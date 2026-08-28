# 03 — Arquitetura e Padrões de Código

## Estrutura de pastas

```
src/
├── app/                          # App Router — apenas roteamento e composição
│   ├── layout.tsx                # shell raiz: fontes, tema, metadata base
│   ├── page.tsx                  # landing page
│   ├── globals.css               # Tailwind v4 + design tokens
│   ├── precos/page.tsx           # tabela de planos
│   ├── checkout/
│   │   ├── sucesso/page.tsx      # retorno de sucesso do Stripe
│   │   └── cancelado/page.tsx    # retorno de cancelamento
│   ├── api/stripe/
│   │   ├── checkout/route.api.ts # cria Checkout Session
│   │   ├── portal/route.api.ts   # cria sessão do Customer Portal
│   │   └── webhook/route.api.ts  # recebe e verifica eventos do Stripe
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── checkout/                 # retorno do Stripe (client)
│   ├── layout/                   # header, footer, navegação
│   ├── marketing/                # seções da landing (hero, features, cta)
│   ├── pricing/                  # tabela de planos e botões de checkout
│   ├── theme/                    # provider e toggle de tema
│   └── ui/                       # primitivos reutilizáveis (button, glass-card…)
├── lib/
│   ├── env.ts                    # leitura validada de variáveis de ambiente
│   ├── utils.ts                  # helper `cn`
│   └── stripe/
│       ├── server.ts             # instância server-only do SDK
│       └── plans.ts              # catálogo de planos (fonte de verdade do produto)
└── types/                        # tipos compartilhados de domínio
```

## Server vs Client Components

- **Server Component é o padrão.** Só marque `"use client"` quando o componente precisar de
  estado, efeito, evento de browser ou API do navegador.
- Empurre o `"use client"` para a folha da árvore: uma seção server pode renderizar um
  botão client, nunca o contrário.
- Segredos, SDK do Stripe server-side e acesso a banco vivem apenas no servidor.
- Marque módulos sensíveis com `import "server-only"`.

## TypeScript

- `strict: true`. Proibido `any`, `as unknown as`, `@ts-ignore` e `!` não-nulo para calar o
  compilador. Se precisar de escape, use `unknown` + narrowing explícito.
- Tipos de domínio (`Plan`, `BillingInterval`, …) ficam em `src/types` ou no módulo dono.
- Props de página/layout usam os tipos globais do Next 16: `PageProps<"/rota">` e
  `LayoutProps<"/rota">`.
- Lembre-se: no Next 16 `params` e `searchParams` são `Promise` — sempre `await`.

## Componentes

- Um componente por arquivo, nome em `kebab-case.tsx`, export nomeado.
- Composição acima de props booleanas: prefira `<Card><CardHeader/></Card>` a `variant="x"`
  com dez ramificações.
- Classes utilitárias sempre via `cn()` para permitir override por quem consome.
- Nada de valores mágicos de cor no JSX: use os tokens definidos em `globals.css`.

## Dados e erros

- `fetch` no servidor, com cache explícito quando fizer sentido.
- Route Handlers retornam JSON com status HTTP correto e mensagem de erro genérica ao
  cliente; o detalhe vai para o log do servidor, nunca para a resposta.

## Dois alvos de build

O site é publicado hoje como **export estático** na Cloudflare (`npm run build:static`,
saída em `out/`) — decisão de produto: só o institucional vai ao ar por enquanto.

- Os Route Handlers do Stripe são nomeados **`route.api.ts`**, e não `route.ts`. A extensão
  `api.ts` só entra em `pageExtensions` no build completo (`npm run build`); no build estático
  ela fica de fora, porque `output: "export"` não suporta POST nem leitura do request.
- Consequência: **nenhuma página pode depender de servidor** (sem `cookies()`, sem
  `searchParams` em Server Component, sem Server Action). `searchParams` só via
  `useSearchParams()` em Client Component dentro de `<Suspense>`.
- Rotas de metadado (`sitemap.ts`, `robots.ts`) exportam `dynamic = "force-static"`.
- Detalhes do deploy: [`docs/deploy-cloudflare.md`](../../docs/deploy-cloudflare.md).
