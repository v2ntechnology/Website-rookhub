# 06 — SEO, Performance e Qualidade

## Metadata

- `metadataBase` definido no layout raiz; `title.template` para as páginas internas.
- Toda rota pública exporta `metadata` com `title`, `description`, `openGraph` e `alternates.canonical`.
- `sitemap.ts` e `robots.ts` mantidos junto com as rotas — rota nova entra no sitemap.
- Dados estruturados JSON-LD (`Organization`, `SoftwareApplication`, `Offer`) na landing e em `/precos`.
- Idioma do site: `pt-BR` (`<html lang="pt-BR">`).

## Performance

- Server Components por padrão; JavaScript no client é exceção justificada.
- `next/image` sempre, com `sizes` correto e `priority` apenas na imagem LCP.
- `next/font` para auto-hospedar fontes (zero requisição externa, sem layout shift).
- Metas Core Web Vitals: **LCP < 2.5s, INP < 200ms, CLS < 0.1**.
- `backdrop-filter` (glass) é o efeito mais caro da UI — limite a poucas superfícies.

## Qualidade

- `npm run lint`, `npm run typecheck` e `npm run build` verdes antes de qualquer PR.
- Verificação manual obrigatória em **tema claro e escuro** e em viewport móvel (360px).
- Sem `console.log` em código de produção.
