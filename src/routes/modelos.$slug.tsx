import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import { ArrowLeft, Check, MessageCircle, Zap, ChevronRight, ChevronLeft, X, Expand } from "lucide-react";
import {
  getModel,
  getGallery,
  models,
  buildWhatsAppFallbackUrl,
  openWhatsAppWithFallback,
} from "@/lib/models";
import { FinanciamentoForm } from "@/components/FinanciamentoForm";
import klugSymbol from "@/assets/klug/klug-symbol.png.asset.json";
import klugLogo from "@/assets/klug/klug-horizontal-white.png.asset.json";

const BASE_URL = "https://proototipomotos.lovable.app";

export const Route = createFileRoute("/modelos/$slug")({
  loader: ({ params }) => {
    const model = getModel(params.slug);
    if (!model) throw notFound();
    return { model };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Modelo — Klug Motors" }] };
    const m = loaderData.model;
    const title = `${m.name} — ${m.tag} | Klug Motors`;
    const desc = `${m.short} A partir de ${m.price}. Autonomia ${m.range}, ${m.speed}. Financiamento facilitado em Joinville/SC.`;
    const img = m.colors[0]?.image;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `${BASE_URL}/modelos/${params.slug}` },
        ...(img ? [{ property: "og:image", content: `${BASE_URL}${img}` }] : []),
      ],
      links: [{ rel: "canonical", href: `${BASE_URL}/modelos/${params.slug}` }],
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
            image: img ? `${BASE_URL}${img}` : undefined,
            offers: {
              "@type": "Offer",
              price: m.priceNumber,
              priceCurrency: "BRL",
              availability: "https://schema.org/InStock",
              url: `${BASE_URL}/modelos/${params.slug}`,
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

function ModelPage() {
  const data = Route.useLoaderData() as { model: import("@/lib/models").Model };
  const m = data.model;
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const variant = m.colors[selected] ?? m.colors[0];

  const gallery = useMemo(() => getGallery(m), [m]);
  const [imgIndex, setImgIndex] = useState(0);
  const activeImage = gallery[imgIndex] ?? variant?.image;

  // When the user picks a color variant, jump the gallery to that image if present.
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

  // Keyboard navigation inside the lightbox.
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

  const whatsappMsg = `Olá! Tenho interesse no modelo *${m.name}* — ${m.price}. Pode me passar mais informações?`;
  const whatsappUrl = buildWhatsAppFallbackUrl(whatsappMsg);
  const handleWhatsAppClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    openWhatsAppWithFallback(whatsappMsg);
  };

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

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        {/* Breadcrumb */}
        <nav className="text-[10px] uppercase tracking-widest text-white/40 mb-10 font-bold" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/modelos" className="hover:text-primary">Catálogo</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{m.name}</span>
        </nav>

        {/* HERO — Kinetic broken frame */}
        <section className="relative isolate">
          {/* Giant faded model name behind everything */}
          <div className="absolute -top-10 -left-6 sm:-left-16 select-none opacity-[0.05] pointer-events-none overflow-hidden max-w-full">
            <h1
              aria-hidden
              className="leading-[0.8] tracking-tighter italic uppercase text-white whitespace-nowrap"
              style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif", fontSize: "28vw" }}
            >
              {m.name.split(" ")[0]}
            </h1>
          </div>

          <div className="relative grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* LEFT — gallery with broken frame */}
            <div className="lg:col-span-7 relative">
              <div className="relative z-10">
                {/* Offset orange frame */}
                <div
                  aria-hidden
                  className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-full h-full border-2 border-primary rounded-[22px] opacity-30 pointer-events-none"
                />

                {/* Gallery — slight rotation */}
                <div className="relative group aspect-square bg-card border border-white/10 rounded-[22px] overflow-hidden shadow-2xl transform rotate-[-1deg] transition-transform duration-500 hover:rotate-0">
                  <img
                    src={activeImage}
                    alt={`${m.name} — imagem ${imgIndex + 1} de ${gallery.length}`}
                    className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-5 left-5 bg-primary text-black text-[10px] font-display font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    {m.tag}
                  </span>

                  <button
                    type="button"
                    onClick={() => setLightbox(true)}
                    aria-label="Ampliar imagem"
                    className="absolute top-5 right-5 bg-black/60 backdrop-blur border border-white/10 text-white p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Expand size={14} />
                  </button>

                  {gallery.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevImage}
                        aria-label="Imagem anterior"
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur border border-white/10 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={nextImage}
                        aria-label="Próxima imagem"
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur border border-white/10 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-full tabular-nums">
                        {imgIndex + 1} / {gallery.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Floating spec cards — breaking the grid */}
                <div className="absolute -right-2 -bottom-8 sm:-right-6 sm:bottom-6 z-20 flex flex-col gap-3 sm:gap-4">
                  <div className="bg-[oklch(0.27_0_0)] border-l-4 border-primary p-4 pr-6 rounded-r-[18px] rounded-tl-[18px] shadow-2xl transform translate-x-2 sm:translate-x-4 hover:translate-x-0 transition-transform duration-500">
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Autonomia</p>
                    <p className="text-3xl sm:text-4xl text-white leading-none mt-1" style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif" }}>
                      {m.range}
                    </p>
                  </div>
                  <div className="bg-primary p-4 pr-6 rounded-[18px] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                    <p className="text-black/60 text-[10px] uppercase font-bold tracking-widest">Potência</p>
                    <p className="text-3xl sm:text-4xl text-black leading-none mt-1" style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif" }}>
                      {m.power}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="mt-16 sm:mt-14 grid grid-cols-5 sm:grid-cols-6 gap-2" role="tablist" aria-label="Galeria">
                  {gallery.map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      role="tab"
                      aria-selected={i === imgIndex}
                      aria-label={`Imagem ${i + 1}`}
                      onClick={() => setImgIndex(i)}
                      className={`aspect-square bg-card border-2 rounded-[12px] transition-all overflow-hidden ${
                        i === imgIndex ? "border-primary" : "border-white/10 hover:border-primary/60"
                      }`}
                    >
                      <img src={src} alt="" className="w-full h-full object-contain p-1" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}

              {m.colors.length > 1 && (
                <div className="mt-6">
                  <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-2">
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
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
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
            </div>

            {/* RIGHT — Details */}
            <div className="lg:col-span-5 relative z-20">
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="h-[2px] w-8 bg-primary" />
                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                      Performance
                    </span>
                  </div>
                  <h1
                    className="text-white uppercase leading-[0.8] tracking-tighter"
                    style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif", fontSize: "clamp(64px, 9vw, 128px)" }}
                  >
                    KLUG <br />
                    <span
                      className="text-primary"
                      style={{ filter: "drop-shadow(3px 3px 0 rgba(255,255,255,0.08))" }}
                    >
                      {m.name.split(" ")[0]}
                    </span>
                  </h1>
                </div>

                <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-md">
                  {m.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-2">
                  <a
                    href={whatsappUrl}
                    onClick={handleWhatsAppClick}
                    className="relative group inline-block self-start"
                  >
                    <div className="absolute inset-0 bg-primary rounded-[18px] translate-x-1.5 translate-y-1.5 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300" />
                    <div className="relative px-8 py-4 bg-white text-black font-display font-black uppercase tracking-tighter text-lg sm:text-xl rounded-[18px] border-2 border-white inline-flex items-center gap-2">
                      <MessageCircle size={18} strokeWidth={0} fill="currentColor" />
                      Tenho interesse
                    </div>
                  </a>

                  <div className="flex flex-col">
                    <span className="text-white/30 text-[10px] uppercase font-bold tracking-widest">
                      A partir de
                    </span>
                    <span
                      className="text-3xl text-white italic leading-none mt-1"
                      style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif" }}
                    >
                      {m.price}
                    </span>
                  </div>
                </div>

                <a
                  href="#financiamento"
                  className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-[11px] font-display font-black uppercase tracking-widest"
                >
                  <Zap size={14} /> Simule o financiamento
                </a>

                {/* Secondary micro-specs */}
                <div className="pt-6 flex gap-10 border-t border-white/5">
                  <div>
                    <span className="block text-white/30 text-[10px] uppercase font-bold mb-1 tracking-widest">
                      Velocidade
                    </span>
                    <span className="text-white font-semibold text-sm">{m.speed}</span>
                  </div>
                  <div>
                    <span className="block text-white/30 text-[10px] uppercase font-bold mb-1 tracking-widest">
                      Bateria
                    </span>
                    <span className="text-white font-semibold text-sm">
                      {m.specs.find((s) => s.label.toLowerCase().includes("bateria"))?.value ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ficha técnica completa */}
        <section className="mt-24 sm:mt-32">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-3">
                Especificações
              </p>
              <h2 className="font-display font-black uppercase text-3xl sm:text-4xl tracking-tight leading-none">
                Ficha técnica
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {m.specs.map((s, i) => (
              <div
                key={s.label}
                className={`bg-card border border-white/5 p-5 rounded-[18px] transition-transform duration-500 hover:-translate-y-1 hover:border-primary/40 ${
                  i % 3 === 1 ? "sm:translate-y-3" : i % 3 === 2 ? "sm:-translate-y-2" : ""
                }`}
              >
                <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-2">
                  {s.label}
                </div>
                <div className="font-display font-black text-base uppercase tracking-tight leading-tight">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Destaques */}
        <section className="mt-20 sm:mt-24">
          <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-3">
            Destaques
          </p>
          <h2 className="font-display font-black uppercase text-3xl sm:text-4xl tracking-tight leading-none mb-6">
            O que torna a <span className="text-primary">{m.name}</span> única
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {m.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 bg-card border border-white/5 p-4 rounded-[18px] text-sm text-white/85 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                <Check size={16} className="text-primary shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>


        {/* Financiamento */}
        <section
          id="financiamento"
          className="mt-24 sm:mt-32 pt-16 border-t border-border grid lg:grid-cols-2 gap-10 items-start"
        >
          <div>
            <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-4">
              Consulta rápida
            </p>
            <h2 className="font-display font-black uppercase text-3xl sm:text-4xl tracking-tight leading-none">
              Simule o financiamento da <span className="text-primary">{m.name}</span>.
            </h2>
            <p className="text-white/60 mt-5 leading-relaxed max-w-md">
              Preencha o formulário e enviaremos sua solicitação direto para o
              WhatsApp da Klug Motors com as informações da simulação.
            </p>
          </div>
          <FinanciamentoForm defaultModel={m.name} />
        </section>

        {/* Related */}
        <section className="mt-24 sm:mt-32 pt-16 border-t border-border">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-3">
                Continue explorando
              </p>
              <h2 className="font-display font-black uppercase text-3xl tracking-tight">
                Outros modelos
              </h2>
            </div>
            <Link
              to="/modelos"
              className="hidden sm:inline-flex items-center gap-2 text-[11px] font-display font-black uppercase tracking-widest text-white/70 hover:text-primary"
            >
              Ver todos <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {models
              .filter((x) => x.slug !== m.slug)
              .slice(0, 6)
              .map((x, i) => (
                <Link
                  key={x.slug}
                  to="/modelos/$slug"
                  params={{ slug: x.slug }}
                  className={`group block bg-card border border-white/5 rounded-[18px] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 ${
                    i % 2 === 1 ? "lg:translate-y-3" : ""
                  }`}
                >
                  <div className="aspect-square p-2">
                    <div className="w-full h-full bg-white rounded-xl overflow-hidden">
                      <img
                        src={x.colors[0].image}
                        alt={x.name}
                        loading="lazy"
                        className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 border-t border-white/5">
                    <div className="font-display font-black uppercase text-xs tracking-tight truncate">
                      {x.name}
                    </div>
                    <div className="text-[10px] text-primary font-bold mt-0.5 truncate">
                      {x.price}
                    </div>
                  </div>
                </Link>
              ))}
          </div>

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
          <Link
            to="/privacidade"
            className="text-[11px] font-display font-black uppercase tracking-widest text-white/70 hover:text-primary"
          >
            Privacidade
          </Link>
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
