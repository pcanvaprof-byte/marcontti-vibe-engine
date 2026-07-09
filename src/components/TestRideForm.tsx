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
  schedule: z.string().min(1, "Escolha um horário"),
  message: z.string().trim().max(500).optional(),
});

const schedules = [
  "Manhã (9h–12h)",
  "Tarde (13h–18h)",
  "Sábado pela manhã",
  "A combinar",
];

export function TestRideForm({
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
      schedule: String(fd.get("schedule") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      // Focus first invalid field for a11y
      const firstKey = parsed.error.issues[0]?.path[0];
      if (typeof firstKey === "string") {
        const el = document.getElementById(`tr-${firstKey}`) as HTMLElement | null;
        el?.focus();
      }
      return;
    }
    setErrors({});
    setSubmitting(true);
    const d = parsed.data;
    const text = [
      `Olá! Quero agendar um test-ride na Klug Motors.`,
      ``,
      `*Nome:* ${d.name}`,
      `*Telefone:* ${d.phone}`,
      `*Modelo:* ${d.model}`,
      `*Horário preferido:* ${d.schedule}`,
      d.message ? `*Mensagem:* ${d.message}` : null,
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
    "w-full bg-background border border-border px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none transition-colors";
  const labelCls =
    "block text-[10px] uppercase font-display font-black text-white/50 tracking-widest mb-2";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Agendar test-ride"
      className={
        compact
          ? "space-y-4"
          : "bg-card border border-border p-8 sm:p-10"
      }
    >
      {!compact && (
        <div className="mb-8">
          <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-3">
            Solicite agora
          </p>
          <h3 className="font-display font-black uppercase text-2xl sm:text-3xl tracking-tight mb-2">
            Agende um Test-Ride
          </h3>
          <p className="text-white/60 text-sm">
            Preencha o formulário — enviaremos direto para o WhatsApp da loja.
          </p>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label htmlFor="tr-name" className={labelCls}>Nome completo</label>
          <input
            id="tr-name"
            name="name"
            maxLength={100}
            placeholder="Como podemos te chamar?"
            className={inputCls}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "tr-name-err" : undefined}
          />
          {errors.name && (
            <p id="tr-name-err" role="alert" className="text-xs text-destructive mt-1.5">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="tr-phone" className={labelCls}>WhatsApp</label>
          <input
            id="tr-phone"
            name="phone"
            type="tel"
            maxLength={20}
            placeholder="(DDD) + número"
            className={inputCls}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "tr-phone-err" : undefined}
          />
          {errors.phone && (
            <p id="tr-phone-err" role="alert" className="text-xs text-destructive mt-1.5">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="tr-model" className={labelCls}>Modelo de interesse</label>
            <select
              id="tr-model"
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
          <div>
            <label htmlFor="tr-schedule" className={labelCls}>Horário preferido</label>
            <select
              id="tr-schedule"
              name="schedule"
              defaultValue=""
              className={inputCls}
              aria-invalid={!!errors.schedule}
            >
              <option value="" disabled>Selecione um horário</option>
              {schedules.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            {errors.schedule && (
              <p role="alert" className="text-xs text-destructive mt-1.5">
                {errors.schedule}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="tr-msg" className={labelCls}>Mensagem (opcional)</label>
          <textarea
            id="tr-msg"
            name="message"
            rows={3}
            maxLength={500}
            placeholder="Conte-nos mais sobre o que você procura"
            className={`${inputCls} resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={submitting || sent}
          className="w-full bg-primary hover:bg-primary-glow disabled:opacity-70 text-primary-foreground font-display font-black uppercase text-sm tracking-widest py-4 transition-all hover:shadow-[var(--shadow-ember)] hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2"
        >
          {sent ? (
            <>
              <CheckCircle2 size={18} /> Enviado
            </>
          ) : submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Enviando…
            </>
          ) : (
            <>
              Confirmar Agendamento <ArrowRight size={18} />
            </>
          )}
        </button>
        <p className="text-[10px] text-white/40 text-center uppercase tracking-widest">
          Ao enviar, você será redirecionado para o WhatsApp
        </p>
      </div>
    </form>
  );
}
