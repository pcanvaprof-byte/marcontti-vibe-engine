# Seletor de cor + escolha das imagens da página de vendas

## Objetivo

No painel admin, poder escolher **por cor em estoque** qual imagem aparece em cada bloco da página de vendas, com miniatura de confirmação antes de salvar.

## Como vai funcionar no admin

Novo painel "Imagens da página de vendas", logo abaixo de "Variantes de Cores e Imagens":

1. **Seletor de cor** no topo: pastilhas com o hex + nome de cada variante (as marcadas "Em falta" aparecem esmaecidas e avisam que não serão exibidas no site). O painel edita a cor selecionada.
2. Para a cor escolhida, uma lista de **slots nomeados** exatamente como os blocos da página:
   - Hero (imagem principal)
   - Pronta para qualquer terreno
   - Tecnologia e conforto (imagem A e imagem B)
   - Comodidade — Praticidade que acompanha a sua rotina
   - Conectividade
   - Modernidade — Painel 100% digital (imagem A, B e C)
3. Cada slot mostra a miniatura atual e abre um seletor com as imagens disponíveis (galeria da cor, se houver, senão a galeria do modelo) para trocar; há opção "Automático" que volta ao comportamento atual.
4. Aviso quando um slot não tem imagem definida e cairá no fallback automático, para o admin confirmar antes de salvar.

## Como reflete no site

A página do produto passa a usar a imagem definida para o slot da cor selecionada; se não houver definição, mantém a ordem automática da galeria como hoje. Trocar de cor troca todas as imagens dos blocos junto.

## Detalhes técnicos

- Sem migração: as escolhas ficam em `models.colors[i].sections`, um objeto `{ hero, terreno, tecnologia_a, tecnologia_b, comodidade, conectividade, modernidade_a, modernidade_b, modernidade_c }` com URLs (chave ausente = automático). `colors` já é `jsonb`.
- `src/hooks/useDbModels.ts`: propagar `sections` no tipo `DbModel["colors"]` e em `dbToModel` (limpar quando a cor está `hidden`).
- `src/lib/models.ts`: adicionar `sections?` opcional ao tipo de cor do `Model`.
- `src/components/YamahaProductPage.tsx`: helper `pick(slot, ...fallbacks)` que lê `variant.sections?.[slot]` e substitui os usos atuais nas linhas de `activeGallery[n]` (540, 585-586, 616, 673, 711-713, 742) e no `heroImg` (101). Fallbacks atuais preservados.
- `src/routes/_authenticated/admin.tsx`: novo sub-componente do editor (estado local `activeColorIdx`), reutilizando as miniaturas/galeria já carregadas no formulário; grava via `set("colors", ...)`.
- Nenhuma alteração no editor JSON avançado, que continua funcionando.
