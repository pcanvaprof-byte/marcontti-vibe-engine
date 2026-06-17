import x13Vermelho from "@/assets/x13-vermelho.jpg";
import x13Cinza from "@/assets/x13-cinza.jpg";
import x13Preto from "@/assets/x13-preto.jpg";
import harleyPreto from "@/assets/harley-preto.jpg";
import harleyAzul from "@/assets/harley-azul.jpg";
import m4Branco from "@/assets/m4-branco.jpg";
import m4Cinza from "@/assets/m4-cinza.jpg";
import m4Preto from "@/assets/m4-preto.jpg";
import etrekPreto from "@/assets/etrek-preto.jpg";
import etrekAzul from "@/assets/etrek-azul.jpg";
import etrekVermelho from "@/assets/etrek-vermelho.jpg";
import etrekVerde from "@/assets/etrek-verde.jpg";
import fontainePreto from "@/assets/fontaine-preto.jpg";
import fontaineBranco from "@/assets/fontaine-branco.jpg";
import fontaineRose from "@/assets/fontaine-rose.jpg";
import eko7Vermelho from "@/assets/eko7-vermelho.jpg";
import eko7Preto from "@/assets/eko7-preto.jpg";
import eko7Branco from "@/assets/eko7-branco.jpg";
import eko7Verde from "@/assets/eko7-verde.jpg";
import eko7Cinza from "@/assets/eko7-cinza.jpg";
import tricicloVermelho from "@/assets/triciclo-vermelho.jpg";
import tricicloBranco from "@/assets/triciclo-branco.jpg";
import tricicloCinza from "@/assets/triciclo-cinza.jpg";
import tricicloPreto from "@/assets/triciclo-preto.jpg";

export type ColorVariant = { name: string; hex: string; image: string };

export type Model = {
  slug: string;
  name: string;
  tag: string;
  price: string;
  priceNumber: number;
  range: string;
  speed: string;
  power: string;
  short: string;
  description: string;
  colors: ColorVariant[];
  specs: { label: string; value: string }[];
  features: string[];
};

export const models: Model[] = [
  {
    slug: "fontaine",
    name: "Fontaine",
    tag: "Compacto",
    price: "R$ 5.290",
    priceNumber: 5290,
    range: "até 40 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "A scooter compacta e elegante para o dia a dia urbano.",
    description:
      "Compacta, leve e silenciosa, a Fontaine é a escolha ideal para quem busca praticidade no trânsito urbano sem abrir mão do estilo.",
    colors: [
      { name: "Preto", hex: "#1a1a1a", image: fontainePreto },
      { name: "Branco", hex: "#f5f5f5", image: fontaineBranco },
      { name: "Rosé", hex: "#f4a8a8", image: fontaineRose },
    ],
    specs: [
      { label: "Autonomia", value: "até 40 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio removível 48V" },
      { label: "Tempo de carga", value: "4–6 horas" },
      { label: "Habilitação", value: "Não exige CNH" },
    ],
    features: ["Bateria removível", "Cesto frontal", "Painel digital", "Freios a disco"],
  },
  {
    slug: "eko7",
    name: "EKO-7",
    tag: "Autopropelido",
    price: "R$ 6.790",
    priceNumber: 6790,
    range: "até 80 km",
    speed: "32 km/h",
    power: "800W",
    short: "Autonomia estendida com design urbano contemporâneo.",
    description:
      "A EKO-7 entrega autonomia de até 80 km com performance silenciosa, perfeita para deslocamentos longos no dia a dia.",
    colors: [
      { name: "Vermelho", hex: "#c8242b", image: eko7Vermelho },
      { name: "Preto", hex: "#1a1a1a", image: eko7Preto },
      { name: "Branco", hex: "#f5f5f5", image: eko7Branco },
      { name: "Verde Água", hex: "#9adfd4", image: eko7Verde },
      { name: "Cinza", hex: "#7a7a7a", image: eko7Cinza },
    ],
    specs: [
      { label: "Autonomia", value: "até 80 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "800W" },
      { label: "Bateria", value: "Lítio dupla 48V" },
      { label: "Tempo de carga", value: "5–7 horas" },
      { label: "Habilitação", value: "Não exige CNH" },
    ],
    features: ["Dupla bateria", "Cesto frontal", "Painel LCD", "Alarme antifurto"],
  },
  {
    slug: "triciclo",
    name: "Triciclo",
    tag: "3 Rodas",
    price: "R$ 9.990",
    priceNumber: 9990,
    range: "até 80 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Estabilidade de 3 rodas com conforto e capacidade de carga.",
    description:
      "O Triciclo elétrico Marcontti combina estabilidade, conforto e capacidade de carga — ideal para entregas, trabalho e mobilidade segura.",
    colors: [
      { name: "Vermelho", hex: "#c8242b", image: tricicloVermelho },
      { name: "Branco", hex: "#f5f5f5", image: tricicloBranco },
      { name: "Cinza", hex: "#7a7a7a", image: tricicloCinza },
      { name: "Preto", hex: "#1a1a1a", image: tricicloPreto },
    ],
    specs: [
      { label: "Autonomia", value: "até 80 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V" },
      { label: "Capacidade", value: "Bi-place com encosto" },
      { label: "Habilitação", value: "Não exige CNH" },
    ],
    features: ["3 rodas estáveis", "Banco com encosto", "Cesto frontal", "Ré elétrica"],
  },
  {
    slug: "x13",
    name: "X-13",
    tag: "Citycoco",
    price: "R$ 10.490",
    priceNumber: 10490,
    range: "60–80 km",
    speed: "50 km/h",
    power: "1.000W",
    short: "Estilo citycoco com pneus largos e presença na rua.",
    description:
      "A X-13 é a citycoco que une visual robusto, pneus largos e potência de 1.000W para encarar a cidade com personalidade.",
    colors: [
      { name: "Vermelho", hex: "#a8201c", image: x13Vermelho },
      { name: "Cinza Brilhoso", hex: "#7a7a7a", image: x13Cinza },
      { name: "Preto", hex: "#1a1a1a", image: x13Preto },
    ],
    specs: [
      { label: "Autonomia", value: "60–80 km" },
      { label: "Velocidade máx.", value: "50 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V removível" },
      { label: "Pneus", value: "Largos off-road" },
      { label: "Habilitação", value: "Categoria A" },
    ],
    features: ["Pneus largos", "Som Bluetooth", "Painel digital", "Alarme com chave"],
  },
  {
    slug: "harley",
    name: "Harley",
    tag: "Chopper",
    price: "R$ 10.990",
    priceNumber: 10990,
    range: "60–80 km",
    speed: "50 km/h",
    power: "1.000W",
    short: "Postura chopper com a alma silenciosa de uma elétrica.",
    description:
      "A Harley elétrica Marcontti traduz a postura chopper em silêncio total, autonomia urbana e zero combustível.",
    colors: [
      { name: "Preto Fosco", hex: "#1a1a1a", image: harleyPreto },
      { name: "Azul Australiana", hex: "#1e3a8a", image: harleyAzul },
    ],
    specs: [
      { label: "Autonomia", value: "60–80 km" },
      { label: "Velocidade máx.", value: "50 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V" },
      { label: "Postura", value: "Chopper / pés à frente" },
      { label: "Habilitação", value: "Categoria A" },
    ],
    features: ["Design chopper", "Painel digital", "Farol de LED", "Pneus largos"],
  },
  {
    slug: "m4",
    name: "M4",
    tag: "Urbano",
    price: "R$ 10.990",
    priceNumber: 10990,
    range: "60–80 km",
    speed: "50 km/h",
    power: "1.000W",
    short: "Motocicleta urbana elétrica para o dia a dia da cidade.",
    description:
      "A M4 é a motocicleta elétrica ideal para a cidade — ágil, silenciosa e econômica, com performance para o uso diário.",
    colors: [
      { name: "Branco", hex: "#f5f5f5", image: m4Branco },
      { name: "Cinza", hex: "#7a7a7a", image: m4Cinza },
      { name: "Preto", hex: "#1a1a1a", image: m4Preto },
    ],
    specs: [
      { label: "Autonomia", value: "60–80 km" },
      { label: "Velocidade máx.", value: "50 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V" },
      { label: "Freios", value: "Disco dianteiro e traseiro" },
      { label: "Habilitação", value: "Categoria A" },
    ],
    features: ["Painel digital", "LED full", "Alarme", "Porta-objetos"],
  },
  {
    slug: "etrek",
    name: "E-Trek",
    tag: "Trabalho",
    price: "R$ 8.990",
    priceNumber: 8990,
    range: "até 60 km",
    speed: "50 km/h",
    power: "1.000W",
    short: "Robusta para trabalho urbano e entregas leves.",
    description:
      "A E-Trek foi desenhada para quem trabalha em movimento — robusta, com autonomia confiável e baixíssimo custo por km rodado.",
    colors: [
      { name: "Azul Metálico", hex: "#1e4a8a", image: etrekAzul },
      { name: "Preto", hex: "#1a1a1a", image: etrekPreto },
      { name: "Vermelho", hex: "#c81e1e", image: etrekVermelho },
      { name: "Verde", hex: "#3d5c3a", image: etrekVerde },
    ],
    specs: [
      { label: "Autonomia", value: "até 60 km" },
      { label: "Velocidade máx.", value: "50 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V" },
      { label: "Uso", value: "Trabalho / entregas" },
      { label: "Habilitação", value: "Categoria A" },
    ],
    features: ["Estrutura reforçada", "Bagageiro", "Painel digital", "Alarme"],
  },
];

export const WHATSAPP_NUMBER = "5547989019584";
const WHATSAPP_FALLBACK_DELAY = 1800;

export function getModel(slug: string): Model | undefined {
  return models.find((m) => m.slug === slug);
}

export function buildWhatsAppUrl(message: string, phone = WHATSAPP_NUMBER): string {
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppFallbackUrl(message: string, phone = WHATSAPP_NUMBER): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppWithFallback(message: string, phone = WHATSAPP_NUMBER): void {
  if (typeof window === "undefined") return;

  const primaryUrl = buildWhatsAppUrl(message, phone);
  const fallbackUrl = buildWhatsAppFallbackUrl(message, phone);
  let fallbackTimer = window.setTimeout(() => {
    if (document.visibilityState === "visible") window.location.assign(fallbackUrl);
  }, WHATSAPP_FALLBACK_DELAY);

  const clearFallback = () => {
    window.clearTimeout(fallbackTimer);
    fallbackTimer = 0;
  };

  window.addEventListener("pagehide", clearFallback, { once: true });
  window.addEventListener("blur", clearFallback, { once: true });
  window.location.assign(primaryUrl);
}
