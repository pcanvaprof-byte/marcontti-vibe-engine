import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, Award, Leaf, Users, Zap } from "lucide-react";
import { PageLayout, SectionCard } from "@/components/PageLayout";
import janainaKlugAsset from "@/assets/janaina-klug.jpg.asset.json";

const BASE_URL = "https://althaciamoveis.shop";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a Klug Motors — Concessionária Elétrica em Joinville" },
      { name: "description", content: "Conheça a Klug Motors: concessionária de motos, scooters e triciclos elétricos em Joinville/SC. Nossa história, missão e compromisso com mobilidade sustentável." },
      { property: "og:title", content: "Sobre a Klug Motors" },
      { property: "og:description", content: "História, missão e valores da Klug Motors — mobilidade elétrica em Joinville/SC." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}/sobre` },
      { property: "og:image", content: `${BASE_URL}/__l5e/assets-v1/78e7624d-b686-4a7e-bab4-74a99ab5fdca/og-sobre.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BASE_URL}/__l5e/assets-v1/78e7624d-b686-4a7e-bab4-74a99ab5fdca/og-sobre.jpg` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/sobre` }],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <PageLayout
      eyebrow="Institucional"
      title="Missão, visão e valores"
      titleAccent="Klug Motors"
      intro="Na Klug Motors, acreditamos que cada moto e cada scooter entregam muito mais do que mobilidade: entregam liberdade, conquistas e novos começos."
    >
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="relative aspect-[3/4] md:aspect-auto md:h-[500px] overflow-hidden rounded-2xl border border-white/10 group">
          <img 
            src={janainaKlugAsset.url} 
            alt="Janaina Klug - Proprietária da Klug Motors" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <p className="font-display font-black text-2xl text-white uppercase tracking-tighter">Janaina Klug</p>
            <p className="text-primary text-xs font-bold uppercase tracking-widest mt-1">Proprietária</p>
          </div>
        </div>
        
        <div className="flex flex-col justify-center gap-6">
          <SectionCard title="Nossa Missão" className="m-0 h-full">
            <p>
              Acolher cada cliente com carinho, ouvir suas necessidades e oferecer a melhor solução com honestidade, respeito e dedicação, fazendo com que cada pessoa saia daqui com a certeza de que fez a escolha certa.
            </p>
          </SectionCard>
        </div>
      </div>

      <SectionCard title="Nossa Visão">
        <p>
          Queremos ser reconhecidos como uma empresa que conquista clientes pela confiança, pelo atendimento humano e pela paixão em servir. Nosso objetivo é crescer sem perder nossa essência: tratar cada cliente como único e construir relações que durem muito além da entrega das chaves.
        </p>
      </SectionCard>

      <SectionCard title="Nossos Valores">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 not-prose">
          {[
            "Atender com o coração e colocar as pessoas em primeiro lugar.",
            "Agir sempre com honestidade, ética e transparência.",
            "Respeitar cada história, cada sonho e cada conquista.",
            "Trabalhar com paixão, dedicação e responsabilidade.",
            "Buscar excelência em tudo o que fazemos.",
            "Valorizar o trabalho em equipe e o respeito entre todos.",
            "Construir relações baseadas na confiança.",
            "Evoluir constantemente para oferecer a melhor experiência aos nossos clientes.",
            "Ter gratidão pela oportunidade de fazer parte da realização de tantos sonhos.",
          ].map((valor, idx) => (
            <li key={idx} className="flex gap-3 items-start border border-border rounded-lg p-3 bg-background/30">
              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary grid place-items-center shrink-0 mt-0.5">
                <Zap size={10} />
              </span>
              <p className="text-white/80 text-[13px] leading-tight">{valor}</p>
            </li>
          ))}
        </ul>
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
            <p className="inline-flex items-start gap-2"><Clock size={16} className="text-primary mt-0.5 shrink-0" /> <span>Seg a Sex: 08:30 às 18:30 (sem fechar para almoço)<br />Sábado: 08:30 às 13:00<br />Domingo: fechado</span></p>
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
