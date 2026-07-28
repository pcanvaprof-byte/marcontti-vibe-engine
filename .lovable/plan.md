O que vou ajustar:

- Padronizar os cards de imagem das seções "Modos de Condução", "Comodidade", "Conectividade", "Modernidade" e "Tecnologia" para terem a mesma altura em cada breakpoint (mobile, tablet, desktop).
- Aplicar `items-stretch` aos grids de duas colunas para que o card de imagem cresça igualmente ao texto ao lado, mantendo alinhamento vertical.
- Definir alturas fixas consistentes nos containers (`min-h` + `max-h`) para que imagens com proporções diferentes não quebrem o grid.
- Manter a seção "Baterias" com altura uniforme entre os 3 cards, já que está correta, mas ajustar se necessário para manter consistência com o novo padrão.
- Ajustar `gap` e `padding` entre seções para não criar pulos no scroll após as imagens ficarem menores.
- Validar visualmente nos breakpoints 360px, 430px, 768px, 1024px e 1440px.

Arquivos envolvidos:
- `src/components/YamahaProductPage.tsx` (principal)
- `src/components/ProductCard.tsx` (se aplicável ao catálogo)