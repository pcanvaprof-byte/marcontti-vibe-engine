# Trocar o banner da Oficina sem cortar os textos

## O que muda

- A imagem enviada passa a ser o banner da seção "Oficina Especializada" na Home (hoje usa `oficina-klug-v5.jpg`).
- A faixa superior da imagem (logo Klug + barra de busca + Atendimento/Localização/Contato) é recortada, porque duplica o cabeçalho real do site. Fica apenas o banner da oficina, com o texto "OFICINA ESPECIALIZADA EM SCOOTERS ELÉTRICAS" e os 4 ícones (Baterias, Motores, Eletrônica, Pneus).
- A proporção do container passa a acompanhar exatamente a proporção da imagem recortada (~3,1:1), em todos os tamanhos de tela. Assim nada de texto ou ícone é cortado no celular, tablet ou desktop.
- Os recortes atuais (`object-cover`, `object-bottom`, `object-left-top`) e o zoom no hover saem: a imagem sempre aparece inteira.
- Os botões "Ver Modelos" e "Simular Financiamento" continuam funcionando, reposicionados no canto inferior direito com um leve fundo escuro para não cobrir o texto impresso na imagem.

## Detalhes técnicos

- Recorte da faixa do cabeçalho e upload via `lovable-assets create`, gerando `src/assets/klug/oficina-klug-v6.jpg.asset.json`; o arquivo original não fica no repositório.
- `src/routes/index.tsx` (componente `Hero`, ~linhas 641-673): importar o novo pointer, trocar o `src`, usar uma única `aspect-[31/10]` (sem variação por breakpoint), `object-contain object-center` e `bg-black`.
- Manter `loading="lazy"`, `decoding="async"` e o `alt` descritivo; atualizar `width`/`height` para as dimensões reais recortadas.
