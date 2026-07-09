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
import p10Img from "@/assets/motos/p10.jpg.asset.json";
import popImg from "@/assets/motos/pop.jpg.asset.json";
import x15Img from "@/assets/motos/x15.jpg.asset.json";

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
    range: "até 45 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Scooter compacta e estilosa para o dia a dia urbano — sem CNH.",
    description:
      "A MIA é a escolha certa para quem busca praticidade, economia e estilo. Autopropelida (não exige CNH), leve, silenciosa e resistente a chuva.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: miaImg.url }],
    specs: [
      { label: "Autonomia", value: "até 45 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Recarga", value: "até 5 horas" },
      { label: "Aro", value: "10\" liga leve" },
      { label: "Capacidade", value: "até 180 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Bateria removível", "Painel digital", "Freios a disco hidráulico", "Farol LED full"],
  },
  {
    slug: "x12",
    name: "X12 1000W",
    tag: "Scooter Citycoco · Sem CNH",
    price: "R$ 10.490,40",
    priceNumber: 10490.4,
    range: "até 45 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "A citycoco mais vendida — potência, pneus largos e presença.",
    description:
      "A X12 une visual citycoco robusto, banco duplo com encosto, suspensão dupla e potência de 1.000W. Suporta 2 baterias, chave cartão e alarme com sirene. Sem CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: x12Img.url }],
    specs: [
      { label: "Autonomia", value: "até 45 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível (suporta 2)" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Recarga", value: "até 5 horas" },
      { label: "Aro", value: "10\" liga leve" },
      { label: "Suspensão", value: "Dupla dianteira e traseira" },
      { label: "Capacidade", value: "até 180 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: [
      "Suporta 2 baterias",
      "Chave cartão + alarme com sirene",
      "Banco duplo com encosto",
      "Freio a disco hidráulico",
    ],
  },
  {
    slug: "giga",
    name: "GIGA 1000W",
    tag: "Scooter · Sem CNH",
    price: "R$ 10.490,40",
    priceNumber: 10490.4,
    range: "até 50 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Scooter robusta com conforto de suspensão dupla.",
    description:
      "A GIGA entrega performance urbana com bateria de lítio removível, suspensão dupla e acabamento premium. Autopropelida, não exige CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: gigaImg.url }],
    specs: [
      { label: "Autonomia", value: "até 50 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Recarga", value: "até 5 horas" },
      { label: "Aro", value: "10\"" },
      { label: "Capacidade", value: "até 180 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Suspensão dupla", "Painel digital", "Farol LED full", "Alarme com sirene"],
  },
  {
    slug: "ret",
    name: "RET 1000W",
    tag: "Moto Elétrica · Sem CNH",
    price: "R$ 8.990,10",
    priceNumber: 8990.1,
    range: "até 50 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Moto elétrica retrô urbana — estilo e economia.",
    description:
      "A RET combina design retrô moderno com a economia da tração 100% elétrica. Bateria de lítio removível e acabamento urbano. Sem CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: retImg.url }],
    specs: [
      { label: "Autonomia", value: "até 50 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Recarga", value: "até 5 horas" },
      { label: "Aro", value: "14\"" },
      { label: "Capacidade", value: "até 180 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Design retrô", "Painel digital", "Farol LED", "Alarme com sirene"],
  },
  {
    slug: "soma",
    name: "SOMA 1000W",
    tag: "Moto Elétrica · Sem CNH",
    price: "R$ 8.540,00",
    priceNumber: 8540,
    range: "até 50 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Moto elétrica compacta, ágil e econômica.",
    description:
      "A SOMA é ideal para trocar combustível pela economia elétrica sem abrir mão do design de moto. Bateria removível, freio a disco e alarme. Sem CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: somaImg.url }],
    specs: [
      { label: "Autonomia", value: "até 50 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Recarga", value: "até 5 horas" },
      { label: "Aro", value: "14\"" },
      { label: "Capacidade", value: "até 180 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Painel digital", "Freio a disco hidráulico", "Farol LED full", "Alarme com sirene"],
  },
  {
    slug: "jet",
    name: "JET 1000W",
    tag: "Moto Elétrica · Sem CNH",
    price: "R$ 10.490,40",
    priceNumber: 10490.4,
    range: "até 55 km",
    speed: "32 km/h",
    power: "1.000W (pico 3.000W)",
    short: "Moto elétrica esportiva com performance urbana.",
    description:
      "A JET combina design esportivo, motor com pico de 3.000W (excelente em subidas) e a economia total da tração 100% elétrica. Sem CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: jetImg.url }],
    specs: [
      { label: "Autonomia", value: "até 55 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W nominal (pico 3.000W)" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Recarga", value: "até 5 horas" },
      { label: "Aro", value: "12\" dianteiro" },
      { label: "Capacidade", value: "até 180 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Pico 3.000W p/ subidas", "Freio a disco hidráulico", "Farol LED full", "Alarme com sirene"],
  },
  {
    slug: "jet-max",
    name: "JET MAX 1000W",
    tag: "Moto Elétrica · Sem CNH",
    price: "R$ 12.340,00",
    priceNumber: 12340,
    range: "até 60 km",
    speed: "32 km/h",
    power: "1.000W (pico 3.000W)",
    short: "Top de linha: bateria 30Ah, marcha ré, baú 31L e chave NFC.",
    description:
      "A JET MAX é o topo da linha: bateria de 30Ah, motor com pico de 3.000W, marcha ré, baú traseiro de 31L, chave pulseira com NFC e acabamento premium. Sem CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: jetmaxImg.url }],
    specs: [
      { label: "Autonomia", value: "até 60 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W nominal (pico 3.000W)" },
      { label: "Bateria", value: "Lítio 30Ah 60V removível" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Recarga", value: "até 5 horas" },
      { label: "Aro", value: "12\" dianteiro" },
      { label: "Baú traseiro", value: "31 litros" },
      { label: "Capacidade", value: "até 180 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Marcha ré", "Chave pulseira com NFC", "Baú traseiro 31L", "Suspensão dupla"],
  },
  {
    slug: "big-tri",
    name: "BIG TRI 1000W",
    tag: "Triciclo · Sem CNH",
    price: "R$ 12.490,02",
    priceNumber: 12490.02,
    range: "até 50 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Triciclo elétrico de 3 lugares — estabilidade e capacidade.",
    description:
      "O BIG TRI oferece estabilidade de três rodas, capacidade para até 3 pessoas e marcha ré elétrica. Ideal para famílias, entregas e mobilidade segura.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: bigtriImg.url }],
    specs: [
      { label: "Autonomia", value: "até 50 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Capacidade", value: "3 lugares · até 200 kg" },
      { label: "Marcha ré", value: "Sim (elétrica)" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["3 rodas estáveis", "Marcha ré elétrica", "Bagageiro traseiro", "Painel digital"],
  },
  {
    slug: "joy-super",
    name: "JOY SUPER 800W",
    tag: "Bicicleta Elétrica · Sem CNH",
    price: "R$ 7.210,00",
    priceNumber: 7210,
    range: "até 40 km",
    speed: "32 km/h",
    power: "800W",
    short: "Bicicleta elétrica leve e prática para o dia a dia.",
    description:
      "A JOY SUPER une o design de bicicleta com um motor de 800W. Leve, econômica, com bateria removível e assistência pedal. Sem exigência de CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: joysuperImg.url }],
    specs: [
      { label: "Autonomia", value: "até 40 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "800W" },
      { label: "Bateria", value: "Lítio 48V removível" },
      { label: "Aro", value: "20\"" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Habilitação", value: "Não exige CNH" },
    ],
    features: ["Bateria removível", "Painel LCD", "Pedal assistido", "Farol LED"],
  },
  {
    slug: "sofia",
    name: "SOFIA 1000W",
    tag: "Scooter · Sem CNH",
    price: "Sob consulta",
    priceNumber: 0,
    range: "até 50 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Design feminino e delicado, sem abrir mão da potência.",
    description:
      "A SOFIA tem design pensado no público feminino, combinando delicadeza, conforto e potência de 1.000W. Consulte disponibilidade.",
    colors: [{ name: "Padrão", hex: "#f4a8a8", image: sofiaImg.url }],
    specs: [
      { label: "Autonomia", value: "até 50 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível" },
      { label: "Carregador", value: "Turbo 5A bivolt 110/220V" },
      { label: "Aro", value: "10\"" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Design feminino", "Painel digital", "Cesto frontal", "Farol LED full"],
  },
  {
    slug: "mia-tri",
    name: "MIA TRI 800W",
    tag: "Triciclo · Sem CNH",
    price: "R$ 11.990,80",
    priceNumber: 11990.8,
    range: "até 45 km",
    speed: "25 km/h",
    power: "800W",
    short: "Triciclo compacto e estável — ideal para mobilidade reduzida e passeios.",
    description:
      "O MIA TRI une a estabilidade de três rodas ao design compacto da linha MIA. Perfeito para quem busca segurança extra, mobilidade e conforto no dia a dia — sem exigir CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: miatriImg.url }],
    specs: [
      { label: "Autonomia", value: "até 45 km" },
      { label: "Velocidade máx.", value: "25 km/h" },
      { label: "Potência", value: "800W" },
      { label: "Bateria", value: "Lítio 20Ah 60V removível" },
      { label: "Carregador", value: "Bivolt 110/220V" },
      { label: "Rodas", value: "3 rodas — estabilidade extra" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["3 rodas estáveis", "Bagageiro traseiro", "Painel digital", "Ré elétrica"],
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
