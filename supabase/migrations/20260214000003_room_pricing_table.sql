-- Create room_pricing table for specific date overrides
create table public.room_pricing (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  branch_id uuid references public.branches(id) on delete cascade not null,
  room_type_id uuid references public.room_types(id) on delete cascade not null,
  date date not null,
  price numeric not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(branch_id, room_type_id, date)
);

-- Enable RLS
alter table public.room_pricing enable row level security;

-- Add RLS Policies (Branch-Isolated)
create policy "Staff access to room pricing"
  on public.room_pricing for all
  using (
    organization_id = public.get_my_org_id()
    AND (
      public.get_my_role() = 'super_admin'
      OR branch_id = public.get_my_branch_id()
    )
  );
