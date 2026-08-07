UPDATE public.models SET slug = lower(slug) WHERE slug <> lower(slug);
ALTER TABLE public.models REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.models;