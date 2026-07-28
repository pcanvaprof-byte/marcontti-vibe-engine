import { useState, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";
import { QuickViewModal } from "@/components/QuickViewModal";

export type Product = {
  id: string;
  nome: string;
  potencia: string;
  imagem: string;
  preco?: string;
  promocao?: boolean;
  novo?: boolean;
  maisVendido?: boolean;
  slug?: string;
};

// Bebas Neue — condensada, pesada, próximo do traço da referência.
const displayFont = "'Bebas Neue', 'Urbanist', sans-serif";

export function ProductCard({ product }: { product: Product }) {
  const href = product.slug ? `/modelos/${product.slug}` : "#";
  const [open, setOpen] = useState(false);

  const openModal = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };


  return (
    <article
      className="
        group relative w-full h-full
        flex flex-col
        bg-black overflow-visible
        rounded-[14px]
        shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]
        transition-[transform,box-shadow] duration-500 ease-out
        motion-safe:hover:-translate-y-2
        hover:shadow-[0_20px_50px_-18px_rgba(248,96,0,0.45),0_0_0_1px_rgba(248,96,0,0.35)]
      "
    >
      {/* Raio pequeno branco no canto superior esquerdo */}
      <span
        aria-hidden
        className="absolute top-2 left-2 sm:top-[8px] sm:left-[8px] z-[3] text-white"
      >
        <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} fill="currentColor" />
      </span>

      {/* Raio grande superior direito (laranja Klug) */}
      <span
        aria-hidden
        className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-[3] text-primary"
        style={{ filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.35))" }}
      >
        <Zap className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.2} fill="currentColor" />
      </span>

      {/* Pastilha vertical arredondada — borda ESQUERDA */}
      <span
        aria-hidden
        className="absolute left-0 top-[42%] -translate-y-1/2 -translate-x-1/2 w-7 h-12 sm:w-8 sm:h-14 rounded-full bg-primary z-[1]"
      />
      {/* Pastilha vertical arredondada — borda DIREITA */}
      <span
        aria-hidden
        className="absolute right-0 top-[50%] -translate-y-1/2 translate-x-1/2 w-7 h-12 sm:w-8 sm:h-14 rounded-full bg-primary z-[1]"
      />

      {/* Palco branco — proporção fixa, imagem pode extrapolar as bordas */}
      <Link
        to={href}
        aria-label={`Ver detalhes de ${product.nome}`}
        className="relative z-[2] block mx-2.5 mt-2.5 sm:mx-3 sm:mt-3"
      >
        <div className="relative aspect-[4/3] rounded-[10px] bg-white overflow-hidden shadow-[0_8px_20px_-12px_rgba(0,0,0,0.6)_inset]">
          <LazyImage
            src={product.imagem}
            alt={product.nome}
            aspectRatio={null}
            wrapperClassName="absolute inset-0 w-full h-full grid place-items-center p-2.5 sm:p-3"
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 40vw, 85vw"
            className="
              max-w-full max-h-full w-auto h-auto object-contain pointer-events-none
              transition-transform duration-500 motion-safe:group-hover:scale-[1.03]
            "
          />
        </div>

      </Link>

      {/* MOBILE — bloco inferior em fluxo, altura automática, sem clipping */}
      <div className="sm:hidden relative z-[4] px-3 pt-2.5 pb-3 flex flex-1 flex-col items-center justify-center text-center gap-1 min-w-0">
        <Link to={href} className="min-w-0 w-full">
          <h3
            className="text-primary italic uppercase leading-[0.9] tracking-[-0.01em] text-[24px] sm:text-[28px] break-words"
            style={{ fontFamily: displayFont, fontWeight: 400 }}
          >
            {product.nome}{" "}
            <span className="text-white/90 text-[18px] not-italic ml-1 break-words">
              {product.potencia}
            </span>
          </h3>
        </Link>
        {product.preco && (
          <p className="text-white/80 text-[11px] font-semibold tracking-wide break-words">
            {product.preco}
          </p>
        )}
        <button
          type="button"
          onClick={openModal}
          className="mt-1 inline-flex items-center gap-1.5 bg-primary text-black font-display font-black uppercase tracking-widest text-[9px] px-3 py-1.5 rounded-full shadow-[0_5px_14px_-6px_rgba(248,96,0,0.7)] hover:brightness-110 transition shrink-0"
        >
          Saiba mais
        </button>
      </div>

      {/* DESKTOP — bloco inferior em fluxo com título à esquerda e CTA à direita */}
      <div className="hidden sm:flex relative z-[4] flex-1 items-end justify-between gap-3 px-4 pb-4 pt-3 min-w-0">
        <Link to={href} className="min-w-0 flex-1">
          <h3
            className="text-primary italic uppercase leading-[0.9] tracking-[-0.01em] text-[32px] lg:text-[40px] break-words hyphens-auto"
            style={{ fontFamily: displayFont, fontWeight: 400 }}
          >
            {product.nome}
          </h3>
          <p
            className="mt-1 text-white italic uppercase leading-[0.9] tracking-[-0.01em] text-[28px] lg:text-[36px] break-words"
            style={{
              fontFamily: displayFont,
              fontWeight: 400,
              WebkitTextStroke: "1px #9a9a9a",
            }}
          >
            {product.potencia}
          </p>
        </Link>
        <button
          type="button"
          onClick={openModal}
          className="shrink-0 inline-flex items-center gap-1.5 bg-primary text-black font-display font-black uppercase tracking-widest text-[10px] px-3 py-1.5 rounded-full shadow-[0_5px_14px_-6px_rgba(248,96,0,0.7)] hover:brightness-110 transition"
        >
          Saiba mais
        </button>
      </div>

      <QuickViewModal product={product} open={open} onClose={() => setOpen(false)} />
    </article>
  );
}


export default ProductCard;
