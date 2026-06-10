import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, MessageCircle, Zap } from "lucide-react";
import { getModel, models, buildWhatsAppUrl } from "@/lib/models";
import { TestRideForm } from "@/components/TestRideForm";

const BASE_URL = "https://marcontti-vibe-engine.lovable.app";

export const Route = createFileRoute("/modelos/$slug")({
  loader: ({ params }) => {
    const model = getModel(params.slug);
    if (!model) throw notFound();
    return { model };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Modelo — Marcontti Garage" }] };
    const m = loaderData.model;
    const title = `${m.name} — Scooter Elétrica ${m.tag} | Marcontti Garage`;
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
            name: `${m.name} — Marcontti Garage`,
            description: m.description,
            brand: { "@type": "Brand", name: "Marcontti" },
            category: m.tag,
            image: img ? `${BASE_URL}${img}` : undefined,
            offers: {
              "@type": "Offer",
              price: m.priceNumber,
              priceCurrency: "BRL",
              availability: "https://schema.org/InStock",
              url: `${BASE_URL}/modelos/${params.slug}`,
              seller: { "@type": "Organization", name: "Marcontti Garage" },
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-black mb-3">Modelo não encontrado</h1>
        <Link to="/" className="text-primary font-semibold">
          ← Voltar para a home
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen grid place-items-center bg-background p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-3">Algo deu errado</h1>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <button onClick={reset} className="text-primary font-semibold">
          Tentar novamente
        </button>
      </div>
    </div>
  ),
  component: ModelPage,
});

function ModelPage() {
  const { model: m } = Route.useLoaderData();
  const [selected, setSelected] = useState(0);
  const variant = m.colors[selected];

  const whatsappMsg = `Olá! Tenho interesse no modelo *${m.name}* (${variant.name}) — ${m.price}. Pode me passar mais informações?`;
  const whatsappUrl = buildWhatsAppUrl(whatsappMsg);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold text-sm">
            <ArrowLeft size={18} /> Voltar
          </Link>
          <Link to="/" className="font-display font-black tracking-tight">
            MARCONTTI
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-sm font-semibold"
          >
            <MessageCircle size={16} fill="white" strokeWidth={0} /> WhatsApp
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>{" "}
          / <span className="text-foreground">{m.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <div className="aspect-square bg-[oklch(0.96_0_0)] rounded-3xl overflow-hidden border border-border">
              <img
                src={variant.image}
                alt={`${m.name} ${variant.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            {m.colors.length > 1 && (
              <div className="grid grid-cols-5 gap-3 mt-4">
                {m.colors.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-label={c.name}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      i === selected ? "border-primary" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
              {m.tag}
            </span>
            <h1 className="text-4xl sm:text-5xl font-black mt-4">{m.name}</h1>
            <p className="text-lg text-muted-foreground mt-3 leading-relaxed">{m.description}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-sm text-muted-foreground">a partir de</span>
              <span className="text-4xl font-black text-primary">{m.price}</span>
            </div>

            <div className="mt-6">
              <div className="text-sm text-muted-foreground mb-2">
                Cor selecionada:{" "}
                <strong className="text-foreground">{variant.name}</strong>
              </div>
              <div className="flex flex-wrap gap-2">
                {m.colors.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelected(i)}
                    title={c.name}
                    aria-label={c.name}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                      i === selected ? "border-primary scale-110" : "border-border"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] hover:opacity-90 text-white font-semibold py-4 rounded-full inline-flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle size={18} fill="white" strokeWidth={0} />
                Tenho interesse — WhatsApp
              </a>
              <a
                href="#test-ride"
                className="flex-1 border-2 border-primary text-primary font-semibold py-4 rounded-full inline-flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Zap size={18} /> Agendar test-ride
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {m.specs.map((s) => (
                <div key={s.label} className="bg-surface border border-border rounded-2xl p-4">
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="font-bold mt-1">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Destaques</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {m.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-foreground/85">
                    <Check size={18} className="text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <section id="test-ride" className="mt-20 sm:mt-28 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Agende grátis
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3">
              Faça o test-ride da {m.name}.
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Preencha o formulário e enviaremos sua solicitação direto para o WhatsApp da
              Marcontti Garage com todas as informações pré-preenchidas.
            </p>
          </div>
          <TestRideForm defaultModel={m.name} />
        </section>

        <section className="mt-20 sm:mt-28">
          <h2 className="text-2xl font-bold mb-6">Outros modelos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {models
              .filter((x) => x.slug !== m.slug)
              .map((x) => (
                <Link
                  key={x.slug}
                  to="/modelos/$slug"
                  params={{ slug: x.slug }}
                  className="group block bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:-translate-y-1 transition-all"
                >
                  <div className="aspect-square bg-[oklch(0.96_0_0)] overflow-hidden">
                    <img
                      src={x.colors[0].image}
                      alt={x.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-sm truncate">{x.name}</div>
                    <div className="text-xs text-primary font-bold mt-0.5">{x.price}</div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </main>

      <footer className="bg-charcoal text-white/70 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 text-sm text-center">
          © {new Date().getFullYear()} Marcontti Garage · Joinville/SC
        </div>
      </footer>
    </div>
  );
}
