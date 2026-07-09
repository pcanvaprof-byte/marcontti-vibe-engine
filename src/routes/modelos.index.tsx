import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Filter, Zap } from "lucide-react";
import { models, type Model } from "@/lib/models";
import klugHorizontalWhite from "@/assets/klug/klug-horizontal-white.png.asset.json";

const BASE_URL = "https://proototipomotos.lovable.app";

export const Route = createFileRoute("/modelos/")({
  head: () => ({
    meta: [
      { title: "Catálogo de Modelos — Klug Motors" },
      {
        name: "description",
        content:
          "Explore todos os modelos elétricos da Klug Motors: scooters, motos, triciclos e bicicletas. Filtre por tipo e faixa de preço.",
      },
      { property: "og:title", content: "Catálogo de Modelos — Klug Motors" },
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

const TYPES = ["Todos", "Scooter", "Moto", "Triciclo", "Bicicleta"] as const;
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="Klug Motors — Home">
            <img src={klugHorizontalWhite.url} alt="Klug Motors" className="h-8 w-auto" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border/60 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
            Catálogo Klug
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Todos os modelos elétricos
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            {models.length} modelos disponíveis — scooters, motos, triciclos e bicicletas.
            Filtre por tipo e faixa de preço para encontrar o seu.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  type === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/60"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={priceId}
                onChange={(e) => setPriceId(e.target.value as typeof priceId)}
                className="bg-background border border-border rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Faixa de preço"
              >
                {PRICE_RANGES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="bg-background border border-border rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Ordenar por"
            >
              <option value="relevance">Relevância</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Mostrando <strong className="text-foreground">{filtered.length}</strong> de{" "}
          {models.length} modelos
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <p className="text-lg font-semibold mb-2">Nenhum modelo encontrado</p>
            <p className="text-muted-foreground text-sm">
              Ajuste os filtros para ver mais opções.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <Link
                key={m.slug}
                to="/modelos/$slug"
                params={{ slug: m.slug }}
                className="group rounded-2xl overflow-hidden border border-border bg-surface hover:border-primary/60 transition"
              >
                <div className="aspect-[4/3] overflow-hidden bg-background">
                  <img
                    src={m.colors[0]?.image}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    {m.tag}
                  </p>
                  <h2 className="text-xl font-black">{m.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{m.short}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{m.price}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <Zap className="w-3.5 h-3.5" /> {m.power}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Klug Motors — Joinville/SC
      </footer>
    </div>
  );
}
