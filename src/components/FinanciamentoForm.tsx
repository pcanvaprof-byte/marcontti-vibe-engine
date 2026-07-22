import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2, MessageCircle, RotateCcw, AlertCircle, Upload, FileCheck2 } from "lucide-react";
import { z } from "zod";
import { models, openWhatsAppWithFallback } from "@/lib/models";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

const PAYMENT_TYPES = ["Financiamento", "À vista", "Cartão de crédito"] as const;
type PaymentType = (typeof PAYMENT_TYPES)[number];

const baseSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  phone: z
    .string()
    .trim()
    .min(8, "Telefone inválido")
    .max(20)
    .regex(/^[0-9()\s+-]+$/, "Use apenas números"),
  email: z.string().trim().email("E-mail inválido").max(255),
  model: z.string().min(1, "Escolha um modelo"),
  paymentType: z.enum(PAYMENT_TYPES, { message: "Escolha a forma de pagamento" }),
  entry: z.string().optional(),
  term: z.string().optional(),
  message: z.string().trim().max(500).optional(),
});

const entries = [
  "Sem entrada",
  "Até R$ 1.500",
  "R$ 1.500 – R$ 3.000",
  "R$ 3.000 – R$ 5.000",
  "Acima de R$ 5.000",
];

const terms = ["12x", "18x", "24x", "36x", "A combinar"];

const MAX_FILE_MB = 10;
const ACCEPTED = "image/png,image/jpeg,image/jpg,application/pdf";

type DocKey = "photo" | "address" | "income";
const DOC_LABELS: Record<DocKey, string> = {
  photo: "Documento com foto (RG ou CNH)",
  address: "Comprovante de residência",
  income: "Comprovante de renda",
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "lead";
}

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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType | "">("");
  const [files, setFiles] = useState<Record<DocKey, File | null>>({
    photo: null,
    address: null,
    income: null,
  });

  const isFinancing = paymentType === "Financiamento";

  function pickFile(key: DocKey, file: File | null) {
    if (file && file.size > MAX_FILE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [`doc_${key}`]: `Arquivo maior que ${MAX_FILE_MB}MB` }));
      return;
    }
    setErrors((prev) => {
      const n = { ...prev };
      delete n[`doc_${key}`];
      return n;
    });
    setFiles((prev) => ({ ...prev, [key]: file }));
  }

  async function uploadDoc(key: DocKey, file: File, folder: string): Promise<string | null> {
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${folder}/${key}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("lead-documents")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) return null;
    return path;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      model: String(fd.get("model") ?? ""),
      paymentType: String(fd.get("paymentType") ?? "") as PaymentType,
      entry: String(fd.get("entry") ?? ""),
      term: String(fd.get("term") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = baseSchema.safeParse(raw);
    const errs: Record<string, string> = {};
    if (!parsed.success) {
      parsed.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
    }
    const d = parsed.success ? parsed.data : (raw as unknown as z.infer<typeof baseSchema>);

    if (d.paymentType === "Financiamento") {
      if (!d.entry) errs.entry = "Selecione uma entrada";
      if (!d.term) errs.term = "Selecione um prazo";
      (["photo", "address", "income"] as DocKey[]).forEach((k) => {
        if (!files[k]) errs[`doc_${k}`] = "Envie este documento";
      });
    }

    if (Object.keys(errs).length) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      const el = document.getElementById(`fin-${firstKey}`) as HTMLElement | null;
      el?.focus();
      return;
    }

    setErrors({});
    setSaveError(null);
    setSubmitting(true);

    const folder = `${slugify(d.name)}-${Date.now()}`;
    const uploaded: Record<DocKey, string | null> = { photo: null, address: null, income: null };

    if (d.paymentType === "Financiamento") {
      for (const k of ["photo", "address", "income"] as DocKey[]) {
        const f = files[k];
        if (f) uploaded[k] = await uploadDoc(k, f, folder);
      }
      const failed = (["photo", "address", "income"] as DocKey[]).some((k) => !uploaded[k]);
      if (failed) {
        setSubmitting(false);
        setSaveError("Falha ao enviar um dos documentos. Tente novamente.");
        return;
      }
    }

    const paymentLine =
      d.paymentType === "Financiamento"
        ? `*Financiamento* — entrada: ${d.entry} · prazo: ${d.term}`
        : `*Forma de pagamento:* ${d.paymentType}`;

    const text = [
      `Olá! Quero uma proposta para uma moto elétrica da Klug Motors.`,
      ``,
      `*Nome:* ${d.name}`,
      `*Telefone:* ${d.phone}`,
      `*E-mail:* ${d.email}`,
      `*Modelo:* ${d.model}`,
      paymentLine,
      d.paymentType === "Financiamento" ? `*Documentos:* enviados pelo site` : null,
      d.message ? `*Observações:* ${d.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const { error } = await supabase.from("leads").insert({
      name: d.name,
      phone: d.phone,
      email: d.email,
      model: d.model,
      payment_type: d.paymentType,
      entry: d.paymentType === "Financiamento" ? d.entry : null,
      term: d.paymentType === "Financiamento" ? d.term : null,
      message: d.message || null,
      source: "financiamento",
      doc_photo_url: uploaded.photo,
      doc_address_url: uploaded.address,
      doc_income_url: uploaded.income,
    });

    setSubmitting(false);

    if (error) {
      setSaveError("Não foi possível salvar sua solicitação. Tente novamente ou envie pelo WhatsApp.");
      setLastMessage(text);
      return;
    }

    setLastMessage(text);
    setSent(true);
    trackEvent("financiamento_submit", {
      source: "financiamento_form",
      meta: { model: d.model, payment_type: d.paymentType, entry: d.entry, term: d.term },
    });
  }

  function reset() {
    setSent(false);
    setLastMessage(null);
    setSaveError(null);
    setErrors({});
    setPaymentType("");
    setFiles({ photo: null, address: null, income: null });
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
            Solicitação recebida
          </p>
          <h3 className="font-display font-black uppercase text-2xl sm:text-3xl tracking-tight mb-3">
            Obrigado! Já recebemos seus dados
          </h3>
          <p className="text-white/70 text-sm max-w-sm mb-6">
            Nossa equipe entrará em contato em breve pelo WhatsApp, telefone ou e-mail informado.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => lastMessage && openWhatsAppWithFallback(lastMessage)}
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-display font-black uppercase text-xs tracking-widest px-6 py-3 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <MessageCircle size={16} fill="white" strokeWidth={0} />
              Enviar pelo WhatsApp
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 border border-border text-white/80 hover:border-primary hover:text-primary font-display font-black uppercase text-xs tracking-widest px-6 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <RotateCcw size={14} />
              Nova solicitação
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
      aria-label="Solicitar proposta"
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
            Solicite sua proposta
          </h3>
          <p className="text-white/60 text-sm">
            Escolha a forma de pagamento. Se optar por financiamento, envie os documentos e agilizamos sua análise.
          </p>
        </div>
      )}

      {saveError && (
        <div role="alert" className="mb-5 flex items-start gap-2 border border-destructive/50 bg-destructive/10 text-destructive text-xs p-3 rounded-md">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{saveError}</span>
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
          />
          {errors.name && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.name}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
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
            />
            {errors.phone && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="fin-email" className={labelCls}>E-mail</label>
            <input
              id="fin-email"
              name="email"
              type="email"
              maxLength={255}
              placeholder="voce@email.com"
              className={inputCls}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.email}</p>}
          </div>
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
          {errors.model && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.model}</p>}
        </div>

        <div>
          <span className={labelCls}>Forma de pagamento</span>
          <div
            id="fin-paymentType"
            role="radiogroup"
            aria-invalid={!!errors.paymentType}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2"
          >
            {PAYMENT_TYPES.map((p) => {
              const active = paymentType === p;
              return (
                <label
                  key={p}
                  className={`cursor-pointer border px-4 py-3 text-center text-xs font-display font-black uppercase tracking-widest transition-all ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-white/80 hover:border-primary/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentType"
                    value={p}
                    className="sr-only"
                    checked={active}
                    onChange={() => setPaymentType(p)}
                  />
                  {p}
                </label>
              );
            })}
          </div>
          {errors.paymentType && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.paymentType}</p>}
        </div>

        {isFinancing && (
          <>
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
                {errors.entry && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.entry}</p>}
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
                {errors.term && <p role="alert" className="text-xs text-destructive mt-1.5">{errors.term}</p>}
              </div>
            </div>

            <div className="border border-border/70 p-5 space-y-4">
              <div>
                <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-1">
                  Documentos para análise
                </p>
                <p className="text-xs text-white/60">
                  Envie fotos legíveis ou PDF. Máx {MAX_FILE_MB}MB por arquivo. Seus documentos ficam em ambiente privado, acessados apenas pela nossa equipe.
                </p>
              </div>
              {(Object.keys(DOC_LABELS) as DocKey[]).map((k) => {
                const f = files[k];
                const err = errors[`doc_${k}`];
                return (
                  <div key={k}>
                    <label htmlFor={`fin-doc_${k}`} className={labelCls}>{DOC_LABELS[k]}</label>
                    <label
                      htmlFor={`fin-doc_${k}`}
                      className={`flex items-center gap-3 cursor-pointer border px-4 py-3 text-sm transition-colors ${
                        f ? "border-primary/60 text-white" : "border-border text-white/70 hover:border-primary/60"
                      }`}
                    >
                      {f ? <FileCheck2 size={18} className="text-primary shrink-0" /> : <Upload size={18} className="shrink-0" />}
                      <span className="truncate">
                        {f ? f.name : "Selecionar arquivo (JPG, PNG ou PDF)"}
                      </span>
                    </label>
                    <input
                      id={`fin-doc_${k}`}
                      type="file"
                      accept={ACCEPTED}
                      className="sr-only"
                      onChange={(e) => pickFile(k, e.currentTarget.files?.[0] ?? null)}
                    />
                    {err && <p role="alert" className="text-xs text-destructive mt-1.5">{err}</p>}
                  </div>
                );
              })}
            </div>
          </>
        )}

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
            </>
          ) : (
            <>
              Enviar solicitação <ArrowRight size={18} />
            </>
          )}
        </button>
        <p className="text-[10px] text-white/60 text-center uppercase tracking-widest">
          Seus dados e documentos são tratados com sigilo
        </p>
      </div>
    </form>
  );
}
