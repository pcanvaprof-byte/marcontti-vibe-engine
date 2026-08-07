/** Parcela prevista (financiamento) — cálculo simples usado apenas para exibição. */
export const INSTALLMENT_MONTHS = 36;
export const INSTALLMENT_NOTE = "parcela prevista no financiamento";

export function fmtBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Retorna a parcela prevista formatada ou null quando não há preço. */
export function installmentLabel(priceNumber: number, months = INSTALLMENT_MONTHS) {
  if (!priceNumber || priceNumber <= 0) return null;
  return `${months}x ${fmtBRL(priceNumber / months)}`;
}

type InstallmentSource = {
  priceNumber?: number;
  installmentMonths?: number;
  installmentValue?: number;
  installmentNote?: string;
};

/**
 * Parcela do modelo respeitando o que o admin cadastrou:
 * nº de parcelas, valor fixo da parcela (opcional) e texto da observação.
 */
export function modelInstallment(m: InstallmentSource) {
  const months = m.installmentMonths && m.installmentMonths > 0 ? m.installmentMonths : INSTALLMENT_MONTHS;
  const note = m.installmentNote?.trim() || INSTALLMENT_NOTE;
  const value =
    m.installmentValue && m.installmentValue > 0
      ? m.installmentValue
      : m.priceNumber && m.priceNumber > 0
        ? m.priceNumber / months
        : 0;
  if (!value) return { label: null as string | null, note, months };
  return { label: `${months}x ${fmtBRL(value)}`, note, months };
}
