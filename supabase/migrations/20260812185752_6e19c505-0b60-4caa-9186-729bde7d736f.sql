UPDATE public.models
SET installment_months = 71,
    installment_note = 'prévia de parcela no boleto (juros 2,58% a.m.)'
WHERE installment_months = 36 AND COALESCE(installment_value,0) = 0;

UPDATE public.models
SET colors = jsonb_set(colors, '{0,image}', to_jsonb((gallery->0->>'url')))
WHERE slug = 'semi-nova-yamaha-xmax-250'
  AND colors->0->>'image' LIKE 'blob:%'
  AND gallery->0->>'url' IS NOT NULL;