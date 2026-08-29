# Instruções para Claude — RookHub Website-rookhub (pt-BR)

> **Fonte única de verdade.** Toda regra deste repositório vive em `.claude/`. É proibido criar
> `.cursor/`, `.codex/`, `.github/copilot-instructions.md` ou qualquer outra pasta paralela de
> instruções para IA.
>
> Este arquivo é o operacional: o que você precisa saber **antes** de escrever a primeira linha.
> Para o detalhe de um assunto, a regra numerada correspondente é mais completa e **vence** em caso
> de divergência. A `memoria.md` guarda o **porquê** e o que já custou retrabalho.

## Comportamento

- Responder sempre em pt-BR, direto e objetivo, resumo breve no fim.
- **Nunca usar travessão (`—`)** em texto de interface, README, documentação, comentário de código
  ou mensagem de commit (decisão do usuário em 15/08/2026, vale nos quatro projetos). Quebrar a
  frase em duas, ou usar dois-pontos e parênteses.
- Fazer só o que foi pedido: sem refatoração, limpeza ou melhoria não solicitada.
- Este repositório é o **site público e a assinatura**, não o painel. Se a tarefa envolve login,
  frota, viagem ou dado de operação, o projeto certo é `../System-web`, `../System-mobile` ou
  `../Backend-web`.
- Na primeira tarefa de código ou infra da sessão, rodar Grep `^#{2,3} ` em `.claude/memoria.md`:
  lista as seções e as linhas, custa pouco. Ler a seção que casar com a tarefa **e sempre
  `Gotchas`**; nunca o arquivo inteiro. Depois, a regra numerada do assunto.
- ⚠️ **Este é o Next 16.** As Request APIs são assíncronas (`headers()`, `cookies()`, `params` e
  `searchParams` retornam `Promise`) e `middleware.ts` virou `proxy.ts`. Consultar
  `node_modules/next/dist/docs/` antes de assumir qualquer API: a documentação empacotada tem
  precedência sobre memória prévia.

## Código

- Stack: Next.js 16 (App Router), React 19, TypeScript estrito, Tailwind v4 em CSS,
  `next-themes` e Stripe. Detalhe e versões em [rules/01-stack.md](rules/01-stack.md).
- ⚠️ **Não existe Prettier nem suíte de testes aqui**, ao contrário do `../System-web`. Não alegar
  cobertura inexistente nem procurar `npm run format`.
- Arquivos em `kebab-case.tsx`, componentes em `PascalCase`, **um componente por arquivo**.
- **Exportação nomeada.** `export default` só em `src/app/`, porque o App Router exige. Hoje não há
  nenhuma exceção a isso no projeto.
- Nomes de código, arquivos e pastas em **inglês**; texto de interface em **pt-BR**.
- TypeScript estrito: sem `any`, sem `@ts-ignore`, sem `!` para calar o compilador. Precisa de
  escape? `unknown` com narrowing explícito.
- Classes utilitárias sempre por `cn()` (`@/lib/utils`), para quem consome poder sobrescrever.

### Onde cada arquivo mora

A árvore normativa está em [rules/03-arquitetura.md](rules/03-arquitetura.md). O resumo:

| O que você está escrevendo | Onde |
| --- | --- |
| Página institucional nova | `src/app/(marketing)/<rota>/page.tsx`, e entra no `sitemap.ts` |
| Bloco de seção da landing | `src/components/marketing/` |
| Planos e cobrança | `src/components/pricing/` |
| Cabeçalho, rodapé, navegação | `src/components/layout/` |
| Primitivo reutilizável | `src/components/ui/` |
| **Texto, lista ou tabela de conteúdo** | `src/content/`, **nunca** dentro do JSX |
| Regra de negócio, integração, helper | `src/lib/` |
| Tipo usado por mais de um módulo | `src/types/` |
| Token, classe de tipografia, estilo | `src/app/globals.css` |
| Imagem ou logotipo | `public/imgs/` |
| Convenção nova | `.claude/rules/`, **nunca** só no README |

- **`app/` só tem roteamento.** O que está lá vira URL. Componente que não é rota não mora ali.
- **Componente desenha, `content/` diz o quê.** O componente recebe o dado por prop e não sabe de
  onde veio. Os tipos desse conteúdo ficam em `src/types/`, nunca no componente, senão a
  dependência se inverte.
- ⚠️ **`lib/stripe/plans.ts` não é conteúdo**, apesar de carregar copy: ele resolve `priceId` no
  servidor e é fonte de verdade de produto.

### Server e client

- **Server Component é o padrão.** `"use client"` só com estado, efeito, evento de navegador ou API
  do navegador, e sempre empurrado para a folha da árvore.
- Hoje são doze ilhas de interação, e a lista serve de referência do que justifica virar client:
  `theme-provider`, `theme-toggle`, `back-to-top`, `header-actions`, `mobile-nav`, `reveal`,
  `pillars-capsules`, `profiles-tabs`, `pricing-table`, `checkout-button`, `session-reference` e o
  arquivado `vs-scroller`.
- Segredo e SDK server-side do Stripe existem **apenas** no servidor. Marcar módulo sensível com
  `import "server-only"`.

### Estilo: o que o projeto faz diferente

- ⚠️ **Tipografia é classe própria, não utilitário do Tailwind.** Use `.type-display-hero`,
  `.type-display-lg`, `.type-display-section`, `.type-display-editorial`, `.type-headline-lg`,
  `.type-headline-md`, `.type-body-lg` e `.type-label-md`. Elas já trazem família, peso,
  `line-height`, `letter-spacing` e `clamp()` responsivo. Escrever `text-4xl font-bold` no lugar
  quebra a escala e some com o responsivo.
- ⚠️ **Cor literal nunca no componente.** Os tokens ficam em `:root` e `.dark` no `globals.css`, e
  o `@theme inline` os transforma em utilitário. Todo token existe nos **dois** temas.
- ⚠️ **A altura da barra fixa é o token `--header-h`**, nunca o número. `main`, o hero e o topo de
  `/precos` dependem dele.
- ⚠️ **A barra de rolagem é oculta por decisão de projeto** (`@layer base`). A rolagem continua
  funcionando; só o indicador some. É por isso que o botão "voltar ao topo" existe: ele compensa a
  pista perdida. Não repor `scrollbar-width`.
- ⚠️ **A navegação são duas, não uma barra adaptativa.** Acima de `md` valem as ilhas flutuantes
  (`site-header` + `header-actions`); abaixo, `mobile-nav`. Mexeu em uma, confira a outra.
- Classe de seção vive em `@layer components` do `globals.css`, agrupada por bloco (`.capsule*`,
  `.ptab*`, `.cmp*`, `.price-*`, `.editorial-*`). Bloco novo entra lá, não em estilo inline.
- ⚠️ **A fase atual é wireframe em escala de cinza.** Nenhuma cor cromática entra enquanto durar a
  validação. As exceções autorizadas estão tabeladas em
  [rules/04-design-system.md](rules/04-design-system.md), e uso novo exige linha nova lá.
- Revisar a mudança nos **dois temas** e em viewport móvel de 360px é parte do pronto.

### Build, rotas e deploy

- Dois alvos a partir do mesmo código: `npm run build` (completo, com as rotas do Stripe) e
  `npm run build:static` (export em `out/`, o que vai ao ar na Cloudflare).
- ⚠️ **Os handlers do Stripe se chamam `route.api.ts`, e isso é mecanismo.** A extensão só entra em
  `pageExtensions` no build completo; no estático fica de fora, porque `output: "export"` não
  suporta POST nem leitura do request.
- Consequência: **nenhuma página pode depender de servidor**. Sem `cookies()`, sem `searchParams`
  em Server Component, sem Server Action. `searchParams` só via `useSearchParams()` em Client
  Component dentro de `<Suspense>`. Rota de metadado exporta `dynamic = "force-static"`.
- **Rota nova entra no `sitemap.ts`**, que não descobre sozinho, e recebe `metadata` própria.
- Antes de qualquer PR, os três precisam passar:
  `npm run lint && npm run typecheck && npm run build`.
- ⚠️ **`npm run build:static` não roda no Windows**: o script usa sintaxe Unix de variável de
  ambiente. Para validar localmente, definir `BUILD_TARGET=static` pelo bash e chamar
  `./node_modules/.bin/next build`.

## Segredos

- O arquivo é o **`.env` da raiz**, ignorado pelo Git. **Nenhum arquivo de ambiente é versionado,
  nem um de exemplo**: a referência de quais variáveis existem é o próprio `.env`, que nasce com as
  chaves comentadas e a explicação de cada uma. Mesmo combinado dos outros três projetos.
- Só `NEXT_PUBLIC_*` chega ao navegador. Nada sigiloso pode usar esse prefixo.
- ⚠️ **As públicas são referenciadas literalmente em `src/lib/env.ts`**, e não por índice dinâmico:
  o Next substitui `process.env.NEXT_PUBLIC_*` estaticamente no bundle, então `process.env[nome]`
  não funcionaria no cliente.
- ⚠️ **Não preencher variável do Stripe com valor de exemplo.** Com `price_xxx` presente,
  `resolvePriceId` devolve algo truthy, o guarda de `503` deixa de valer, e a rota tenta falar com
  o Stripe devolvendo `500`. Ou a chave é real, ou a linha fica comentada.
- ⚠️ **Nunca confiar em preço vindo do navegador.** O cliente manda `{ planId, interval }`; o
  servidor resolve o `priceId`. Aceitar preço do cliente permitiria assinar qualquer Price da
  conta, inclusive um de R$ 0.
- O webhook verifica a assinatura sobre o corpo **bruto** (`await request.text()`). Fazer
  `request.json()` antes invalida a checagem. Detalhe em [rules/05-stripe.md](rules/05-stripe.md).
- Nunca pôr o literal de um segredo em comando de shell (a harness grava comandos como permissão no
  `settings.local.json`); buscar pelo nome da variável.

## Git / autoria

- Repo: `https://github.com/v2ntechnology/Website-rookhub.git`. Detalhe em
  [rules/02-commits-e-branches.md](rules/02-commits-e-branches.md).
- ⚠️ **Conventional Commits é obrigatório aqui**: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.
  Isso é o **oposto** do `../System-web`, `../System-mobile` e `../Backend-web`, que proíbem o
  prefixo. A regra é por repositório, e a divergência já confundiu.
- ⚠️ **Nunca commitar direto na `main`.** Sempre `feat/*`, `fix/*` ou `chore/*`, e PR.
- Nenhum commit pode atribuir autoria a IA, em autor, committer ou trailer. Citar a pasta
  `.claude/` no corpo não é violação.
- Nunca `push --force`, `reset --hard` ou reescrita de histórico.
- ⚠️ **`AGENTS.md` e `CLAUDE.md` não existem na raiz, e não devem voltar.** O Next 16 os gera
  quando o `next dev` roda dentro de um agente de IA, detectado por variável de ambiente. Por isso
  o `npm run dev` passa por `scripts/dev.mjs`, que limpa essas variáveis antes de chamar o Next.
  Chamar `next dev` direto recria os dois. Eles também estão no `.gitignore`, como rede de
  segurança.
- Antes de commitar: revisar `git diff`, confirmar que nenhum segredo entrou, e registrar em
  `.claude/memoria.md` a decisão ou armadilha que o commit não revela.

## Índice das regras

| Documento | Conteúdo |
| --- | --- |
| [memoria.md](memoria.md) | Decisões, história e armadilhas. O **porquê**, não normativo |
| [rules/01-stack.md](rules/01-stack.md) | Stack, versões e ferramentas permitidas |
| [rules/02-commits-e-branches.md](rules/02-commits-e-branches.md) | Conventional Commits, branches, PRs |
| [rules/03-arquitetura.md](rules/03-arquitetura.md) | Estrutura de pastas, Server/Client, TypeScript |
| [rules/04-design-system.md](rules/04-design-system.md) | Tokens, temas, fase de wireframe |
| [design/DESIGN.md](design/DESIGN.md) | Especificação de origem do design system (normativa) |
| [rules/05-stripe.md](rules/05-stripe.md) | Checkout, Portal, Webhooks, segurança |
| [rules/06-seo-performance.md](rules/06-seo-performance.md) | Metadata, Core Web Vitals, acessibilidade |
