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

      {/* HERO — Yamaha editorial: light backdrop, oversized faded wordmark, side profile */}
      <section className="relative overflow-hidden isolate bg-gradient-to-b from-[#e6ecf1] via-[#d9e0e6] to-[#c9d2da] text-neutral-900">
        <div className="max-w-[1500px] mx-auto px-5 sm:px-10 pt-10 sm:pt-14 pb-10 sm:pb-16 min-h-[86svh] flex flex-col">
          {/* Oversized wordmark behind everything */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[18%] flex flex-col items-center justify-center leading-[0.82] text-center select-none"
            style={{
              fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
              color: "rgba(30,41,59,0.10)",
              letterSpacing: "-0.01em",
            }}
          >
            {(() => {
              const clean = m.name.replace(/^Yamaha\s+/i, "").toUpperCase();
              const words = clean.split(" ");
              const line1 = words[0] ?? clean;
              const line2 = words.slice(1).join(" ");
              return (
                <>
                  <span style={{ fontSize: "clamp(90px, 18vw, 260px)" }}>{line1}</span>
                  {line2 ? (
                    <span style={{ fontSize: "clamp(70px, 14vw, 210px)" }}>{line2}</span>
                  ) : null}
                </>
              );
            })()}
          </div>

          <div className="relative flex-1 grid lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)] gap-8 lg:gap-12 items-center">
            {/* Color selector column */}
            <div className="relative z-10">
              <ul className="space-y-5">
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
                        className="group flex items-center gap-4 text-left w-full"
                      >
                        <span
                          aria-hidden
                          className={`shrink-0 grid place-items-center rounded-full transition-all ${
                            active ? "w-12 h-12 ring-2 ring-primary ring-offset-2 ring-offset-transparent" : "w-11 h-11 ring-1 ring-neutral-400/50"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {active ? <Check size={16} className="text-white mix-blend-difference" /> : null}
                        </span>
                        <span className="min-w-0">
                          <span
                            className={`block uppercase tracking-wide font-black ${active ? "text-primary" : "text-neutral-900"}`}
                            style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif", fontSize: "20px", letterSpacing: "0.06em" }}
                          >
                            {title}
                          </span>
                          {subtitle ? (
                            <span className="block text-sm text-neutral-600 mt-0.5">{subtitle}</span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 flex flex-col gap-3 max-w-[260px]">
                <Link
                  to="/comparar"
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary bg-white/60 backdrop-blur-sm font-display font-black uppercase tracking-wider text-[11px] px-5 py-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Comparar este modelo
                </Link>
                <button
                  type="button"
                  onClick={() => openWhatsAppWithFallback(whatsappMsg)}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-wider text-[11px] px-5 py-3 rounded-full hover:brightness-110"
                >
                  Consultar condições <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Vehicle */}
            <div className="relative">
              <div className="absolute inset-x-6 bottom-4 h-10 rounded-[50%] bg-black/25 blur-2xl" />
              {heroImg ? (
                <img
                  key={heroImg}
                  src={heroImg}
                  alt={`${m.name} — ${variant?.name ?? ""}`}
                  width={1400}
                  height={1000}
                  fetchPriority="high"
                  decoding="async"
                  className="relative w-full h-auto object-contain drop-shadow-[0_35px_45px_rgba(15,23,42,0.35)] transition-opacity duration-300"
                />
              ) : null}
              {/* 360 badge — clicável, abre o modal de visualização 360° */}
              <button
                type="button"
                onClick={() => setView360Open(true)}
                aria-label="Abrir visualização 360 graus"
                className="hidden sm:grid absolute right-[8%] top-1/2 -translate-y-1/2 w-16 h-16 place-items-center rounded-full bg-white/95 shadow-lg text-neutral-900 hover:scale-110 hover:bg-white transition-transform cursor-pointer"
              >
                <div className="text-center leading-tight pointer-events-none">
                  <div className="text-[13px] font-black" style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif" }}>360°</div>
                  <div className="text-[9px] uppercase tracking-widest text-neutral-500">view</div>
                </div>
              </button>
              {/* Rotation arrow — decorative */}
              <svg
                aria-hidden
                viewBox="0 0 400 60"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[70%] max-w-[520px] text-neutral-700/60"
                fill="none"
              >
                <path d="M20 30 C 120 55, 280 55, 380 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M373 25 L 383 30 L 373 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Bottom quick specs */}
          <dl className="relative z-10 mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
            {[
              { l: "Autonomia", v: m.range },
              { l: "Velocidade", v: m.speed },
              { l: "Potência", v: m.power },
            ].map((s) => (
              <div key={s.l} className="border-l border-neutral-500/30 pl-3">
                <dt className="text-[10px] uppercase tracking-widest text-neutral-600 font-bold">{s.l}</dt>
                <dd
                  className="text-neutral-900 mt-1"
                  style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif", fontSize: "22px", lineHeight: 1 }}
                >
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
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
