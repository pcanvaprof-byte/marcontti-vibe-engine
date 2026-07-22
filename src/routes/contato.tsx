import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, Instagram, MessageCircle } from "lucide-react";
import { PageLayout, SectionCard } from "@/components/PageLayout";
import { FinanciamentoForm } from "@/components/FinanciamentoForm";
import { buildWhatsAppFallbackUrl, openWhatsAppWithFallback } from "@/lib/models";

const BASE_URL = "https://proototipomotos.lovable.app";
const FINANCE_MSG =
  "Olá, Klug Motors! Quero simular um financiamento e conhecer as condições. Podem me ajudar?";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Klug Motors Joinville" },
      { name: "description", content: "Fale com a Klug Motors: WhatsApp, telefone, e-mail e endereço em Joinville/SC. Atendimento seg–sáb, sem fechar para o almoço." },
      { property: "og:title", content: "Contato — Klug Motors" },
      { property: "og:description", content: "WhatsApp, telefone e loja física em Joinville/SC. Fale direto com a nossa equipe." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}/contato` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/contato` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AutomotiveBusiness",
          name: "Klug Motors",
          url: BASE_URL,
          telephone: "+554734293200",
          email: "klugmotors@gmail.com",
          taxID: "51.728.597/0001-26",
          address: {
            "@type": "PostalAddress",
            streetAddress: "R. Albano Schmidt, 1882 — Boa Vista",
            addressLocality: "Joinville",
            postalCode: "89205-100",
            addressRegion: "SC",
            addressCountry: "BR",
          },
          openingHoursSpecification: [
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:30", closes: "18:30" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:30", closes: "13:00" },
          ],
          sameAs: ["https://www.instagram.com/klugmotors/"],
        }),
      },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  return (
    <PageLayout
      eyebrow="Fale conosco"
      title="Estamos em"
      titleAccent="Joinville"
      intro="Prefere falar direto? WhatsApp, telefone, e-mail ou pessoalmente na loja. Respondemos rápido."
      maxWidth="max-w-6xl"
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SectionCard title="Canais diretos">
            <div className="not-prose grid gap-3">
              <a
                href={buildWhatsAppFallbackUrl(FINANCE_MSG)}
                onClick={(e) => { e.preventDefault(); openWhatsAppWithFallback(FINANCE_MSG); }}
                className="flex items-center justify-between gap-3 p-4 border border-border rounded-xl bg-background/50 hover:border-primary transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-[#25D366]/10 text-[#25D366] grid place-items-center"><MessageCircle size={18} /></span>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-display font-black mb-0.5">WhatsApp</p>
                    <p className="text-sm font-display font-black text-white">Fale agora</p>
                  </div>
                </div>
                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-xs uppercase tracking-widest">Abrir →</span>
              </a>
              <a href="tel:+554734293200" className="flex items-center gap-3 p-4 border border-border rounded-xl bg-background/50 hover:border-primary transition-colors">
                <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><Phone size={18} /></span>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-display font-black mb-0.5">Telefone</p>
                  <p className="text-sm font-display font-black text-white">(47) 3429-3200</p>
                </div>
              </a>
              <a href="mailto:klugmotors@gmail.com" className="flex items-center gap-3 p-4 border border-border rounded-xl bg-background/50 hover:border-primary transition-colors">
                <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><Mail size={18} /></span>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-display font-black mb-0.5">E-mail</p>
                  <p className="text-sm text-white">klugmotors@gmail.com</p>
                </div>
              </a>
              <a href="https://www.instagram.com/klugmotors/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 border border-border rounded-xl bg-background/50 hover:border-primary transition-colors">
                <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><Instagram size={18} /></span>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-display font-black mb-0.5">Instagram</p>
                  <p className="text-sm text-white">@klugmotors</p>
                </div>
              </a>
            </div>
          </SectionCard>

          <SectionCard title="Loja física">
            <div className="not-prose space-y-3 text-sm">
              <p className="inline-flex items-start gap-2"><MapPin size={16} className="text-primary mt-0.5 shrink-0" /> <span>R. Albano Schmidt, 1882 — Boa Vista, Joinville/SC · 89205-100</span></p>
              <p className="inline-flex items-start gap-2"><Clock size={16} className="text-primary mt-0.5 shrink-0" /> <span>Seg–Sex 08:30–18:30 (sem fechar para almoço)<br />Sábado 08:30–13:00</span></p>
            </div>
            <div className="not-prose mt-5 border border-border rounded-xl overflow-hidden">
              <iframe
                title="Localização da Klug Motors"
                src="https://www.google.com/maps?q=R.+Albano+Schmidt,+1882+-+Boa+Vista,+Joinville+-+SC,+89205-100&output=embed"
                width="100%"
                height="260"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-t border-border bg-background/50">
                <p className="text-xs text-white/60">R. Albano Schmidt, 1882 — Boa Vista, Joinville/SC · 89205-100</p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=R.+Albano+Schmidt,+1882+-+Boa+Vista,+Joinville+-+SC,+89205-100"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase text-[11px] tracking-widest px-4 py-2.5 rounded-full transition-all hover:-translate-y-0.5"
                >
                  <MapPin size={14} /> Como chegar
                </a>
              </div>
            </div>
          </SectionCard>
        </div>

        <div>
          <FinanciamentoForm />
        </div>
      </div>
    </PageLayout>
  );
}
