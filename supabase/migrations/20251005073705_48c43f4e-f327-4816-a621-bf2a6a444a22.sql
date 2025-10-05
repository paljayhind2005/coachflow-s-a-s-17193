-- Make announcements publicly readable so all users can see them
DROP POLICY IF EXISTS "Users can view own announcements" ON announcements;

CREATE POLICY "Anyone can view announcements"
ON announcements
FOR SELECT
TO public
USING (true);

-- Keep other policies for admin management
-- Users can still only manage their own announcements