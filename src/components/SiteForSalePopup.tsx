import { useEffect, useState } from "react";
import { X, Zap, Clock, CheckCircle2, Globe } from "lucide-react";

const PHONE = "5547996535134";
const SITE_PRICE = "R$ 997,90";
const DOMAIN_PRICE = "R$ 130,98";
const STORAGE_KEY = "site-sale-popup-dismissed";

function buildWhatsAppLink() {
  const msg = encodeURIComponent(
    `Olá! Tenho interesse em adquirir um site como este por ${SITE_PRICE} (+ domínio por ${DOMAIN_PRICE}). Pode me passar mais informações?`,
  );
  return `https://wa.me/${PHONE}?text=${msg}`;
}

export function SiteForSalePopup() {
  const [open, setOpen] = useState(false);
  const [seconds, setSeconds] = useState(15 * 60);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const i = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(i);
  }, [open]);

  function close() {
    setOpen(false);
    if (typeof window !== "undefined") sessionStorage.setItem(STORAGE_KEY, "1");
  }

  if (!open) return null;

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={close}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-background via-background to-primary/5 shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-1.5 text-muted-foreground transition hover:bg-background hover:text-foreground"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="bg-gradient-to-r from-primary to-primary/70 px-6 py-2 text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
            <Zap className="h-3.5 w-3.5" /> Oferta por tempo limitado
          </p>
        </div>

        <div className="p-6 md:p-8">
          {/* Attention */}
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight text-foreground">
            Este site pode ser <span className="text-primary">SEU</span> hoje.
          </h2>

          {/* Interest */}
          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            Design profissional, responsivo, otimizado para SEO e pronto para
            converter visitantes em clientes. Sem mensalidade, sem complicação.
          </p>

          {/* Desire */}
          <ul className="mt-4 space-y-1.5 text-sm">
            {[
              "Site completo entregue funcionando",
              "Otimizado para Google e mobile",
              "Editável — você muda quando quiser",
              "Suporte na configuração",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-muted-foreground line-through">R$ 2.997</span>
              <span className="text-3xl md:text-4xl font-extrabold text-primary">
                {SITE_PRICE}
              </span>
              <span className="text-xs text-muted-foreground">à vista</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-sm text-foreground">
              <Globe className="h-4 w-4 text-primary" />
              <span>+ Domínio próprio por apenas</span>
              <span className="font-bold text-primary">{DOMAIN_PRICE}</span>
            </div>
          </div>

          {/* Urgency */}
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-destructive">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-semibold">
              Oferta expira em {mm}:{ss}
            </span>
          </div>

          {/* Action */}
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="mt-4 flex w-full items-center justify-center rounded-xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary/90"
          >
            QUERO MEU SITE AGORA →
          </a>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Falar no WhatsApp: <span className="font-medium text-foreground">(47) 99653-5134</span>
          </p>
        </div>
      </div>
    </div>
  );
}
