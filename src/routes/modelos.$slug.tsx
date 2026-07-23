import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import {
  ArrowLeft,
  Check,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  X,
  Expand,
  Truck,
  CreditCard,
  Percent,
  ShieldCheck,
  Store,
  ShoppingCart,
  MapPin,
  Play,
  Star,
} from "lucide-react";
import {
  getModel,
  getGallery,
  models as staticModels,
  buildWhatsAppFallbackUrl,
  openWhatsAppWithFallback,
} from "@/lib/models";
import { usePublicModels } from "@/hooks/useDbModels";
import { FinanciamentoForm } from "@/components/FinanciamentoForm";
import { YamahaProductPage } from "@/components/YamahaProductPage";
import klugSymbol from "@/assets/klug/klug-symbol.png.asset.json";
import { CreatedBy } from "@/components/CreatedBy";
import klugLogo from "@/assets/klug/klug-horizontal-white.png.asset.json";

const BASE_URL = "https://althaciamoveis.shop";

function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

export const slugColor = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

type SlugSearch = { cor?: string };

export const Route = createFileRoute("/modelos/$slug")({
  validateSearch: (s: Record<string, unknown>): SlugSearch => ({
    cor: typeof s.cor === "string" && s.cor.length > 0 ? s.cor : undefined,
  }),
  loader: ({ params }) => {
    const model = getModel(params.slug);
    // Allow unknown slugs to render — the component fetches from the DB.
    return { model: model ?? null, slug: params.slug };
  },
  head: ({ loaderData, params }) => {
    const url = `${BASE_URL}/modelos/${params.slug}`;
    if (!loaderData || !loaderData.model) {
      const name = humanizeSlug(params.slug);
      const title = `${name} — Klug Motors | Motos e Scooters Elétricas`;
      const desc = `Conheça a ${name} na Klug Motors em Joinville/SC. Preço, autonomia, velocidade e financiamento facilitado.`;
      return {
        meta: [
          { title },
          { name: "description", content: desc },
          { property: "og:title", content: title },
          { property: "og:description", content: desc },
          { property: "og:type", content: "product" },
          { property: "og:url", content: url },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const m = loaderData.model;
    const title = `${m.name} — ${m.tag} | Klug Motors`;
    const desc = `${m.short} A partir de ${m.price}. Autonomia ${m.range}, ${m.speed}. Financiamento facilitado em Joinville/SC.`;
    const rawImg = m.colors[0]?.image;
    const img = rawImg
      ? rawImg.startsWith("http")
        ? rawImg
        : `${BASE_URL}${rawImg}`
      : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        ...(img
          ? [
              { property: "og:image", content: img },
              { name: "twitter:card", content: "summary_large_image" },
              { name: "twitter:image", content: img },
            ]
          : []),
      ],
      links: [
        { rel: "canonical", href: url },
        ...(img ? [{ rel: "preload", as: "image", href: img, fetchpriority: "high" }] : []),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${m.name} — Klug Motors`,
            description: m.description,
            brand: { "@type": "Brand", name: "Klug Motors" },
            category: m.tag,
            image: img,
            offers: {
              "@type": "Offer",
              price: m.priceNumber,
              priceCurrency: "BRL",
              availability: "https://schema.org/InStock",
              url,
              seller: { "@type": "Organization", name: "Klug Motors" },
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-dvh grid place-items-center bg-background p-6">
      <div className="text-center">
        <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-3">
          404
        </p>
        <h1 className="font-display font-black uppercase text-3xl tracking-tight mb-4">
          Modelo não encontrado
        </h1>
        <Link
          to="/modelos"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-xs px-5 py-3 rounded-full"
        >
          Ver catálogo <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-dvh grid place-items-center bg-background p-6">
      <div className="text-center max-w-md">
        <h1 className="font-display font-black uppercase text-2xl tracking-tight mb-3">
          Algo deu errado
        </h1>
        <p className="text-white/60 mb-6 text-sm">{error.message}</p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-xs px-5 py-3 rounded-full"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  ),
  component: ModelPage,
});

const TABS = [
  "Descrição Geral",
  "Itens Inclusos",
  "Características",
  "Garantia",
  "Formas de Pagamento",
  "Avaliações",
] as const;
type Tab = (typeof TABS)[number];

function ModelPage() {
  const data = Route.useLoaderData() as { model: import("@/lib/models").Model | null; slug: string };
  const { items: dbModels, isLoading: dbLoading } = usePublicModels();
  // Prefer DB (source of truth for price/gallery); fall back to static seed.
  const m = dbModels.find((x) => x.slug === data.slug) ?? data.model ?? null;

  // Hooks must be declared unconditionally — never early-return above them.
  const [selected, setSelectedState] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [tab, setTab] = useState<Tab>("Descrição Geral");
  const [cep, setCep] = useState("");
  const gallery = useMemo(() => (m ? getGallery(m) : []), [m]);
  const [imgIndex, setImgIndex] = useState(0);

  const search = Route.useSearch();


  // Sync selected color with ?cor= search param (share-friendly deep links).
  useEffect(() => {
    if (!m || !search.cor) return;
    const idx = m.colors.findIndex((c) => slugColor(c.name) === search.cor);
    if (idx >= 0 && idx !== selected) setSelectedState(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m?.slug, search.cor]);

  const setSelected = useCallback(
    (i: number) => {
      setSelectedState(i);
      const color = m?.colors[i];
      if (!color || typeof window === "undefined") return;
      // Atualiza apenas o ?cor= via history API — evita re-render de rota,
      // re-run de loader e qualquer sensação de "reload" ao trocar de cor.
      const url = new URL(window.location.href);
      url.searchParams.set("cor", slugColor(color.name));
      window.history.replaceState(window.history.state, "", url.toString());
    },
    [m],
  );


  const variant = m?.colors[selected] ?? m?.colors[0];

  useEffect(() => {
    if (!variant) return;
    const idx = gallery.indexOf(variant.image);
    if (idx >= 0) setImgIndex(idx);
  }, [selected, variant, gallery]);

  const prevImage = useCallback(
    () => setImgIndex((i) => (gallery.length ? (i - 1 + gallery.length) % gallery.length : 0)),
    [gallery.length],
  );
  const nextImage = useCallback(
    () => setImgIndex((i) => (gallery.length ? (i + 1) % gallery.length : 0)),
    [gallery.length],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [lightbox, prevImage, nextImage]);

  if (!m) {
    if (dbLoading) {
      return (
        <div className="min-h-dvh grid place-items-center bg-background p-6 text-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      );
    }
    return (
      <div className="min-h-dvh grid place-items-center bg-background p-6 text-center">
        <div>
          <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-3">404</p>
          <h1 className="font-display font-black uppercase text-3xl tracking-tight mb-4">Modelo não encontrado</h1>
          <Link to="/modelos" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-xs px-5 py-3 rounded-full">
            Ver catálogo <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  // Yamaha models use the dedicated editorial layout.
  if (m.slug.startsWith("yamaha-")) {
    return (
      <YamahaProductPage
        m={m}
        selected={selected}
        onSelect={setSelected}
      />
    );
  }

  const activeImage = gallery[imgIndex] ?? variant?.image;




  const whatsappMsg = `Olá! Tenho interesse no modelo *${m.name}* — ${m.price}. Pode me passar mais informações?`;
  const whatsappUrl = buildWhatsAppFallbackUrl(whatsappMsg);
  const handleWhatsAppClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    openWhatsAppWithFallback(whatsappMsg);
  };

  // Derived pricing to mimic reference (PIX 10% off).
  const pixPrice = m.priceNumber * 0.9;
  const fmtBRL = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const related = (dbModels.length ? dbModels : staticModels).filter((x) => x.slug !== m.slug).slice(0, 4);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link
            to="/modelos"
            className="inline-flex items-center gap-2 text-[11px] font-display font-black uppercase tracking-widest text-white/70 hover:text-primary"
          >
            <ArrowLeft size={16} /> Catálogo
          </Link>
          <Link to="/" className="flex items-center gap-2" aria-label="Klug Motors">
            <img src={klugLogo.url} alt="Klug Motors" className="h-8 w-auto object-contain" />
          </Link>
          <a
            href={whatsappUrl}
            onClick={handleWhatsAppClick}
            className="hidden sm:inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-[11px] font-display font-black uppercase tracking-widest hover:brightness-110 transition-all"
          >
            <MessageCircle size={14} fill="white" strokeWidth={0} /> WhatsApp
          </a>
        </div>
      </header>

      {/* Benefits strip */}
      <div className="border-b border-border bg-card/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 grid grid-cols-2 md:grid-cols-5 gap-3 text-[10px] sm:text-[11px] font-display font-black uppercase tracking-widest text-white/70">
          <BenefitPill icon={CreditCard} title="Financiamento" hint="18x sem juros" />
          <BenefitPill icon={ShieldCheck} title="Pagamento facilitado" />
          <BenefitPill icon={Percent} title="10% OFF no PIX" highlight />
          <BenefitPill icon={Truck} title="Frete a partir R$ 8.000" />
          <BenefitPill icon={Store} title="Loja física" hint="Joinville / SC" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="text-[10px] uppercase tracking-widest text-white/40 mb-6 font-bold" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/modelos" className="hover:text-primary">Catálogo</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{m.name}</span>
        </nav>

        {/* PRODUCT — 3 columns: thumbs | main image | buybox */}
        <section className="grid lg:grid-cols-[80px_minmax(0,1fr)_360px] gap-4 lg:gap-6 items-start">
          {/* Thumbnails column */}
          {gallery.length > 1 ? (
            <div
              role="tablist"
              aria-label="Galeria"
              className="hidden lg:flex flex-col gap-2 max-h-[520px] overflow-auto pr-1"
            >
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  role="tab"
                  aria-selected={i === imgIndex}
                  onClick={() => setImgIndex(i)}
                  className={`aspect-square w-full bg-white rounded-md overflow-hidden border-2 transition-all ${
                    i === imgIndex ? "border-primary" : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-contain p-1" loading="lazy" />
                </button>
              ))}
            </div>
          ) : (
            <div className="hidden lg:block" />
          )}

          {/* Main image */}
          <div className="relative bg-white rounded-lg border border-border overflow-hidden">
            <div className="relative aspect-square">
              <img
                src={activeImage}
                alt={`${m.name} — imagem ${imgIndex + 1} de ${gallery.length}`}
                width={800}
                height={800}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 w-full h-full object-contain p-6"
              />

              {/* Badge — Novidade */}
              <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-display font-black uppercase tracking-widest px-3 py-1 rounded-sm shadow">
                Novidade
              </span>

              {/* Video icon */}
              <button
                type="button"
                aria-label="Vídeo do produto"
                className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Play size={14} fill="currentColor" />
              </button>

              {/* Expand */}
              <button
                type="button"
                onClick={() => setLightbox(true)}
                aria-label="Ampliar imagem"
                className="absolute bottom-3 right-3 bg-black/70 text-white p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Expand size={14} />
              </button>

              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Imagem anterior"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Próxima imagem"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Mobile thumbnails strip */}
            {gallery.length > 1 && (
              <div className="lg:hidden flex gap-2 p-3 border-t border-border overflow-auto">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setImgIndex(i)}
                    className={`shrink-0 w-14 h-14 bg-white rounded-md overflow-hidden border-2 ${
                      i === imgIndex ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buybox */}
          <aside className="space-y-4">
            <div>
              <p className="text-primary text-[10px] font-display font-black uppercase tracking-[0.25em]">
                {m.tag}
              </p>
              <h1 className="mt-1 font-display font-black uppercase text-xl sm:text-2xl leading-tight tracking-tight text-white">
                {m.name} — Klug Motors
              </h1>
            </div>

            {/* Stars + code */}
            <div className="flex items-center gap-3 text-[11px] text-white/50">
              <span className="flex items-center gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <span>Cód: {m.slug.toUpperCase()}</span>
            </div>

            {/* Color variants */}
            {m.colors.length > 1 && (
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">
                  Cor: <span className="text-white">{variant?.name}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {m.colors.map((c, i) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelected(i)}
                      aria-label={c.name}
                      title={c.name}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        i === selected
                          ? "border-primary scale-110"
                          : "border-white/15 hover:border-primary/60"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Price block */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  À vista no PIX com 10% OFF
                </p>
                <p
                  className="text-primary leading-none mt-1"
                  style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif", fontSize: "40px" }}
                >
                  {fmtBRL(pixPrice)}
                </p>
                <p className="text-white/50 text-xs mt-1">
                  ou <span className="text-white font-semibold">{m.price}</span> em outras formas
                </p>
              </div>

              <a
                href="#financiamento"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("financiamento")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-sm py-3 rounded-md hover:brightness-110 transition-all"
              >
                <ShoppingCart size={16} /> Comprar
              </a>

              <a
                href={whatsappUrl}
                onClick={handleWhatsAppClick}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-display font-black uppercase tracking-widest text-sm py-3 rounded-md hover:brightness-110 transition-all"
              >
                <MessageCircle size={16} fill="white" strokeWidth={0} /> WhatsApp
              </a>

              <Link
                to="/comparar"
                search={{ a: m.slug }}
                className="w-full inline-flex items-center justify-center gap-2 border border-border text-white/80 font-display font-black uppercase tracking-widest text-xs py-2.5 rounded-md hover:border-primary hover:text-primary transition-all"
              >
                Comparar este modelo
              </Link>
            </div>

            {/* Shipping estimator */}
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2 inline-flex items-center gap-1">
                <MapPin size={12} /> Simule o prazo de entrega
              </p>
              <div className="flex gap-2">
                <input
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  inputMode="numeric"
                  maxLength={9}
                  placeholder="Informe seu CEP"
                  className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  className="bg-primary text-primary-foreground font-display font-black uppercase text-[11px] tracking-widest px-4 rounded-md hover:brightness-110"
                >
                  Calcular
                </button>
              </div>
              <a
                href="https://buscacepinter.correios.com.br/"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-primary hover:underline mt-2 inline-block"
              >
                Não sei meu CEP
              </a>
            </div>
          </aside>
        </section>

        {/* Tabs */}
        <section className="mt-12 border-t border-border">
          <div
            role="tablist"
            aria-label="Informações do produto"
            className="flex flex-wrap gap-x-6 gap-y-2 -mb-px overflow-x-auto"
          >
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`py-4 text-[11px] font-display font-black uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors ${
                  tab === t
                    ? "text-primary border-primary"
                    : "text-white/50 hover:text-white border-transparent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="border-t border-border pt-8">
            {tab === "Descrição Geral" && (
              <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10">
                <div>
                  <p className="text-white/70 leading-relaxed text-base">{m.description}</p>
                  <p className="text-white/60 leading-relaxed text-base mt-4">
                    Com potência de <strong className="text-white">{m.power}</strong>, autonomia
                    de <strong className="text-white">{m.range}</strong> e velocidade máxima de{" "}
                    <strong className="text-white">{m.speed}</strong>, a {m.name} entrega uma
                    experiência de condução única. Ideal para o dia a dia urbano, econômica,
                    silenciosa e resistente.
                  </p>

                  <h3 className="mt-8 font-display font-black uppercase text-lg tracking-tight text-primary">
                    Ficha técnica
                  </h3>
                  <dl className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    {m.specs.map((s) => (
                      <div key={s.label} className="flex justify-between gap-4 border-b border-border py-2">
                        <dt className="text-white/50">{s.label}</dt>
                        <dd className="text-white font-semibold text-right">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <aside className="space-y-4">
                  <div className="rounded-lg border border-border bg-card p-5">
                    <h4 className="font-display font-black uppercase text-sm tracking-widest text-primary mb-3">
                      Recomendações
                    </h4>
                    <ul className="space-y-2 text-sm text-white/70">
                      <li className="flex gap-2"><Check size={14} className="text-primary mt-0.5 shrink-0" />Uso urbano até 180 kg — respeite o limite de velocidade e a legislação.</li>
                      <li className="flex gap-2"><Check size={14} className="text-primary mt-0.5 shrink-0" />Sempre use capacete e conforme o Código de Trânsito.</li>
                      <li className="flex gap-2"><Check size={14} className="text-primary mt-0.5 shrink-0" />Consulte exclusivas condições de financiamento.</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5">
                    <h4 className="font-display font-black uppercase text-sm tracking-widest text-primary mb-3">
                      Sobre a montagem
                    </h4>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Recomendamos que a montagem final do produto seja feita em uma oficina
                      especializada, garantindo a melhor experiência e segurança. Nossa equipe
                      te orienta em todo o processo.
                    </p>
                  </div>
                </aside>
              </div>
            )}

            {tab === "Itens Inclusos" && (
              <ul className="grid sm:grid-cols-2 gap-3 max-w-3xl">
                {m.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 bg-card border border-border p-4 rounded-md text-sm text-white/85"
                  >
                    <Check size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}

            {tab === "Características" && (
              <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl">
                {m.specs.map((s) => (
                  <div key={s.label} className="bg-card border border-border p-4 rounded-md">
                    <dt className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                      {s.label}
                    </dt>
                    <dd className="mt-1 font-semibold text-white text-sm">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {tab === "Garantia" && (
              <div className="max-w-3xl space-y-4 text-sm text-white/70 leading-relaxed">
                <p>
                  Garantia legal de 90 dias contra defeitos (vícios não aparentes) e mais 9 meses
                  de garantia contratual da Klug Motors, conforme legislação vigente.
                </p>
                <p>
                  Bateria e componentes eletrônicos possuem garantia de 6 meses. Consulte os
                  Artigos 26, 34 e 50 do Código de Defesa do Consumidor.
                </p>
                <p className="text-white font-semibold">Não estão cobertos danos por mau uso.</p>
              </div>
            )}

            {tab === "Formas de Pagamento" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl text-sm">
                {["PIX (10% OFF)", "Cartão de crédito em até 18x", "Boleto bancário", "Financiamento em até 48x", "Transferência bancária", "Dinheiro na loja"].map((p) => (
                  <div key={p} className="bg-card border border-border p-4 rounded-md flex items-center gap-3">
                    <CreditCard size={16} className="text-primary" />
                    <span className="text-white/85">{p}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === "Avaliações" && (
              <div className="max-w-3xl text-sm text-white/60">
                <p>Ainda não há avaliações públicas para este modelo.</p>
              </div>
            )}
          </div>
        </section>

        {/* Warranty/Assembly promo block */}
        <section className="mt-16 rounded-lg border border-border bg-card p-6 sm:p-8">
          <h3 className="font-display font-black uppercase text-xl tracking-tight text-primary">
            Sobre a Garantia
          </h3>
          <p className="mt-3 text-white/70 text-sm leading-relaxed max-w-3xl">
            Respeito às normas de trânsito, uso responsável, respeito ao limite de velocidade e
            do peso indicado, seguindo a legislação de veículos vigente.
          </p>
          <h3 className="mt-6 font-display font-black uppercase text-xl tracking-tight text-primary">
            Sobre a Montagem
          </h3>
          <p className="mt-3 text-white/70 text-sm leading-relaxed max-w-3xl">
            Recomendamos que a montagem final do produto seja feita em uma oficina especializada,
            para garantir a melhor experiência e segurança. Caso opte por realizar a montagem em
            casa, o produto é enviado parcialmente montado e a finalização é simples e está
            detalhada no manual que acompanha.
          </p>
        </section>

        {/* Quem somos */}
        <section className="mt-12">
          <h3 className="font-display font-black uppercase text-xl tracking-tight text-primary">
            Quem somos
          </h3>
          <p className="mt-3 text-white/70 text-sm leading-relaxed max-w-3xl">
            A Klug Motors é a maior loja de mobilidade elétrica do Sul, referência regional no
            estilo de vida sobre duas rodas elétricas.
          </p>
        </section>

        {/* Related — Produtos relacionados */}
        <section className="mt-16">
          <h2 className="text-center font-display font-black uppercase text-2xl sm:text-3xl tracking-tight mb-8">
            Produtos <span className="text-primary">relacionados</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((x: import("@/lib/models").Model) => {
              const xPix = x.priceNumber * 0.9;
              return (
                <Link
                  key={x.slug}
                  to="/modelos/$slug"
                  params={{ slug: x.slug }}
                  className="group block bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
                >
                  <div className="aspect-square bg-white">
                    <img
                      src={x.colors[0].image}
                      alt={x.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-black uppercase text-sm tracking-tight text-white line-clamp-2 break-words min-h-[2.4em]">
                      {x.name}
                    </h3>
                    <p
                      className="text-primary leading-none mt-2"
                      style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif", fontSize: "24px" }}
                    >
                      {fmtBRL(xPix)}
                    </p>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">
                      À vista no PIX
                    </p>
                    <span className="mt-3 inline-flex items-center justify-center w-full gap-1 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-[10px] py-2 rounded-md">
                      Ver produto
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Financiamento */}
        <section
          id="financiamento"
          className="mt-20 pt-12 border-t border-border grid lg:grid-cols-2 gap-10 items-start"
        >
          <div>
            <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-4">
              Consulta rápida
            </p>
            <h2 className="font-display font-black uppercase text-3xl sm:text-4xl tracking-tight leading-none">
              Simule o financiamento da <span className="text-primary">{m.name}</span>.
            </h2>
            <p className="text-white/60 mt-5 leading-relaxed max-w-md">
              Preencha o formulário e enviaremos sua solicitação direto para o WhatsApp da Klug
              Motors com as informações da simulação.
            </p>
          </div>
          <FinanciamentoForm defaultModel={m.name} />
        </section>
      </main>

      <footer className="bg-card border-t border-border py-10 mt-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img
              src={klugSymbol.url}
              alt=""
              aria-hidden="true"
              className="w-6 h-6 object-contain opacity-70"
            />
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
              © {new Date().getFullYear()} Klug Motors · Joinville / SC
            </span>
          </div>
          <div className="flex items-center gap-6">
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
            <CreatedBy />
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp (mobile) */}
      <a
        href={whatsappUrl}
        onClick={handleWhatsAppClick}
        aria-label="Falar no WhatsApp"
        className="sm:hidden fixed bottom-5 right-5 z-40 bg-[#25D366] text-white shadow-2xl rounded-full w-14 h-14 grid place-items-center hover:brightness-110 active:scale-95 transition-all"
      >
        <MessageCircle size={26} fill="white" strokeWidth={0} />
      </a>

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria — ${m.name}`}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightbox(false); }}
            aria-label="Fechar"
            className="absolute top-4 right-4 text-white/80 hover:text-primary p-2"
          >
            <X size={28} />
          </button>
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                aria-label="Imagem anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-primary p-2"
              >
                <ChevronLeft size={36} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                aria-label="Próxima imagem"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-primary p-2"
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}
          <img
            src={activeImage}
            alt={`${m.name} — imagem ${imgIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[85vh] object-contain"
          />
          {gallery.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs font-bold tabular-nums tracking-widest">
              {imgIndex + 1} / {gallery.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BenefitPill({
  icon: Icon,
  title,
  hint,
  highlight,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  hint?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon
        size={16}
        className={highlight ? "text-primary" : "text-white/60"}
      />
      <div className="leading-tight">
        <div className={highlight ? "text-primary" : "text-white"}>{title}</div>
        {hint && <div className="text-white/40 text-[9px] normal-case tracking-wide">{hint}</div>}
      </div>
    </div>
  );
}
