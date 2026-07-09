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
        group relative w-full h-full
        bg-white overflow-hidden
        rounded-[18px]
        border border-black/5
        transition-transform duration-300 ease-out
        motion-safe:hover:-translate-y-0.5
      "
    >
      {/* Top-left black corner */}
      <span
        aria-hidden
        className="absolute top-0 left-0 w-[54px] h-[54px] bg-black rounded-br-[22px] z-[2]"
      />
      {/* Small yellow bolt sitting on the black corner */}
      <span
        aria-hidden
        className="absolute top-[10px] left-[10px] z-[3] text-primary drop-shadow-[0_1px_0_rgba(0,0,0,0.4)]"
      >
        <Zap size={20} strokeWidth={2.5} fill="currentColor" />
      </span>

      {/* Prominent yellow bolt top-right */}
      <span
        aria-hidden
        className="absolute top-3 right-3 z-[3] text-primary"
        style={{ filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.35))" }}
      >
        <Zap size={34} strokeWidth={2.2} fill="currentColor" />
      </span>

      {/* Yellow half-circle bleeding off LEFT edge (mid) */}
      <span
        aria-hidden
        className="absolute left-0 top-[45%] -translate-y-1/2 -translate-x-1/2 w-[70px] h-[70px] rounded-full bg-primary z-[1]"
      />
      {/* Yellow half-circle bleeding off RIGHT edge (mid) */}
      <span
        aria-hidden
        className="absolute right-0 top-[55%] -translate-y-1/2 translate-x-1/2 w-[70px] h-[70px] rounded-full bg-primary z-[1]"
      />

      {/* Optional small badges — top center-ish, discreet */}
      {(product.novo || product.maisVendido || product.promocao) && (
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-[3] flex gap-1">
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
      )}

      <Link
        to={href}
        aria-label={`Ver detalhes de ${product.nome}`}
        className="relative z-[2] block h-full"
      >
        {/* Product image — dominates the card */}
        <div className="absolute inset-0 flex items-center justify-center p-6 pt-10">
          <img
            src={product.imagem}
            alt={product.nome}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full w-auto object-contain transition-transform duration-500 motion-safe:group-hover:scale-105"
          />
        </div>

        {/* Text overlay at bottom-left, sitting ON TOP of the image */}
        <div className="absolute left-5 bottom-4 z-[4] pointer-events-none">
          <h3
            className="text-primary font-black italic uppercase leading-[0.85] tracking-tight text-[54px]"
            style={{ fontFamily: "var(--font-display, inherit)" }}
          >
            {product.nome}
          </h3>
          <p
            className="mt-1 text-white font-black italic uppercase leading-[0.85] tracking-tight text-[48px]"
            style={{ WebkitTextStroke: "1.5px #1a1a1a" }}
          >
            {product.potencia}
          </p>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
