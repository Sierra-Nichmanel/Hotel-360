-- Function to check branch limit before insertion
create or replace function public.check_branch_limit()
returns trigger as $$
declare
  current_count integer;
  max_allowed integer;
begin
  -- Get current count of branches for this organization
  select count(*) into current_count
  from public.branches
  where organization_id = new.organization_id;

  -- Get the branch limit for this organization from the organizations table
  select branch_limit into max_allowed
  from public.organizations
  where id = new.organization_id;

  -- Check if adding a new branch would exceed the limit
  if current_count >= max_allowed then
    raise exception 'Branch limit reached. Your subscription allows a maximum of % branch(es).', max_allowed;
  end if;

  return new;
end;
$$ language plpgsql;

-- Trigger to enforce the limit
drop trigger if exists tr_check_branch_limit on public.branches;
create trigger tr_check_branch_limit
  before insert on public.branches
  for each row
  execute procedure public.check_branch_limit();
