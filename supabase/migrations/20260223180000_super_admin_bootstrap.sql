-- Function to auto-promote super admin (SECURITY DEFINER bypasses RLS)
-- This ensures jiveshpatil0@gmail.com always gets admin access
CREATE OR REPLACE FUNCTION public.ensure_super_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the new user is the super admin
  IF NEW.email = 'jiveshpatil0@gmail.com' THEN
    -- Update their role to admin (the trigger handle_new_user_role already inserted a 'user' row)
    UPDATE public.user_roles SET role = 'admin' WHERE user_id = NEW.id;
    -- If no row exists yet, insert one
    IF NOT FOUND THEN
      INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
      ON CONFLICT (user_id, role) DO UPDATE SET role = 'admin';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Run this trigger AFTER the role-assignment trigger so it can override
CREATE TRIGGER on_auth_user_created_super_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.ensure_super_admin();

-- Also add a policy so authenticated users can insert their own role
-- (needed for the client-side ensureSuperAdmin fallback)
CREATE POLICY "Users can insert own role" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own role (needed for super admin self-promotion)
CREATE POLICY "Users can update own role" ON public.user_roles
  FOR UPDATE USING (auth.uid() = user_id);
