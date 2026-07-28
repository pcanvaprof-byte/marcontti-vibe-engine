import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Zap, ChevronRight, AlertCircle, MessageCircle } from "lucide-react";
import { type Model, buildWhatsAppFallbackUrl, openWhatsAppWithFallback } from "@/lib/models";
import { usePublicModels } from "@/hooks/useDbModels";
import { useReveal } from "@/hooks/use-reveal";
import { LazyImage } from "@/components/LazyImage";
import { QuickViewModal } from "@/components/QuickViewModal";


import klugSymbol from "@/assets/klug/klug-symbol.png.asset.json";
import { CreatedBy } from "@/components/CreatedBy";
import klugLogo from "@/assets/klug/klug-horizontal-white.png.asset.json";

const BASE_URL = "https://althaciamoveis.shop";

const VALID_BRANDS = ["klug", "sudu", "yamaha"] as const;
type ValidBrand = (typeof VALID_BRANDS)[number];

type CatSearch = { cat?: string; marca?: string };

function isValidBrand(marca?: string): marca is ValidBrand {
  return Boolean(marca && (VALID_BRANDS as readonly string[]).includes(marca.toLowerCase()));
}

function brandMeta(marca?: string) {
  const key = marca?.toLowerCase();
  switch (key) {
    case "yamaha":
      return {
        title: "Modelos Yamaha — Catálogo Klug Motors",
        description:
          "Descubra os modelos elétricos Yamaha na Klug Motors: scooters urbanas, design e performance com financiamento facilitado em Joinville/SC.",
        ogTitle: "Modelos Yamaha — Catálogo Klug Motors",
        ogDescription: "Veículos elétricos Yamaha disponíveis na Klug Motors. Filtre e compare modelos.",
      };
    case "sudu":
      return {
        title: "Modelos SUDU — Catálogo Klug Motors",
        description:
          "Conheça a linha SUDU de veículos elétricos na Klug Motors: scooters, motos e triciclos com tecnologia e autonomia para o dia a dia.",
        ogTitle: "Modelos SUDU — Catálogo Klug Motors",
        ogDescription: "Veículos elétricos SUDU na Klug Motors. Encontre o modelo ideal para você.",
      };
    case "klug":
      return {
        title: "Modelos Klug — Catálogo Klug Motors",
        description:
          "Explore a linha completa Klug Motors: scooters, motos elétricos sem CNH em Joinville/SC.",
        ogTitle: "Modelos Klug — Catálogo Klug Motors",
        ogDescription: "Todos os modelos Klug Motors elétricos. Filtre por tipo, preço e autonomia.",
      };
    default:
      return {
        title: "Catálogo — Klug Motors",
        description:
          "Explore todos os modelos elétricos da Klug Motors: scooters, motos. Filtre por tipo, marca e faixa de preço.",
        ogTitle: "Catálogo — Klug Motors",
        ogDescription: "Todos os modelos elétricos da Klug — filtre por tipo, marca e preço.",
      };
  }
}

export const Route = createFileRoute("/modelos/")({
  validateSearch: (s: Record<string, unknown>): CatSearch => ({
    cat: typeof s.cat === "string" ? s.cat : undefined,
    marca: typeof s.marca === "string" ? s.marca : undefined,
  }),
  loaderDeps: ({ search }) => ({ marca: search.marca, cat: search.cat }),
  loader: ({ deps }) => ({ marca: deps.marca, cat: deps.cat }),
  head: ({ loaderData }) => {
    const marca = loaderData?.marca;
    const cat = loaderData?.cat;
    const valid = isValidBrand(marca);
    const meta = brandMeta(marca);
    const url = valid ? `${BASE_URL}/modelos?marca=${marca.toLowerCase()}` : `${BASE_URL}/modelos`;
    const metaTags: { title?: string; name?: string; property?: string; content?: string }[] = [
      { title: meta.title },
      { name: "description", content: meta.description },
      { property: "og:title", content: meta.ogTitle },
      { property: "og:description", content: meta.ogDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    // Não indexa marca inválida nem categoria "seminovos" (placeholder — sem
    // conteúdo real). Evita páginas vazias no índice do Google.
    if ((!valid && marca) || cat === "seminovos") {
      metaTags.push({ name: "robots", content: "noindex, follow" });
    }
    return {
      meta: metaTags,
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: CatalogPage,
});

const CATEGORY_TABS = [
  { key: "todos", label: "Todos", search: {} as CatSearch },
  { key: "klug", label: "Scooter Elétricas Moto Chefe", search: { marca: "klug" } as CatSearch },
  { key: "sudu", label: "Scooter Elétricas Sudu", search: { marca: "sudu" } as CatSearch },
  { key: "triciclo", label: "Triciclos Elétricos", search: { cat: "triciclo" } as CatSearch },
  { key: "yamaha", label: "Motos Yamaha 0km", search: { marca: "yamaha" } as CatSearch },
  { key: "seminovos", label: "Motos Semi Novas", search: { cat: "seminovos" } as CatSearch },
] as const;

const VALID_MARCAS = ["klug", "sudu", "yamaha"] as const;

function brandOf(m: Model): "Klug" | "SUDU" | "Yamaha" | "Semi Novas" {
  if (m.slug.startsWith("semi-nova")) return "Semi Novas";
  if (m.slug.startsWith("sudu")) return "SUDU";
  if (m.slug.startsWith("yamaha")) return "Yamaha";
  return "Klug";
}

function isSemiNova(m: Model): boolean {
  return m.slug.startsWith("semi-nova");
}


const MARCA_LABEL: Record<string, "Klug" | "SUDU" | "Yamaha"> = {
  klug: "Klug",
  sudu: "SUDU",
  yamaha: "Yamaha",
};

const PRICE_RANGES = [
  { id: "all", label: "Todos os preços", min: 0, max: Infinity },
  { id: "u8", label: "Até R$ 8.000", min: 0, max: 8000 },
  { id: "8-12", label: "R$ 8.000 – 12.000", min: 8000, max: 12000 },
  { id: "12-16", label: "R$ 12.000 – 16.000", min: 12000, max: 16000 },
  { id: "16p", label: "Acima de R$ 16.000", min: 16000, max: Infinity },
] as const;

function isTriciclo(m: Model): boolean {
  return m.tag.toLowerCase().includes("triciclo");
}

function activeCategoryKey(search: CatSearch): string {
  if (search.cat === "triciclo") return "triciclo";
  if (search.cat === "seminovos") return "seminovos";
  const marca = search.marca?.toLowerCase();
  if (marca && (VALID_MARCAS as readonly string[]).includes(marca)) return marca;
  return "todos";
}

function CatalogPage() {
  const { items: models, isLoading, isFetching, data: dbData } = usePublicModels();
  const dataReady = Boolean(dbData);
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/modelos/" });
  const activeKey = activeCategoryKey(search);
  const invalidMarca = Boolean(
    search.marca && !(VALID_MARCAS as readonly string[]).includes(search.marca.toLowerCase()),
  );

  const [priceId, setPriceId] = useState<(typeof PRICE_RANGES)[number]["id"]>("all");
  const [sort, setSort] = useState<"relevance" | "price-asc" | "price-desc">("relevance");

  const filtered = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.id === priceId)!;
    let list = models.filter((m) => {
      let catOk = true;
      if (activeKey === "triciclo") catOk = isTriciclo(m) && !isSemiNova(m);
      else if (activeKey === "seminovos") catOk = isSemiNova(m);
      else if (activeKey === "klug" || activeKey === "sudu") {
        catOk = brandOf(m) === MARCA_LABEL[activeKey] && !isTriciclo(m);
      } else if (activeKey === "yamaha") {
        catOk = brandOf(m) === "Yamaha";
      } else if (activeKey === "todos") {
        catOk = !isSemiNova(m);
      }
      const priceOk = m.priceNumber >= range.min && m.priceNumber <= range.max;
      return catOk && priceOk;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.priceNumber - b.priceNumber);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.priceNumber - a.priceNumber);
    return list;
  }, [models, activeKey, priceId, sort]);



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
          <h1 className="font-display font-black uppercase text-4xl sm:text-5xl md:text-6xl tracking-tight sm:tracking-tighter leading-[1.05] break-words">
            Todos os <span className="text-primary">modelos</span>
          </h1>
          <p className="mt-6 text-white/60 max-w-xl leading-relaxed">
            <strong className="text-white">{models.length} modelos</strong> disponíveis —
            scooters, motos. Filtre por tipo e preço
            para encontrar o seu.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-16">
        {invalidMarca && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-white/90">
            <AlertCircle size={18} className="text-primary shrink-0" />
            <span>
              Marca <strong className="text-white">“{search.marca}”</strong> não encontrada. Exibindo o catálogo completo.
            </span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div
            role="tablist"
            aria-label="Filtrar por categoria"
            className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-display font-black uppercase tracking-widest"
          >
            {CATEGORY_TABS.map((c) => {
              const active = activeKey === c.key;
              return (
                <Link
                  key={c.key}
                  to="/modelos"
                  search={c.search}
                  role="tab"
                  aria-selected={active}
                  className={`min-h-11 px-1 pb-1 inline-flex items-center transition-colors border-b-2 ${
                    active
                      ? "text-primary border-primary"
                      : "text-white/40 hover:text-white border-transparent"
                  }`}
                >
                  {c.label}
                </Link>
              );
            })}
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

        {search.cat === "seminovos" && filtered.length === 0 ? (
          <div className="border border-dashed border-primary/40 rounded-2xl p-16 text-center bg-card">
            <p className="text-primary text-[10px] font-display font-black uppercase tracking-widest mb-3">
              Novidade
            </p>
            <p className="font-display font-black uppercase tracking-wider text-2xl sm:text-3xl mb-3">
              Motos Semi Novas — em breve
            </p>
            <p className="text-white/60 text-sm max-w-md mx-auto mb-8">
              Estamos preparando um catálogo exclusivo de motos semi novas revisadas e com garantia Klug Motors. Fale conosco no WhatsApp para consultar disponibilidade agora.
            </p>
            <a
              href="https://wa.me/554734293200?text=Ol%C3%A1%2C%20Klug%20Motors!%20Tenho%20interesse%20em%20motos%20semi%20novas.%20Podem%20me%20passar%20as%20op%C3%A7%C3%B5es%20dispon%C3%ADveis%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:brightness-110 transition"
            >
              <MessageCircle size={14} strokeWidth={2.5} /> Consultar no WhatsApp
            </a>
          </div>

        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-border rounded-2xl p-16 text-center bg-card">
            <p className="font-display font-black uppercase tracking-wider text-lg mb-2">
              Nenhum modelo encontrado
            </p>
            <p className="text-white/50 text-sm mb-6">
              Ajuste os filtros para ver mais opções.
            </p>
            <button
              onClick={() => {
                setPriceId("all");
                navigate({ to: "/modelos", search: () => ({}), replace: true });
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
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-6">
            <Link
              to="/privacidade"
              className="text-[11px] font-display font-black uppercase tracking-widest text-white/70 hover:text-primary"
            >
              Privacidade
            </Link>
            <Link
              to="/admin"
              className="text-[11px] font-display font-black uppercase tracking-widest text-white/50 hover:text-primary"
            >
              Admin
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[11px] font-display font-black uppercase tracking-widest text-white/70 hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para a home
            </Link>
            <CreatedBy />
          </div>
        </div>
      </footer>
    </div>
  );
}

function CatalogGrid({ items }: { items: Model[] }) {
  const ref = useReveal<HTMLDivElement>();
  const [quickView, setQuickView] = useState<Model | null>(null);

  return (
    <>
      <div ref={ref} className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((m, i) => {
          const waMsg = `Olá, Klug Motors! Tenho interesse na *${m.name}*${m.price ? ` (${m.price})` : ""}. Pode me passar mais informações?`;
          return (
            <div
              key={m.slug}
              style={{ transitionDelay: `${Math.min(i, 8) * 60}ms` }}
              className="reveal card-shine group relative bg-card border border-border rounded-2xl overflow-hidden hover-ember transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 flex flex-col"
            >
              <Link
                to="/modelos/$slug"
                params={{ slug: m.slug }}
                className="block"
                aria-label={`Ver detalhes de ${m.name}`}
              >
                <div className="relative aspect-[4/3] p-3">
                  <div className="relative w-full h-full bg-white rounded-xl overflow-hidden">
                    <LazyImage
                      src={m.colors[0]?.image ?? ""}
                      alt={`${m.name} — ${m.tag}`}
                      wrapperClassName="w-full h-full rounded-xl"
                      loadingLabel="Carregando"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute bottom-3 left-3 bg-black/85 backdrop-blur text-white text-[9px] font-display font-black uppercase tracking-wider px-2 py-1 rounded-full inline-flex items-center gap-1">
                      <Zap size={10} className="text-primary" /> {m.power}
                    </span>
                  </div>
                </div>
                <div className="px-6 pt-4">
                  <p className="text-primary text-[10px] font-display font-black uppercase tracking-widest mb-2">
                    {m.tag}
                  </p>
                  <h2 className="font-display font-black uppercase text-xl tracking-tight">
                    {m.name}
                  </h2>
                  <p className="mt-2 text-sm text-white/60 line-clamp-2">{m.short}</p>
                </div>
              </Link>

              <div className="px-6 pb-6 pt-4 mt-auto">
                <div className="pt-5 border-t border-border flex items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="block text-[9px] text-white/40 uppercase font-bold tracking-wider">
                      A partir de
                    </span>
                    <span className="font-display font-black text-lg">{m.price}</span>
                  </div>
                  <Link
                    to="/modelos/$slug"
                    params={{ slug: m.slug }}
                    className="inline-flex items-center gap-1 text-[10px] font-display font-black uppercase tracking-widest text-primary hover:gap-2 transition-all"
                  >
                    Ver <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickView(m)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-[10px] px-3 py-2.5 rounded-full hover:brightness-110 transition"
                  >
                    Saiba mais
                  </button>
                  <a
                    href={buildWhatsAppFallbackUrl(waMsg)}
                    onClick={(e) => {
                      e.preventDefault();
                      openWhatsAppWithFallback(waMsg);
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Falar no WhatsApp sobre ${m.name}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe57] text-black font-display font-black uppercase tracking-widest text-[10px] px-3 py-2.5 rounded-full transition"
                  >
                    <MessageCircle size={12} strokeWidth={2.5} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <QuickViewModal
        open={Boolean(quickView)}
        onClose={() => setQuickView(null)}
        product={
          quickView
            ? {
                id: quickView.slug,
                nome: quickView.name,
                potencia: quickView.power,
                imagem: quickView.colors[0]?.image ?? "",
                preco: quickView.price,
                slug: quickView.slug,
              }
            : null
        }
      />
    </>
  );
}


