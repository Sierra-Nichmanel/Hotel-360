-- Core Schema for Hotel 360 SaaS (Multi-Tenant)

-- Clean Slate
drop table if exists public.payments cascade;
drop table if exists public.bookings cascade;
drop table if exists public.pricing_rules cascade;
drop table if exists public.rooms cascade;
drop table if exists public.room_types cascade;
drop table if exists public.profiles cascade;
drop table if exists public.branches cascade;
drop table if exists public.organizations cascade;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ORGANIZATIONS TABLE (Master Tenant)
create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  subscription_plan text not null default 'starter', -- starter, growth, scale, enterprise
  subscription_status text not null default 'trial', -- trial, active, expired, suspended
  branch_limit integer not null default 1,
  billing_cycle text not null default 'monthly',
  subscription_start_date timestamp with time zone,
  subscription_end_date timestamp with time zone,
  paystack_customer_code text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- BRANCHES TABLE
create table public.branches (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  name text not null,
  address text,
  phone text,
  manager_id uuid, -- Reference to profiles.id (added later via constraint/trigger logic)
  is_main_branch boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- PROFILES TABLE (Extending Supabase Auth)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  role text not null check (role in ('admin', 'branch_manager', 'receptionist', 'accountant')),
  full_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add manager_id foreign key to branches after profiles table exists
alter table public.branches add constraint branches_manager_id_fkey foreign key (manager_id) references public.profiles(id) on delete set null;

-- ROOM TYPES
create table public.room_types (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  branch_id uuid references public.branches(id) on delete cascade not null,
  name text not null,
  description text,
  base_price numeric not null,
  capacity integer not null,
  created_at timestamp with time zone default now()
);

-- ROOMS
create table public.rooms (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  branch_id uuid references public.branches(id) on delete cascade not null,
  room_type_id uuid references public.room_types(id) on delete cascade not null,
  room_number text not null,
  status text not null default 'available', -- available, occupied, maintenance, cleaning
  created_at timestamp with time zone default now()
);

-- PRICING RULES
create table public.pricing_rules (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  branch_id uuid references public.branches(id) on delete cascade not null,
  room_type_id uuid references public.room_types(id) on delete cascade not null,
  rule_type text not null,
  start_date date,
  end_date date,
  days_of_week integer[],
  price_override numeric not null,
  priority integer default 0,
  created_at timestamp with time zone default now()
);

-- BOOKINGS
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  branch_id uuid references public.branches(id) on delete cascade not null,
  room_id uuid references public.rooms(id) on delete cascade not null,
  guest_name text not null,
  guest_email text,
  guest_phone text,
  check_in_date date not null,
  check_out_date date not null,
  total_price numeric not null,
  nightly_breakdown jsonb not null,
  status text not null default 'pending', -- pending, confirmed, checked-in, checked-out, cancelled
  created_at timestamp with time zone default now()
);

-- PAYMENTS
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  amount numeric not null,
  currency text default 'NGN',
  status text not null,
  payment_method text,
  paystack_reference text,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- RLS POLICIES

alter table public.organizations enable row level security;
alter table public.branches enable row level security;
alter table public.profiles enable row level security;
alter table public.room_types enable row level security;
alter table public.rooms enable row level security;
alter table public.pricing_rules enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;

-- Global Visibility Logic: Users can only see data for their Organization
-- Branch Visibility Logic: Branch Managers only see their assigned Branch

-- Helper functions to get profile data for RLS without recursion
create or replace function public.get_my_org_id()
returns uuid as $$
  begin
    return (select organization_id from public.profiles where profiles.id = auth.uid());
  end;
$$ language plpgsql security definer;

create or replace function public.get_my_role()
returns text as $$
  begin
    return (select role from public.profiles where profiles.id = auth.uid());
  end;
$$ language plpgsql security definer;

create or replace function public.get_my_branch_id()
returns uuid as $$
  begin
    return (select branch_id from public.profiles where profiles.id = auth.uid());
  end;
$$ language plpgsql security definer;

-- 1. Organizations
drop policy if exists "Users can view their own organization" on public.organizations;
create policy "Users can view their own organization"
  on public.organizations for select
  using (id = public.get_my_org_id());

-- 2. Branches
drop policy if exists "Users can view branches in their organization" on public.branches;
create policy "Users can view branches in their organization"
  on public.branches for select
  using (
    organization_id = public.get_my_org_id()
    AND (
      public.get_my_role() = 'super_admin'
      OR id = public.get_my_branch_id()
    )
  );

-- 3. Profiles
drop policy if exists "Staff can view organization profiles" on public.profiles;
drop policy if exists "Profiles are viewable by organization staff" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Staff can view organization profiles"
  on public.profiles for select
  using (organization_id = public.get_my_org_id());

create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid());

-- 4. Shared Resources Mapping
drop policy if exists "Staff access to organization data" on public.room_types;
create policy "Staff access to organization data"
  on public.room_types for all
  using (
    organization_id = public.get_my_org_id()
    AND (
      public.get_my_role() = 'super_admin'
      OR branch_id = public.get_my_branch_id()
    )
  );

drop policy if exists "Staff access to rooms" on public.rooms;
create policy "Staff access to rooms"
  on public.rooms for all
  using (
    organization_id = public.get_my_org_id()
    AND (
      public.get_my_role() = 'super_admin'
      OR branch_id = public.get_my_branch_id()
    )
  );

drop policy if exists "Staff access to pricing" on public.pricing_rules;
create policy "Staff access to pricing"
  on public.pricing_rules for all
  using (
    organization_id = public.get_my_org_id()
    AND (
      public.get_my_role() = 'super_admin'
      OR branch_id = public.get_my_branch_id()
    )
  );

drop policy if exists "Staff access to bookings" on public.bookings;
create policy "Staff access to bookings"
  on public.bookings for all
  using (
    organization_id = public.get_my_org_id()
    AND (
      public.get_my_role() = 'super_admin'
      OR branch_id = public.get_my_branch_id()
    )
  );

drop policy if exists "Staff access to organization payments" on public.payments;
create policy "Staff access to organization payments"
  on public.payments for all
  using (organization_id = public.get_my_org_id());

-- 4. Shared Resources Mapping (Room Types, Rooms, Pricing, Bookings, Payments)
drop policy if exists "Staff access to organization data" on public.room_types;
create policy "Staff access to organization data"
  on public.room_types for all
  using (
    organization_id = public.get_my_org_id()
    AND (
      (select role from public.profiles where profiles.id = auth.uid()) = 'super_admin'
      OR branch_id = (select branch_id from public.profiles where profiles.id = auth.uid())
    )
  );

drop policy if exists "Staff access to rooms" on public.rooms;
create policy "Staff access to rooms"
  on public.rooms for all
  using (
    organization_id = public.get_my_org_id()
    AND (
      (select role from public.profiles where profiles.id = auth.uid()) = 'super_admin'
      OR branch_id = (select branch_id from public.profiles where profiles.id = auth.uid())
    )
  );

drop policy if exists "Staff access to pricing" on public.pricing_rules;
create policy "Staff access to pricing"
  on public.pricing_rules for all
  using (
    organization_id = public.get_my_org_id()
    AND (
      (select role from public.profiles where profiles.id = auth.uid()) = 'super_admin'
      OR branch_id = (select branch_id from public.profiles where profiles.id = auth.uid())
    )
  );

drop policy if exists "Staff access to bookings" on public.bookings;
create policy "Staff access to bookings"
  on public.bookings for all
  using (
    organization_id = public.get_my_org_id()
    AND (
      (select role from public.profiles where profiles.id = auth.uid()) = 'super_admin'
      OR branch_id = (select branch_id from public.profiles where profiles.id = auth.uid())
    )
  );

drop policy if exists "Staff access to organization payments" on public.payments;
create policy "Staff access to organization payments"
  on public.payments for all
  using (organization_id = public.get_my_org_id());

-- AUTH TRIGGER FOR PROFILES
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_org_id uuid;
  new_branch_id uuid;
begin
  -- 1. Create Organization
  insert into public.organizations (name, subscription_status)
  values (
    coalesce(new.raw_user_meta_data->>'hotel_name', 'My New Organization'),
    'trial'
  )
  returning id into new_org_id;

  -- 2. Create Default Main Branch
  insert into public.branches (organization_id, name, is_main_branch)
  values (new_org_id, 'Main Branch', true)
  returning id into new_branch_id;

  -- 3. Create Profile
  insert into public.profiles (id, organization_id, branch_id, role)
  values (new.id, new_org_id, new_branch_id, 'admin');

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
