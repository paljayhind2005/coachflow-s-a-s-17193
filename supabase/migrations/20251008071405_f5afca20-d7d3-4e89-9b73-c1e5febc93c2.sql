-- Create institute_info table
CREATE TABLE public.institute_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  location TEXT,
  description TEXT,
  teacher_names TEXT,
  map_link TEXT,
  hero_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.institute_info ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own institute info" 
ON public.institute_info 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own institute info" 
ON public.institute_info 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own institute info" 
ON public.institute_info 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create upcoming_classes table
CREATE TABLE public.upcoming_classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  class_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  start_date DATE NOT NULL,
  timing TEXT NOT NULL,
  fee NUMERIC NOT NULL,
  teacher_name TEXT NOT NULL,
  teacher_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.upcoming_classes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own upcoming classes" 
ON public.upcoming_classes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own upcoming classes" 
ON public.upcoming_classes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own upcoming classes" 
ON public.upcoming_classes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own upcoming classes" 
ON public.upcoming_classes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create live_classes table
CREATE TABLE public.live_classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  class_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  start_date DATE NOT NULL,
  timing TEXT NOT NULL,
  fee NUMERIC NOT NULL,
  teacher_name TEXT NOT NULL,
  teacher_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own live classes" 
ON public.live_classes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own live classes" 
ON public.live_classes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own live classes" 
ON public.live_classes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own live classes" 
ON public.live_classes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create topper_students table
CREATE TABLE public.topper_students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  marks TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.topper_students ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own topper students" 
ON public.topper_students 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own topper students" 
ON public.topper_students 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own topper students" 
ON public.topper_students 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own topper students" 
ON public.topper_students 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create student_summary table
CREATE TABLE public.student_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_summary ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own student summary" 
ON public.student_summary 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own student summary" 
ON public.student_summary 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own student summary" 
ON public.student_summary 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own events" 
ON public.events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events" 
ON public.events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" 
ON public.events 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" 
ON public.events 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add update triggers for all tables
CREATE TRIGGER update_institute_info_updated_at
BEFORE UPDATE ON public.institute_info
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_upcoming_classes_updated_at
BEFORE UPDATE ON public.upcoming_classes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_live_classes_updated_at
BEFORE UPDATE ON public.live_classes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_topper_students_updated_at
BEFORE UPDATE ON public.topper_students
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_student_summary_updated_at
BEFORE UPDATE ON public.student_summary
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();