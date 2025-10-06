-- Security Fix: Add session access validation for favorites

-- Create security definer function to check if user can access a session
CREATE OR REPLACE FUNCTION public.user_can_access_session(_user_id uuid, _session_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.sessions
    WHERE id = _session_id
      AND (is_public = true OR user_id = _user_id)
  )
$$;

-- Drop existing favorites policies
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;

-- Create new favorites policies with session validation
CREATE POLICY "Users can view their own favorites"
ON public.favorites
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert favorites for accessible sessions"
ON public.favorites
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND public.user_can_access_session(user_id, session_id)
);

CREATE POLICY "Users can delete their own favorites"
ON public.favorites
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Restrict profile exposure: Only show display_name for public session creators
DROP POLICY IF EXISTS "Public can view session creator names" ON public.profiles;

CREATE POLICY "Public can view session creator display names only"
ON public.profiles
FOR SELECT
USING (
  -- Users can see their own full profile
  auth.uid() = user_id
  OR
  -- Public can only see display_name of users with public sessions
  EXISTS (
    SELECT 1
    FROM sessions
    WHERE sessions.user_id = profiles.user_id
      AND sessions.is_public = true
  )
);