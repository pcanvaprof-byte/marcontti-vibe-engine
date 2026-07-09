import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

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

export function ProductCard({ product }: { product: Product }) {
  const href = product.slug ? `/modelos/${product.slug}` : "#";

  return (
    <article
      className="
        group relative w-full h-full flex flex-col
        bg-[#fafafa] rounded-2xl overflow-hidden
        border border-black/5
        transition-transform duration-300 ease-out
        motion-safe:hover:-translate-y-0.5
      "
    >
      {/* small black corner (top-left) */}
      <span
        aria-hidden
        className="absolute top-0 left-0 w-8 h-8 bg-black rounded-br-2xl z-[2]"
      />

      {/* subtle decorative circles */}
      <span
        aria-hidden
        className="absolute -bottom-4 -left-3 w-10 h-10 rounded-full bg-primary/70 z-[1]"
      />
      <span
        aria-hidden
        className="absolute -bottom-5 right-6 w-9 h-9 rounded-full bg-black/85 z-[1]"
      />

      {/* small bolt */}
      <span aria-hidden className="absolute top-3 right-3 text-primary z-[3]">
        <Zap size={14} strokeWidth={2.5} fill="currentColor" />
      </span>

      {/* badges — small, top */}
      <div className="absolute top-2.5 left-10 z-[3] flex gap-1">
        {product.novo && (
          <span className="bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
            Novo
          </span>
        )}
        {product.maisVendido && (
          <span className="bg-black text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
            Mais vendido
          </span>
        )}
        {product.promocao && (
          <span className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
            Promoção
          </span>
        )}
      </div>

      <Link
        to={href}
        aria-label={`Ver detalhes de ${product.nome}`}
        className="relative z-[2] flex flex-col h-full"
      >
        {/* image — ~65% of card height, centered */}
        <div className="relative flex-[0_0_65%] flex items-center justify-center px-8 pt-10 pb-6">
          <img
            src={product.imagem}
            alt={product.nome}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full w-auto object-contain transition-transform duration-500 motion-safe:group-hover:scale-105"
          />
        </div>

        {/* text block — generous spacing, 8px scale */}
        <div className="relative z-[2] flex-1 flex flex-col justify-end px-6 pb-8 pt-2">
          <h3 className="text-primary font-black uppercase leading-[0.9] text-5xl sm:text-6xl tracking-tight">
            {product.nome}
          </h3>
          <p
            className="mt-3 text-white font-black uppercase leading-none text-2xl sm:text-3xl tracking-tight"
            style={{ WebkitTextStroke: "1px #4b4b4b" }}
          >
            {product.potencia}
          </p>

          {product.preco && (
            <div className="mt-6">
              <p className="text-black/40 text-[9px] uppercase font-semibold tracking-widest">
                A partir de
              </p>
              <p className="text-black/70 font-semibold text-xs mt-1">{product.preco}</p>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
