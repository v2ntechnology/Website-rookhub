# 03 — Arquitetura e Padrões de Código

## Estrutura de pastas

```
src/
├── app/                          # App Router — apenas roteamento e composição
│   ├── layout.tsx                # shell raiz: fontes, tema, metadata base
│   ├── globals.css               # Tailwind v4 + design tokens
│   ├── icon.svg                  # ícone da aba
│   ├── (marketing)/              # grupo de rotas: os parênteses não entram na URL
│   │   ├── page.tsx              → /
│   │   └── precos/page.tsx       → /precos
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
│   ├── marketing/                # seções da landing (hero, pilares, perfis, cta)
│   ├── pricing/                  # tabela de planos e botões de checkout
│   ├── theme/                    # provider e toggle de tema
│   └── ui/                       # primitivos reutilizáveis (button, card, section…)
├── content/                      # conteúdo editorial tipado, fora dos componentes
│   ├── pillars.ts                # os quatro pilares
│   ├── profiles.ts               # o que cada perfil enxerga
│   ├── comparison.ts             # hoje × com o RookHub
│   └── onboarding.ts             # etapas da implantação
├── lib/
│   ├── env.ts                    # leitura validada de variáveis de ambiente
│   ├── utils.ts                  # helper `cn`
│   └── stripe/
│       ├── server.ts             # instância server-only do SDK
│       └── plans.ts              # catálogo de planos (fonte de verdade do produto)
└── types/                        # tipos compartilhados de domínio
    ├── billing.ts                # plano, intervalo de cobrança
    └── marketing.ts              # pilar, perfil, comparação, etapa
```

### Por que o grupo `(marketing)`

Os parênteses organizam sem alterar URL: `(marketing)/page.tsx` continua sendo `/`. No dia em
que existir uma área com layout próprio (central de ajuda, documentação, landing de campanha),
ela entra como grupo irmão e ganha o próprio `layout.tsx` **sem que nenhuma URL atual mude**.

### Por que `content/` e não conteúdo dentro do componente

Texto de marketing é conteúdo editorial, e muda por decisão de produto, não de engenharia.
Mantê-lo dentro do JSX obriga a abrir um componente React para corrigir uma vírgula, e faz o
diff de uma troca de copy parecer mudança de código.

A regra: **componente desenha, `content/` diz o quê.** O componente recebe o dado por prop e não
sabe de onde veio. Foi assim que `pillars-capsules` e `profiles-tabs` já nasceram, e `content/`
apenas fechou o ciclo.

⚠️ **Os tipos desse conteúdo moram em `src/types/`, nunca no componente que os desenha.** Se
`content/` importasse o tipo de `components/`, a dependência ficaria invertida: o dado passaria a
existir em função da tela.

⚠️ **`lib/stripe/plans.ts` não é conteúdo, apesar de carregar copy.** Ele resolve `priceId` no
servidor e é fonte de verdade de produto, então continua em `lib/` (ver regra 05).

### Layout arquivado

Variante de layout que foi substituída mas pode voltar **fica no repositório**, ao lado da que
está em uso, com um cabeçalho dizendo o que é e como trocar de volta. Hoje são
`marketing/pillars-bento.tsx` e `marketing/problem-solution-vs.tsx`.

⚠️ **Não são código morto: não apague.** Uma varredura de importações acusa os dois como órfãos,
porque de fato ninguém os importa. O cabeçalho de cada arquivo é o que distingue arquivo
arquivado de sobra esquecida. Arquivo arquivado é autocontido, com tipos e dados próprios, para
não acoplar o que está vivo ao que está guardado.

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
