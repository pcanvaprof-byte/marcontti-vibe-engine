
-- Remove bikes/patinete from Scooter catalog
UPDATE public.models SET is_active = false WHERE slug IN ('joy-super','pop','p10');

-- Standardize Klug prices to ,00
UPDATE public.models SET price = 'R$ 10.490,00' WHERE slug IN ('x12','giga','jet');
UPDATE public.models SET price = 'R$ 8.990,00' WHERE slug = 'ret';
UPDATE public.models SET price = 'R$ 12.490,00' WHERE slug = 'big-tri';
UPDATE public.models SET price = 'R$ 11.990,00' WHERE slug = 'mia-tri';

-- Standardize SUDU/Yamaha prices to include ,00
UPDATE public.models
SET price = price || ',00'
WHERE price ~ '^R\$ [0-9\.]+$';

-- Ensure any zero-price model is labeled "Consultar disponibilidade"
UPDATE public.models SET price = 'Consultar disponibilidade' WHERE price_number = 0 AND price <> 'Consultar disponibilidade';
