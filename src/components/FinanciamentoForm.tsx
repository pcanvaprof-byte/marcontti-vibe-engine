import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2, MessageCircle, RotateCcw } from "lucide-react";
import { z } from "zod";
import { models, openWhatsAppWithFallback } from "@/lib/models";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  phone: z
    .string()
    .trim()
    .min(8, "Telefone inválido")
    .max(20)
    .regex(/^[0-9()\s+-]+$/, "Use apenas números"),
  model: z.string().min(1, "Escolha um modelo"),
  entry: z.string().min(1, "Selecione uma entrada"),
  term: z.string().min(1, "Selecione um prazo"),
  message: z.string().trim().max(500).optional(),
});

const entries = [
  "Sem entrada",
  "Até R$ 1.500",
  "R$ 1.500 – R$ 3.000",
  "R$ 3.000 – R$ 5.000",
  "Acima de R$ 5.000",
];

const terms = [
  "12x",
  "18x",
  "24x",
  "36x",
  "A combinar",
];

export function FinanciamentoForm({
  defaultModel,
  compact = false,
}: {
  defaultModel?: string;
  compact?: boolean;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      model: String(fd.get("model") ?? ""),
      entry: String(fd.get("entry") ?? ""),
      term: String(fd.get("term") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      const firstKey = parsed.error.issues[0]?.path[0];
      if (typeof firstKey === "string") {
        const el = document.getElementById(`fin-${firstKey}`) as HTMLElement | null;
        el?.focus();
      }
      return;
    }
    setErrors({});
    setSubmitting(true);
    const d = parsed.data;
    const text = [
      `Olá! Quero simular o financiamento de uma moto elétrica da Klug Motors.`,
      ``,
      `*Nome:* ${d.name}`,
      `*Telefone:* ${d.phone}`,
      `*Modelo:* ${d.model}`,
      `*Entrada estimada:* ${d.entry}`,
      `*Prazo desejado:* ${d.term}`,
      d.message ? `*Observações:* ${d.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    setTimeout(() => {
      openWhatsAppWithFallback(text);
      setLastMessage(text);
      setSubmitting(false);
      setSent(true);
    }, 400);
  }

  function reset() {
    setSent(false);
    setLastMessage(null);
    setErrors({});
  }

  const inputCls =
    "w-full bg-background border border-border px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-0 transition-all";
  const labelCls =
    "block text-[10px] uppercase font-display font-black text-white/70 tracking-widest mb-2";

  if (sent) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={
          compact
            ? "space-y-4"
            : "bg-card border border-border p-8 sm:p-10 animate-fade-up"
        }
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 grid place-items-center border border-primary text-primary mb-5 animate-pulse-ring">
            <CheckCircle2 size={26} />
          </div>
          <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-3">
            Solicitação enviada
          </p>
          <h3 className="font-display font-black uppercase text-2xl sm:text-3xl tracking-tight mb-3">
            Abrimos o WhatsApp pra você
          </h3>
          <p className="text-white/70 text-sm max-w-sm mb-6">
            Confirme o envio da mensagem no WhatsApp. Se a janela não abriu,
            clique em "Reabrir" abaixo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => lastMessage && openWhatsAppWithFallback(lastMessage)}
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-display font-black uppercase text-xs tracking-widest px-6 py-3 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <MessageCircle size={16} fill="white" strokeWidth={0} />
              Reabrir WhatsApp
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 border border-border text-white/80 hover:border-primary hover:text-primary font-display font-black uppercase text-xs tracking-widest px-6 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <RotateCcw size={14} />
              Nova simulação
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Simular financiamento"
      className={
        compact
          ? "space-y-4"
          : "bg-card border border-border p-8 sm:p-10"
      }
    >
      {!compact && (
        <div className="mb-8">
          <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-3">
            Consulte agora
          </p>
          <h3 className="font-display font-black uppercase text-2xl sm:text-3xl tracking-tight mb-2">
            Simule seu financiamento
          </h3>
          <p className="text-white/60 text-sm">
            Preencha para receber as condições diretamente no WhatsApp da loja.
          </p>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label htmlFor="fin-name" className={labelCls}>Nome completo</label>
          <input
            id="fin-name"
            name="name"
            maxLength={100}
            placeholder="Como podemos te chamar?"
            className={inputCls}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "fin-name-err" : undefined}
          />
          {errors.name && (
            <p id="fin-name-err" role="alert" className="text-xs text-destructive mt-1.5">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="fin-phone" className={labelCls}>WhatsApp</label>
          <input
            id="fin-phone"
            name="phone"
            type="tel"
            maxLength={20}
            placeholder="(DDD) + número"
            className={inputCls}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "fin-phone-err" : undefined}
          />
          {errors.phone && (
            <p id="fin-phone-err" role="alert" className="text-xs text-destructive mt-1.5">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="fin-model" className={labelCls}>Modelo de interesse</label>
          <select
            id="fin-model"
            name="model"
            defaultValue={defaultModel ?? ""}
            className={inputCls}
            aria-invalid={!!errors.model}
          >
            <option value="" disabled>Selecione um modelo</option>
            {models.map((m) => (
              <option key={m.slug} value={m.name}>{m.name}</option>
            ))}
            <option>Outro / Catálogo completo</option>
          </select>
          {errors.model && (
            <p role="alert" className="text-xs text-destructive mt-1.5">
              {errors.model}
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="fin-entry" className={labelCls}>Entrada estimada</label>
            <select
              id="fin-entry"
              name="entry"
              defaultValue=""
              className={inputCls}
              aria-invalid={!!errors.entry}
            >
              <option value="" disabled>Selecione</option>
              {entries.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            {errors.entry && (
              <p role="alert" className="text-xs text-destructive mt-1.5">
                {errors.entry}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="fin-term" className={labelCls}>Prazo desejado</label>
            <select
              id="fin-term"
              name="term"
              defaultValue=""
              className={inputCls}
              aria-invalid={!!errors.term}
            >
              <option value="" disabled>Selecione</option>
              {terms.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            {errors.term && (
              <p role="alert" className="text-xs text-destructive mt-1.5">
                {errors.term}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="fin-msg" className={labelCls}>Observações (opcional)</label>
          <textarea
            id="fin-msg"
            name="message"
            rows={3}
            maxLength={500}
            placeholder="Conte-nos mais sobre o que você procura"
            className={`${inputCls} resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary hover:bg-primary-glow disabled:opacity-70 disabled:cursor-not-allowed text-primary-foreground font-display font-black uppercase text-sm tracking-widest py-4 transition-all hover:shadow-[var(--shadow-ember)] hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              <span>Enviando…</span>
              <span className="sr-only">Aguarde, enviando sua solicitação</span>
            </>
          ) : (
            <>
              Solicitar Simulação <ArrowRight size={18} />
            </>
          )}
        </button>
        <p className="text-[10px] text-white/60 text-center uppercase tracking-widest">
          Ao enviar, você será redirecionado para o WhatsApp
        </p>
      </div>
    </form>
  );
}
