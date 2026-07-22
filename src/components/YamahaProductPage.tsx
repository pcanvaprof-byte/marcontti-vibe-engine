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

      {/* HERO — cinematic dark stage, oversized wordmark, floating taglines */}
      <section
        className="relative overflow-hidden isolate bg-[#050708] text-white"
        style={{
          backgroundImage: `radial-gradient(ellipse 90% 70% at 50% 45%, ${variant?.hex ?? "#00c2c5"}33 0%, #0a1216 55%, #050708 100%)`,
        }}
      >
        <div className="max-w-[1500px] mx-auto px-5 sm:px-10 pt-10 sm:pt-14 pb-8 sm:pb-10 min-h-[86svh] flex flex-col">
          {/* Oversized wordmark behind everything */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[16%] flex items-center justify-center leading-none text-center select-none"
            style={{
              fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
              color: "rgba(255,255,255,0.05)",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: "clamp(120px, 32vw, 520px)" }}>
              {m.name.replace(/^Yamaha\s+/i, "").split(" ")[0].toUpperCase()}
            </span>
          </div>

          {/* Category tag */}
          <div className="relative z-20 mb-6">
            <span className="inline-flex items-center gap-2 border border-primary/60 bg-primary/10 px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-[0.3em] text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {m.tag}
            </span>
          </div>

          <div className="relative flex-1 grid lg:grid-cols-[minmax(220px,300px)_minmax(0,1fr)] gap-8 lg:gap-12 items-center">
            {/* Color selector column */}
            <div className="relative z-20">
              <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-black mb-5">Disponível em</p>
              <ul className="space-y-4">
                {m.colors.map((c, i) => {
                  const [title, subtitle] = c.name.includes("·")
                    ? c.name.split("·").map((s) => s.trim())
                    : [c.name, ""];
                  const active = i === selected;
                  return (
                    <li key={c.name + i}>
                      <button
                        type="button"
                        onClick={() => setSelected(i)}
                        className={`group flex items-center gap-4 text-left w-full transition-opacity ${active ? "opacity-100" : "opacity-50 hover:opacity-100"}`}
                      >
                        <span
                          aria-hidden
                          className={`shrink-0 grid place-items-center rounded-full transition-all ${
                            active ? "w-10 h-10 ring-2 ring-white ring-offset-4 ring-offset-transparent" : "w-8 h-8 ring-1 ring-white/30"
                          }`}
                          style={{
                            backgroundColor: c.hex,
                            boxShadow: active ? `0 0 24px ${c.hex}66` : undefined,
                          }}
                        >
                          {active ? <Check size={14} className="text-white mix-blend-difference" /> : null}
                        </span>
                        <span className="min-w-0">
                          <span
                            className={`block uppercase tracking-wider font-black ${active ? "text-white" : "text-white/80"}`}
                            style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif", fontSize: "18px", letterSpacing: "0.08em" }}
                          >
                            {title}
                          </span>
                          {subtitle ? (
                            <span className="block text-[11px] text-white/50 mt-0.5">{subtitle}</span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Vehicle stage */}
            <div className="relative">
              {/* Floating tagline — left */}
              <div
                aria-hidden
                className="hidden md:block absolute left-2 top-4 z-10 select-none"
                style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif" }}
              >
                <h2 className="text-white/85 leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]" style={{ fontSize: "clamp(36px, 5.5vw, 84px)", letterSpacing: "0.18em" }}>
                  ELÉTRICA
                </h2>
              </div>

              {/* Floating tagline — right */}
              <div
                aria-hidden
                className="hidden md:block absolute right-2 bottom-16 z-10 text-right select-none"
                style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif" }}
              >
                <h2 className="text-white/90 leading-[0.85] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]" style={{ fontSize: "clamp(30px, 4.6vw, 68px)", letterSpacing: "0.14em" }}>
                  CARREGADA<br />
                  <span style={{ color: variant?.hex ?? "#00c2c5" }}>DE ENERGIA</span>
                </h2>
              </div>

              {/* Ground shadow */}
              <div
                className="absolute inset-x-8 bottom-2 h-10 rounded-[50%] blur-2xl"
                style={{ backgroundColor: `${variant?.hex ?? "#000"}55` }}
              />

              {heroImg ? (
                <img
                  key={heroImg}
                  src={heroImg}
                  alt={`${m.name} — ${variant?.name ?? ""}`}
                  width={1400}
                  height={1000}
                  fetchPriority="high"
                  decoding="async"
                  className="relative z-20 w-full h-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)] transition-opacity duration-300"
                />
              ) : null}

              {/* 360 badge */}
              <button
                type="button"
                onClick={() => setView360Open(true)}
                aria-label="Abrir visualização 360 graus"
                className="hidden sm:grid absolute right-[6%] top-1/2 -translate-y-1/2 z-30 w-16 h-16 place-items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary hover:border-primary transition-all cursor-pointer"
              >
                <div className="text-center leading-tight pointer-events-none">
                  <div className="text-[13px] font-black" style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif" }}>360°</div>
                  <div className="text-[9px] uppercase tracking-widest opacity-70">view</div>
                </div>
              </button>
            </div>
          </div>

          {/* Bottom strip: specs + CTAs */}
          <div className="relative z-20 mt-8 pt-6 border-t border-white/10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
            <dl className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl">
              {[
                { l: "Autonomia", v: m.range },
                { l: "Velocidade", v: m.speed },
                { l: "Potência", v: m.power },
              ].map((s, i) => (
                <div key={s.l} className={i > 0 ? "border-l border-white/10 pl-4 sm:pl-6" : ""}>
                  <dt className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold">{s.l}</dt>
                  <dd
                    className="text-white mt-1"
                    style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif", fontSize: "clamp(22px, 2.4vw, 32px)", lineHeight: 1, letterSpacing: "0.04em" }}
                  >
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/comparar"
                search={{ a: m.slug }}
                className="inline-flex items-center justify-center gap-2 border border-white/25 text-white font-display font-black uppercase tracking-wider text-[11px] px-6 py-3 rounded-full hover:bg-white hover:text-neutral-900 transition-colors"
              >
                Comparar este modelo
              </Link>
              <button
                type="button"
                onClick={() => openWhatsAppWithFallback(whatsappMsg)}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-wider text-[11px] px-6 py-3 rounded-full hover:brightness-110"
              >
                Consultar condições <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
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
