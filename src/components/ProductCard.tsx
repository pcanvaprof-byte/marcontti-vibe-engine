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
        bg-black overflow-visible
        rounded-[18px]
        shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)]
        transition-[transform,box-shadow] duration-500 ease-out
        motion-safe:hover:-translate-y-2
        hover:shadow-[0_25px_60px_-20px_rgba(248,96,0,0.45),0_0_0_1px_rgba(248,96,0,0.35)]
      "
    >
      {/* Raio pequeno branco no canto superior esquerdo */}
      <span
        aria-hidden
        className="absolute top-2 left-2 sm:top-[10px] sm:left-[10px] z-[3] text-white"
      >
        <Zap className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} fill="currentColor" />
      </span>

      {/* Raio grande superior direito (laranja Klug) */}
      <span
        aria-hidden
        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-[3] text-primary"
        style={{ filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.35))" }}
      >
        <Zap className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.2} fill="currentColor" />
      </span>

      {/* Pastilha vertical arredondada — borda ESQUERDA */}
      <span
        aria-hidden
        className="absolute left-0 top-[46%] -translate-y-1/2 -translate-x-1/2 w-8 h-14 sm:w-[38px] sm:h-[64px] rounded-full bg-primary z-[1]"
      />
      {/* Pastilha vertical arredondada — borda DIREITA */}
      <span
        aria-hidden
        className="absolute right-0 top-[54%] -translate-y-1/2 translate-x-1/2 w-8 h-14 sm:w-[38px] sm:h-[64px] rounded-full bg-primary z-[1]"
      />

      <Link
        to={href}
        aria-label={`Ver detalhes de ${product.nome}`}
        className="relative z-[2] block h-full"
      >
        {/* Palco branco — moto pode estourar as bordas para simular "saindo" do card */}
        <div className="absolute inset-x-3 top-3 bottom-[132px] sm:inset-x-4 sm:top-4 sm:bottom-28 rounded-[12px] bg-white overflow-visible shadow-[0_10px_25px_-15px_rgba(0,0,0,0.6)_inset]">
          <div className="absolute inset-0 flex items-end justify-center overflow-visible">
            <LazyImage
              src={product.imagem}
              alt={product.nome}
              aspectRatio={null}
              wrapperClassName="h-full items-end"
              className="
                w-auto object-contain pointer-events-none
                h-[135%] sm:h-[145%]
                -translate-y-[6%] sm:-translate-y-[8%]
                drop-shadow-[0_20px_25px_rgba(0,0,0,0.35)]
                transition-transform duration-500 motion-safe:group-hover:scale-[1.06] motion-safe:group-hover:-translate-y-[10%]
              "
            />
          </div>
        </div>


        {/* MOBILE — bloco inferior com título, preço e CTA centralizados vertical e horizontalmente */}
        <div className="sm:hidden absolute inset-x-0 bottom-0 h-[128px] z-[4] px-4 pb-3 flex flex-col items-center justify-center gap-1.5 text-center">
          <h3
            className="text-primary italic uppercase leading-[0.85] tracking-[-0.01em] text-[34px]"
            style={{ fontFamily: displayFont, fontWeight: 400 }}
          >
            {product.nome} <span className="text-white/90 text-[24px] not-italic ml-1">{product.potencia}</span>
          </h3>
          {product.preco && (
            <p className="text-white/80 text-[12px] font-semibold tracking-wide">
              {product.preco}
            </p>
          )}
          <button
            type="button"
            onClick={openModal}
            className="mt-1 inline-flex items-center gap-1.5 bg-primary text-black font-display font-black uppercase tracking-widest text-[10px] px-4 py-2 rounded-full shadow-[0_6px_16px_-6px_rgba(248,96,0,0.7)] hover:brightness-110 transition"
          >
            Saiba mais
          </button>
        </div>

        {/* DESKTOP — sobreposição no canto inferior esquerdo (mantido) */}
        <div className="hidden sm:block absolute left-5 bottom-4 z-[4] pointer-events-none">
          <h3
            className="text-primary italic uppercase leading-[0.85] tracking-[-0.01em] text-[48px] lg:text-[56px]"
            style={{ fontFamily: displayFont, fontWeight: 400 }}
          >
            {product.nome}
          </h3>
          <p
            className="mt-1 text-white italic uppercase leading-[0.85] tracking-[-0.01em] text-[44px] lg:text-[52px]"
            style={{
              fontFamily: displayFont,
              fontWeight: 400,
              WebkitTextStroke: "1px #9a9a9a",
            }}
          >
            {product.potencia}
          </p>
        </div>

      </Link>

    </article>
  );
}

export default ProductCard;
