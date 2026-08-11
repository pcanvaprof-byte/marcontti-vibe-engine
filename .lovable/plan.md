# Banner da Oficina: tamanho reduzido e botões visíveis

## O que muda

1. **Banner 2x menor**
   O banner da oficina na home deixa de ocupar toda a largura do bloco. Passa a ter metade da largura em desktop (centralizado, máx. ~50% do container) mantendo a proporção ultra-panorâmica da arte, sem cortar o texto "OFICINA ESPECIALIZADA EM SCOOTERS ELÉTRICAS".

2. **Botões visíveis de volta sobre a imagem**
   Hoje existe apenas uma área invisível clicável no canto da arte. Volta um par de botões reais, sobrepostos na imagem:
   - **Ver Modelos** (leva ao catálogo)
   - **Simular Financiamento** (WhatsApp, mesmo comportamento e rastreio atual)

   No desktop ficam alinhados no rodapé direito do banner; no mobile ficam empilhados e centralizados logo abaixo da arte, para nunca cobrirem o texto impresso da imagem.

3. **Responsividade garantida**
   O texto da arte e os botões permanecem visíveis de 320px até desktop largo. Botões com altura mínima de toque de 44px e sem quebra de linha.

## Detalhes técnicos

- Arquivo: `src/routes/index.tsx`, componente `Hero` (bloco do banner da oficina, ~linhas 643-676).
- Substituir o wrapper do banner por um container com `w-full sm:max-w-[50%] mx-auto`, mantendo `aspect-[4.4/1]` e `object-contain object-center`.
- Remover o `<Link>` invisível (hotspot) e inserir um overlay com os dois botões: `absolute` + `bottom-3 right-3` a partir de `sm:`, e em mobile renderizar os botões fora da imagem (fluxo normal, empilhados com `gap-2`).
- Reutilizar `openWhatsAppWithFallback(FINANCE_MSG)` e `buildWhatsAppFallbackUrl` já existentes para o botão de financiamento, preservando o disparo de analytics atual.
- O botão "Simular Financiamento" solto abaixo do bloco deixa de ser duplicado: fica apenas no novo grupo de botões.
- Validar com Playwright em 320/375/430/1280px após a implementação.
