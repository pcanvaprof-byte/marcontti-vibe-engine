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
import suduA12Img from "@/assets/motos/sudu-a12.png.asset.json";
import suduA10Img from "@/assets/motos/sudu-a10.png.asset.json";
import suduA3PlusImg from "@/assets/motos/sudu-a3-plus.png.asset.json";
import suduA4Img from "@/assets/motos/sudu-a4.png.asset.json";
import suduA5Img from "@/assets/motos/sudu-a5.png.asset.json";
import suduA6Img from "@/assets/motos/sudu-a6.png.asset.json";
import suduA13TImg from "@/assets/motos/sudu-a13t.png.asset.json";
import yamahaNeosImg from "@/assets/motos/yamaha-neos.jpg.asset.json";
import yamahaE01Img from "@/assets/motos/yamaha-e01.jpg.asset.json";

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
  gallery?: string[];
};

/** Build a gallery for a model: explicit gallery > color variants > single image. */
export function getGallery(m: Model): string[] {
  if (m.gallery && m.gallery.length > 0) return m.gallery;
  const fromColors = m.colors.map((c) => c.image).filter(Boolean);
  return fromColors.length > 0 ? fromColors : [];
}

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
    price: "Consultar disponibilidade",
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
    slug: "p10",
    name: "P10 500W",
    tag: "Patinete Elétrico · Sem CNH",
    price: "R$ 4.360,00",
    priceNumber: 4360,
    range: "20–25 km",
    speed: "32 km/h",
    power: "500W",
    short: "Patinete dobrável com banco — leve, prático e econômico.",
    description:
      "O P10 é um patinete elétrico dobrável com banco ajustável, ideal para deslocamentos urbanos rápidos. Freio a disco nas duas rodas, suspensão dupla e faróis LED. Suporta até 120 kg — sem CNH.",
    colors: [{ name: "Preto", hex: "#1a1a1a", image: p10Img.url }],
    specs: [
      { label: "Autonomia", value: "20–25 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "500W (cubo traseiro)" },
      { label: "Bateria", value: "Lítio 48V 11Ah" },
      { label: "Carregador", value: "Bivolt 110/220V" },
      { label: "Recarga", value: "até 5 horas" },
      { label: "Aro", value: "10\"" },
      { label: "Peso", value: "16 kg (dobrável)" },
      { label: "Capacidade", value: "até 120 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Dobrável e portátil", "Banco ajustável e removível", "Suspensão dupla", "Freio a disco dianteiro e traseiro"],
  },
  {
    slug: "pop",
    name: "POP 800W",
    tag: "Bicicleta Elétrica · Sem CNH",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "até 40 km",
    speed: "32 km/h",
    power: "800W",
    short: "Bicicleta elétrica urbana com bateria removível e cesto frontal.",
    description:
      "A POP 800W é uma bicicleta urbana resistente, prática e sustentável. Bateria de lítio removível 48V 15Ah, aros 24\", cesto dianteiro, alarme antifurto e cartão NFC. Suporta até 150 kg — sem CNH.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: popImg.url }],
    specs: [
      { label: "Autonomia", value: "até 40 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "800W" },
      { label: "Bateria", value: "Lítio 48V 15Ah removível" },
      { label: "Carregador", value: "Bivolt 110/220V" },
      { label: "Recarga", value: "4 a 6 horas" },
      { label: "Aro", value: "24\"" },
      { label: "Modo", value: "Aceleração ou pedal assistido" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Bateria removível com alça", "Cesta dianteira + garupa", "Alarme antifurto + NFC", "3 níveis de velocidade"],
  },
  {
    slug: "x15",
    name: "X15 3000W",
    tag: "Triciclo Elétrico · Com CNH",
    price: "R$ 13.491,00",
    priceNumber: 13491,
    range: "40–45 km",
    speed: "75 km/h",
    power: "3.000W",
    short: "Triciclo top de linha — 3.000W, 75 km/h, marcha ré e alarme.",
    description:
      "O X15 3000W é o triciclo elétrico mais potente da linha — motor 3.000W, velocidade até 75 km/h e bateria de lítio 60V 25Ah removível (suporta 2). Freios hidráulicos a disco, marcha ré, alarme com partida remota e suspensão dupla. Produto homologado — exige CNH e emplacamento.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: x15Img.url }],
    specs: [
      { label: "Autonomia", value: "40–45 km" },
      { label: "Velocidade máx.", value: "75 km/h" },
      { label: "Potência", value: "3.000W" },
      { label: "Bateria", value: "Lítio 60V 25Ah removível (suporta 2)" },
      { label: "Carregador", value: "Bivolt 110/220V" },
      { label: "Recarga", value: "5 a 6 horas" },
      { label: "Aro", value: "10\"" },
      { label: "Peso", value: "≈ 50 kg (com bateria)" },
      { label: "Capacidade", value: "até 180 kg" },
      { label: "Habilitação", value: "Exige CNH · homologado p/ emplacamento" },
    ],
    features: ["Marcha ré", "Freios hidráulicos a disco", "Alarme com partida remota", "Suporte p/ 2 baterias"],
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
  // ==================== SUDU ====================
  {
    slug: "sudu-a12",
    name: "SUDU A12",
    tag: "Scooter SUDU · Sem CNH",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "até 55 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Scooter SUDU A12 com NFC, Bluetooth e cruise control.",
    description:
      "SUDU A12 combina tecnologia embarcada (NFC, Bluetooth, Cruise Control) com bateria 60V 24Ah de lítio e capacidade de 150 kg. Design urbano e desempenho ideal para o dia a dia.",
    colors: [{ name: "Verde", hex: "#1f8a4c", image: suduA12Img.url }],
    specs: [
      { label: "Autonomia", value: "até 55 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V 24Ah" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Tecnologia", value: "NFC · Bluetooth · Cruise Control" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["NFC", "Bluetooth", "Cruise Control", "Painel digital"],
  },
  {
    slug: "sudu-a10",
    name: "SUDU A10 1000W",
    tag: "Scooter SUDU · Sem CNH",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "até 50 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "SUDU A10 — scooter urbana com bateria de lítio 48V 24Ah.",
    description:
      "SUDU A10 é a opção equilibrada da linha: leve, econômica e com autonomia de até 50 km. Suporta até 140 kg.",
    colors: [{ name: "Padrão", hex: "#7f8c8d", image: suduA10Img.url }],
    specs: [
      { label: "Autonomia", value: "até 50 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 48V 24Ah" },
      { label: "Capacidade", value: "até 140 kg" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Bateria removível", "Painel digital", "Freios a disco"],
  },
  {
    slug: "sudu-a3-plus",
    name: "SUDU A3+ 1000W",
    tag: "Scooter SUDU · Sem CNH",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "até 60 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "SUDU A3+ com NFC e autonomia de até 60 km.",
    description:
      "SUDU A3+ traz destravamento por NFC e bateria de lítio 60V 20Ah para uma autonomia estendida de até 60 km.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: suduA3PlusImg.url }],
    specs: [
      { label: "Autonomia", value: "até 60 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V 20Ah" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Tecnologia", value: "NFC" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["NFC", "Painel digital", "Freios a disco"],
  },
  {
    slug: "sudu-a4",
    name: "SUDU A4 1000W",
    tag: "Scooter SUDU · Sem CNH",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "até 60 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "SUDU A4 — design urbano e NFC integrado.",
    description:
      "SUDU A4 oferece bateria 60V 20Ah de lítio, autonomia de até 60 km e capacidade de 150 kg. Ideal para deslocamentos diários.",
    colors: [{ name: "Padrão", hex: "#2c3e50", image: suduA4Img.url }],
    specs: [
      { label: "Autonomia", value: "até 60 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V 20Ah" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Tecnologia", value: "NFC" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["NFC", "Painel digital", "Freios a disco"],
  },
  {
    slug: "sudu-a5",
    name: "SUDU A5 1000W",
    tag: "Scooter SUDU · Sem CNH",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "até 60 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "SUDU A5 com NFC, Bluetooth e bateria 60V 24Ah.",
    description:
      "SUDU A5 integra conectividade Bluetooth e NFC com bateria de lítio 60V 24Ah, entregando até 60 km de autonomia.",
    colors: [{ name: "Padrão", hex: "#c0392b", image: suduA5Img.url }],
    specs: [
      { label: "Autonomia", value: "até 60 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V 24Ah" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Tecnologia", value: "NFC · Bluetooth" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["NFC", "Bluetooth", "Painel digital"],
  },
  {
    slug: "sudu-a6",
    name: "SUDU A6 1000W",
    tag: "Scooter SUDU · Sem CNH",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "até 65 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "SUDU A6 — topo de linha com Hill Assist e Bluetooth.",
    description:
      "SUDU A6 é a scooter mais completa da linha: assistente de subida (Hill Assist), Bluetooth, NFC, bateria de lítio 60V 24Ah e autonomia de até 65 km.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: suduA6Img.url }],
    specs: [
      { label: "Autonomia", value: "até 65 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V 24Ah" },
      { label: "Capacidade", value: "até 150 kg" },
      { label: "Tecnologia", value: "NFC · Bluetooth · Hill Assist" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["Hill Assist", "NFC", "Bluetooth", "Painel digital"],
  },
  {
    slug: "sudu-a13t",
    name: "SUDU A13T 1000W",
    tag: "Triciclo SUDU · 3 lugares",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "até 55 km",
    speed: "32 km/h",
    power: "1.000W",
    short: "Triciclo SUDU A13T — 3 lugares e capacidade de 186 kg.",
    description:
      "SUDU A13T é o triciclo elétrico para famílias e transporte utilitário. Comporta até 3 lugares, capacidade de 186 kg, NFC e bateria 60V 24Ah.",
    colors: [{ name: "Padrão", hex: "#1a1a1a", image: suduA13TImg.url }],
    specs: [
      { label: "Autonomia", value: "até 55 km" },
      { label: "Velocidade máx.", value: "32 km/h" },
      { label: "Potência", value: "1.000W" },
      { label: "Bateria", value: "Lítio 60V 24Ah" },
      { label: "Capacidade", value: "até 186 kg" },
      { label: "Lugares", value: "3 lugares" },
      { label: "Tecnologia", value: "NFC" },
      { label: "Habilitação", value: "Não exige CNH (CONTRAN 996/23)" },
    ],
    features: ["3 lugares", "NFC", "3 rodas estáveis", "Ré elétrica"],
  },
  // ==================== YAMAHA ====================
  {
    slug: "yamaha-neos",
    name: "Yamaha Neo's",
    tag: "Scooter Elétrica Yamaha",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "até 68 km",
    speed: "45 km/h",
    power: "2.500W",
    short: "Yamaha Neo's — scooter elétrica premium para o dia a dia urbano.",
    description:
      "A Yamaha Neo's é uma scooter 100% elétrica com bateria removível de lítio, ideal para o trânsito urbano com o DNA de qualidade Yamaha.",
    colors: [{ name: "Azul", hex: "#1e40af", image: yamahaNeosImg.url }],
    specs: [
      { label: "Autonomia", value: "até 68 km" },
      { label: "Velocidade máx.", value: "45 km/h" },
      { label: "Potência", value: "2.500W" },
      { label: "Bateria", value: "Lítio removível" },
      { label: "Habilitação", value: "Exige CNH" },
    ],
    features: ["Bateria removível", "Painel digital", "Freios a disco", "Farol LED"],
  },
  {
    slug: "yamaha-e01",
    name: "Yamaha E01",
    tag: "Maxi Scooter Elétrica",
    price: "Consultar disponibilidade",
    priceNumber: 0,
    range: "até 100 km",
    speed: "100 km/h",
    power: "8.100W",
    short: "Yamaha E01 — maxi scooter elétrica com performance superior.",
    description:
      "A Yamaha E01 é a maxi scooter elétrica da Yamaha, equivalente a uma 125cc a combustão. Potência, autonomia e conforto para deslocamentos maiores.",
    colors: [{ name: "Prata", hex: "#94a3b8", image: yamahaE01Img.url }],
    specs: [
      { label: "Autonomia", value: "até 100 km" },
      { label: "Velocidade máx.", value: "100 km/h" },
      { label: "Potência", value: "8.100W (≈ 125cc)" },
      { label: "Bateria", value: "Lítio integrada" },
      { label: "Recarga rápida", value: "Sim" },
      { label: "Habilitação", value: "Exige CNH" },
    ],
    features: ["Recarga rápida", "Modo de condução", "TFT digital", "ABS"],
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
