import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Zap, ChevronRight } from "lucide-react";
import { models, type Model } from "@/lib/models";
import { useReveal } from "@/hooks/use-reveal";

import klugSymbol from "@/assets/klug/klug-symbol.png.asset.json";
import klugLogo from "@/assets/klug/klug-horizontal-white.png.asset.json";

const BASE_URL = "https://proototipomotos.lovable.app";

export const Route = createFileRoute("/modelos/")({
  head: () => ({
    meta: [
      { title: "Catálogo — Klug Motors" },
      {
        name: "description",
        content:
          "Explore todos os modelos elétricos da Klug Motors: scooters, motos, triciclos, bicicletas e patinetes. Filtre por tipo e faixa de preço.",
      },
      { property: "og:title", content: "Catálogo — Klug Motors" },
      {
        property: "og:description",
        content: "Todos os modelos elétricos da Klug — filtre por tipo e preço.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}/modelos` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/modelos` }],
  }),
  component: CatalogPage,
});

const TYPES = ["Todos", "Scooter", "Moto", "Triciclo", "Bicicleta", "Patinete"] as const;
type TypeFilter = (typeof TYPES)[number];

const PRICE_RANGES = [
  { id: "all", label: "Todos os preços", min: 0, max: Infinity },
  { id: "u8", label: "Até R$ 8.000", min: 0, max: 8000 },
  { id: "8-12", label: "R$ 8.000 – 12.000", min: 8000, max: 12000 },
  { id: "12-16", label: "R$ 12.000 – 16.000", min: 12000, max: 16000 },
  { id: "16p", label: "Acima de R$ 16.000", min: 16000, max: Infinity },
] as const;

function typeOf(m: Model): TypeFilter {
  const t = m.tag.toLowerCase();
  if (t.includes("patinete")) return "Patinete";
  if (t.includes("bicicleta")) return "Bicicleta";
  if (t.includes("triciclo")) return "Triciclo";
  if (t.includes("scooter")) return "Scooter";
  if (t.includes("moto")) return "Moto";
  return "Todos";
}

function CatalogPage() {
  const [type, setType] = useState<TypeFilter>("Todos");
  const [priceId, setPriceId] = useState<(typeof PRICE_RANGES)[number]["id"]>("all");
  const [sort, setSort] = useState<"relevance" | "price-asc" | "price-desc">("relevance");

  const filtered = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.id === priceId)!;
    let list = models.filter((m) => {
      const typeOk = type === "Todos" || typeOf(m) === type;
      const priceOk = m.priceNumber >= range.min && m.priceNumber <= range.max;
      return typeOk && priceOk;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.priceNumber - b.priceNumber);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.priceNumber - a.priceNumber);
    return list;
  }, [type, priceId, sort]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="Klug Motors — início">
            <img src={klugLogo.url} alt="Klug Motors" className="h-8 w-auto object-contain" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[11px] font-display font-black uppercase tracking-widest text-white/70 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 ember-spotlight pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-display font-black mb-4">
            Catálogo completo
          </p>
          <h1 className="font-display font-black uppercase text-5xl sm:text-6xl tracking-tighter leading-none">
            Todos os <span className="text-primary">modelos</span>
          </h1>
          <p className="mt-6 text-white/60 max-w-xl leading-relaxed">
            <strong className="text-white">{models.length} modelos</strong> disponíveis —
            scooters, motos, triciclos, bicicletas e patinetes. Filtre por tipo e preço
            para encontrar o seu.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div
            role="tablist"
            aria-label="Filtrar por tipo"
            className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-display font-black uppercase tracking-widest"
          >
            {TYPES.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={type === t}
                onClick={() => setType(t)}
                className={`pb-1 transition-colors border-b-2 ${
                  type === t
                    ? "text-primary border-primary"
                    : "text-white/40 hover:text-white border-transparent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={priceId}
              onChange={(e) => setPriceId(e.target.value as typeof priceId)}
              className="bg-card border border-border rounded-xl px-4 py-2 text-xs font-display font-bold uppercase tracking-wider text-white focus:border-primary focus:outline-none"
              aria-label="Faixa de preço"
            >
              {PRICE_RANGES.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="bg-card border border-border rounded-xl px-4 py-2 text-xs font-display font-bold uppercase tracking-wider text-white focus:border-primary focus:outline-none"
              aria-label="Ordenar por"
            >
              <option value="relevance">Relevância</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
          </div>
        </div>

        <p className="text-[11px] uppercase tracking-widest font-bold text-white/50 mb-6">
          Mostrando <strong className="text-white">{filtered.length}</strong> de{" "}
          {models.length} modelos
        </p>

        {filtered.length === 0 ? (
          <div className="border border-dashed border-border rounded-2xl p-16 text-center bg-card">
            <p className="font-display font-black uppercase tracking-wider text-lg mb-2">
              Nenhum modelo encontrado
            </p>
            <p className="text-white/50 text-sm mb-6">
              Ajuste os filtros para ver mais opções.
            </p>
            <button
              onClick={() => {
                setType("Todos");
                setPriceId("all");
              }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full"
            >
              Limpar filtros <ArrowRight size={14} />
            </button>
          </div>

        ) : (
          <CatalogGrid items={filtered} />
        )}
      </section>


      <footer className="bg-card border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={klugSymbol.url} alt="" aria-hidden="true" className="w-6 h-6 object-contain opacity-70" />
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
              © {new Date().getFullYear()} Klug Motors · Joinville / SC
            </span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[11px] font-display font-black uppercase tracking-widest text-white/70 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para a home
          </Link>
        </div>
      </footer>
    </div>
  );
}

function CatalogGrid({ items }: { items: Model[] }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
      {items.map((m, i) => (
        <Link
          key={m.slug}
          to="/modelos/$slug"
          params={{ slug: m.slug }}
          style={{ transitionDelay: `${Math.min(i, 8) * 60}ms` }}
          className="reveal card-shine group bg-card border border-border rounded-2xl overflow-hidden hover-ember transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
        >
          <div className="relative aspect-[4/3] p-3">
            <div className="relative w-full h-full bg-white rounded-xl overflow-hidden">
              <img
                src={m.colors[0]?.image}
                alt={`${m.name} — ${m.tag}`}
                loading="lazy"
                className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute bottom-3 left-3 bg-black/85 backdrop-blur text-white text-[9px] font-display font-black uppercase tracking-wider px-2 py-1 rounded-full inline-flex items-center gap-1">
                <Zap size={10} className="text-primary" /> {m.power}
              </span>
            </div>
          </div>
          <div className="p-6 pt-4">
            <p className="text-primary text-[10px] font-display font-black uppercase tracking-widest mb-2">
              {m.tag}
            </p>
            <h2 className="font-display font-black uppercase text-xl tracking-tight">
              {m.name}
            </h2>
            <p className="mt-2 text-sm text-white/60 line-clamp-2">{m.short}</p>
            <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
              <div>
                <span className="block text-[9px] text-white/40 uppercase font-bold tracking-wider">
                  A partir de
                </span>
                <span className="font-display font-black text-lg">{m.price}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-display font-black uppercase tracking-widest text-primary group-hover:gap-2 transition-all">
                Ver <ChevronRight size={14} />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

