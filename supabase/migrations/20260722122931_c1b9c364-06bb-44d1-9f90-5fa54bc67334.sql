
-- Public read of images
CREATE POLICY "Public read model-images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'model-images');

-- Admin write
CREATE POLICY "Admins upload model-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'model-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update model-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'model-images' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'model-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete model-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'model-images' AND public.has_role(auth.uid(), 'admin'));
