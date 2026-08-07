/** Parcela prevista (financiamento) — cálculo simples usado apenas para exibição. */
export const INSTALLMENT_MONTHS = 36;

export function fmtBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Retorna a parcela prevista formatada ou null quando não há preço. */
export function installmentLabel(priceNumber: number, months = INSTALLMENT_MONTHS) {
  if (!priceNumber || priceNumber <= 0) return null;
  return `${months}x ${fmtBRL(priceNumber / months)}`;
}
