-- Create storage buckets for photos
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('land-photos', 'land-photos', true),
  ('product-photos', 'product-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for land-photos
DROP POLICY IF EXISTS "Anyone can view land photos" ON storage.objects;
CREATE POLICY "Anyone can view land photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'land-photos');

DROP POLICY IF EXISTS "Authenticated users can upload land photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload land photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'land-photos'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Users can delete their own land photos" ON storage.objects;
CREATE POLICY "Users can delete their own land photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'land-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for product-photos
DROP POLICY IF EXISTS "Anyone can view product photos" ON storage.objects;
CREATE POLICY "Anyone can view product photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-photos');

DROP POLICY IF EXISTS "Authenticated users can upload product photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload product photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-photos'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Users can delete their own product photos" ON storage.objects;
CREATE POLICY "Users can delete their own product photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
