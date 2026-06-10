import { createFileRoute } from "@tanstack/react-router";
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
import heroScooter from "@/assets/hero-scooter.jpg";
import modelX13 from "@/assets/model-x13.jpg";
import x13Vermelho from "@/assets/x13-vermelho.jpg";
import x13Cinza from "@/assets/x13-cinza.jpg";
import x13Preto from "@/assets/x13-preto.jpg";
import modelHarley from "@/assets/model-harley.jpg";
import harleyPreto from "@/assets/harley-preto.jpg";
import harleyAzul from "@/assets/harley-azul.jpg";
import modelM4 from "@/assets/model-m4.jpg";
import m4Branco from "@/assets/m4-branco.jpg";
import m4Cinza from "@/assets/m4-cinza.jpg";
import m4Preto from "@/assets/m4-preto.jpg";
import modelEtrek from "@/assets/model-etrek.jpg";
import fontainePreto from "@/assets/fontaine-preto.jpg";
import fontaineBranco from "@/assets/fontaine-branco.jpg";
import fontaineRose from "@/assets/fontaine-rose.jpg";
import eko7Vermelho from "@/assets/eko7-vermelho.jpg";
import eko7Preto from "@/assets/eko7-preto.jpg";
import eko7Branco from "@/assets/eko7-branco.jpg";
import eko7Verde from "@/assets/eko7-verde.jpg";
import eko7Cinza from "@/assets/eko7-cinza.jpg";
import tricicloVermelho from "@/assets/triciclo-vermelho.jpg";
import tricicloBranco from "@/assets/triciclo-branco.jpg";
import tricicloCinza from "@/assets/triciclo-cinza.jpg";
import tricicloPreto from "@/assets/triciclo-preto.jpg";
import garageExterior from "@/assets/garage-exterior.png.asset.json";
import marconttiLogo from "@/assets/marcontti-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marcontti Garage — A Nova Era da Mobilidade em Joinville" },
      {
        name: "description",
        content:
          "Concessionária de scooters e motos elétricas em Joinville/SC. Agende seu test-ride na Marcontti Garage.",
      },
    ],
  }),
  component: Index,
});


type ColorVariant = { name: string; hex: string; image: string };
type Product = {
  name: string;
  tag: string;
  price: string;
  range: string;
  speed: string;
  power: string;
  colors: ColorVariant[];
};

const products: Product[] = [
  {
    name: "Fontaine",
    tag: "Compacto",
    price: "R$ 5.290",
    range: "até 40 km",
    speed: "32 km/h",
    power: "1.000W",
    colors: [
      { name: "Preto", hex: "#1a1a1a", image: fontainePreto },
      { name: "Branco", hex: "#f5f5f5", image: fontaineBranco },
      { name: "Rosé", hex: "#f4a8a8", image: fontaineRose },
    ],
  },
  {
    name: "EKO-7",
    tag: "Autopropelido",
    price: "R$ 6.790",
    range: "até 80 km",
    speed: "32 km/h",
    power: "800W",
    colors: [
      { name: "Vermelho", hex: "#c8242b", image: eko7Vermelho },
      { name: "Preto", hex: "#1a1a1a", image: eko7Preto },
      { name: "Branco", hex: "#f5f5f5", image: eko7Branco },
      { name: "Verde Água", hex: "#9adfd4", image: eko7Verde },
      { name: "Cinza", hex: "#7a7a7a", image: eko7Cinza },
    ],
  },
  {
    name: "Triciclo",
    tag: "3 Rodas",
    price: "R$ 9.990",
    range: "até 80 km",
    speed: "32 km/h",
    power: "1.000W",
    colors: [
      { name: "Vermelho", hex: "#c8242b", image: tricicloVermelho },
      { name: "Branco", hex: "#f5f5f5", image: tricicloBranco },
      { name: "Cinza", hex: "#7a7a7a", image: tricicloCinza },
      { name: "Preto", hex: "#1a1a1a", image: tricicloPreto },
    ],
  },
  {
    name: "X-13",
    tag: "Citycoco",
    price: "R$ 10.490",
    range: "60–80 km",
    speed: "50 km/h",
    power: "1.000W",
    colors: [
      { name: "Vermelho", hex: "#a8201c", image: x13Vermelho },
      { name: "Cinza Brilhoso", hex: "#7a7a7a", image: x13Cinza },
      { name: "Preto", hex: "#1a1a1a", image: x13Preto },
    ],
  },
  {
    name: "Harley",
    tag: "Chopper",
    price: "R$ 10.990",
    range: "60–80 km",
    speed: "50 km/h",
    power: "1.000W",
    colors: [
      { name: "Preto Fosco", hex: "#1a1a1a", image: harleyPreto },
      { name: "Azul Australiana", hex: "#1e3a8a", image: harleyAzul },
    ],
  },
  {
    name: "M4",
    tag: "Urbano",
    price: "R$ 10.990",
    range: "60–80 km",
    speed: "50 km/h",
    power: "1.000W",
    colors: [
      { name: "Branco", hex: "#f5f5f5", image: m4Branco },
      { name: "Cinza", hex: "#7a7a7a", image: m4Cinza },
      { name: "Preto", hex: "#1a1a1a", image: m4Preto },
    ],
  },
  {
    name: "E-Trek",
    tag: "Trabalho",
    price: "R$ 8.990",
    range: "até 60 km",
    speed: "50 km/h",
    power: "1.000W",
    colors: [{ name: "Preto", hex: "#1a1a1a", image: modelEtrek }],
  },
];

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
    title: "Silenciosa e Ecológica",
    desc: "Zero emissão de poluentes. Joinville pede mais mobilidade limpa.",
  },
];

const gallery = [
  heroScooter,
  eko7Vermelho,
  garageExterior.url,
  tricicloVermelho,
  fontaineRose,
  modelHarley,
];

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#modelos", label: "Modelos" },
    { href: "#sobre", label: "Sobre Nós" },
    { href: "#joinville", label: "Joinville" },
    { href: "#contato", label: "Contato" },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-display font-black text-xl tracking-tight">
          <img src={marconttiLogo.url} alt="Marcontti Garage" width={36} height={36} className="w-9 h-9 rounded-full" />
          MARCONTTI
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
          src={heroScooter}
          alt="Scooter elétrica Marcontti em ambiente urbano"
          width={1920}
          height={1080}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 min-h-[88vh] flex flex-col justify-center py-24">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-ring" />
            Joinville · SC
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 uppercase">
            A Revolução
            <br />
            é{" "}
            <span className="bg-gradient-to-r from-[oklch(0.96_0.22_124)] to-[oklch(0.93_0.24_122)] bg-clip-text text-transparent">
              Elétrica
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/75 max-w-xl mb-10 leading-relaxed">
            Estilo, economia e sustentabilidade sobre duas rodas. Conheça a linha completa de
            scooters elétricas da Marcontti Garage.
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
            ["311", "Posts no Insta"],
            ["3.8k+", "Seguidores"],
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
              Linha 2026
            </span>
            <h2 className="text-4xl sm:text-5xl font-black mt-3 max-w-xl">
              Modelos feitos para a cidade.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Cada scooter combina design contemporâneo, autonomia urbana e a melhor relação
            custo-benefício do mercado.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.name} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  const [selected, setSelected] = useState(0);
  const variant = p.colors[selected];
  return (
    <article className="group bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/40 transition-all hover:-translate-y-2 hover:shadow-[var(--shadow-card)]">
      <div className="aspect-[5/4] bg-[oklch(0.96_0_0)] overflow-hidden relative">
        <img
          src={variant.image}
          alt={`${p.name} ${variant.name}`}
          width={1024}
          height={1024}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-4 left-4 bg-charcoal text-white text-xs font-semibold px-3 py-1 rounded-full">
          {p.tag}
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-bold">{p.name}</h3>
            <div className="text-xs text-muted-foreground mt-1">Cor: {variant.name}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">a partir de</div>
            <div className="text-lg font-black text-primary">{p.price}</div>
          </div>
        </div>
        {p.colors.length > 1 && (
          <div className="flex gap-2 mb-4">
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
            <strong className="text-foreground">{p.speed}</strong> vel. máx.
          </span>
        </div>
        <a
          href="#contato"
          className="inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all"
        >
          Saiba Mais <ChevronRight size={16} />
        </a>
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
            Por que elétrica
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

function InstagramSection() {
  return (
    <section className="py-24 sm:py-32 bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              @marcontti.garage
            </span>
            <h2 className="text-4xl sm:text-5xl font-black mt-3 max-w-xl">
              Siga a nossa garagem.
            </h2>
          </div>
          <a
            href="https://instagram.com/marcontti.garage"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-6 py-3 rounded-full transition-all hover:-translate-y-0.5 self-start md:self-auto"
          >
            <Instagram size={18} />
            Seguir no Instagram
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {gallery.map((src, i) => (
            <a
              key={i}
              href="https://instagram.com/marcontti.garage"
              target="_blank"
              rel="noopener"
              className="group aspect-square overflow-hidden rounded-xl bg-white/5 relative"
            >
              <img
                src={src}
                alt="Marcontti Garage Instagram"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/60 grid place-items-center transition-all">
                <Instagram size={22} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
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
        <div id="joinville">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Visite nossa loja
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mt-3 mb-6">
            Estamos no coração de Joinville.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
            Venha conhecer nossos modelos pessoalmente, fazer um test-ride e conversar com nosso
            time. O melhor negócio é feito olho no olho.
          </p>

          <div className="rounded-3xl overflow-hidden mb-8 shadow-[var(--shadow-card)]">
            <img
              src={garageExterior.url}
              alt="Loja Marcontti Garage em Joinville"
              width={1600}
              height={1024}
              loading="lazy"
              className="w-full h-72 object-cover"
            />
          </div>

          <div className="space-y-4">
            {[
              { icon: MapPin, label: "Joinville · SC, Brasil" },
              { icon: Clock, label: "Seg–Sex 9h–18h · Sáb 9h–13h" },
              { icon: Phone, label: "(47) 9 0000-0000" },
              { icon: Mail, label: "contato@marcontti.garage" },
            ].map((i) => (
              <div key={i.label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                  <i.icon className="text-primary" size={18} />
                </div>
                <span className="text-foreground/85 font-medium">{i.label}</span>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Recebemos seu contato! Em breve retornaremos.");
          }}
          className="bg-card rounded-3xl p-8 sm:p-10 border border-border shadow-[var(--shadow-card)]"
        >
          <h3 className="text-2xl font-bold mb-2">Agende seu test-ride</h3>
          <p className="text-muted-foreground mb-8">
            Preencha o formulário e entraremos em contato em instantes.
          </p>
          <div className="space-y-4">
            <input
              required
              maxLength={100}
              placeholder="Seu nome"
              className="w-full px-5 py-4 rounded-2xl bg-surface border border-border focus:border-primary outline-none transition-colors"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                required
                type="email"
                maxLength={150}
                placeholder="E-mail"
                className="w-full px-5 py-4 rounded-2xl bg-surface border border-border focus:border-primary outline-none transition-colors"
              />
              <input
                required
                type="tel"
                maxLength={20}
                placeholder="WhatsApp"
                className="w-full px-5 py-4 rounded-2xl bg-surface border border-border focus:border-primary outline-none transition-colors"
              />
            </div>
            <select
              defaultValue=""
              className="w-full px-5 py-4 rounded-2xl bg-surface border border-border focus:border-primary outline-none transition-colors"
            >
              <option value="" disabled>
                Modelo de interesse
              </option>
              {products.map((p) => (
                <option key={p.name}>{p.name}</option>
              ))}
              <option>Outro / Catálogo completo</option>
            </select>
            <textarea
              rows={4}
              maxLength={500}
              placeholder="Mensagem (opcional)"
              className="w-full px-5 py-4 rounded-2xl bg-surface border border-border focus:border-primary outline-none transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-semibold py-4 rounded-full transition-all hover:shadow-[var(--shadow-elegant)] hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
            >
              Enviar Solicitação
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-charcoal text-white/70 py-12">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row justify-between gap-6 items-center">
        <div className="flex items-center gap-2 font-display font-black text-white">
          <img src={marconttiLogo.url} alt="Marcontti Garage" width={28} height={28} className="w-7 h-7 rounded-full" />
          MARCONTTI GARAGE
        </div>
        <div className="text-sm">
          © {new Date().getFullYear()} Marcontti Garage · Joinville/SC · Todos os direitos reservados.
        </div>
        <a
          href="https://instagram.com/marcontti.garage"
          target="_blank"
          rel="noopener"
          className="text-white/70 hover:text-primary transition-colors"
        >
          <Instagram size={20} />
        </a>
      </div>
    </footer>
  );
}

function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/5547900000000?text=Ol%C3%A1!%20Tenho%20interesse%20em%20conhecer%20os%20modelos%20Marcontti."
      target="_blank"
      rel="noopener"
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
        <InstagramSection />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
