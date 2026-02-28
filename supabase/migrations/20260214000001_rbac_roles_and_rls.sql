-- 1. Update Profiles Role Constraint
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check 
  check (role in ('super_admin', 'branch_manager', 'receptionist', 'accountant'));

-- 2. Migrate existing 'admin' roles to 'super_admin'
update public.profiles set role = 'super_admin' where role = 'admin';

-- 3. Update handle_new_user trigger for super_admin
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_org_id uuid;
  new_branch_id uuid;
begin
  -- Create Organization
  insert into public.organizations (name, subscription_status)
  values (
    coalesce(new.raw_user_meta_data->>'hotel_name', 'My New Organization'),
    'trial'
  )
  returning id into new_org_id;

  -- Create Default Main Branch
  insert into public.branches (organization_id, name, is_main_branch)
  values (new_org_id, 'Main Branch', true)
  returning id into new_branch_id;

  -- Create Profile as super_admin
  insert into public.profiles (id, organization_id, branch_id, role)
  values (new.id, new_org_id, new_branch_id, 'super_admin');

  return new;
end;
$$ language plpgsql security definer;

-- RLS policies are now managed in core_schema.sql to prevent recursion.

