import x12Img from "@/assets/motos/x12.jpg.asset.json";
import miaImg from "@/assets/motos/mia.jpg.asset.json";
import gigaImg from "@/assets/motos/giga.jpg.asset.json";
import retImg from "@/assets/motos/ret.jpg.asset.json";
import somaImg from "@/assets/motos/soma.jpg.asset.json";
import jetImg from "@/assets/motos/jet.jpg.asset.json";
import jetmaxImg from "@/assets/motos/jetmax.jpg.asset.json";
import bigtriImg from "@/assets/motos/bigtri.jpg.asset.json";
import joysuperImg from "@/assets/motos/joysuper.jpg.asset.json";
import sofiaImg from "@/assets/motos/sofia.jpg.asset.json";
import miatriImg from "@/assets/motos/miatri.jpg.asset.json";

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
    slug: "mia",
    name: "MIA 1000W",
    tag: "Scooter · Sem CNH",
    price: "R$ 7.990,00",
    priceNumber: 7990,
    range: "até 50 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Scooter compacta e estilosa para o dia a dia urbano — sem CNH.",
    description:
      "A MIA é a escolha certa para quem busca praticidade, economia e estilo no dia a dia. Autopropelida (não exige CNH), leve e silenciosa.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: miaImg.url }],
    specs: [
      { label: "Autonomia", value: "até 50 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V removível" },
      { label: "Habilitação", value: "Não exige CNH" },
      { label: "Categoria", value: "Autopropelido" },
    ],
    features: ["Bateria removível", "Painel digital", "Freios a disco", "LED full"],
  },
  {
    slug: "x12",
    name: "X12 1000W",
    tag: "Scooter Citycoco · Sem CNH",
    price: "R$ 10.490,40",
    priceNumber: 10490.4,
    range: "60–80 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "A citycoco mais vendida — potência, pneus largos e presença.",
    description:
      "A X12 une visual citycoco robusto, pneus largos e potência de 1.000W. Sem CNH, ideal para trabalho, entregas e uso urbano diário.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: x12Img.url }],
    specs: [
      { label: "Autonomia", value: "60–80 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V removível" },
      { label: "Pneus", value: "Largos off-road" },
      { label: "Habilitação", value: "Não exige CNH" },
    ],
    features: ["Pneus largos", "Som Bluetooth", "Alarme com chave", "Bateria removível"],
  },
  {
    slug: "giga",
    name: "GIGA 1000W",
    tag: "Scooter · Sem CNH",
    price: "R$ 10.490,40",
    priceNumber: 10490.4,
    range: "60–80 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Scooter robusta com autonomia estendida para uso diário.",
    description:
      "A GIGA entrega performance urbana com autonomia estendida e conforto. Autopropelida, não exige CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: gigaImg.url }],
    specs: [
      { label: "Autonomia", value: "60–80 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V" },
      { label: "Habilitação", value: "Não exige CNH" },
      { label: "Categoria", value: "Autopropelido" },
    ],
    features: ["Painel digital", "Bagageiro", "LED full", "Alarme"],
  },
  {
    slug: "ret",
    name: "RET 1000W",
    tag: "Moto Elétrica · Sem CNH",
    price: "R$ 8.990,10",
    priceNumber: 8990.1,
    range: "60–80 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Moto elétrica retrô urbana — estilo e economia.",
    description:
      "A RET traz um design retrô moderno com a economia da tração elétrica. Autopropelida, para uso urbano diário sem CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: retImg.url }],
    specs: [
      { label: "Autonomia", value: "60–80 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V" },
      { label: "Habilitação", value: "Não exige CNH" },
      { label: "Categoria", value: "Autopropelido" },
    ],
    features: ["Design retrô", "Painel digital", "Alarme", "Farol LED"],
  },
  {
    slug: "soma",
    name: "SOMA 1000W",
    tag: "Moto Elétrica · Sem CNH",
    price: "R$ 8.540,00",
    priceNumber: 8540,
    range: "60–80 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Moto elétrica compacta, ágil e econômica.",
    description:
      "A SOMA é ideal para quem quer trocar o combustível pela economia elétrica sem abrir mão do design de moto. Sem CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: somaImg.url }],
    specs: [
      { label: "Autonomia", value: "60–80 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V" },
      { label: "Habilitação", value: "Não exige CNH" },
      { label: "Categoria", value: "Autopropelido" },
    ],
    features: ["Painel digital", "Freios a disco", "LED full", "Alarme"],
  },
  {
    slug: "jet",
    name: "JET 1000W",
    tag: "Moto Elétrica · Sem CNH",
    price: "R$ 10.490,40",
    priceNumber: 10490.4,
    range: "60–80 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Moto elétrica esportiva com performance urbana.",
    description:
      "A JET combina design esportivo, performance e a economia total da tração 100% elétrica. Autopropelida, sem CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: jetImg.url }],
    specs: [
      { label: "Autonomia", value: "60–80 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V" },
      { label: "Habilitação", value: "Não exige CNH" },
      { label: "Categoria", value: "Autopropelido" },
    ],
    features: ["Design esportivo", "Painel digital", "Alarme", "LED full"],
  },
  {
    slug: "jet-max",
    name: "JET MAX 1000W",
    tag: "Moto Elétrica · Sem CNH",
    price: "R$ 12.340,00",
    priceNumber: 12340,
    range: "80–100 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Top de linha: mais autonomia, mais conforto, mais estilo.",
    description:
      "A JET MAX é o topo da linha: autonomia estendida, acabamento premium e o silêncio total do motor elétrico. Sem CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: jetmaxImg.url }],
    specs: [
      { label: "Autonomia", value: "80–100 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V dupla" },
      { label: "Habilitação", value: "Não exige CNH" },
      { label: "Categoria", value: "Autopropelido" },
    ],
    features: ["Dupla bateria", "Painel digital", "Alarme premium", "LED full"],
  },
  {
    slug: "big-tri",
    name: "BIG TRI 1000W",
    tag: "Triciclo · Sem CNH",
    price: "R$ 12.490,02",
    priceNumber: 12490.02,
    range: "60–80 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Triciclo elétrico de 3 lugares — estabilidade e capacidade.",
    description:
      "O BIG TRI oferece estabilidade de três rodas, capacidade para até 3 pessoas e ré elétrica. Ideal para famílias, entregas e mobilidade segura.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: bigtriImg.url }],
    specs: [
      { label: "Autonomia", value: "60–80 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V" },
      { label: "Capacidade", value: "3 lugares" },
      { label: "Habilitação", value: "Não exige CNH" },
    ],
    features: ["3 rodas estáveis", "Ré elétrica", "Bagageiro", "Painel digital"],
  },
  {
    slug: "joy-super",
    name: "JOY SUPER 800W",
    tag: "Bicicleta Elétrica · Sem CNH",
    price: "R$ 7.210,00",
    priceNumber: 7210,
    range: "40–60 km",
    speed: "32 km/h",
    power: "800W",
    short: "Bicicleta elétrica leve e prática para o dia a dia.",
    description:
      "A JOY SUPER une design de bicicleta com a assistência de um motor de 800W. Leve, econômica e sem exigência de CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: joysuperImg.url }],
    specs: [
      { label: "Autonomia", value: "40–60 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "800W" },
      { label: "Bateria", value: "Lítio 48V" },
      { label: "Habilitação", value: "Não exige CNH" },
      { label: "Categoria", value: "Bicicleta Elétrica" },
    ],
    features: ["Leve", "Bateria removível", "Painel LCD", "Pedal assistido"],
  },
  {
    slug: "sofia",
    name: "SOFIA 1000W",
    tag: "Scooter · Sem CNH",
    price: "Sob consulta",
    priceNumber: 0,
    range: "50–70 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Design feminino e delicado, sem abrir mão da potência.",
    description:
      "A SOFIA tem design pensado no público feminino, combinando delicadeza, conforto e potência de 1.000W. Consulte disponibilidade.",
    colors: [{ name: "Padrão", hex: "#f4a8a8", image: sofiaImg.url }],
    specs: [
      { label: "Autonomia", value: "50–70 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V" },
      { label: "Habilitação", value: "Não exige CNH" },
      { label: "Categoria", value: "Autopropelido" },
    ],
    features: ["Design feminino", "Painel digital", "Cesto frontal", "LED full"],
  },
];

// Klug Motors - Joinville
export const WHATSAPP_NUMBER = "554734293200";
const WHATSAPP_FALLBACK_DELAY = 1800;

export function getModel(slug: string): Model | undefined {
  return models.find((m) => m.slug === slug);
}

export function buildWhatsAppUrl(message: string, phone = WHATSAPP_NUMBER): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppFallbackUrl(message: string, phone = WHATSAPP_NUMBER): string {
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
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
