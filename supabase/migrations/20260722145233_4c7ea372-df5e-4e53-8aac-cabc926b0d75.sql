
UPDATE public.models
SET colors = jsonb_set(
  colors,
  '{0,image}',
  '"/__l5e/assets-v1/b9cf64c2-16db-4123-8be1-b618cc462a7d/yamaha-neos-blue-cutout.png"'::jsonb
)
WHERE slug = 'yamaha-neos-connected';
