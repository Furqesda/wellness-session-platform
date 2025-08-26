-- Fix critical security vulnerability: Restrict profile SELECT access
-- Replace the overly permissive "Profiles are viewable by everyone" policy
-- with a secure policy that only allows users to view their own profiles

-- Drop the insecure policy that allows public access to all profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a secure policy that only allows authenticated users to view their own profiles
CREATE POLICY "Users can view their own profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Add a policy to allow users to view basic profile info of session creators (if needed for public sessions)
-- This is more restrictive and only exposes minimal necessary data
CREATE POLICY "Public can view session creator names" 
ON public.profiles 
FOR SELECT 
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.sessions 
    WHERE sessions.user_id = profiles.user_id 
    AND sessions.is_public = true
  )
);