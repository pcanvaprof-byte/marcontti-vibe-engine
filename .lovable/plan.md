# Nova imagem no banner da Oficina (sem cortar textos)

## O que muda

- A imagem enviada (banner "OFICINA ESPECIALIZADA EM SCOOTERS ELÉTRICAS" com os ícones Baterias, Motores, Eletrônica e Pneus) substitui a atual `oficina-klug-v5.jpg` na Home.
- O container passa a usar a proporção real da imagem (~4,4:1) em todos os tamanhos de tela, com a imagem inteira visível — nada de texto ou ícone cortado no celular, tablet ou desktop.
- Saem os recortes atuais (`object-cover`, `object-bottom`, `object-left-top`) e as proporções diferentes por breakpoint que causavam o corte.
- A imagem já traz o botão "VER MODELOS" desenhado nela: o botão real "Ver Modelos" do site é posicionado exatamente sobre essa área (clicável, sem texto duplicado visível) e o botão verde "Simular Financiamento" fica logo abaixo do banner, para não cobrir o conteúdo da arte.

## Detalhes técnicos

- Upload via `lovable-assets create` a partir de `/mnt/user-uploads/`, gerando `src/assets/klug/oficina-klug-v6.jpg.asset.json` (binário não entra no repositório).
- `src/routes/index.tsx`, componente `Hero` (~linhas 641-673): importar o novo pointer, trocar o `src`, aplicar `aspect-[4.4/1]` único, `object-contain object-center`, fundo `bg-black`, `width={1983}` / `height={450}`.
- Manter `loading="lazy"`, `decoding="async"`, `alt` descritivo e o rastreio de analytics existente nos botões.
