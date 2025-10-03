-- Add WhatsApp fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS whatsapp_number text,
ADD COLUMN IF NOT EXISTS whatsapp_group_link text;

-- Create fee_payments table for monthly fee tracking
CREATE TABLE IF NOT EXISTS public.fee_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL CHECK (year >= 2020 AND year <= 2100),
  amount_paid numeric NOT NULL DEFAULT 0,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  payment_method text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(student_id, month, year)
);

-- Enable RLS on fee_payments
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for fee_payments
CREATE POLICY "Users can view own fee payments"
  ON public.fee_payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fee payments"
  ON public.fee_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fee payments"
  ON public.fee_payments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fee payments"
  ON public.fee_payments FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_fee_payments_updated_at
  BEFORE UPDATE ON public.fee_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();