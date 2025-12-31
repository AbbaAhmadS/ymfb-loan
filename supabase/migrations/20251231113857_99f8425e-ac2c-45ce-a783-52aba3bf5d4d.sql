-- Fix function search_path issues
CREATE OR REPLACE FUNCTION public.generate_application_number(prefix TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  year_str TEXT;
BEGIN
  year_str := to_char(now(), 'YYYY');
  new_number := prefix || year_str || '-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
  RETURN new_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES 
  ('passport-photos', 'passport-photos', true, 1048576),
  ('signatures', 'signatures', true, 1048576),
  ('nin-photos', 'nin-photos', false, 1048576),
  ('payment-slips', 'payment-slips', false, 1048576);

-- Storage policies for passport photos (public)
CREATE POLICY "Anyone can view passport photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'passport-photos');

CREATE POLICY "Authenticated users can upload passport photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'passport-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own passport photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'passport-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own passport photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'passport-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for signatures (public)
CREATE POLICY "Anyone can view signatures"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'signatures');

CREATE POLICY "Authenticated users can upload signatures"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'signatures' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own signatures"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'signatures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own signatures"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'signatures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for NIN photos (private)
CREATE POLICY "Users can view own NIN photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'nin-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all NIN photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'nin-photos' AND public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can upload NIN photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'nin-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own NIN photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'nin-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own NIN photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'nin-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for payment slips (private)
CREATE POLICY "Users can view own payment slips"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'payment-slips' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all payment slips"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'payment-slips' AND public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can upload payment slips"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'payment-slips' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own payment slips"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'payment-slips' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own payment slips"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'payment-slips' AND auth.uid()::text = (storage.foldername(name))[1]);