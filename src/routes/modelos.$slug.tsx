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
import { TestRideForm } from "@/components/TestRideForm";
import klugSymbol from "@/assets/klug/klug-symbol.png.asset.json";

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
    const desc = `${m.short} A partir de ${m.price}. Autonomia ${m.range}, ${m.speed}. Test-ride em Joinville/SC.`;
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
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-xs px-5 py-3"
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
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-xs px-5 py-3"
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
  const variant = m.colors[selected];

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
            <span className="klug-mark" aria-hidden="true" />
            <span className="font-display font-black text-xl tracking-tighter uppercase leading-none">
              Klug<span className="text-primary">Motors</span>
            </span>
          </Link>
          <a
            href={whatsappUrl}
            onClick={handleWhatsAppClick}
            className="hidden sm:inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 text-[11px] font-display font-black uppercase tracking-widest"
          >
            <MessageCircle size={14} fill="white" strokeWidth={0} /> WhatsApp
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        {/* Breadcrumb */}
        <nav className="text-[10px] uppercase tracking-widest text-white/40 mb-8 font-bold" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/modelos" className="hover:text-primary">Catálogo</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{m.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Image */}
          <div className="lg:col-span-6">
            <div className="relative aspect-square bg-card border border-border overflow-hidden">
              <img
                src={variant.image}
                alt={`${m.name} — ${variant.name}`}
                className="w-full h-full object-contain p-8"
              />
              <span className="absolute top-4 left-4 bg-charcoal/80 backdrop-blur border border-border text-white text-[9px] font-display font-black uppercase tracking-wider px-2 py-1 inline-flex items-center gap-1">
                <Zap size={10} className="text-primary" /> {m.power}
              </span>
            </div>
            {m.colors.length > 1 && (
              <div className="mt-4 flex gap-2 flex-wrap">
                {m.colors.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-label={c.name}
                    title={c.name}
                    className={`w-9 h-9 border-2 transition-all min-h-11 min-w-11 sm:min-h-9 sm:min-w-9 ${
                      i === selected
                        ? "border-primary scale-110"
                        : "border-border hover:border-primary/60"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-6">
            <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-3">
              {m.tag}
            </p>
            <h1 className="font-display font-black uppercase text-4xl sm:text-5xl tracking-tighter leading-none">
              {m.name}
            </h1>
            <p className="text-white/60 mt-5 leading-relaxed">{m.description}</p>

            <div className="mt-8 flex items-baseline gap-3 border-t border-border pt-6">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                A partir de
              </span>
              <span className="font-display font-black text-4xl text-primary">
                {m.price}
              </span>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappUrl}
                onClick={handleWhatsAppClick}
                className="flex-1 bg-[#25D366] hover:brightness-110 text-white font-display font-black uppercase text-sm tracking-widest py-4 inline-flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle size={18} fill="white" strokeWidth={0} />
                Tenho interesse
              </a>
              <a
                href="#test-ride"
                className="flex-1 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-display font-black uppercase text-sm tracking-widest py-4 inline-flex items-center justify-center gap-2 transition-all"
              >
                <Zap size={18} /> Test-Ride
              </a>
            </div>

            {/* Specs grid */}
            <div className="mt-10">
              <h2 className="font-display font-black uppercase text-[10px] tracking-[0.3em] text-primary mb-4">
                Ficha técnica
              </h2>
              <div className="grid grid-cols-2 gap-px bg-border border border-border">
                {m.specs.map((s) => (
                  <div key={s.label} className="bg-card p-4">
                    <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-1">
                      {s.label}
                    </div>
                    <div className="font-display font-black text-sm uppercase tracking-tight">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mt-10">
              <h2 className="font-display font-black uppercase text-[10px] tracking-[0.3em] text-primary mb-4">
                Destaques
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {m.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 bg-card border border-border p-3 text-sm text-white/85"
                  >
                    <Check size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Test ride */}
        <section
          id="test-ride"
          className="mt-24 sm:mt-32 pt-16 border-t border-border grid lg:grid-cols-2 gap-10 items-start"
        >
          <div>
            <p className="text-[10px] text-primary font-display font-black uppercase tracking-[0.3em] mb-4">
              Agende grátis
            </p>
            <h2 className="font-display font-black uppercase text-3xl sm:text-4xl tracking-tight leading-none">
              Faça o test-ride da <span className="text-primary">{m.name}</span>.
            </h2>
            <p className="text-white/60 mt-5 leading-relaxed max-w-md">
              Preencha o formulário e enviaremos sua solicitação direto para o
              WhatsApp da Klug Motors com todas as informações preenchidas.
            </p>
          </div>
          <TestRideForm defaultModel={m.name} />
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
              .map((x) => (
                <Link
                  key={x.slug}
                  to="/modelos/$slug"
                  params={{ slug: x.slug }}
                  className="group block bg-card border border-border hover-ember overflow-hidden"
                >
                  <div className="aspect-square bg-charcoal overflow-hidden p-3">
                    <img
                      src={x.colors[0].image}
                      alt={x.name}
                      loading="lazy"
                      className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="p-3 border-t border-border">
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
        </div>
      </footer>
    </div>
  );
}
