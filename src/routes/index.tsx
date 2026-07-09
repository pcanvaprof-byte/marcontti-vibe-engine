import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Menu,
  X,
  ArrowRight,
  Zap,
  Wrench,
  Leaf,
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { buildWhatsAppFallbackUrl, openWhatsAppWithFallback, models, type Model } from "@/lib/models";
import { TestRideForm } from "@/components/TestRideForm";
import klugHorizontalWhite from "@/assets/klug/klug-horizontal-white.png.asset.json";
import klugHorizontal from "@/assets/klug/klug-horizontal.png.asset.json";
import klugSymbol from "@/assets/klug/klug-symbol.png.asset.json";
import x12Img from "@/assets/motos/x12.jpg.asset.json";

const BASE_URL = "https://proototipomotos.lovable.app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Klug Motors — Motos e Scooters Elétricas em Joinville" },
      {
        name: "description",
        content:
          "Klug Motors: motos, scooters, triciclos e bicicletas elétricas em Joinville/SC. Sem CNH, econômicas e sustentáveis. Rua Albano Schimidt, 1882.",
      },
      { property: "og:url", content: `${BASE_URL}/` },
      { property: "og:image", content: `${BASE_URL}${x12Img.url}` },
    ],
    links: [
      { rel: "canonical", href: `${BASE_URL}/` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AutomotiveBusiness",
          name: "Klug Motors",
          description:
            "Concessionária de motos, scooters, triciclos e bicicletas elétricas em Joinville/SC.",
          url: BASE_URL,
          telephone: "+554734293200",
          email: "klugmotors@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Rua Albano Schimidt, 1882",
            addressLocality: "Joinville",
            addressRegion: "SC",
            addressCountry: "BR",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "08:30",
              closes: "18:30",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "08:30",
              closes: "13:00",
            },
          ],
          sameAs: ["https://www.instagram.com/klugmotors/"],
        }),
      },
    ],
  }),
  component: Index,
});

const benefits = [
  {
    icon: Zap,
    title: "Zero Combustível",
    desc: "Recarregue em qualquer tomada. Custo até 10x menor que motos a gasolina.",
  },
  {
    icon: Wrench,
    title: "Manutenção Mínima",
    desc: "Sem óleo, sem correia, sem velas. Mais tempo na estrada, menos na oficina.",
  },
  {
    icon: Leaf,
    title: "Sem CNH · Silenciosa",
    desc: "A maioria dos modelos é autopropelida — não exige habilitação. E é 100% silenciosa.",
  },
];

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#modelos", label: "Modelos" },
    { href: "#sobre", label: "Sobre" },
    { href: "#contato", label: "Contato" },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2" aria-label="Klug Motors">
          <img src={klugHorizontalWhite.url} alt="Klug Motors" className="h-9 w-auto object-contain" />
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#contato"
          className="hidden md:inline-flex items-center gap-2 bg-primary hover:bg-primary-glow text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:shadow-[var(--shadow-elegant)] hover:-translate-y-0.5"
        >
          Agendar Test-Ride
          <ArrowRight size={16} />
        </a>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2" aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-5 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2 font-medium">
                {l.label}
              </a>
            ))}
            <a
              href="#contato"
              onClick={() => setOpen(false)}
              className="bg-primary text-primary-foreground text-center font-semibold px-5 py-3 rounded-full"
            >
              Agendar Test-Ride
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-16 overflow-hidden bg-charcoal text-white">
      <div className="absolute inset-0">
        <img
          src={x12Img.url}
          alt="Moto elétrica Klug Motors"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 min-h-[88vh] flex flex-col justify-center py-24">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-ring" />
            Joinville · SC
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 uppercase">
            Sua próxima moto
            <br />
            é{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Elétrica
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-xl mb-10 leading-relaxed">
            Motos, scooters, triciclos e bicicletas elétricas — a maioria <strong>sem CNH</strong>.
            Economia, silêncio e sustentabilidade na Klug Motors.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#modelos"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-7 py-4 rounded-full transition-all hover:shadow-[var(--shadow-elegant)] hover:-translate-y-0.5"
            >
              Ver Modelos
              <ArrowRight size={18} />
            </a>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white font-semibold px-7 py-4 rounded-full backdrop-blur transition-all"
            >
              Agendar Test-Ride
            </a>
          </div>
        </div>
        <div className="hidden lg:grid grid-cols-3 gap-8 mt-20 max-w-2xl border-t border-white/15 pt-8">
          {[
            ["10+", "Modelos"],
            ["0", "Combustível"],
            ["100%", "Elétrico"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="text-3xl font-black text-primary">{n}</div>
              <div className="text-sm text-white/60 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Products() {
  return (
    <section id="modelos" className="py-24 sm:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Catálogo Klug
            </span>
            <h2 className="text-4xl sm:text-5xl font-black mt-3 max-w-xl">
              Modelos feitos para a cidade.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Scooters, motos, triciclos e bicicletas elétricas — a maioria <strong>sem CNH</strong>,
            com a melhor relação custo-benefício do mercado.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((p) => (
            <ProductCard key={p.name} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product: p }: { product: Model }) {
  const [selected, setSelected] = useState(0);
  const variant = p.colors[selected];
  return (
    <article className="group bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/40 transition-all hover:-translate-y-2 hover:shadow-[var(--shadow-card)]">
      <Link
        to="/modelos/$slug"
        params={{ slug: p.slug }}
        className="block aspect-[5/4] bg-white overflow-hidden relative cursor-pointer"
        aria-label={`Ver detalhes do ${p.name}`}
      >
        <img
          src={variant.image}
          alt={`${p.name} ${variant.name}`}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-4 left-4 bg-charcoal text-white text-xs font-semibold px-3 py-1 rounded-full">
          {p.tag}
        </span>
        <span className="absolute bottom-4 right-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
          Ver detalhes <ChevronRight size={14} />
        </span>
      </Link>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <Link
              to="/modelos/$slug"
              params={{ slug: p.slug }}
              className="text-xl font-bold hover:text-primary transition-colors"
            >
              {p.name}
            </Link>
            <div className="text-xs text-muted-foreground mt-1">{p.tag}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">a partir de</div>
            <div className="text-lg font-black text-primary">{p.price}</div>
          </div>
        </div>
        {p.colors.length > 1 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {p.colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelected(i)}
                aria-label={c.name}
                title={c.name}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  i === selected ? "border-primary scale-110" : "border-border hover:border-primary/60"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}
        <div className="flex gap-4 text-sm text-muted-foreground border-t border-border pt-4 mb-5">
          <span>
            <strong className="text-foreground">{p.range}</strong> autonomia
          </span>
          <span className="w-px bg-border" />
          <span>
            <strong className="text-foreground">{p.power}</strong>
          </span>
        </div>
        <Link
          to="/modelos/$slug"
          params={{ slug: p.slug }}
          className="inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all"
        >
          Ver mais informações <ChevronRight size={16} />
        </Link>
      </div>
    </article>
  );
}

function Benefits() {
  return (
    <section id="sobre" className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Por que Klug Motors
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mt-3">
            Mais liberdade. Menos custo. Zero ruído.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="p-8 rounded-3xl bg-surface border border-border hover:border-primary/40 hover:-translate-y-1 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 grid place-items-center mb-6">
                <b.icon className="text-primary" size={26} strokeWidth={2.2} />
              </div>
              <h3 className="text-xl font-bold mb-3">{b.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contato" className="py-24 sm:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div>
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Visite a Klug Motors
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mt-3 mb-6">
            Estamos em Joinville · Albano Schimidt.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
            Venha conhecer os modelos pessoalmente, fazer um test-ride e conversar com nosso
            time. Atendemos direto, sem fechar para o almoço.
          </p>

          <div className="rounded-3xl overflow-hidden mb-8 shadow-[var(--shadow-card)] bg-white p-8 grid place-items-center">
            <img
              src={klugHorizontal.url}
              alt="Klug Motors"
              className="w-full max-w-xs object-contain"
              loading="lazy"
            />
          </div>

          <div className="space-y-4">
            {[
              { icon: MapPin, label: "Rua Albano Schimidt, 1882 — Joinville/SC" },
              { icon: Clock, label: "Seg–Sex 08h30–18h30 (sem fechar para almoço) · Sáb 08h30–13h00" },
              { icon: Phone, label: "(47) 3429-3200", href: "tel:+554734293200" },
              { icon: Mail, label: "klugmotors@gmail.com", href: "mailto:klugmotors@gmail.com" },
              {
                icon: Instagram,
                label: "@klugmotors",
                href: "https://www.instagram.com/klugmotors/",
              },
            ].map((i) => {
              const content = (
                <>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                    <i.icon className="text-primary" size={18} />
                  </div>
                  <span className="text-foreground/85 font-medium">{i.label}</span>
                </>
              );
              return i.href ? (
                <a
                  key={i.label}
                  href={i.href}
                  target={i.href.startsWith("http") ? "_blank" : undefined}
                  rel={i.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-4 hover:text-primary transition-colors"
                >
                  {content}
                </a>
              ) : (
                <div key={i.label} className="flex items-center gap-4">
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        <TestRideForm />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-charcoal text-white/70 py-12">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row justify-between gap-6 items-center">
        <div className="flex items-center gap-3">
          <img src={klugSymbol.url} alt="Klug Motors" className="w-9 h-9 object-contain" />
          <img src={klugHorizontalWhite.url} alt="Klug Motors" className="h-6 w-auto object-contain hidden sm:block" />
        </div>
        <div className="text-sm text-center">
          © {new Date().getFullYear()} Klug Motors · Joinville/SC · Todos os direitos reservados.
        </div>
        <a
          href="https://www.instagram.com/klugmotors/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/70 hover:text-primary transition-colors"
          aria-label="Instagram @klugmotors"
        >
          <Instagram size={20} />
        </a>
      </div>
    </footer>
  );
}

function WhatsAppFab() {
  const message = "Olá! Tenho interesse em conhecer os modelos da Klug Motors.";
  return (
    <a
      href={buildWhatsAppFallbackUrl(message)}
      onClick={(event) => {
        event.preventDefault();
        openWhatsAppWithFallback(message);
      }}
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-[var(--shadow-elegant)] hover:scale-110 transition-transform animate-float"
    >
      <MessageCircle size={26} fill="white" strokeWidth={0} />
    </a>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Products />
        <Benefits />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
