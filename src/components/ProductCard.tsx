import { Link } from "@tanstack/react-router";
import { Zap, Sparkles, Flame, ArrowRight } from "lucide-react";

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
        bg-white rounded-3xl overflow-hidden
        shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]
        transition-all duration-300 ease-out
        motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.02]
        hover:shadow-[0_20px_45px_-15px_rgba(0,0,0,0.55)]
      "
    >
      {/* decorative corners */}
      <span
        aria-hidden
        className="absolute top-0 left-0 w-16 h-16 bg-black rounded-br-[28px]"
      />
      <span
        aria-hidden
        className="absolute top-2 left-2 text-primary"
      >
        <ArrowRight size={18} strokeWidth={3} />
      </span>
      <span
        aria-hidden
        className="absolute top-4 right-4 text-primary drop-shadow"
      >
        <Zap size={26} strokeWidth={2.5} fill="currentColor" />
      </span>
      <span
        aria-hidden
        className="absolute -bottom-8 -left-6 w-28 h-28 rounded-full bg-primary/80 blur-sm"
      />
      <span
        aria-hidden
        className="absolute -bottom-10 right-8 w-24 h-24 rounded-full bg-black/90"
      />

      {/* badges */}
      <div className="absolute top-3 right-14 z-10 flex flex-col gap-1 items-end">
        {product.novo && (
          <span className="flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
            <Sparkles size={10} /> Novo
          </span>
        )}
        {product.maisVendido && (
          <span className="flex items-center gap-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
            <Flame size={10} className="text-primary" /> Mais vendido
          </span>
        )}
        {product.promocao && (
          <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
            Promoção
          </span>
        )}
      </div>

      <Link
        to={href}
        aria-label={`Ver detalhes de ${product.nome}`}
        className="relative z-[5] flex flex-col h-full"
      >
        {/* image */}
        <div className="relative aspect-[4/3] flex items-center justify-center px-6 pt-10 pb-4 overflow-hidden">
          <img
            src={product.imagem}
            alt={product.nome}
            loading="lazy"
            decoding="async"
            className="max-h-full w-auto object-contain drop-shadow-2xl transition-transform duration-500 motion-safe:group-hover:scale-110"
          />
        </div>

        {/* name / power */}
        <div className="relative z-10 px-5 pb-5 pt-2 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-primary font-black uppercase leading-none text-4xl sm:text-5xl tracking-tight drop-shadow-[0_2px_0_rgba(0,0,0,0.15)]">
              {product.nome}
            </h3>
            <p className="text-white font-black uppercase leading-none text-3xl sm:text-4xl tracking-tight mt-1 [-webkit-text-stroke:1px_black]">
              {product.potencia}
            </p>
          </div>
        </div>

        {product.preco && (
          <div className="relative z-10 px-5 pb-5 -mt-2">
            <p className="text-black/60 text-[10px] uppercase font-bold tracking-widest">
              A partir de
            </p>
            <p className="text-black font-black text-lg">{product.preco}</p>
          </div>
        )}
      </Link>
    </article>
  );
}

export default ProductCard;
