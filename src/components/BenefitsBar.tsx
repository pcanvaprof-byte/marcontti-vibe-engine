import { CreditCard, Wallet, BadgePercent, Store, ShieldCheck, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type Benefit = {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
};

const DEFAULT_BENEFITS: Benefit[] = [
  { id: "financ",   icon: CreditCard,   title: "Financiamento",       desc: "em até 36x (WhatsApp)" },
  { id: "cartao",   icon: Wallet,       title: "Pagamento Facilitado", desc: "em até 21x no cartão" },
  { id: "pix",      icon: BadgePercent, title: "10% OFF no PIX",       desc: "ganhe desconto na hora!" },
  { id: "nacional", icon: Store,        title: "Fabricação Nacional",  desc: "scooters produzidas no Brasil" },
  { id: "oficial",  icon: ShieldCheck,  title: "Loja Oficial",         desc: "Unidade de Joinville" },
];

function useInViewOnce<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { setInView(true); io.disconnect(); }
      }),
      { threshold: 0.15 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

export function BenefitsBar({ items = DEFAULT_BENEFITS }: { items?: Benefit[] }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();

  return (
    <section aria-label="Benefícios" className="bg-black border-b border-white/5">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-8 py-5 sm:py-6">
        <ul
          className="
            flex md:grid md:grid-cols-3 lg:grid-cols-5
            gap-6 md:gap-x-6 md:gap-y-5
            overflow-x-auto md:overflow-visible
            snap-x snap-mandatory md:snap-none
            scroll-px-4
            [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          "
        >
          {items.map((b, i) => (
            <li
              key={b.id}
              className="snap-start shrink-0 basis-[75%] sm:basis-[45%] md:basis-auto md:min-w-0"
              style={
                inView
                  ? { animation: `fade-in 0.5s ease-out ${i * 80}ms both` }
                  : { opacity: 0 }
              }
            >
              <div className="group flex items-center gap-3 md:justify-center md:text-left h-full">
                <span
                  className="
                    shrink-0 w-11 h-11 rounded-xl grid place-items-center
                    bg-primary/10 text-primary
                    transition-all duration-300
                    group-hover:bg-primary group-hover:text-primary-foreground
                    motion-safe:group-hover:scale-110
                  "
                >
                  <b.icon size={20} strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold text-sm leading-tight break-words">
                    {b.title}
                  </p>
                  <p className="text-white/55 text-xs leading-snug mt-0.5 break-words">
                    {b.desc}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default BenefitsBar;
