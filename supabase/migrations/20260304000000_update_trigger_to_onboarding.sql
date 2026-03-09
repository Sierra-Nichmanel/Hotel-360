-- Update handle_new_user trigger to set subscription_status to 'onboarding'
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_org_id uuid;
  new_branch_id uuid;
begin
  -- 1. Create Hotel
  insert into public.hotels (name, subscription_status)
  values (
    coalesce(new.raw_user_meta_data->>'hotel_name', 'My New Hotel'),
    'onboarding' -- CHANGED from 'trial' to 'onboarding'
  )
  returning id into new_org_id;

  -- 2. Create Default Main Branch
  insert into public.branches (hotel_id, name, is_main_branch)
  values (new_org_id, 'Main Branch', true)
  returning id into new_branch_id;

  -- 3. Create Profile
  insert into public.profiles (id, hotel_id, branch_id, role)
  values (new.id, new_org_id, new_branch_id, 'admin');

  return new;
end;
$$ language plpgsql security definer;
