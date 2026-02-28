-- Update handle_new_user to handle dynamic plan selection and payment status
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_org_id uuid;
  new_branch_id uuid;
  selected_plan text;
  selected_limit integer;
begin
  -- Get plan from metadata or default to starter
  selected_plan := coalesce(new.raw_user_meta_data->>'subscription_plan', 'starter');
  
  -- Simple mapping for limits in PL/pgSQL
  if selected_plan = 'enterprise' then selected_limit := 9999;
  elsif selected_plan = 'scale' then selected_limit := 20;
  elsif selected_plan = 'growth' then selected_limit := 5;
  else selected_limit := 1;
  end if;

  -- 1. Create Organization with Selected Plan (Pending Payment)
  insert into public.organizations (
    name, 
    subscription_plan, 
    subscription_status, 
    branch_limit,
    subscription_start_date,
    subscription_end_date
  )
  values (
    coalesce(new.raw_user_meta_data->>'hotel_name', 'My New Organization'),
    selected_plan,
    'pending_payment',
    selected_limit,
    now(),
    now() + interval '14 days' -- Still providing trial window
  )
  returning id into new_org_id;

  -- 2. Create Default Main Branch
  insert into public.branches (organization_id, name, is_main_branch)
  values (new_org_id, 'Main Branch', true)
  returning id into new_branch_id;

  -- 3. Create Profile
  insert into public.profiles (id, organization_id, branch_id, role)
  values (new.id, new_org_id, new_branch_id, 'super_admin');

  return new;
end;
$$ language plpgsql security definer;
