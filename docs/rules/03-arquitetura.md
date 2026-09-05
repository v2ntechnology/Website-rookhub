# 03 — Arquitetura e Padrões de Código

## Estrutura de pastas

```
src/
├── app/                          # App Router, apenas roteamento e composição
│   ├── layout.tsx                # shell raiz: fontes, tema, metadata base
│   ├── globals.css               # Tailwind v4 + design tokens
│   ├── (marketing)/              # grupo de rotas: os parênteses não entram na URL
│   │   ├── page.tsx              → /
│   │   ├── precos/page.tsx       → /precos
│   │   └── contato/page.tsx      → /contato
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── archive/                  # variantes substituídas, guardadas de propósito
│   ├── layout/                   # header, footer, navegação
│   ├── marketing/                # seções da landing (hero, pilares, perfis, cta)
│   ├── pricing/                  # vitrine de planos e comparativo
│   ├── theme/                    # provider e toggle de tema
│   └── ui/                       # primitivos reutilizáveis (button, card, section…)
├── content/                      # conteúdo editorial tipado, fora dos componentes
│   ├── pillars.ts                # os quatro pilares
│   ├── profiles.ts               # o que cada perfil enxerga
│   ├── comparison.ts             # hoje × com o RookHub
│   ├── onboarding.ts             # etapas da implantação
│   ├── contact.ts                # canais de contato
│   ├── footer-headline.ts        # palavras da manchete do rodapé
│   ├── faq.ts                    # perguntas frequentes de /precos
│   └── plans.ts                  # catálogo comercial: copy, preços e features
├── lib/
│   ├── env.ts                    # leitura de variáveis de ambiente
│   └── utils.ts                  # helper `cn`
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

⚠️ **`content/plans.ts` é conteúdo, e por isso mora aqui.** Ele viveu em `lib/stripe/` enquanto
resolvia `priceId` no servidor, o que fazia dele regra de negócio. Sem a integração, sobrou o
catálogo comercial: copy, preços e features. Se a cobrança voltar, o que volta para `lib/` é a
resolução de preço, não a copy.

### Layout arquivado

Variante que foi substituída mas pode voltar **fica no repositório**, em
`components/archive/`, com um cabeçalho dizendo o que é e como trocar de volta.

⚠️ **Não é código morto: não apague.** Uma varredura de importações acusa a pasta inteira como
órfã, porque de fato ninguém a importa, e esse é o estado esperado. A regra é a própria pasta:
**se está em `archive/`, é guardado; se está fora, é usado.** Antes, o que distinguia arquivo
guardado de sobra esquecida era só um comentário no topo, invisível para quem lia a árvore.

Arquivo arquivado é autocontido, com tipos e dados próprios, para não acoplar o que está vivo ao
que está guardado. Ele continua compilando, e é isso que garante que a variante ainda funciona.
Componente novo nunca nasce ali: só chega o que já esteve em produção.

O inventário do que está guardado, e por quê, vive em
[`src/components/archive/README.md`](../../src/components/archive/README.md).

## Server vs Client Components

- **Server Component é o padrão.** Só marque `"use client"` quando o componente precisar de
  estado, efeito, evento de browser ou API do navegador.
- Empurre o `"use client"` para a folha da árvore: uma seção server pode renderizar um
  botão client, nunca o contrário.
- Segredo, SDK server-side e acesso a banco vivem apenas no servidor. Hoje o site não tem nenhum
  dos três: ele é estático e não fala com serviço externo.
- Marque módulos sensíveis com `import "server-only"`.

## TypeScript

- `strict: true`. Proibido `any`, `as unknown as`, `@ts-ignore` e `!` não-nulo para calar o
  compilador. Se precisar de escape, use `unknown` + narrowing explícito.
- Tipos de domínio (`Plan`, `BillingInterval`, …) ficam em `src/types` ou no módulo dono.
- Props de página/layout usam os tipos globais do Next 16: `PageProps<"/rota">` e
  `LayoutProps<"/rota">`.
- Lembre-se: no Next 16 `params` e `searchParams` são `Promise`, sempre `await`.

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

O site é publicado como **export estático** na Cloudflare (`npm run build:static`, saída em
`out/`). Decisão de produto: só o institucional vai ao ar por enquanto.

- **Nenhuma página pode depender de servidor**: sem `cookies()`, sem `searchParams` em Server
  Component, sem Server Action, sem Route Handler. `searchParams` só via `useSearchParams()` em
  Client Component dentro de `<Suspense>`.
- ⚠️ Desde 05/09/2026 **todas as rotas são estáticas**, e o `next build` sem `BUILD_TARGET` produz
  o mesmo conteúdo do export. A distinção entre os dois alvos sobrou só para gerar `out/`.
  Enquanto o Stripe existiu, o build completo carregava três Route Handlers nomeados
  `route.api.ts`, que entravam em `pageExtensions` apenas fora do export.
- Rotas de metadado (`sitemap.ts`, `robots.ts`) exportam `dynamic = "force-static"`.
- Detalhes do deploy: [`deploy-cloudflare.md`](../deploy-cloudflare.md).
