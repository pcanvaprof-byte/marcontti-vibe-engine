
UPDATE public.models
SET colors = '[{"hex":"#1a3ea8","name":"Wolverine Edition","image":"/__l5e/assets-v1/246d11ee-a096-49d8-931a-9cb796de5900/yamaha-crosser-wolverine.png"}]'::jsonb,
    gallery = '["/__l5e/assets-v1/246d11ee-a096-49d8-931a-9cb796de5900/yamaha-crosser-wolverine.png"]'::jsonb
WHERE slug = 'yamaha-crosser-z-abs-wolverine';

UPDATE public.models
SET colors = '[{"hex":"#c8102e","name":"Deadpool Edition","image":"/__l5e/assets-v1/d5b9f6cb-6ebf-4d80-8cc7-2fca90d9b9e8/yamaha-fz15-deadpool.png"}]'::jsonb,
    gallery = '["/__l5e/assets-v1/d5b9f6cb-6ebf-4d80-8cc7-2fca90d9b9e8/yamaha-fz15-deadpool.png"]'::jsonb
WHERE slug = 'yamaha-fazer-fz15-abs-deadpool';
