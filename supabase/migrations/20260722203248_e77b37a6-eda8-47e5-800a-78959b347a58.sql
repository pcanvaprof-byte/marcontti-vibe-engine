
UPDATE public.models
SET gallery = COALESCE(gallery, '[]'::jsonb) || jsonb_build_array(
  jsonb_build_object('url','/__l5e/assets-v1/fd315ad1-3974-46d2-a645-c4d8f0457cb6/jet-bateria.webp','alt','Bateria removível YoNo da JET'),
  jsonb_build_object('url','/__l5e/assets-v1/4eabde9f-8321-4e65-9d22-85d34731b755/jet-guidao.webp','alt','Guidão e retrovisor da JET'),
  jsonb_build_object('url','/__l5e/assets-v1/d718cecf-308b-4995-9af4-a835906e69a9/jet-max-specs.webp','alt','Ficha técnica JET 1000W')
)
WHERE slug = 'jet';

UPDATE public.models
SET gallery = COALESCE(gallery, '[]'::jsonb) || jsonb_build_array(
  jsonb_build_object('url','/__l5e/assets-v1/497ffc14-da1b-42b4-a516-ea138cc5431f/ret-prata.webp','alt','RET 1000W prata frontal'),
  jsonb_build_object('url','/__l5e/assets-v1/d48b5c34-2b20-490e-af41-16fc7f716cd3/ret-bateria.webp','alt','Bateria removível YoNo da RET'),
  jsonb_build_object('url','/__l5e/assets-v1/2f9874d9-0c25-4234-b84d-dfddd77601f8/ret-painel.webp','alt','Painel digital da RET'),
  jsonb_build_object('url','/__l5e/assets-v1/98bd3b0c-2f62-41ed-8e0e-7353aee890b9/ret-guidao.webp','alt','Guidão e retrovisores da RET'),
  jsonb_build_object('url','/__l5e/assets-v1/6a162f02-c807-474c-9cd0-ea72804a2d7b/ret-specs.webp','alt','Ficha técnica RET 1000W')
)
WHERE slug = 'ret';

UPDATE public.models
SET gallery = COALESCE(gallery, '[]'::jsonb) || jsonb_build_array(
  jsonb_build_object('url','/__l5e/assets-v1/6c964769-448c-4707-8c1f-2e20ecf56bc7/soma-branco-frente.webp','alt','SOMA 1000W branca frontal')
)
WHERE slug = 'soma';
