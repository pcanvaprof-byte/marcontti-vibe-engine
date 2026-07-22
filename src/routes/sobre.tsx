import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, Award, Leaf, Users, Zap } from "lucide-react";
import { PageLayout, SectionCard } from "@/components/PageLayout";

const BASE_URL = "https://proototipomotos.lovable.app";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a Klug Motors — Concessionária Elétrica em Joinville" },
      { name: "description", content: "Conheça a Klug Motors: concessionária de motos, scooters, triciclos e bicicletas elétricas em Joinville/SC. Nossa história, missão e compromisso com mobilidade sustentável." },
      { property: "og:title", content: "Sobre a Klug Motors" },
      { property: "og:description", content: "História, missão e valores da Klug Motors — mobilidade elétrica em Joinville/SC." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}/sobre` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/sobre` }],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <PageLayout
      eyebrow="Institucional"
      title="Sobre a"
      titleAccent="Klug Motors"
      intro="Somos uma concessionária especializada em mobilidade elétrica em Joinville/SC. Motos, scooters, triciclos e bicicletas com foco em economia, sustentabilidade e o melhor pós-venda da região."
    >
      <SectionCard title="Nossa missão">
        <p>
          Democratizar o acesso à mobilidade elétrica no sul do Brasil, oferecendo veículos
          confiáveis, com preço justo, garantia real e atendimento técnico local. Acreditamos
          que motos e scooters elétricas são a solução mais inteligente para o dia a dia
          urbano — econômicas, silenciosas e livres de emissões.
        </p>
      </SectionCard>

      <SectionCard title="Por que Klug Motors">
        <ul className="grid sm:grid-cols-2 gap-4 not-prose">
          {[
            { icon: Award, title: "Revenda autorizada", desc: "Modelos homologados, com nota fiscal e garantia oficial." },
            { icon: Users, title: "Atendimento próximo", desc: "Falamos direto com você, sem intermediário — no WhatsApp, telefone ou na loja." },
            { icon: Leaf, title: "Mobilidade sustentável", desc: "Zero emissão local. Reduza sua pegada de carbono no trânsito diário." },
            { icon: Zap, title: "Economia real", desc: "Recarga custa centavos por km — muito mais barato que combustível." },
          ].map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex gap-4 items-start border border-border rounded-xl p-4 bg-background/50">
              <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
                <Icon size={18} />
              </span>
              <div>
                <p className="font-display font-black uppercase text-sm tracking-wider text-white mb-1">{title}</p>
                <p className="text-white/60 text-[13px] leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Visite a loja">
        <div className="grid sm:grid-cols-2 gap-6 not-prose">
          <div className="space-y-3 text-sm">
            <p className="inline-flex items-start gap-2"><MapPin size={16} className="text-primary mt-0.5 shrink-0" /> <span>R. Albano Schmidt, 1882 — Boa Vista<br />Joinville/SC · 89205-100</span></p>
            <p className="inline-flex items-start gap-2"><Clock size={16} className="text-primary mt-0.5 shrink-0" /> <span>Seg–Sex 08:30 às 18:30 (sem fechar para almoço)<br />Sábado 08:30 às 13:00</span></p>
            <p className="text-xs text-white/50 pt-2">CNPJ 51.728.597/0001-26</p>
          </div>
          <div className="border border-border rounded-xl overflow-hidden">
            <iframe
              title="Localização da Klug Motors em Joinville"
              src="https://www.google.com/maps?q=R.+Albano+Schmidt,+1882+-+Boa+Vista,+Joinville+-+SC,+89205-100&output=embed"
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </SectionCard>
    </PageLayout>
  );
}
