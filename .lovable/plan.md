## Fase 0 — Substituir Test-Ride por "Simular Financiamento"

- Remover todas as menções a Test-Ride (header desktop/mobile, hero, footer, seção com formulário no `index.tsx`, botões em `modelos.$slug.tsx`, links, mensagens WhatsApp).
- Deletar `src/components/TestRideForm.tsx`.
- Criar `src/components/FinanciamentoForm.tsx` — formulário curto (nome, telefone, modelo de interesse, entrada estimada, prazo desejado) validado com Zod, que envia via WhatsApp com mensagem pré-formatada.
- Novo CTA principal em todo o site: **"Simular Financiamento"** (pill no header + botões hero + seção dedicada).
- Atualizar `privacidade.tsx` trocando "test-ride" por "simulação de financiamento / atendimento comercial".

## Fase 1 — Confiança e Institucional (recomendações 1, 2, 5)

- **Página `/sobre`** (`src/routes/sobre.tsx`): história da Klug, missão, foto da loja (placeholder), endereço, CNPJ, horário, mapa embed do Google Maps.
- **Seção de Prova Social** na home: bloco de depoimentos (3–4 cards estáticos, marcados como "exemplos ilustrativos" até você fornecer os reais), avaliação Google (link), contador de motos entregues.
- **Página `/garantia`** (`src/routes/garantia.tsx`): política de garantia da bateria e do motor, prazo, o que cobre, assistência técnica, peças de reposição.
- Adicionar CNPJ + endereço no rodapé de todas as páginas.

## Fase 2 — Conversão comercial (recomendações 4, 7, 8)

- **Página `/financiamento`** (`src/routes/financiamento.tsx`): tabela simulada de parcelas por modelo, condições, parceiros bancários (placeholders), FAQ curto sobre CDC/CNH, CTA "Simular no WhatsApp".
- **Página `/comparar`** (`src/routes/comparar.tsx`): tabela lado a lado dos modelos (autonomia, velocidade, preço, peso, bateria, garantia) com seletor de até 3 modelos.
- **Página `/contato`** (`src/routes/contato.tsx`): formulário curto + WhatsApp + mapa + horário + dados da loja, com JSON-LD `LocalBusiness` para SEO local.

## Fase 3 — Suporte e SEO de conteúdo (recomendações 3, 6)

- **Página `/faq`** (`src/routes/faq.tsx`): 10–15 perguntas (precisa CNH? autonomia real? carrega em tomada comum? garantia da bateria? é homologada Denatran? seguro? etc.) com JSON-LD `FAQPage`.
- **Blog stub** (`src/routes/blog.index.tsx` + 3 posts de exemplo em `blog.$slug.tsx`): estrutura pronta com MDX simples ou dados estáticos, para você preencher depois. Se preferir pular, aviso e deixo só o link no menu.

## Fase 4 — Qualidade técnica (recomendações 9, 10, 11, 12)

- **Performance**: adicionar `loading="lazy"` em imagens fora do hero, `fetchpriority="high"` no hero, `decoding="async"` global. Verificar imagens grandes e sinalizar as que precisam ser convertidas pra WebP (não faço batch converter automaticamente — te aviso quais).
- **Acessibilidade**: auditar contraste do laranja em fundos claros, adicionar `alt` descritivo real em imagens de moto, garantir foco visível (`:focus-visible` ring) em todos interativos.
- **Analytics + Pixel**: adicionar helper `src/lib/analytics.ts` que só dispara GA4/Meta Pixel se o usuário aceitou "Analytics" / "Marketing" no `CookieConsent`. Eventos: `click_whatsapp`, `submit_financiamento`, `view_modelo`. Precisa dos IDs (GA4 Measurement ID + Pixel ID) — se não tiver ainda, deixo os hooks prontos e desabilitados.
- **Open Graph image**: gerar uma imagem OG 1200×630 com a marca Klug + moto elétrica, adicionar como `og:image` na home e derivar por modelo nas páginas `modelos.$slug`.

## Menu de navegação atualizado (após tudo)

Home · Modelos · Comparar · Financiamento · Garantia · Sobre · FAQ · Contato

## Pontos que preciso confirmar antes de começar

1. **Dados reais da empresa**: endereço, CNPJ, telefone, horário, link do Google Maps, link de avaliações Google. Sem isso, uso placeholders marcados como `[EDITAR]`.
2. **Depoimentos**: você tem clientes reais que autorizaram? Se não, uso mockups genéricos rotulados como "exemplos ilustrativos" até você trocar.
3. **Financiamento**: quer valores simulados baseados em uma taxa fictícia (ex.: "a partir de X/mês em 24x") ou prefere só o CTA "Consultar condições no WhatsApp" sem números?
4. **Blog**: quer que eu crie a estrutura + 3 posts stub, ou pulo e deixo pra depois?
5. **Analytics**: já tem GA4 Measurement ID e Meta Pixel ID? (Se não, preparo desabilitado.)
6. **Ordem**: rodo Fase 0 → 1 → 2 → 3 → 4 sequencial, ou você quer priorizar alguma antes?

Quando você responder essas 6, eu executo tudo.