ALTER TABLE public.models
  ADD COLUMN IF NOT EXISTS installment_months integer NOT NULL DEFAULT 36,
  ADD COLUMN IF NOT EXISTS installment_value numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS installment_note text NOT NULL DEFAULT 'parcela prevista no financiamento';