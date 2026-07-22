
-- Anyone (anon or authenticated) can upload to lead-documents (write-only for public)
CREATE POLICY "Public can upload lead documents"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'lead-documents');

-- Only admins can read/manage
CREATE POLICY "Admins can read lead documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'lead-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lead documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'lead-documents' AND public.has_role(auth.uid(), 'admin'));
