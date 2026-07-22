
CREATE TABLE public.instagram_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  post_url text NOT NULL DEFAULT 'https://www.instagram.com/klugmotors/',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.instagram_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.instagram_posts TO authenticated;
GRANT ALL ON public.instagram_posts TO service_role;

ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads active instagram posts"
  ON public.instagram_posts FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert instagram posts"
  ON public.instagram_posts FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update instagram posts"
  ON public.instagram_posts FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete instagram posts"
  ON public.instagram_posts FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER touch_instagram_posts_updated_at
  BEFORE UPDATE ON public.instagram_posts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
