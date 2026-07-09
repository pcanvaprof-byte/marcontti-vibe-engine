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

// Bebas Neue — condensada, pesada, próximo do traço da referência.
const displayFont = "'Bebas Neue', 'Urbanist', sans-serif";

export function ProductCard({ product }: { product: Product }) {
  const href = product.slug ? `/modelos/${product.slug}` : "#";

  return (
    <article
      className="
        group relative w-full h-full
        bg-black overflow-hidden
        rounded-[18px]
        shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)]
        transition-[transform,box-shadow] duration-500 ease-out
        motion-safe:hover:-translate-y-2
        hover:shadow-[0_25px_60px_-20px_rgba(248,96,0,0.45),0_0_0_1px_rgba(248,96,0,0.35)]
      "
    >

      {/* Canto preto superior esquerdo */}
      <span
        aria-hidden
        className="absolute top-0 left-0 w-11 h-11 sm:w-[52px] sm:h-[52px] bg-black rounded-br-[18px] z-[2]"
      />
      {/* Raio pequeno branco sobre o canto preto */}
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
        {/* Palco da imagem — proporção e recorte fixos, para alinhar entre motos de tamanhos diferentes */}
        <div className="absolute inset-x-3 top-12 bottom-24 sm:inset-x-4 sm:top-14 sm:bottom-28 rounded-[12px] bg-white/[0.03] ring-1 ring-white/5 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3">
            <img
              src={product.imagem}
              alt={product.nome}
              loading="lazy"
              decoding="async"
              className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-500 motion-safe:group-hover:scale-105"
              style={{ mixBlendMode: "multiply", filter: "contrast(1.05)" }}
            />
          </div>
        </div>

        {/* Nome + potência sobrepostos no canto inferior esquerdo */}
        <div className="absolute left-4 bottom-3 sm:left-5 sm:bottom-4 z-[4] pointer-events-none">

          <h3
            className="text-primary italic uppercase leading-[0.85] tracking-[-0.01em] text-[40px] sm:text-[48px] lg:text-[56px]"
            style={{ fontFamily: displayFont, fontWeight: 400 }}
          >
            {product.nome}
          </h3>
          <p
            className="mt-1 text-white italic uppercase leading-[0.85] tracking-[-0.01em] text-[36px] sm:text-[44px] lg:text-[52px]"
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
