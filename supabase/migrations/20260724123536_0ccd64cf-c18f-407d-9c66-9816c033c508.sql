
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated, anon, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, anon;

DROP POLICY IF EXISTS "Admins can delete analytics events" ON public.analytics_events;
DROP POLICY IF EXISTS "Admins can read analytics events" ON public.analytics_events;
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;
CREATE POLICY "Admins can delete analytics events" ON public.analytics_events
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can read analytics events" ON public.analytics_events
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can insert analytics events" ON public.analytics_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (event_name IS NOT NULL AND char_length(event_name) BETWEEN 1 AND 100);

DROP POLICY IF EXISTS "Admins delete instagram posts" ON public.instagram_posts;
DROP POLICY IF EXISTS "Admins insert instagram posts" ON public.instagram_posts;
DROP POLICY IF EXISTS "Admins update instagram posts" ON public.instagram_posts;
DROP POLICY IF EXISTS "Anyone reads active instagram posts" ON public.instagram_posts;
CREATE POLICY "Admins delete instagram posts" ON public.instagram_posts
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins insert instagram posts" ON public.instagram_posts
  FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update instagram posts" ON public.instagram_posts
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone reads active instagram posts" ON public.instagram_posts
  FOR SELECT USING ((is_active = true) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins delete leads" ON public.leads;
DROP POLICY IF EXISTS "Admins read leads" ON public.leads;
DROP POLICY IF EXISTS "Admins update leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Admins delete leads" ON public.leads
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins read leads" ON public.leads
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone can submit a lead" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND char_length(name) BETWEEN 1 AND 200
    AND phone IS NOT NULL AND char_length(phone) BETWEEN 8 AND 30
    AND lgpd_consent = true
  );

DROP POLICY IF EXISTS "Admins delete models" ON public.models;
DROP POLICY IF EXISTS "Admins insert models" ON public.models;
DROP POLICY IF EXISTS "Admins update models" ON public.models;
DROP POLICY IF EXISTS "Anyone reads active models" ON public.models;
CREATE POLICY "Admins delete models" ON public.models
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins insert models" ON public.models
  FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update models" ON public.models
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Anyone reads active models" ON public.models
  FOR SELECT USING ((is_active = true) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins upload model-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins update model-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete model-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read lead documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete lead documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload lead documents" ON storage.objects;

CREATE POLICY "Admins upload model-images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'model-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update model-images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'model-images' AND private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (bucket_id = 'model-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins delete model-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'model-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can read lead documents" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'lead-documents' AND private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete lead documents" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'lead-documents' AND private.has_role(auth.uid(), 'admin'::public.app_role));

-- Remove public helper (no longer referenced by policies)
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- grant_first_admin is used by a trigger on auth.users; keep it but restrict EXECUTE
REVOKE ALL ON FUNCTION public.grant_first_admin() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
