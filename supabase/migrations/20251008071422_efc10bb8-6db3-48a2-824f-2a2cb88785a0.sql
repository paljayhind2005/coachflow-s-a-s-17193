-- Fix the announcement security issue
-- Drop the old insecure policy
DROP POLICY IF EXISTS "Anyone can view announcements" ON public.announcements;

-- Create new secure policy - only authenticated users can view announcements
CREATE POLICY "Authenticated users can view announcements" 
ON public.announcements 
FOR SELECT 
USING (auth.uid() IS NOT NULL);