import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  BadgeCheck,
  CreditCard,
  Wallet,
  BadgePercent,
  Store,
  ShieldCheck,
} from "lucide-react";
import {
  buildWhatsAppFallbackUrl,
  openWhatsAppWithFallback,
  models,
  type Model,
} from "@/lib/models";
import { TestRideForm } from "@/components/TestRideForm";
import klugSymbol from "@/assets/klug/klug-symbol.png.asset.json";
import klugLogo from "@/assets/klug/klug-horizontal-white.png.asset.json";
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
    links: [{ rel: "canonical", href: `${BASE_URL}/` }],
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
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
              ],
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

/* ------------------------------ Brand mark ------------------------------ */

function KlugWordmark({ className = "" }: { className?: string }) {
  return (
    <img
      src={klugLogo.url}
      alt="Klug Motors"
      className={`h-8 sm:h-9 w-auto object-contain ${className}`}
    />
  );
}

/* ------------------------------ Header ------------------------------ */

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#modelos", label: "Modelos" },
    { href: "#sobre", label: "Sobre" },
    { href: "#contato", label: "Contato" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${
        scrolled
          ? "bg-background/95 border-border"
          : "bg-background/70 border-border/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a
          href="#"
          className="flex items-center gap-2 focus:outline-none"
          aria-label="Klug Motors — início"
        >
          <KlugWordmark />
        </a>

        <nav
          className="hidden md:flex items-center gap-8 font-display font-bold uppercase text-xs tracking-[0.2em]"
          aria-label="Principal"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="story-link text-white/80 hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/modelos"
            className="story-link text-white/80 hover:text-primary transition-colors"
          >
            Catálogo
          </Link>
        </nav>

        <a
          href="#contato"
          className="hidden md:inline-flex items-center gap-2 bg-primary hover:bg-primary-glow text-primary-foreground font-display font-extrabold text-[11px] px-5 py-2.5 rounded-full uppercase tracking-widest transition-all hover:scale-[1.03] hover:shadow-[var(--shadow-ember)] active:scale-95"
        >
          Test-Ride
          <ArrowRight size={14} />
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 min-h-11 min-w-11 grid place-items-center"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="md:hidden border-t border-border bg-background animate-fade-in"
        >
          <div className="px-5 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 font-display font-bold uppercase text-sm tracking-wider hover:text-primary"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/modelos"
              onClick={() => setOpen(false)}
              className="py-3 font-display font-bold uppercase text-sm tracking-wider hover:text-primary"
            >
              Catálogo
            </Link>
            <a
              href="#contato"
              onClick={() => setOpen(false)}
              className="mt-2 bg-primary text-primary-foreground text-center font-display font-extrabold uppercase text-xs tracking-widest px-5 py-4 rounded-full"
            >
              Agendar Test-Ride
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------ Hero ------------------------------ */

function AnimatedCount({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          const start = performance.now();
          const duration = 900;
          const step = (t: number) => {
            const p = Math.min(1, (t - start) / duration);
            setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 ember-spotlight pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left */}
        <div className="lg:col-span-7 relative z-10 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 border border-primary text-primary text-[10px] font-display font-extrabold uppercase tracking-[0.3em] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-ring" />
            Joinville · SC · Albano Schimidt
          </span>

          <h1 className="font-display font-black uppercase text-5xl sm:text-6xl lg:text-8xl leading-[0.9] tracking-tighter mb-8">
            Sua próxima{" "}
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "1.5px white" }}
            >
              moto
            </span>{" "}
            é <span className="text-primary">elétrica</span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 max-w-lg mb-10 leading-relaxed">
            Performance silenciosa, zero combustível e a maioria dos modelos{" "}
            <strong className="text-white">sem CNH</strong>. Venha conhecer a
            revolução da mobilidade elétrica na Klug Motors.
          </p>

          <div className="flex flex-wrap gap-4 mb-14">
            <a
              href="#modelos"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-sm px-8 py-4 transition-all hover:shadow-[var(--shadow-ember)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Explorar Catálogo
              <ArrowRight size={18} />
            </a>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 border border-border hover:border-white text-white font-display font-black uppercase tracking-widest text-sm px-8 py-4 transition-all"
            >
              Ver Unidade
            </a>
          </div>

          {/* Stats strip */}
          <dl className="grid grid-cols-3 gap-6 max-w-lg border-t border-border pt-6">
            {[
              { n: models.length, s: "+", l: "Modelos" },
              { n: 100, s: "%", l: "Elétrico" },
              { n: 0, s: "", l: "Combustível" },
            ].map((it) => (
              <div key={it.l}>
                <dt className="sr-only">{it.l}</dt>
                <dd className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
                  <AnimatedCount target={it.n} suffix={it.s} />
                </dd>
                <p className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-bold mt-1">
                  {it.l}
                </p>
              </div>
            ))}
          </dl>
        </div>

        {/* Right — hero image + big watermark */}
        <div className="lg:col-span-5 relative">
          <div className="relative z-10 aspect-[4/5] bg-card border border-border overflow-hidden">
            <img
              src={x12Img.url}
              alt="Scooter elétrica Klug Motors — X12"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/95 via-black/50 to-transparent">
              <p className="text-[10px] font-display font-black text-primary uppercase tracking-[0.3em] mb-1">
                Destaque
              </p>
              <p className="font-display font-black uppercase text-2xl leading-none">
                X12 1000W
              </p>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="hidden md:block absolute -bottom-16 -right-8 font-display font-black uppercase text-[14rem] leading-none opacity-[0.04] select-none pointer-events-none tracking-tighter"
          >
            KLUG
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Perks strip ---------------------------- */

const PERKS = [
  { icon: CreditCard, title: "Financiamento", desc: "em até 36x (WhatsApp)" },
  { icon: Wallet, title: "Pagamento facilitado", desc: "em até 21x no cartão" },
  { icon: BadgePercent, title: "10% OFF no PIX", desc: "desconto na hora" },
  { icon: Store, title: "+ de 5.000", desc: "unidades vendidas" },
  { icon: ShieldCheck, title: "Loja Oficial", desc: "Joinville / SC" },
] as const;

function PerksBar() {
  return (
    <section
      aria-label="Benefícios e condições"
      className="border-b border-border bg-card"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {PERKS.map((p, i) => (
            <li
              key={p.title}
              className={`flex items-center gap-3 py-5 px-4 sm:px-5 border-border ${
                i > 0 ? "md:border-l" : ""
              } ${i >= 2 ? "border-t md:border-t-0" : ""} ${
                i === 1 ? "border-l md:border-l" : ""
              } ${i === 3 ? "border-l md:border-l" : ""} group hover:bg-background transition-colors`}
            >
              <span className="w-10 h-10 shrink-0 border border-border grid place-items-center text-primary group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-colors">
                <p.icon size={18} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <p className="font-display font-black uppercase text-[12px] tracking-wider leading-none">
                  {p.title}
                </p>
                <p className="text-white/55 text-[11px] mt-1 leading-tight">
                  {p.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------- Products grid ---------------------------- */

const CATEGORIES = ["Todos", "Motos", "Scooters", "Triciclos", "Bicicletas", "Patinetes"] as const;
type Category = (typeof CATEGORIES)[number];

function matchCategory(m: Model, cat: Category) {
  if (cat === "Todos") return true;
  const t = m.tag.toLowerCase();
  if (cat === "Patinetes") return t.includes("patinete");
  if (cat === "Bicicletas") return t.includes("bicicleta");
  if (cat === "Triciclos") return t.includes("triciclo");
  if (cat === "Scooters") return t.includes("scooter");
  if (cat === "Motos") return t.includes("moto elétrica") || t.startsWith("moto");
  return true;
}

/* ------------------------- Nossa Linha (featured) ------------------------- */

const FEATURED_SLUGS = ["p10", "pop", "x12", "x15"] as const;

function Featured() {
  const featured = FEATURED_SLUGS
    .map((s) => models.find((m) => m.slug === s))
    .filter((m): m is Model => Boolean(m));

  return (
    <section id="nossa-linha" className="py-24 sm:py-32 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-4">
              Destaques
            </p>
            <h2 className="font-display font-black uppercase text-4xl sm:text-5xl tracking-tighter leading-none">
              Nossa <span className="text-primary">Linha</span>
            </h2>
            <p className="text-white/60 mt-4 text-sm leading-relaxed max-w-md">
              Os quatro modelos mais procurados — do patinete urbano ao triciclo top de linha.
            </p>
          </div>
          <Link
            to="/modelos"
            className="inline-flex items-center gap-2 self-start md:self-auto text-[10px] font-display font-black uppercase tracking-widest text-primary hover:gap-3 transition-all"
          >
            Ver catálogo completo <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((m) => (
            <article key={m.slug} className="group bg-card border border-border hover-ember flex flex-col">
              <Link
                to="/modelos/$slug"
                params={{ slug: m.slug }}
                className="block relative aspect-[4/3] overflow-hidden bg-charcoal"
                aria-label={`Ver detalhes de ${m.name}`}
              >
                <img
                  src={m.colors[0]?.image}
                  alt={`${m.name} — ${m.tag}`}
                  loading="lazy"
                  className="w-full h-full object-contain p-5 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <span className="absolute top-3 left-3 bg-charcoal/80 backdrop-blur border border-border text-white text-[9px] font-display font-black uppercase tracking-wider px-2 py-1 inline-flex items-center gap-1">
                  <Zap size={10} className="text-primary" /> {m.power}
                </span>
              </Link>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-primary text-[10px] font-display font-black uppercase tracking-widest mb-1">
                  {m.tag}
                </p>
                <h3 className="font-display font-black uppercase text-lg tracking-tight">
                  {m.name}
                </h3>
                <p className="mt-2 text-xs text-white/55 line-clamp-2 flex-1">{m.short}</p>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="block text-[9px] text-white/40 uppercase font-bold tracking-wider">
                      A partir de
                    </span>
                    <span className="font-display font-black text-base">{m.price}</span>
                  </div>
                </div>
                <Link
                  to="/modelos/$slug"
                  params={{ slug: m.slug }}
                  className="mt-4 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-[10px] px-4 py-3 hover:opacity-90 transition-opacity"
                >
                  Ver detalhes <ChevronRight size={12} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}



function Products() {
  const [cat, setCat] = useState<Category>("Todos");
  const filtered = models.filter((m) => matchCategory(m, cat));

  return (
    <section id="modelos" className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <h2 className="font-display font-black uppercase text-4xl sm:text-5xl tracking-tighter leading-none">
              Catálogo <span className="text-primary">Completo</span>
            </h2>
            <p className="text-white/50 font-bold uppercase text-[11px] tracking-[0.25em] mt-4">
              {models.length} modelos disponíveis · Pronta entrega
            </p>
          </div>
          <div
            role="tablist"
            aria-label="Filtrar por categoria"
            className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-display font-black uppercase tracking-widest"
          >
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                onClick={() => setCat(c)}
                className={`pb-1 transition-colors ${
                  cat === c
                    ? "text-primary border-b-2 border-primary"
                    : "text-white/40 hover:text-white border-b-2 border-transparent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="Nenhum modelo nesta categoria"
            hint="Selecione outra categoria acima ou veja o catálogo completo."
            action={
              <button
                onClick={() => setCat("Todos")}
                className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-xs px-6 py-3"
              >
                Ver Todos <ArrowRight size={14} />
              </button>
            }
          />
        ) : (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product: p }: { product: Model }) {
  const img = p.colors[0]?.image ?? "";
  return (
    <article className="group bg-card border border-border hover-ember">
      <Link
        to="/modelos/$slug"
        params={{ slug: p.slug }}
        className="block relative aspect-[4/3] overflow-hidden bg-charcoal"
        aria-label={`Ver detalhes de ${p.name}`}
      >
        <img
          src={img}
          alt={`${p.name} — ${p.tag}`}
          loading="lazy"
          className="w-full h-full object-contain p-6 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
          <span className="bg-charcoal/80 backdrop-blur border border-border text-white text-[9px] font-display font-black uppercase tracking-wider px-2 py-1 inline-flex items-center gap-1">
            <Zap size={10} className="text-primary" /> {p.power}
          </span>
          <span className="bg-charcoal/80 backdrop-blur border border-border text-white text-[9px] font-display font-black uppercase tracking-wider px-2 py-1">
            {p.range}
          </span>
        </div>
      </Link>
      <div className="p-6 sm:p-7">
        <div className="flex justify-between items-start gap-4 mb-5">
          <div className="min-w-0">
            <h3 className="font-display font-black uppercase text-xl tracking-tight truncate">
              {p.name}
            </h3>
            <p className="text-primary text-[10px] font-display font-black uppercase tracking-widest mt-1">
              {p.tag}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="block text-[9px] text-white/40 uppercase font-bold tracking-wider">
              A partir de
            </span>
            <span className="font-display font-black text-lg">{p.price}</span>
          </div>
        </div>
        <Link
          to="/modelos/$slug"
          params={{ slug: p.slug }}
          className="w-full py-3 flex items-center justify-center gap-2 border border-border group-hover:bg-primary group-hover:border-primary text-white font-display font-black uppercase text-[11px] tracking-widest transition-all"
        >
          Ver Detalhes <ChevronRight size={14} />
        </Link>
      </div>
    </article>
  );
}

function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border border-dashed border-border p-16 text-center bg-card">
      <p className="font-display font-black uppercase tracking-wider text-lg mb-2">
        {title}
      </p>
      <p className="text-white/50 text-sm">{hint}</p>
      {action}
    </div>
  );
}

/* ---------------------------- Benefits strip ---------------------------- */

const benefits = [
  {
    icon: Zap,
    kicker: "01",
    title: "Zero Combustível",
    desc: "Recarregue em qualquer tomada. Custo por km até 10× menor que a gasolina.",
  },
  {
    icon: Wrench,
    kicker: "02",
    title: "Manutenção Mínima",
    desc: "Sem óleo, sem correia, sem velas. Mais tempo na estrada, menos na oficina.",
  },
  {
    icon: BadgeCheck,
    kicker: "03",
    title: "Sem CNH",
    desc: "A maioria dos modelos é autopropelida (CONTRAN 996/23) — não exige habilitação.",
  },
  {
    icon: Leaf,
    kicker: "04",
    title: "100% Silenciosa",
    desc: "Zero ruído, zero emissão. A mobilidade urbana que respeita a cidade.",
  },
];

function Benefits() {
  return (
    <section id="sobre" className="py-24 sm:py-32 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-4">
            Por que Klug Motors
          </p>
          <h2 className="font-display font-black uppercase text-4xl sm:text-5xl tracking-tighter leading-none">
            Mais liberdade.
            <br />
            Menos <span className="text-primary">custo</span>. Zero ruído.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className={`p-8 border-t border-l border-border ${
                i === benefits.length - 1 ? "sm:border-r" : ""
              } ${i >= benefits.length - 2 ? "lg:border-b-0" : ""} lg:border-b border-b group hover:bg-background transition-colors`}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-11 h-11 border border-border grid place-items-center group-hover:bg-primary group-hover:border-primary transition-colors">
                  <b.icon
                    className="text-primary group-hover:text-primary-foreground transition-colors"
                    size={20}
                    strokeWidth={2.2}
                  />
                </div>
                <span className="font-display text-xs text-white/30 font-black tracking-widest">
                  {b.kicker}
                </span>
              </div>
              <h3 className="font-display font-black uppercase text-lg tracking-tight mb-3">
                {b.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Contact ---------------------------- */

function Contact() {
  return (
    <section id="contato" className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div>
          <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-4">
            Visite a unidade
          </p>
          <h2 className="font-display font-black uppercase text-4xl sm:text-5xl tracking-tighter leading-none mb-6">
            Estamos em <span className="text-primary">Joinville</span>.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-md">
            Venha conhecer os modelos, fazer um test-ride e conversar com o
            time. Atendemos direto, sem fechar para o almoço.
          </p>

          {/* Cockpit panel */}
          <div className="border border-border bg-card divide-y divide-border">
            <ContactRow
              icon={MapPin}
              label="Endereço"
              value="Rua Albano Schimidt, 1882 · Joinville / SC"
              href="https://maps.google.com/?q=Rua+Albano+Schimidt+1882+Joinville"
            />
            <ContactRow
              icon={Phone}
              label="Central de vendas"
              value="(47) 3429-3200"
              href="tel:+554734293200"
              highlight
            />
            <ContactRow
              icon={Clock}
              label="Horários"
              value="Seg–Sex 08:30–18:30 (sem fechar p/ almoço) · Sáb 08:30–13:00"
            />
            <ContactRow
              icon={Mail}
              label="E-mail"
              value="klugmotors@gmail.com"
              href="mailto:klugmotors@gmail.com"
            />
            <ContactRow
              icon={Instagram}
              label="Instagram"
              value="@klugmotors"
              href="https://www.instagram.com/klugmotors/"
              external
            />
          </div>
        </div>

        <div>
          <TestRideForm />
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  external,
  highlight,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  highlight?: boolean;
}) {
  const content = (
    <>
      <div className="w-11 h-11 border border-border bg-background grid place-items-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-colors">
        <Icon
          size={18}
          className="text-primary group-hover:text-primary-foreground transition-colors"
        />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] text-white/40 font-display font-black uppercase tracking-[0.25em] mb-1">
          {label}
        </p>
        <p
          className={`font-medium truncate ${
            highlight
              ? "text-primary font-display font-black text-xl tracking-tight"
              : "text-white/90"
          }`}
        >
          {value}
        </p>
      </div>
    </>
  );

  const cls =
    "group flex items-center gap-5 p-5 sm:p-6 transition-colors hover:bg-background";

  return href ? (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cls}
    >
      {content}
    </a>
  ) : (
    <div className={`${cls} cursor-default`}>{content}</div>
  );
}

/* ---------------------------- Footer ---------------------------- */

function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-6" aria-label="Klug Motors">
              <KlugWordmark />
            </a>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              A revolução da mobilidade elétrica em Joinville. Qualidade,
              tecnologia e o melhor pós-venda da região.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/klugmotors/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 border border-border grid place-items-center hover:bg-primary hover:border-primary transition-colors"
                aria-label="Instagram @klugmotors"
              >
                <Instagram size={16} />
              </a>
              <a
                href={buildWhatsAppFallbackUrl(
                  "Olá! Tenho interesse em conhecer os modelos da Klug Motors.",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  openWhatsAppWithFallback(
                    "Olá! Tenho interesse em conhecer os modelos da Klug Motors.",
                  );
                }}
                className="w-11 h-11 border border-border grid place-items-center hover:bg-primary hover:border-primary transition-colors"
                aria-label="Falar no WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-black uppercase text-[10px] tracking-[0.3em] text-primary mb-6">
              Visite-nos
            </h4>
            <address className="not-italic text-white/70 text-sm leading-loose">
              Rua Albano Schimidt, 1882
              <br />
              Joinville — SC
            </address>
          </div>

          <div>
            <h4 className="font-display font-black uppercase text-[10px] tracking-[0.3em] text-primary mb-6">
              Contato
            </h4>
            <p className="font-display font-black text-lg mb-1">(47) 3429-3200</p>
            <a
              href="mailto:klugmotors@gmail.com"
              className="text-white/70 text-sm hover:text-primary story-link"
            >
              klugmotors@gmail.com
            </a>
            <div className="mt-5">
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">
                Horários
              </p>
              <p className="text-white/70 text-xs">Seg–Sex: 08:30 às 18:30</p>
              <p className="text-white/70 text-xs">Sábado: 08:30 às 13:00</p>
            </div>
          </div>

          <div>
            <h4 className="font-display font-black uppercase text-[10px] tracking-[0.3em] text-primary mb-6">
              Navegação
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><a href="#modelos" className="story-link hover:text-primary">Modelos</a></li>
              <li><Link to="/modelos" className="story-link hover:text-primary">Catálogo completo</Link></li>
              <li><a href="#sobre" className="story-link hover:text-primary">Sobre</a></li>
              <li><a href="#contato" className="story-link hover:text-primary">Test-Ride</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Klug Motors · Revenda Autorizada · Joinville / SC
          </p>
          <img
            src={klugSymbol.url}
            alt=""
            aria-hidden="true"
            className="w-6 h-6 object-contain opacity-60"
          />
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------- WhatsApp FAB ---------------------------- */

function WhatsAppFab() {
  const message =
    "Olá! Tenho interesse em conhecer os modelos da Klug Motors.";
  return (
    <a
      href={buildWhatsAppFallbackUrl(message)}
      onClick={(event) => {
        event.preventDefault();
        openWhatsAppWithFallback(message);
      }}
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-[var(--shadow-elegant)] hover:scale-110 transition-transform animate-float"
    >
      <MessageCircle size={26} fill="white" strokeWidth={0} />
    </a>
  );
}

function Index() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <PerksBar />
        <Featured />
        <Products />
        <Benefits />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
