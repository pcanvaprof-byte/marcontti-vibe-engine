import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { ArrowLeft, MessageCircle, ChevronRight, Check, Plus, Minus } from "lucide-react";

import type { Model } from "@/lib/models";
import { getGallery, buildWhatsAppFallbackUrl, openWhatsAppWithFallback } from "@/lib/models";
import { trackEvent } from "@/lib/analytics";

import { FinanciamentoForm } from "@/components/FinanciamentoForm";
import { ConsorcioForm } from "@/components/ConsorcioForm";
import { View360Modal } from "@/components/View360Modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import klugLogo from "@/assets/klug/klug-horizontal-white.png.asset.json";
import neosHeroOfficial from "@/assets/neos-hero-official.png.asset.json";

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
  const [modalOpen, setModalOpen] = useState<null | "financiamento" | "consorcio" | "avista">(null);
  const modelGallery = useMemo(() => getGallery(m), [m]);
  const variant = m.colors[selected] ?? m.colors[0];
  // Per-color gallery takes precedence; fall back to the model-level gallery.
  const activeGallery = useMemo(() => {
    const vg = variant?.gallery?.filter(Boolean) ?? [];
    return vg.length > 0 ? vg : modelGallery;
  }, [variant, modelGallery]);
  const heroImg = variant?.image ?? activeGallery[0];

  // O hero oficial só se aplica ao Neo's Connected. Demais modelos usam a
  // arte do próprio produto (variant.image / galeria) sobre fundo escuro.
  const isNeos = m.slug === "yamaha-neos-connected";
  // "Dual Battery" e cópia elétrica só fazem sentido para modelos elétricos.
  // Uma heurística segura: apenas o Neo's é 100% elétrico com baterias
  // removíveis no catálogo Yamaha atual — demais são combustão/híbridos.
  const isDualBattery = isNeos;

  // Textos das seções Intro/Versatilidade/Tecnologia são fixos (não trocam por cor)
  // — evita re-render/piscada de várias seções a cada clique na cor.
  const baseDescription = m.description;
  const sentences = useMemo(() => {
    const parts = baseDescription
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return parts.length ? parts : [baseDescription];
  }, [baseDescription]);

  const fmtBRL = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const whatsappMsg = `Olá! Tenho interesse na *${m.name}* — ${m.price}. Pode me passar mais informações e condições?`;
  const whatsappUrl = buildWhatsAppFallbackUrl(whatsappMsg);
  const handleWhats = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openWhatsAppWithFallback(whatsappMsg);
  };

  // Pré-carrega TODAS as imagens de variantes no mount — troca de cor fica instantânea.
  useEffect(() => {
    m.colors.forEach((c) => {
      if (!c?.image) return;
      const i = new Image();
      i.src = c.image;
    });
  }, [m.colors]);

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

      {/* Sub-nav com âncoras — padrão site oficial Yamaha */}
      <SubNav
        model={m}
        whatsappUrl={whatsappUrl}
        onWhats={handleWhats}
      />


      {/* HERO — official artwork for Neo's; per-model artwork for the rest */}
      <section className="relative overflow-hidden isolate text-white bg-neutral-950">
        {isNeos ? (
          <img
            src={neosHeroOfficial.url}
            alt={`${m.name} — elétrica, carregada de energia`}
            fetchPriority="high"
            decoding="async"
            className="block w-full h-auto select-none"
            draggable={false}
          />
        ) : (
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_60%)]"
            />
            <div className="relative max-w-[1400px] mx-auto px-5 sm:px-10 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] font-display font-black text-primary">
                  {m.tag || (m.slug.startsWith("sudu-") ? "Sudu" : m.slug.startsWith("yamaha-") ? "Yamaha" : "Klug")}
                </p>
                <h1
                  className="mt-4 text-white uppercase leading-[0.9] tracking-tight"
                  style={{
                    fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                    fontSize: "clamp(44px, 7vw, 96px)",
                  }}
                >
                  {m.name.replace(/^Yamaha\s+/i, "")}
                </h1>
                <p className="mt-6 text-white/75 text-base sm:text-lg leading-relaxed max-w-xl">
                  {m.short || m.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#financiamento"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:brightness-110"
                  >
                    Comprar online <ChevronRight size={14} />
                  </a>
                  <a
                    href={whatsappUrl}
                    onClick={handleWhats}
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white font-display font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:brightness-110"
                  >
                    <MessageCircle size={14} fill="white" strokeWidth={0} /> WhatsApp
                  </a>
                </div>
              </div>
              <div className="relative min-h-[280px] sm:min-h-[420px] grid place-items-center">
                {heroImg ? (
                  <img
                    src={heroImg}
                    alt={`${m.name}`}
                    fetchPriority="high"
                    decoding="async"
                    className="relative max-h-[460px] w-auto object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.6)]"
                  />
                ) : null}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 1. INTRO — MOBILIDADE INTELIGENTE (2-col: título esquerda / texto direita) */}
      <section id="eficiencia" className="border-t border-border bg-neutral-950">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 py-20 sm:py-28 grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] font-display font-black text-primary">
              Eficiência elétrica
            </p>
            <h2
              className="mt-5 text-white uppercase leading-[0.9] tracking-tight"
              style={{
                fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                fontSize: "clamp(36px, 5.5vw, 76px)",
              }}
            >
              Mobilidade <span className="text-primary">inteligente</span>
            </h2>
          </div>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed lg:pt-6">
            {baseDescription}
          </p>
        </div>
      </section>




      {/* 3. MODOS DE CONDUÇÃO / VERSATILIDADE */}
      <section id="modos" className="border-t border-border bg-card/30">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 py-20 sm:py-28 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-[11px] uppercase tracking-[0.4em] font-display font-black text-primary">
              Experiência
            </p>
            <h3
              className="mt-4 text-white uppercase leading-[0.9] tracking-tight"
              style={{
                fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                fontSize: "clamp(30px, 4.5vw, 60px)",
              }}
            >
              Versatilidade em <span className="text-primary">cada viagem</span>
            </h3>
            <p className="mt-6 text-white/75 leading-relaxed text-base sm:text-lg">
              {sentences[1] ?? sentences[0]}
            </p>
            {m.features.length > 0 && (
              <ul className="mt-8 grid sm:grid-cols-2 gap-3 max-w-lg">
                {m.features.slice(0, 6).map((it) => (
                  <li key={it} className="flex gap-2 text-sm text-white/85">
                    <Check size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="order-1 lg:order-2">
            <div className="rounded-3xl overflow-hidden bg-neutral-950 border border-white/10">
              <img
                src={activeGallery[1] ?? activeGallery[0] ?? heroImg}
                alt={`${m.name} — modos de condução`}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. TECNOLOGIA — cabeçalho 2-col + 3 imagens sem legendas */}
      <section id="tecnologia" className="border-t border-border bg-neutral-950">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] font-display font-black text-primary">
                Tecnologia
              </p>
              <h3
                className="mt-4 text-white uppercase leading-[0.9] tracking-tight"
                style={{
                  fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                  fontSize: "clamp(30px, 4.5vw, 60px)",
                }}
              >
                A escolha certa para <span className="text-primary">mobilidade urbana</span>
              </h3>
            </div>
            <p className="text-white/75 leading-relaxed lg:pt-6">
              {sentences[2] ?? sentences[0]}
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 gap-6">
            {[
              activeGallery[2] ?? activeGallery[0],
              activeGallery[4] ?? activeGallery[3] ?? activeGallery[1] ?? activeGallery[0],
            ].map((img, i) => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 aspect-[4/3] grid place-items-center"
              >
                {img ? (
                  <img
                    src={img}
                    alt={`${m.name} — detalhe ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 5. COMODIDADE + CONECTIVIDADE — dois blocos alternados */}
      <section id="comodidade" className="border-t border-border bg-card/30">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 py-20 sm:py-28 space-y-20 sm:space-y-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="rounded-3xl overflow-hidden bg-neutral-950 border border-white/10">
              <img
                src={activeGallery[5] ?? activeGallery[0] ?? heroImg}
                alt="Comodidade"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain"
              />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] font-display font-black text-primary">
                Comodidade
              </p>
              <h3
                className="mt-4 text-white uppercase leading-[0.9] tracking-tight"
                style={{
                  fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                  fontSize: "clamp(28px, 4vw, 52px)",
                }}
              >
                Praticidade que acompanha <span className="text-primary">a sua rotina</span>
              </h3>
              <p className="mt-6 text-white/75 leading-relaxed">
                Ergonomia pensada para deslocamentos diários, com espaço útil e acessos rápidos
                que fazem diferença na cidade.
              </p>
            </div>
          </div>

          <div id="conectividade" className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center scroll-mt-28">
            <div className="order-2 lg:order-1">
              <p className="text-[11px] uppercase tracking-[0.4em] font-display font-black text-primary">
                Conectividade
              </p>
              <h3
                className="mt-4 text-white uppercase leading-[0.9] tracking-tight"
                style={{
                  fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                  fontSize: "clamp(28px, 4vw, 52px)",
                }}
              >
                Sua {m.name.replace(/^Yamaha\s+/i, "")} <span className="text-primary">na palma da mão</span>
              </h3>
              <p className="mt-6 text-white/75 leading-relaxed">
                Monitore seu veículo, acompanhe informações essenciais e mantenha a manutenção em
                dia direto pelo aplicativo — tecnologia que anda com você.
              </p>
              <a
                href={whatsappUrl}
                onClick={handleWhats}
                className="mt-8 inline-flex items-center gap-2 text-primary text-xs font-display font-black uppercase tracking-widest hover:brightness-125"
              >
                Falar com um consultor Klug <ChevronRight size={14} />
              </a>
            </div>
            <div className="order-1 lg:order-2 rounded-3xl overflow-hidden bg-neutral-950 border border-white/10">
              <img
                src={activeGallery[6] ?? activeGallery[1] ?? heroImg}
                alt="Conectividade"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. BATERIAS / AUTONOMIA — DUAL BATTERY (somente Neo's) */}
      {isDualBattery && (
        <section id="baterias" className="border-t border-border bg-neutral-950">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 py-20 sm:py-28">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-[11px] uppercase tracking-[0.4em] font-display font-black text-primary">
                Baterias
              </p>
              <h2
                className="mt-4 text-white uppercase leading-[0.9] tracking-tight"
                style={{
                  fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                  fontSize: "clamp(32px, 5vw, 64px)",
                }}
              >
                Autonomia máxima com <span className="text-primary">Dual Battery</span>
              </h2>
              <p className="mt-6 text-white/75 leading-relaxed">
                Duas baterias removíveis de íon-lítio, carregáveis diretamente no veículo ou levadas
                para casa. Localizadas sob o banco para acesso fácil, garantem praticidade e alcance
                impressionante em cada trajeto.
              </p>
            </div>

            <div className="mt-14 grid sm:grid-cols-3 gap-6">
              {[
                activeGallery[7] ?? activeGallery[0],
                activeGallery[8] ?? activeGallery[1] ?? activeGallery[0],
                activeGallery[9] ?? activeGallery[2] ?? activeGallery[0],
              ].map((img, i) => (
                <div
                  key={i}
                  className="rounded-3xl overflow-hidden bg-neutral-950 border border-white/10 aspect-[4/3] grid place-items-center"
                >
                  {img ? (
                    <img
                      src={img}
                      alt={`Bateria ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain p-6"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. MODERNIDADE — PAINEL 100% DIGITAL */}
      <section id="modernidade" className="border-t border-border bg-card/30">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 py-20 sm:py-28 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="rounded-3xl overflow-hidden bg-neutral-950 border border-white/10">
            <img
              src={activeGallery[10] ?? activeGallery[2] ?? heroImg}
              alt={`${m.name} — painel 100% digital`}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-contain"
            />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] font-display font-black text-primary">
              Modernidade
            </p>
            <h3
              className="mt-4 text-white uppercase leading-[0.9] tracking-tight"
              style={{
                fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                fontSize: "clamp(28px, 4vw, 52px)",
              }}
            >
              Painel <span className="text-primary">100% digital</span>
            </h3>
            <p className="mt-6 text-white/75 leading-relaxed">
              Display digital com avisos inteligentes em tempo real: modo de pilotagem, status da
              bateria e alertas visuais que colocam toda a informação necessária ao alcance do olhar.
            </p>
          </div>
        </div>
      </section>

      {/* 8. INOVAÇÃO — MANUAL INTERATIVO */}
      <section id="inovacao" className="border-t border-border bg-neutral-950">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 py-20 sm:py-28 text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] font-display font-black text-primary">
            Inovação
          </p>
          <h2
            className="mt-4 text-white uppercase leading-[0.9] tracking-tight max-w-3xl mx-auto"
            style={{
              fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
              fontSize: "clamp(28px, 4.5vw, 56px)",
            }}
          >
            Conheça seu novo veículo em <span className="text-primary">detalhes</span>
          </h2>
          <p className="mt-6 text-white/75 leading-relaxed max-w-2xl mx-auto">
            Nossos consultores apresentam cada recurso e cuidam de todo o processo — da escolha à
            entrega — com suporte da Klug Motors.
          </p>
          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-primary text-[11px] font-display font-black uppercase tracking-widest">
            <Check size={14} /> Revisada e pronta para uso
          </div>
        </div>
      </section>



      {/* 6. CORES */}
      {m.colors.length > 0 && (
        <section className="border-t border-border bg-neutral-950">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 py-20 sm:py-28">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-[11px] uppercase tracking-[0.4em] font-display font-black text-primary">
                Cores
              </p>
              <h2
                className="mt-4 text-white uppercase leading-[0.9] tracking-tight"
                style={{
                  fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                  fontSize: "clamp(32px, 5vw, 64px)",
                }}
              >
                Escolha o seu <span className="text-primary">estilo</span>
              </h2>
            </div>

            <div className="mt-12 relative rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-6 sm:p-12">
              <div className="relative min-h-[280px] sm:min-h-[420px] grid place-items-center">
                {/* Anel tracejado 360° — padrão site oficial Yamaha */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[560px] aspect-[2/1] rounded-[50%] border border-dashed border-white/25"
                  style={{ maskImage: "linear-gradient(to bottom, transparent 0%, transparent 55%, black 60%, black 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, transparent 55%, black 60%, black 100%)" }}
                />
                {variant?.image ? (
                  <img
                    src={variant.image}
                    alt={`${m.name} — ${variant.name}`}
                    className="relative max-h-[420px] w-auto object-contain transition-opacity duration-300"
                  />
                ) : null}
              </div>
              <p
                className="text-center mt-6 text-white uppercase"
                style={{
                  fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                  fontSize: "32px",
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

      {/* 7. FICHA TÉCNICA */}
      {m.specs.length > 0 && <SpecSheet specs={m.specs} />}


      {/* 8. CONDIÇÕES — Financiamento / Consórcio / Consultoria */}
      <section className="border-t border-border bg-neutral-950">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.4em] font-display font-black text-primary">
              Condições Klug
            </p>
            <h2
              className="mt-4 text-white uppercase leading-[0.9] tracking-tight"
              style={{
                fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                fontSize: "clamp(32px, 5vw, 64px)",
              }}
            >
              A partir de <span className="text-primary">{fmtBRL(m.priceNumber)}</span>
            </h2>
            <p className="mt-5 text-white/70">
              Consulte disponibilidade e condições especiais na unidade Klug Motors Joinville / SC.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              {
                key: "financiamento" as const,
                title: "Financiamento",
                desc: "Simule parcelas em até 36x com nossos parceiros bancários.",
                cta: "Simular financiamento",
              },
              {
                key: "consorcio" as const,
                title: "Consórcio",
                desc: "Planeje agora a compra do seu novo veículo com parcelas sob medida.",
                cta: "Saiba mais",
              },
              {
                key: "avista" as const,
                title: "À vista / Cartão",
                desc: "Compra 100% online via Pix, transferência ou cartão. Em breve direto no site.",
                cta: "Ver opções",
              },
            ].map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => {
                  trackEvent("interest_click", {
                    source: "product_payment_card",
                    modelSlug: m.slug,
                    meta: { model: m.name, paymentType: c.key, cta: c.cta },
                  });
                  setModalOpen(c.key);
                }}

                className="group text-left rounded-3xl bg-card/60 border border-white/10 p-8 hover:border-primary/60 hover:bg-card transition-colors block w-full"
              >
                <h4
                  className="text-white uppercase leading-[1] tracking-tight"
                  style={{
                    fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                    fontSize: "32px",
                  }}
                >
                  {c.title}
                </h4>
                <p className="mt-3 text-white/70 text-sm leading-relaxed">{c.desc}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-primary text-xs font-display font-black uppercase tracking-widest">
                  {c.cta} <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <FaqAccordion
        items={[
          {
            q: `Como faço para comprar a ${m.name.replace(/^Yamaha\s+/i, "")} na Klug?`,
            a: "Basta falar com um dos nossos consultores pelo WhatsApp ou visitar nossa unidade em Joinville / SC. Emitimos nota fiscal e entregamos pronto para rodar. Para modelos homologados (acima de 1000W) cuidamos também do emplacamento; modelos até 1000W seguem o CONTRAN 996/23 e não exigem CNH nem emplacamento.",
          },
          {
            q: "Vocês entregam em outras cidades?",
            a: "Sim. Entregamos em Joinville e região com frota própria e para todo o Brasil via transportadoras parceiras. Consulte o frete pelo WhatsApp informando o CEP de destino.",
          },
          {
            q: "É necessária CNH para conduzir este modelo?",
            a: "Depende do modelo. Scooters e motos elétricas acima de 1000W são homologadas como motocicletas e exigem CNH categoria A, emplacamento e uso obrigatório de capacete e demais equipamentos de segurança. Modelos até 1000W são classificados como autopropelidos pelo CONTRAN 996/23 e não exigem CNH nem emplacamento — ainda assim recomendamos capacete e proteção adequada.",
          },
          {
            q: "Qual é a garantia do veículo?",
            a: "Todos os modelos comercializados pela Klug Motors possuem garantia oficial de fábrica. Fale com nosso consultor para conhecer as condições específicas deste modelo.",
          },
        ]}
      />


      {/* 10. AVISO DE FRAUDE / DISCLAIMER */}
      <section className="border-t border-border bg-neutral-950">
        <div className="max-w-4xl mx-auto px-5 sm:px-10 py-14 sm:py-20 text-white/60 text-xs sm:text-sm leading-relaxed space-y-4">
          <p className="uppercase tracking-widest font-display font-black text-primary text-[11px]">
            Aviso importante
          </p>
          <p>
            Os veículos são comercializados exclusivamente por meio de concessionárias autorizadas e
            do e-commerce oficial das marcas. A Klug Motors é a unidade autorizada em Joinville / SC.
            Nunca realize pagamentos em contas de terceiros e desconfie de ofertas com valores muito
            abaixo do mercado.
          </p>
          <p>
            Preços, condições de financiamento e disponibilidade sujeitos a alteração sem aviso
            prévio e à análise de crédito. Imagens meramente ilustrativas. Consulte o consultor Klug
            para as condições vigentes.
          </p>
        </div>
      </section>

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

      {/* Modal: Financiamento */}
      <Dialog open={modalOpen === "financiamento"} onOpenChange={(o) => !o && setModalOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-950 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif", fontSize: "28px" }}>
              Simular financiamento
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Preencha os dados e anexe seus documentos. Retornamos com a simulação em até 1 dia útil.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <FinanciamentoForm defaultModel={m.name} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Consórcio */}
      <Dialog open={modalOpen === "consorcio"} onOpenChange={(o) => !o && setModalOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-950 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif", fontSize: "28px" }}>
              Consórcio Klug
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Uma alternativa planejada e sem juros para conquistar sua {m.name.replace(/^Yamaha\s+/i, "")}.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4 text-sm text-white/80 leading-relaxed">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-primary text-[11px] uppercase tracking-[0.3em] font-display font-black mb-2">Como funciona</p>
              <p>
                Você entra em um grupo de participantes, paga parcelas mensais reduzidas
                (sem juros — apenas taxa de administração) e é contemplado por sorteio
                ou lance com uma carta de crédito no valor do veículo.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { k: "Sem juros", v: "Apenas taxa de administração" },
                { k: "Parcelas", v: "A partir de 60 meses" },
                { k: "Contemplação", v: "Sorteio mensal ou lance" },
              ].map((i) => (
                <div key={i.k} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-primary text-[10px] uppercase tracking-widest font-display font-black">{i.k}</p>
                  <p className="mt-1 text-white text-sm">{i.v}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10">
              <p className="text-primary text-[11px] uppercase tracking-[0.3em] font-display font-black mb-3">
                Solicite sua simulação
              </p>
              <ConsorcioForm defaultModel={m.name} />
            </div>
          </div>

        </DialogContent>
      </Dialog>

      {/* Modal: À vista / Cartão */}
      <Dialog open={modalOpen === "avista"} onOpenChange={(o) => !o && setModalOpen(null)}>
        <DialogContent className="max-w-lg bg-neutral-950 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white uppercase tracking-tight" style={{ fontFamily: "'Bebas Neue', 'Urbanist', sans-serif", fontSize: "28px" }}>
              À vista / Cartão
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Compra 100% online direto pelo site — em breve.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4 text-sm text-white/80 leading-relaxed">
            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5">
              <p className="text-primary text-[11px] uppercase tracking-[0.3em] font-display font-black mb-2">Em breve</p>
              <p>
                Estamos preparando o checkout online da Klug Motors para pagamento via
                <b className="text-white"> Pix, transferência e cartão de crédito</b> em até 12x,
                com emissão de nota e entrega em todo o Brasil.
              </p>
            </div>

            <p className="text-white/70">
              Enquanto isso, nosso consultor finaliza sua compra pelo WhatsApp com as
              mesmas condições — desconto especial no Pix e parcelamento no cartão.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={whatsappUrl}
                onClick={handleWhats}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-display font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:brightness-110"
              >
                <MessageCircle size={14} fill="white" strokeWidth={0} /> Comprar pelo WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setModalOpen(null)}
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-display font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:border-primary hover:text-primary"
              >
                Fechar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- Spec Sheet (Yamaha-style tabbed) ---------------- */

type Spec = { label: string; value: string };

const SPEC_GROUPS: { id: string; label: string; match: RegExp }[] = [
  { id: "motor", label: "Motor / Propulsão", match: /(motor|potênc|potenc|torque|cilindr|combust|inje|refriger|partida|transmiss|câmbio|cambio|embreagem|válvul|valvul)/i },
  { id: "bateria", label: "Bateria / Autonomia", match: /(bateria|autonom|carga|carregamento|litio|lítio|voltagem|tensão|tensao|kwh|ah\b)/i },
  { id: "desempenho", label: "Desempenho", match: /(velocid|aceler|km\/h|rampa|inclina|rendiment)/i },
  { id: "chassi", label: "Chassi / Suspensão", match: /(chassi|suspens|amortec|garfo|quadro|pneu|roda|freio|disco|abs\b)/i },
  { id: "dimensoes", label: "Dimensões / Peso", match: /(dimens|comprim|largur|altur|entre.?eixo|peso|capacid|tanque|carga|distância|distancia)/i },
  { id: "eletrica", label: "Elétrica / Iluminação", match: /(elétric|eletric|farol|luz|led|painel|display|instrument|bluetooth|conect|usb|app|gps)/i },
];

function groupSpecs(specs: Spec[]) {
  const groups = new Map<string, { label: string; items: Spec[] }>();
  const order: string[] = [];
  for (const s of specs) {
    const g = SPEC_GROUPS.find((g) => g.match.test(s.label));
    const id = g?.id ?? "outros";
    const label = g?.label ?? "Outros";
    if (!groups.has(id)) {
      groups.set(id, { label, items: [] });
      order.push(id);
    }
    groups.get(id)!.items.push(s);
  }
  return order.map((id) => ({ id, ...groups.get(id)! }));
}

function SpecSheet({ specs }: { specs: Spec[] }) {
  const groups = useMemo(() => groupSpecs(specs), [specs]);
  const [active, setActive] = useState(groups[0]?.id ?? "");
  const current = groups.find((g) => g.id === active) ?? groups[0];

  return (
    <section id="ficha-tecnica" className="border-t border-border bg-white text-neutral-900 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-10 py-12 sm:py-24">
        {/* Título centralizado com underline — padrão Yamaha */}
        <div className="text-center">
          <h2 className="inline-block text-neutral-900 text-base sm:text-lg font-medium tracking-wide pb-3 border-b border-neutral-900">
            Especificações Técnicas
          </h2>
        </div>

        {/* Tabs: strip com scroll-snap, fade nas bordas no mobile */}
        <div className="mt-8 sm:mt-10 relative -mx-4 sm:mx-0">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent sm:hidden z-10"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent sm:hidden z-10"
            aria-hidden
          />
          <div
            role="tablist"
            aria-label="Categorias de especificações"
            className="flex sm:justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none px-4 sm:px-0 snap-x snap-mandatory scroll-smooth"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {groups.map((g) => {
              const isActive = g.id === current?.id;
              return (
                <button
                  key={g.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(g.id)}
                  className={[
                    "shrink-0 snap-start whitespace-nowrap rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-[12px] sm:text-[13px] font-semibold tracking-wide transition-all",
                    isActive
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "bg-neutral-100 sm:bg-transparent text-neutral-500 hover:text-neutral-900",
                  ].join(" ")}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabela responsiva: stack no mobile, 2 colunas no desktop */}
        {current && (
          <div
            key={current.id}
            className="mt-6 sm:mt-10 border border-neutral-200 rounded-lg overflow-hidden animate-in fade-in duration-300"
          >
            <dl>
              {current.items.map((s, i) => (
                <div
                  key={`${s.label}-${i}`}
                  className={[
                    "grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-start sm:items-center gap-1 sm:gap-6 px-4 sm:px-8 py-3 sm:py-4",
                    i % 2 === 0 ? "bg-neutral-50" : "bg-white",
                    i !== current.items.length - 1 ? "border-b border-neutral-200/70" : "",
                  ].join(" ")}
                >
                  <dt className="min-w-0 text-neutral-900 text-[12px] sm:text-sm font-semibold uppercase tracking-wide sm:normal-case sm:tracking-normal">
                    {s.label}
                  </dt>
                  <dd className="min-w-0 text-neutral-600 text-[13px] sm:text-sm leading-relaxed break-words">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <p className="mt-6 text-[11px] text-neutral-400 leading-relaxed text-center px-4">
          As informações técnicas podem sofrer alterações sem aviso prévio. Imagens meramente
          ilustrativas. Consulte a Klug Motors para condições e disponibilidade.
        </p>
      </div>
    </section>
  );
}


/* ---------------- Sub-nav with scroll-spy ---------------- */

const SUBNAV_SECTIONS_ALL: { id: string; label: string; neosOnly?: boolean; firstLabel?: string }[] = [
  { id: "eficiencia", label: "Eficiência elétrica", firstLabel: "Destaques" },
  { id: "modos", label: "Modos de condução" },
  { id: "tecnologia", label: "Tecnologia" },
  { id: "comodidade", label: "Comodidade" },
  { id: "conectividade", label: "Conectividade" },
  { id: "baterias", label: "Baterias", neosOnly: true },
  { id: "modernidade", label: "Modernidade" },
  { id: "inovacao", label: "Inovação" },
  { id: "ficha-tecnica", label: "Ficha Técnica" },
  { id: "faq", label: "FAQ" },
];

/** Highlights the anchor whose section currently sits under the sticky sub-nav. */
function useScrollSpy(ids: string[], offset = 120) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (targets.length === 0) return;

    const compute = () => {
      const y = window.scrollY + offset + 1;
      let current = targets[0].id;
      for (const el of targets) {
        if (el.offsetTop <= y) current = el.id;
        else break;
      }
      // Bottom-of-page: force last id (works even when the section is short).
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
        current = targets[targets.length - 1].id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [ids, offset]);
  return active;
}

function SubNav({
  model,
  whatsappUrl,
  onWhats,
}: {
  model: Model;
  whatsappUrl: string;
  onWhats: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const isNeos = model.slug === "yamaha-neos-connected";
  const sections = useMemo(
    () =>
      SUBNAV_SECTIONS_ALL.filter((s) => (s.neosOnly ? isNeos : true)).map((s) => ({
        id: s.id,
        label: !isNeos && s.firstLabel ? s.firstLabel : s.label,
      })),
    [isNeos],
  );
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useScrollSpy(ids, 120);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Keep the active tab visible when scrolling changes it.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector<HTMLAnchorElement>(`a[data-id="${active}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  const scrollTo = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const y = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: y, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      aria-label="Seções da página"
      className="border-b border-border bg-neutral-950/85 backdrop-blur-md sticky top-14 z-30"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-12 flex items-center justify-between gap-6">
        <div
          ref={listRef}
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none -mx-2 px-2 h-full text-[11px] uppercase tracking-widest font-display font-black"
        >
          {sections.map((s) => {
            const isActive = s.id === active;
            return (
              <a
                key={s.id}
                data-id={s.id}
                href={`#${s.id}`}
                onClick={scrollTo(s.id)}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "relative h-full inline-flex items-center whitespace-nowrap px-3 transition-colors",
                  isActive ? "text-white" : "text-white/55 hover:text-white/85",
                ].join(" ")}
              >
                {s.label}
                <span
                  className={[
                    "pointer-events-none absolute left-2 right-2 bottom-0 h-[2px] rounded-full origin-left transition-transform duration-300",
                    isActive ? "bg-primary scale-x-100" : "bg-primary scale-x-0",
                  ].join(" ")}
                />
              </a>
            );
          })}
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() =>
              openWhatsAppWithFallback(
                `Olá! Quero agendar um Test-Ride da *${model.name}*. Pode me passar as opções?`,
                { source: "yamaha_subnav_test_ride", event: "test_ride_click", modelSlug: model.slug },
              )
            }
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-white text-neutral-950 text-[11px] font-display font-black uppercase tracking-widest hover:brightness-90"
          >
            Agendar Test-Ride
          </button>
          <a
            href="#financiamento"
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/30 text-white text-[11px] font-display font-black uppercase tracking-widest hover:border-primary hover:text-primary"
          >
            Comprar online
          </a>
          <a
            href={whatsappUrl}
            onClick={onWhats}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-display font-black uppercase tracking-widest hover:brightness-110"
          >
            Receber contato
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ---------------- FAQ Accordion ---------------- */

type FaqItem = { q: string; a: string };

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-border bg-card/30">
      <div className="max-w-4xl mx-auto px-5 sm:px-10 py-20 sm:py-28">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] font-display font-black text-primary">
            Perguntas frequentes
          </p>
          <h2
            className="mt-4 text-white uppercase leading-[0.9] tracking-tight"
            style={{
              fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
              fontSize: "clamp(30px, 5vw, 56px)",
            }}
          >
            Tire suas <span className="text-primary">dúvidas</span>
          </h2>
        </div>

        <ul className="mt-10 sm:mt-12 divide-y divide-white/10 border-y border-white/10">
          {items.map((f, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-trigger-${i}`;
            return (
              <li key={i}>
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full text-left flex items-start justify-between gap-4 py-5 sm:py-6 group"
                  >
                    <span className="flex items-start gap-3 sm:gap-4 min-w-0">
                      <span className="text-primary font-display font-black text-xs sm:text-sm mt-1 tracking-widest shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-white text-sm sm:text-base font-semibold leading-snug">
                        {f.q}
                      </span>
                    </span>
                    <span
                      className={[
                        "shrink-0 mt-0.5 grid place-items-center h-8 w-8 rounded-full border transition-colors",
                        isOpen
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-white/20 text-white/70 group-hover:border-primary group-hover:text-primary",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={[
                    "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pl-9 sm:pl-10 pr-2 text-white/70 text-sm sm:text-[15px] leading-relaxed">
                      {f.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* SEO — FAQPage schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: items.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}

