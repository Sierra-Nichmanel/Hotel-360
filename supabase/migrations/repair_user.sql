-- MANUAL PROFILE REPAIR SCRIPT
-- Run this if you signed up but keep getting redirected to /auth

DO $$
DECLARE
  target_user_email TEXT := 'YOUR_EMAIL_HERE'; -- Change this to your email
  target_user_id UUID;
  new_hotel_id UUID;
  new_branch_id UUID;
BEGIN
  -- 1. Find the user ID
  SELECT id INTO target_user_id FROM auth.users WHERE email = target_user_email;
  
  IF target_user_id IS NULL THEN
    RAISE NOTICE 'User not found with email %', target_user_email;
  ELSE
    -- 2. Create Hotel if user has none
    INSERT INTO public.hotels (name, subscription_status)
    VALUES ('My Hotel', 'trial')
    RETURNING id INTO new_hotel_id;

    -- 3. Create Branch
    INSERT INTO public.branches (hotel_id, name, is_main_branch)
    VALUES (new_hotel_id, 'Main Branch', true)
    RETURNING id INTO new_branch_id;

    -- 4. Create/Update Profile
    INSERT INTO public.profiles (id, hotel_id, branch_id, role)
    VALUES (target_user_id, new_hotel_id, new_branch_id, 'admin')
    ON CONFLICT (id) DO UPDATE 
    SET 
      hotel_id = EXCLUDED.hotel_id,
      branch_id = EXCLUDED.branch_id,
      role = EXCLUDED.role;
      
    RAISE NOTICE 'Repair successful for %', target_user_email;
  END IF;
END $$;
