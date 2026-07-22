import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { ArrowLeft, MessageCircle, ChevronRight, Check } from "lucide-react";
import type { Model } from "@/lib/models";
import { getGallery, buildWhatsAppFallbackUrl, openWhatsAppWithFallback } from "@/lib/models";
import { FinanciamentoForm } from "@/components/FinanciamentoForm";
import { View360Modal } from "@/components/View360Modal";
import klugLogo from "@/assets/klug/klug-horizontal-white.png.asset.json";

/**
 * Yamaha-style editorial product page.
 * Layout inspired by yamaha-motor.com.br/product/*: full-bleed hero, oversized
 * typography, alternating feature blocks driven by the model's gallery, big
 * color selector, spec table and a final CTA. Uses existing DB fields only.
 */
export function YamahaProductPage({
  m,
  selected: selectedProp,
  onSelect,
}: {
  m: Model;
  selected?: number;
  onSelect?: (i: number) => void;
}) {
  const [selectedLocal, setSelectedLocal] = useState(0);
  const selected = selectedProp ?? selectedLocal;
  const setSelected = (i: number) => {
    if (onSelect) onSelect(i);
    else setSelectedLocal(i);
  };
  const [view360Open, setView360Open] = useState(false);
  const modelGallery = useMemo(() => getGallery(m), [m]);
  const variant = m.colors[selected] ?? m.colors[0];
  // Per-color gallery takes precedence; fall back to the model-level gallery.
  const activeGallery = useMemo(() => {
    const vg = variant?.gallery?.filter(Boolean) ?? [];
    return vg.length > 0 ? vg : modelGallery;
  }, [variant, modelGallery]);
  const heroImg = variant?.image ?? activeGallery[0];

  // Split description into paragraphs / sentences for the feature blocks.
  const sentences = useMemo(() => {
    const parts = m.description
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return parts.length ? parts : [m.description];
  }, [m.description]);

  // Build up to 3 alternating feature blocks pairing gallery images with copy.
  const featureBlocks = useMemo(() => {
    const imgs = activeGallery.filter((g) => g && g !== heroImg).slice(0, 3);
    const highlights = [
      { kicker: "Design", title: "Presença que atravessa a cidade" },
      { kicker: "Performance", title: "Resposta afinada em cada acelerada" },
      { kicker: "Tecnologia", title: "Recursos que elevam a experiência" },
    ];
    return imgs.map((img, i) => ({
      img,
      kicker: highlights[i]?.kicker ?? "Destaque",
      title: highlights[i]?.title ?? m.name,
      copy: sentences[i + 1] ?? sentences[0],
    }));
  }, [activeGallery, heroImg, sentences, m.name]);

  const fmtBRL = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const whatsappMsg = `Olá! Tenho interesse na *${m.name}* — ${m.price}. Pode me passar mais informações e condições?`;
  const whatsappUrl = buildWhatsAppFallbackUrl(whatsappMsg);
  const handleWhats = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openWhatsAppWithFallback(whatsappMsg);
  };

  // Prefetch the variant image swap.
  useEffect(() => {
    if (!variant?.image) return;
    const i = new Image();
    i.src = variant.image;
  }, [variant?.image]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Sticky mini header */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
          <Link
            to="/modelos"
            className="inline-flex items-center gap-2 text-[11px] font-display font-black uppercase tracking-widest text-white/70 hover:text-primary"
          >
            <ArrowLeft size={14} /> Catálogo
          </Link>
          <Link to="/" aria-label="Klug Motors">
            <img src={klugLogo.url} alt="Klug Motors" className="h-7 w-auto object-contain" />
          </Link>
          <a
            href={whatsappUrl}
            onClick={handleWhats}
            className="hidden sm:inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-[11px] font-display font-black uppercase tracking-widest hover:brightness-110"
          >
            <MessageCircle size={14} fill="white" strokeWidth={0} /> WhatsApp
          </a>
        </div>
      </header>

      {/* HERO — official artwork, matches yamaha-motor.com.br */}
      <section className="relative overflow-hidden isolate text-white bg-neutral-950">
        <img
          src={neosHeroOfficial.url}
          alt={`${m.name} — elétrica, carregada de energia`}
          fetchPriority="high"
          decoding="async"
          className="block w-full h-auto select-none"
          draggable={false}
        />
      </section>






      {/* INTRO */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-5 sm:px-10 py-16 sm:py-24 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] font-display font-black text-primary">
            {m.tag}
          </p>
          <h2
            className="mt-4 text-white uppercase leading-[0.9] tracking-tight"
            style={{
              fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
              fontSize: "clamp(32px, 5vw, 64px)",
            }}
          >
            Feita para quem <span className="text-primary">exige mais</span>
          </h2>
          <p className="mt-6 text-white/70 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            {m.description}
          </p>
        </div>
      </section>

      {/* FEATURE BLOCKS — alternating */}
      {featureBlocks.map((f, i) => (
        <section
          key={f.img + i}
          className={`border-t border-border ${i % 2 === 0 ? "bg-card/30" : ""}`}
        >
          <div
            className={`max-w-[1400px] mx-auto px-5 sm:px-10 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent" />
              <img
                src={f.img}
                alt={f.title}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] font-display font-black text-primary">
                {f.kicker}
              </p>
              <h3
                className="mt-3 text-white uppercase leading-[0.9] tracking-tight"
                style={{
                  fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                  fontSize: "clamp(28px, 4vw, 52px)",
                }}
              >
                {f.title}
              </h3>
              <p className="mt-5 text-white/70 leading-relaxed text-base sm:text-lg max-w-lg">
                {f.copy}
              </p>
              {i === 0 && m.features.length > 0 && (
                <ul className="mt-6 grid sm:grid-cols-2 gap-2 max-w-lg">
                  {m.features.slice(0, 6).map((it) => (
                    <li key={it} className="flex gap-2 text-sm text-white/80">
                      <Check size={16} className="text-primary shrink-0 mt-0.5" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* COLORS */}
      {m.colors.length > 0 && (
        <section className="border-t border-border">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 py-16 sm:py-24">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] font-display font-black text-primary">
                  Cores
                </p>
                <h2
                  className="mt-3 text-white uppercase leading-[0.9] tracking-tight"
                  style={{
                    fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                    fontSize: "clamp(32px, 5vw, 64px)",
                  }}
                >
                  Escolha o seu <span className="text-primary">estilo</span>
                </h2>
              </div>
              <p className="text-white/60 text-sm max-w-sm">
                Selecione uma cor abaixo para visualizar em detalhes.
              </p>
            </div>

            <div className="relative rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-6 sm:p-12">
              <div className="min-h-[280px] sm:min-h-[420px] grid place-items-center">
                {variant?.image ? (
                  <img
                    src={variant.image}
                    alt={`${m.name} — ${variant.name}`}
                    className="max-h-[420px] w-auto object-contain transition-opacity duration-300"
                  />
                ) : null}
              </div>
              <p
                className="text-center mt-6 text-white uppercase"
                style={{
                  fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                  fontSize: "28px",
                  lineHeight: 1,
                }}
              >
                {variant?.name}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {m.colors.map((c, i) => (
                  <button
                    key={c.name + i}
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-label={c.name}
                    title={c.name}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      i === selected
                        ? "border-primary scale-110"
                        : "border-white/20 hover:border-primary/60"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SPECS */}
      {m.specs.length > 0 && (
        <section className="border-t border-border bg-card/30">
          <div className="max-w-5xl mx-auto px-5 sm:px-10 py-16 sm:py-24">
            <p className="text-[10px] uppercase tracking-[0.35em] font-display font-black text-primary">
              Ficha técnica
            </p>
            <h2
              className="mt-3 text-white uppercase leading-[0.9] tracking-tight"
              style={{
                fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                fontSize: "clamp(32px, 5vw, 56px)",
              }}
            >
              Cada número, uma <span className="text-primary">promessa</span>
            </h2>

            <dl className="mt-10 grid sm:grid-cols-2 gap-x-10">
              {m.specs.map((s) => (
                <div
                  key={s.label}
                  className="flex justify-between gap-6 py-4 border-b border-white/10"
                >
                  <dt className="text-white/60 text-sm uppercase tracking-widest font-bold">
                    {s.label}
                  </dt>
                  <dd className="text-white font-semibold text-right">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section
        id="financiamento"
        className="border-t border-border"
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] font-display font-black text-primary">
              Fale com um especialista
            </p>
            <h2
              className="mt-3 text-white uppercase leading-[0.9] tracking-tight"
              style={{
                fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                fontSize: "clamp(36px, 5vw, 64px)",
              }}
            >
              {m.name.replace(/^Yamaha\s+/i, "")} <br />
              <span className="text-primary">a partir de {fmtBRL(m.priceNumber)}</span>
            </h2>
            <p className="mt-5 text-white/70 leading-relaxed max-w-md">
              Consulte disponibilidade, condições de pagamento e financiamento na Klug
              Motors — unidade Joinville / SC.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappUrl}
                onClick={handleWhats}
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-display font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:brightness-110"
              >
                <MessageCircle size={14} fill="white" strokeWidth={0} /> Falar no WhatsApp
              </a>
              <Link
                to="/modelos"
                className="inline-flex items-center gap-2 border border-white/20 text-white font-display font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:border-primary hover:text-primary"
              >
                Ver outros modelos
              </Link>
            </div>
          </div>

          <FinanciamentoForm defaultModel={m.name} />
        </div>
      </section>

      <View360Modal
        open={view360Open}
        onClose={() => setView360Open(false)}
        frames={activeGallery.filter(Boolean)}
        title={`${m.name} — ${variant?.name ?? ""}`}
      />
    </div>
  );
}
