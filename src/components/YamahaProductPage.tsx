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

      {/* HERO — warm lifestyle stage inspired by yamaha-motor.com.br */}
      <section
        className="relative overflow-hidden isolate text-white bg-[#7a2a0a]"
      >
        {/* Base warm gradient */}
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 90% at 78% 40%, #ffd9a8 0%, #f4a463 28%, #d96a26 60%, #7a2a0a 100%)",
          }}
        />
        {/* Variant tint layer — cross-fades on color change */}
        <div
          key={variant?.hex ?? "base"}
          aria-hidden
          className="absolute inset-0 z-0 mix-blend-overlay animate-[tintIn_700ms_ease-out_forwards] opacity-0"
          style={{
            backgroundImage: `radial-gradient(ellipse 60% 70% at 50% 55%, ${variant?.hex ?? "#ffffff"}80 0%, transparent 70%)`,
          }}
        />
        {/* Floating leaves */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
          {[
            { top: "8%", left: "6%", size: 90, rot: -18, delay: "0s", opacity: 0.9 },
            { top: "18%", left: "22%", size: 46, rot: 30, delay: "1.2s", opacity: 0.75 },
            { top: "62%", left: "4%", size: 120, rot: 15, delay: "0.4s", opacity: 0.95 },
            { top: "46%", left: "14%", size: 60, rot: -25, delay: "2s", opacity: 0.7 },
            { top: "72%", left: "24%", size: 70, rot: 55, delay: "0.8s", opacity: 0.85 },
            { top: "30%", right: "8%", size: 110, rot: 22, delay: "1.6s", opacity: 0.9 },
            { top: "58%", right: "4%", size: 80, rot: -35, delay: "0.2s", opacity: 0.8 },
            { top: "82%", right: "18%", size: 55, rot: 12, delay: "2.4s", opacity: 0.7 },
          ].map((l, i) => (
            <svg
              key={i}
              viewBox="0 0 100 100"
              width={l.size}
              height={l.size}
              className="absolute drop-shadow-[0_8px_18px_rgba(70,20,0,0.35)] animate-[float_9s_ease-in-out_infinite]"
              style={{
                top: l.top,
                left: (l as { left?: string }).left,
                right: (l as { right?: string }).right,
                transform: `rotate(${l.rot}deg)`,
                opacity: l.opacity,
                animationDelay: l.delay,
              }}
            >
              <defs>
                <linearGradient id={`lf${i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffb56b" />
                  <stop offset="50%" stopColor="#e77a2b" />
                  <stop offset="100%" stopColor="#8a3a10" />
                </linearGradient>
              </defs>
              <path
                d="M50 5 C 75 20, 92 45, 88 78 C 60 90, 30 82, 12 60 C 18 32, 30 15, 50 5 Z"
                fill={`url(#lf${i})`}
              />
              <path
                d="M50 10 Q 55 45 82 72"
                stroke="rgba(80,25,0,0.4)"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          ))}
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translate(0,0) rotate(var(--r,0deg)); }
            50% { transform: translate(6px,-10px) rotate(var(--r,0deg)); }
          }
          @keyframes tintIn {
            0% { opacity: 0; }
            100% { opacity: 0.85; }
          }
          @keyframes heroImgIn {
            0% { opacity: 0; transform: translateY(12px) scale(0.985); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        <div className="relative max-w-[1500px] mx-auto px-5 sm:px-10 pt-8 sm:pt-10 pb-10 min-h-[86svh] flex flex-col">
          {/* Category tag */}
          <div className="relative z-20 mb-4">
            <span className="inline-flex items-center gap-2 border border-white/60 bg-white/10 backdrop-blur px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-[0.3em] text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {m.tag}
            </span>
          </div>

          {/* Wordmark — in front, large, centered top */}
          <div className="relative z-30 text-center pointer-events-none select-none">
            <h1
              className="text-white leading-[0.85] drop-shadow-[0_12px_40px_rgba(80,25,0,0.45)]"
              style={{
                fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                fontSize: "clamp(80px, 16vw, 240px)",
                letterSpacing: "0.02em",
              }}
            >
              {m.name.replace(/^Yamaha\s+/i, "").split(" ")[0].toUpperCase()}
            </h1>
            <p
              className="mt-2 text-white/95 tracking-[0.5em] font-light"
              style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif", fontSize: "clamp(14px, 1.6vw, 22px)" }}
            >
              ELÉTRICA
            </p>
          </div>

          {/* Vehicle stage */}
          <div className="relative flex-1 flex items-center justify-center mt-[-40px] sm:mt-[-70px]">
            {/* Right tagline */}
            <div
              aria-hidden
              className="hidden md:block absolute right-[3%] top-[38%] z-20 text-right select-none"
              style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif" }}
            >
              <h2
                className="text-white leading-[0.9] drop-shadow-[0_10px_28px_rgba(80,25,0,0.5)]"
                style={{ fontSize: "clamp(22px, 3vw, 44px)", letterSpacing: "0.2em" }}
              >
                CARREGADA<br />
                DE ENERGIA
              </h2>
            </div>

            {/* Ground reflection — tints with variant */}
            <div
              className="absolute inset-x-12 bottom-4 h-12 rounded-[50%] blur-2xl opacity-70 transition-[background-color] duration-700 ease-out"
              style={{ backgroundColor: `${variant?.hex ?? "#3c0f00"}88` }}
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
                className="relative z-30 w-full max-w-[860px] h-auto object-contain drop-shadow-[0_50px_60px_rgba(60,15,0,0.5)] animate-[heroImgIn_500ms_ease-out]"
              />
            ) : null}

            {/* 360 badge */}
            <button
              type="button"
              onClick={() => setView360Open(true)}
              aria-label="Abrir visualização 360 graus"
              className="hidden sm:grid absolute right-[6%] bottom-[10%] z-40 w-16 h-16 place-items-center rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white hover:bg-white hover:text-neutral-900 transition-all cursor-pointer"
            >
              <div className="text-center leading-tight pointer-events-none">
                <div className="text-[13px] font-black" style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif" }}>360°</div>
                <div className="text-[9px] uppercase tracking-widest opacity-80">view</div>
              </div>
            </button>
          </div>

          {/* Color selector — horizontal chip strip */}
          <div className="relative z-30 mt-4">
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/80 font-black mb-3">Disponível em</p>
            <ul className="flex flex-wrap gap-3">
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
                      className={`group flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full border backdrop-blur transition-all ${
                        active
                          ? "border-white bg-white/25 text-white"
                          : "border-white/30 bg-white/5 text-white/85 hover:bg-white/15"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`shrink-0 grid place-items-center rounded-full ${active ? "w-8 h-8 ring-2 ring-white" : "w-7 h-7 ring-1 ring-white/60"}`}
                        style={{ backgroundColor: c.hex, boxShadow: active ? `0 0 20px ${c.hex}aa` : undefined }}
                      >
                        {active ? <Check size={12} className="text-white mix-blend-difference" /> : null}
                      </span>
                      <span className="min-w-0 text-left">
                        <span
                          className="block uppercase tracking-wider font-black"
                          style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif", fontSize: "14px", letterSpacing: "0.1em" }}
                        >
                          {title}
                        </span>
                        {subtitle ? (
                          <span className="block text-[10px] opacity-75 -mt-0.5">{subtitle}</span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Bottom strip: specs + CTAs */}
          <div className="relative z-20 mt-8 pt-6 border-t border-white/25 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
            <dl className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl">
              {[
                { l: "Autonomia", v: m.range },
                { l: "Velocidade", v: m.speed },
                { l: "Potência", v: m.power },
              ].map((s, i) => (
                <div key={s.l} className={i > 0 ? "border-l border-white/25 pl-4 sm:pl-6" : ""}>
                  <dt className="text-[10px] uppercase tracking-[0.3em] text-white/75 font-bold">{s.l}</dt>
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
                className="inline-flex items-center justify-center gap-2 border border-white/60 text-white font-display font-black uppercase tracking-wider text-[11px] px-6 py-3 rounded-full hover:bg-white hover:text-neutral-900 transition-colors"
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
