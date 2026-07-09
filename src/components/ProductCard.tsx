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
        transition-transform duration-300 ease-out
        motion-safe:hover:-translate-y-0.5
      "
    >

      {/* Canto preto superior esquerdo */}
      <span
        aria-hidden
        className="absolute top-0 left-0 w-[52px] h-[52px] bg-black rounded-br-[18px] z-[2]"
      />
      {/* Raio pequeno branco sobre o canto preto */}
      <span
        aria-hidden
        className="absolute top-[10px] left-[10px] z-[3] text-white"
      >
        <Zap size={18} strokeWidth={2.5} fill="currentColor" />
      </span>

      {/* Raio grande superior direito (laranja Klug) */}
      <span
        aria-hidden
        className="absolute top-3 right-3 z-[3] text-primary"
        style={{ filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.35))" }}
      >
        <Zap size={32} strokeWidth={2.2} fill="currentColor" />
      </span>

      {/* Pastilha vertical arredondada — borda ESQUERDA */}
      <span
        aria-hidden
        className="absolute left-0 top-[46%] -translate-y-1/2 -translate-x-1/2 w-[38px] h-[64px] rounded-full bg-primary z-[1]"
      />
      {/* Pastilha vertical arredondada — borda DIREITA */}
      <span
        aria-hidden
        className="absolute right-0 top-[54%] -translate-y-1/2 translate-x-1/2 w-[38px] h-[64px] rounded-full bg-primary z-[1]"
      />

      <Link
        to={href}
        aria-label={`Ver detalhes de ${product.nome}`}
        className="relative z-[2] block h-full"
      >
        {/* Imagem — domina o card */}
        <div className="absolute inset-0 flex items-center justify-center px-4 pt-8 pb-14">
          <img
            src={product.imagem}
            alt={product.nome}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full w-auto object-contain transition-transform duration-500 motion-safe:group-hover:scale-105"
          />
        </div>

        {/* Nome + potência sobrepostos no canto inferior esquerdo */}
        <div className="absolute left-5 bottom-4 z-[4] pointer-events-none">
          <h3
            className="text-primary italic uppercase leading-[0.85] tracking-[-0.01em] text-[56px]"
            style={{ fontFamily: displayFont, fontWeight: 400 }}
          >
            {product.nome}
          </h3>
          <p
            className="mt-1 text-white italic uppercase leading-[0.85] tracking-[-0.01em] text-[52px]"
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
