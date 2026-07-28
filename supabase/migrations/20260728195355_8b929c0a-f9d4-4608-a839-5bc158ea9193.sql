CREATE TYPE public.model_condition AS ENUM ('zero_km', 'semi_nova');

ALTER TABLE public.models
  ADD COLUMN condition public.model_condition NOT NULL DEFAULT 'zero_km';

UPDATE public.models
  SET condition = 'semi_nova'
  WHERE slug LIKE 'semi-nova-%' OR tag ILIKE '%semi nova%';