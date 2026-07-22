import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { ArrowLeft, MessageCircle, ChevronRight, Check } from "lucide-react";
import type { Model } from "@/lib/models";
import { getGallery, buildWhatsAppFallbackUrl, openWhatsAppWithFallback } from "@/lib/models";
import { FinanciamentoForm } from "@/components/FinanciamentoForm";
import { View360Modal } from "@/components/View360Modal";
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

      {/* Sub-nav com âncoras — padrão site oficial Yamaha */}
      <nav className="hidden md:block border-b border-border bg-neutral-950/80 backdrop-blur-md sticky top-14 z-30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-12 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar text-[11px] uppercase tracking-widest font-display font-black text-white/70">
            {[
              ["eficiencia", "Eficiência elétrica"],
              ["modos", "Modos de condução"],
              ["tecnologia", "Tecnologia"],
              ["comodidade", "Comodidade"],
              ["conectividade", "Conectividade"],
              ["baterias", "Baterias"],
              ["modernidade", "Modernidade"],
              ["inovacao", "Inovação"],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="whitespace-nowrap hover:text-primary transition-colors">
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="#financiamento"
              className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/30 text-white text-[11px] font-display font-black uppercase tracking-widest hover:border-primary hover:text-primary"
            >
              Comprar online
            </a>
            <a
              href={whatsappUrl}
              onClick={handleWhats}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-display font-black uppercase tracking-widest hover:brightness-110"
            >
              Receber contato
            </a>
          </div>
        </div>
      </nav>

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
            {m.description}
          </p>
        </div>
      </section>

      {/* 2. GRANDE IMAGEM LATERAL */}
      {activeGallery[0] ? (
        <section className="border-t border-border bg-neutral-950">
          <div className="max-w-[1600px] mx-auto px-5 sm:px-10 py-16 sm:py-24">
            <div className="relative rounded-3xl overflow-hidden bg-neutral-950">
              <img
                src={activeGallery[0]}
                alt={`${m.name} — vista lateral`}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </section>
      ) : null}

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

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              activeGallery[2] ?? activeGallery[0],
              activeGallery[3] ?? activeGallery[1] ?? activeGallery[0],
              activeGallery[4] ?? activeGallery[2] ?? activeGallery[0],
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
      <section className="border-t border-border bg-card/30">
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

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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

      {/* 6. BATERIAS / AUTONOMIA — DUAL BATTERY */}
      <section className="border-t border-border bg-neutral-950">
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

      {/* 7. MODERNIDADE — PAINEL 100% DIGITAL */}
      <section className="border-t border-border bg-card/30">
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
      <section className="border-t border-border bg-neutral-950">
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
            entrega — com garantia oficial de fábrica e suporte da Klug Motors.
          </p>
          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-primary text-[11px] font-display font-black uppercase tracking-widest">
            <Check size={14} /> Garantia oficial de fábrica
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
      {m.specs.length > 0 && (
        <section className="border-t border-border bg-card/30">
          <div className="max-w-5xl mx-auto px-5 sm:px-10 py-20 sm:py-28">
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.4em] font-display font-black text-primary">
                Especificações técnicas
              </p>
              <h2
                className="mt-4 text-white uppercase leading-[0.9] tracking-tight"
                style={{
                  fontFamily: "'Bebas Neue', 'Urbanist', sans-serif",
                  fontSize: "clamp(30px, 5vw, 56px)",
                }}
              >
                Cada número, uma <span className="text-primary">promessa</span>
              </h2>
            </div>

            <dl className="mt-12 grid sm:grid-cols-2 gap-x-10">
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
                title: "Financiamento",
                desc: "Simule parcelas em até 36x com nossos parceiros bancários.",
                cta: "Simular financiamento",
              },
              {
                title: "Consórcio",
                desc: "Planeje agora a compra do seu novo veículo com parcelas sob medida.",
                cta: "Saiba mais",
              },
              {
                title: "À vista",
                desc: "Condições exclusivas para pagamento à vista via Pix ou transferência.",
                cta: "Falar com consultor",
              },
            ].map((c) => (
              <a
                key={c.title}
                href={whatsappUrl}
                onClick={handleWhats}
                className="group rounded-3xl bg-card/60 border border-white/10 p-8 hover:border-primary/60 hover:bg-card transition-colors block"
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
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="border-t border-border bg-card/30">
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

          <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {[
              {
                q: `Como faço para comprar a ${m.name.replace(/^Yamaha\s+/i, "")} na Klug?`,
                a: "Basta falar com um dos nossos consultores pelo WhatsApp ou visitar nossa unidade em Joinville / SC. Emitimos nota, cuidamos do emplacamento e entregamos pronto para rodar.",
              },
              {
                q: "Vocês entregam em outras cidades?",
                a: "Sim. Realizamos entregas em todo o Brasil com transportadoras parceiras. Consulte o frete pelo WhatsApp informando o CEP de destino.",
              },
              {
                q: "É necessária CNH para conduzir este modelo?",
                a: "Sim, é necessária habilitação adequada conforme a legislação vigente e o uso obrigatório de equipamentos de segurança.",
              },
              {
                q: "Qual é a garantia do veículo?",
                a: "Todos os modelos comercializados pela Klug Motors possuem garantia oficial de fábrica. Fale com nosso consultor para conhecer as condições específicas deste modelo.",
              },
            ].map((f, i) => (
              <details key={i} className="group py-5">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 text-white font-semibold">
                  <span className="flex items-start gap-4">
                    <span className="text-primary font-display font-black text-sm mt-0.5">
                      {String(i + 1).padStart(2, "0")}.
                    </span>
                    <span>{f.q}</span>
                  </span>
                  <ChevronRight
                    size={18}
                    className="shrink-0 mt-1 text-primary transition-transform group-open:rotate-90"
                  />
                </summary>
                <p className="mt-3 pl-10 text-white/70 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

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
    </div>
  );
}
