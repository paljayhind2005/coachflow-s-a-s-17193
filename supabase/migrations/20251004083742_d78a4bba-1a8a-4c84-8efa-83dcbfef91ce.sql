-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  media_url text,
  media_type text CHECK (media_type IN ('image', 'video', 'none')),
  batch text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- RLS policies for announcements
CREATE POLICY "Users can view own announcements"
  ON public.announcements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own announcements"
  ON public.announcements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own announcements"
  ON public.announcements FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own announcements"
  ON public.announcements FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();