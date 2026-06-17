import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { z } from "zod";
import { models, buildWhatsAppUrl } from "@/lib/models";

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
      return;
    }
    setErrors({});
    setSubmitting(true);
    const d = parsed.data;
    const text = [
      `Olá! Quero agendar um test-ride na Infinda Digital.`,
      ``,
      `*Nome:* ${d.name}`,
      `*Telefone:* ${d.phone}`,
      `*Modelo:* ${d.model}`,
      `*Horário preferido:* ${d.schedule}`,
      d.message ? `*Mensagem:* ${d.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(buildWhatsAppUrl(text), "_blank", "noopener,noreferrer");
    setSubmitting(false);
  }

  const inputCls =
    "w-full px-5 py-4 rounded-2xl bg-surface border border-border focus:border-primary outline-none transition-colors";

  return (
    <form
      onSubmit={onSubmit}
      className={
        compact
          ? "space-y-3"
          : "bg-card rounded-3xl p-8 sm:p-10 border border-border shadow-[var(--shadow-card)]"
      }
    >
      {!compact && (
        <>
          <h3 className="text-2xl font-bold mb-2">Agende seu test-ride</h3>
          <p className="text-muted-foreground mb-8">
            Preencha o formulário — enviaremos direto para o WhatsApp da loja.
          </p>
        </>
      )}
      <div className="space-y-4">
        <div>
          <input name="name" maxLength={100} placeholder="Seu nome" className={inputCls} />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
        </div>
        <div>
          <input
            name="phone"
            type="tel"
            maxLength={20}
            placeholder="WhatsApp (DDD + número)"
            className={inputCls}
          />
          {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <select
              name="model"
              defaultValue={defaultModel ?? ""}
              className={inputCls}
            >
              <option value="" disabled>
                Modelo de interesse
              </option>
              {models.map((m) => (
                <option key={m.slug} value={m.name}>
                  {m.name}
                </option>
              ))}
              <option>Outro / Catálogo completo</option>
            </select>
            {errors.model && <p className="text-sm text-destructive mt-1">{errors.model}</p>}
          </div>
          <div>
            <select name="schedule" defaultValue="" className={inputCls}>
              <option value="" disabled>
                Horário preferido
              </option>
              {schedules.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            {errors.schedule && (
              <p className="text-sm text-destructive mt-1">{errors.schedule}</p>
            )}
          </div>
        </div>
        <textarea
          name="message"
          rows={3}
          maxLength={500}
          placeholder="Mensagem (opcional)"
          className={`${inputCls} resize-none`}
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-semibold py-4 rounded-full transition-all hover:shadow-[var(--shadow-elegant)] hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          Enviar via WhatsApp
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
