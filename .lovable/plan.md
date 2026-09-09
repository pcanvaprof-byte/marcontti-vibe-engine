# Páginas locais para ranquear em Joinville

## O que será criado

Cinco páginas novas no site, cada uma focada em um termo de busca, com texto próprio, lista de modelos do catálogo e caminho claro para WhatsApp/loja:

| Endereço | Título da aba | Título da página |
| --- | --- | --- |
| /scooters-eletricas-joinville | Scooter Elétrica em Joinville \| Concessionária Klug Motors | Scooters Elétricas em Joinville: Modelos SUDU e MotoChefe |
| /motos-eletricas-joinville | Motos Elétricas em Joinville \| Venda e Assistência Klug | Motos Elétricas em Joinville: Economia e Alta Performance |
| /motos-yamaha-joinville | Motos Yamaha em Joinville (0km e Seminovas) \| Klug Motors | Motos Yamaha e Seminovas Revisadas no Boa Vista - Joinville |
| /motinha-eletrica-sem-cnh | Motinha Elétrica sem CNH em Joinville \| Modelos e Preços | Motinhas Elétricas que Não Precisam de CNH em Joinville |
| /triciclos-eletricos-joinville | Triciclos Elétricos em Joinville (Carga e Conforto) \| Klug | Triciclos Elétricos Utilitários e para Melhor Idade em Joinville |

## Conteúdo de cada página

- Título principal exatamente como na tabela, com um texto de abertura mencionando Joinville, o bairro Boa Vista e a oficina própria.
- Grade com os modelos reais do catálogo daquele tipo (puxados do painel, com preço e prévia de parcela já existentes) e link para cada ficha.
- Bloco de motivos para comprar na Klug: loja física, oficina especializada, garantia, financiamento em até 71x, região atendida (Joinville, Araquari, São Francisco do Sul, Jaraguá do Sul).
- 3 a 5 perguntas frequentes específicas do tema (na página sem CNH, a regra do CONTRAN 996/23 que já consta nas fichas).
- Botões de WhatsApp e "Como chegar", além de link para o catálogo filtrado.
- Nada de números ou depoimentos inventados: só informação que já existe no site.

## Ligações internas e indexação

- Links para as cinco páginas no rodapé (bloco "Joinville e região") e nos lugares naturais da home e do catálogo.
- Inclusão das cinco no sitemap.xml.
- Endereço único (canonical), dados do Google (Organization + FAQ + trilha de navegação) em cada página.

## Fora do site (não é alteração de código)

Google Maps, avaliações e cadastro de produtos na ficha do Google precisam ser feitos por vocês no perfil da empresa — posso montar um passo a passo pronto para copiar (nome, categorias, lista de produtos, texto sugerido de avaliação) e entregar em um documento, se quiser.

## Blog

Os três artigos (CNH, custo de recarga, checklist de seminova) ficam para uma etapa seguinte, depois que estas páginas estiverem no ar. Falta definir se o blog será uma seção nova do site.

## Detalhes técnicos

- Uma rota por página em `src/routes/`, reaproveitando `PageLayout`/`SectionCard`, `usePublicModelsLight` e `ProductCard`.
- `head()` por rota: title, description, og:*, canonical próprio, JSON-LD `FAQPage` + `BreadcrumbList` vinculado à Organization do `__root.tsx`.
- Novas entradas em `src/routes/sitemap[.]xml.ts` com prioridade 0.9.
- Filtros de catálogo derivados de `categoria`/`marca`/tag "Sem CNH" já presentes em `src/lib/models.ts`; nenhuma mudança de banco.
