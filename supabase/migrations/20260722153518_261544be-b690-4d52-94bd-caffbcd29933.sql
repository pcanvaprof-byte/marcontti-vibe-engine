
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS payment_type text,
  ADD COLUMN IF NOT EXISTS doc_photo_url text,
  ADD COLUMN IF NOT EXISTS doc_address_url text,
  ADD COLUMN IF NOT EXISTS doc_income_url text;
