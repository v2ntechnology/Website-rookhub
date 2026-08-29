# Memória do Projeto — RookHub Website-rookhub

> Documento versionado e compartilhado pelo time. Guarda decisões, limites e armadilhas que não
> ficam claros lendo um arquivo isolado.
>
> ⚠️ **As regras normativas não estão aqui.** Elas vivem em `.claude/rules/` e em
> `.claude/design/DESIGN.md`. Este arquivo guarda o **porquê** e o que já custou retrabalho; as
> regras dizem o **como**. Divergiu? A regra vence, e este arquivo é que está velho.

> **Como usar:** localize os títulos com `rg -n "^#{2,3} " .claude/memoria.md`, leia a seção ligada
> à tarefa e sempre `Gotchas`. Nunca o arquivo inteiro.

**Índice:** Visão geral · História do repositório · Estrutura · Fase de wireframe · Stripe ·
Build e deploy · Arquivos de agente · Estado e pendências · Gotchas

---

## Visão geral

- Site institucional do RookHub e o fluxo de assinatura recorrente pelo Stripe. Não é o painel:
  quem faz login e opera frota está em `../System-web` ou `../System-mobile`.
- Next.js 16 com App Router, React 19, TypeScript estrito, Tailwind v4 em CSS e `next-themes`.
- Quatro rotas públicas: `/`, `/precos`, `/checkout/sucesso` e `/checkout/cancelado`.
- ⚠️ **Não há Prettier nem suíte de testes aqui**, ao contrário do `System-web`. Quem vem de lá
  procura `npm run format` e não acha. Os gates são `lint`, `typecheck` e `build`.

## História do repositório

Importa porque explica arquivos que parecem órfãos e uma pasta local que não é este projeto.

- Este repositório **nasceu em 24/08/2026**, do zero, com `create-next-app`. Não é renomeação de
  nenhum outro.
- Existiu antes um site institucional diferente, em `Projetos/Rookhub/Website`, com trabalho de 10
  a 16/08 que **nunca foi enviado para cá**: outro conjunto de páginas (blog, contato, sobre,
  recursos), outros componentes (`glass-card`, `chip`, `field`) e conteúdo em `src/content/`.
  Verificado: aqueles arquivos não aparecem em nenhum commit deste repositório.
- Em 29/08/2026 aquela pasta foi preservada como `Website-prototipo-ate-16-08` e este repositório
  passou a ocupar `Website-rookhub`. ⚠️ **Não tente juntar os dois**: o protótipo tem
  `src/app/(marketing)/` e este tem `src/app/page.tsx`; sobrepostos, o Next quebra com rota
  duplicada na raiz.
- A organização daquele protótipo agradava o usuário, e o que dela não conflitava com as regras
  daqui foi adotado em 29/08: o grupo `(marketing)` e o `src/content/`.

## Estrutura

A árvore normativa está em `rules/03-arquitetura.md`. O que não cabe lá:

- **`app/` só tem roteamento.** O que está em `src/app` vira URL. Componente que não é rota não
  mora ali, senão o mapa de rotas deixa de ser legível de relance.
- **`content/` existe para separar copy de código.** Texto de marketing muda por decisão de
  produto, não de engenharia. Dentro do JSX, corrigir uma vírgula obriga a abrir um componente
  React e a troca aparece no diff como mudança de código. Componente desenha, `content/` diz o quê.
- Os tipos desse conteúdo ficam em `src/types/`, nunca no componente que os desenha. Se `content/`
  importasse tipo de `components/`, a dependência ficaria invertida: o dado passaria a existir em
  função da tela.
- ⚠️ **`lib/stripe/plans.ts` não é conteúdo**, apesar de carregar copy. Ele resolve `priceId` no
  servidor e é fonte de verdade de produto.

### Layout arquivado

`marketing/pillars-bento.tsx` e `marketing/problem-solution-vs.tsx` foram substituídos mas seguem
inteiros e funcionais, cada um com cabeçalho dizendo como voltar a ele. `layout/brand-logo.tsx` é o
wordmark textual da fase de wireframe.

⚠️ **Os três aparecem como órfãos em varredura de importação, e não são código morto.** O cabeçalho
é o que distingue arquivo arquivado de sobra esquecida. Ler antes de apagar.

## Fase de wireframe

Decisão de produto em 27/08/2026: o site foi reduzido a protótipo de baixa fidelidade em escala de
cinza, para validar estrutura, hierarquia e copy sem a estética interferir na leitura.

- A regra `04-design-system.md` está **suspensa no código**, mas continua normativa para a
  reaplicação da marca depois da validação.
- Nenhuma cor cromática entra enquanto isso durar. As exceções autorizadas estão tabeladas na
  regra, e qualquer uso novo precisa de linha nova lá.
- A implementação anterior da marca (tokens, `glass-card`, `glow`, `spectrum-edge`) está
  recuperável no commit `4105812`.

## Stripe

- Um Product por plano (Básico, Profissional, Enterprise), dois Prices por plano (mensal e anual).
- ⚠️ **O navegador nunca envia preço.** Ele manda `{ planId, interval }` e o servidor resolve o
  `priceId`. Aceitar preço do cliente permitiria a qualquer visitante assinar qualquer Price da
  conta, inclusive um de R$ 0.
- O webhook verifica a assinatura sobre o corpo **bruto** (`await request.text()`). Fazer
  `request.json()` antes invalida a checagem.
- O provisionamento acontece **só pelo webhook**, nunca na página de sucesso.
- Sem os Price IDs configurados, `/api/stripe/checkout` responde `503`. É o esperado, não defeito.

## Build e deploy

- **Dois alvos a partir do mesmo código.** `npm run build` é completo, com SSR e os Route Handlers.
  `npm run build:static` gera `out/` para a Cloudflare.
- ⚠️ **Os handlers se chamam `route.api.ts`, e isso é o mecanismo, não estilo.** A extensão só
  entra em `pageExtensions` no build completo; no estático fica de fora, porque `output: "export"`
  não suporta POST nem leitura do request.
- Consequência: **nenhuma página pode depender de servidor**. `searchParams` só via
  `useSearchParams()` em Client Component dentro de `<Suspense>`.
- ⚠️ **O checkout não existe no site publicado**, porque as rotas `/api/stripe/*` ficam fora do
  export. Volta quando o app rodar com servidor.
- Deploy por Cloudflare Workers Static Assets, projeto `rookhub-site`, configurado em
  `wrangler.jsonc`.

## Variáveis de ambiente

Em 29/08/2026 o `.env.example` foi removido e o arquivo passou a ser um `.env` local, ignorado pelo
Git. Alinha este projeto com os outros três, onde o exemplo já tinha sido removido em 10/08.

- A referência de quais variáveis existem é o próprio `.env`, que nasce com as chaves **comentadas**
  e a explicação de cada uma.
- ⚠️ **Por que comentadas, e não com valor de exemplo:** `resolvePriceId` devolvendo qualquer coisa
  truthy faz o `/api/stripe/checkout` pular o guarda de `503` e tentar falar com o Stripe de
  verdade, devolvendo `500`. Com `price_xxx` preenchido, o comportamento documentado deixa de
  valer. Ou a chave é real, ou a linha fica comentada.
- ⚠️ **Não deixar `NEXT_PUBLIC_SITE_URL` vazia.** O fallback em `lib/env.ts` é `??`, que só pega
  `undefined`: string vazia passa, e `new URL("")` no `metadataBase` derruba o build.

## Arquivos de agente

Em 29/08/2026 o `AGENTS.md` e o `CLAUDE.md` da raiz foram removidos, e o `npm run dev` passou a
impedir que voltem. Decisão do usuário: as regras deste projeto vivem em `.claude/`, e não se quer
mais nada na raiz.

- Os dois são gerados pelo Next 16, não pelo time, por `ensureAgentRulesForDev` em
  `server/lib/start-server.js`.
- **A detecção é por variável de ambiente**, e só isso. O `@vercel/detect-agent` procura
  `CLAUDECODE`, `CLAUDE_CODE`, `CURSOR_AGENT`, `CURSOR_TRACE_ID`, `CODEX_THREAD_ID`, `GEMINI_CLI`,
  `AI_AGENT` e afins. Num terminal comum nenhuma existe, nada é gerado, e é por isso que só algumas
  pessoas os viam aparecer.
- **Não existe opção de configuração para desligar.** A única condição de saída é `determineAgent()`
  responder que não há agente.
- Por isso o `npm run dev` chama `scripts/dev.mjs`, que remove essas variáveis do ambiente do
  processo filho e então executa o `next dev`. Testado nos dois sentidos em 29/08: pelo envoltório
  os arquivos não aparecem; chamando `./node_modules/.bin/next dev` direto, os dois voltam.
- ⚠️ **A geração é só no `dev`.** O `next build` não cria nada.
- ⚠️ **Nunca apagar só um dos dois**, se um dia reaparecerem. Sem o `AGENTS.md`, o Next passa a
  injetar o bloco dele **dentro do `CLAUDE.md`**.
- ⚠️ O `CLAUDE.md` recriado volta só com `@AGENTS.md`: a linha `@.claude/CLAUDE.md` que existia era
  do time e não sobrevive à regeneração. Ou seja, não há nada na raiz apontando para as regras, e
  quem trabalhar aqui precisa abrir `.claude/` por conta própria.
- Os dois seguem no `.gitignore` como rede de segurança, para o caso de alguém rodar `next dev`
  fora do script.

## Estado e pendências

- Pronto: landing, `/precos` com comparativo e prova social, navegação móvel separada, export
  estático, e a reorganização de 29/08 (`(marketing)`, `content/`, `types/marketing.ts`).
- Falta: reaplicar a marca depois da validação do wireframe, e voltar a rodar com servidor para o
  checkout existir em produção.
- Falta também, e é barato: um `.gitattributes` com `eol=lf`. Os irmãos `System-web` e
  `Backend-web` têm; este não, então o git avisa que vai converter LF para CRLF e quem clonar no
  Linux vê o arquivo inteiro como alterado.
- ⚠️ **`npm run build:static` não roda no Windows.** O script usa `BUILD_TARGET=static next build`,
  sintaxe que o cmd não entende. Para validar localmente, definir a variável pelo bash e chamar
  `./node_modules/.bin/next build`. Um `cross-env` resolveria.

## Gotchas

- ⚠️ **`npm run typecheck` sozinho falha em clone novo**, com
  `Cannot find name 'LayoutProps'` em `app/layout.tsx`. Não é erro de código: o Next 16 **gera**
  os tipos globais `LayoutProps` e `PageProps` dentro de `.next/types`, e quem os cria é o
  `next build` ou o `next dev`. Rodar um dos dois antes resolve. Vale também depois de
  `rm -rf .next`, e é por isso que a ordem dos gates importa: **build antes de typecheck**.

- **Não** registrar a escala de espaçamento como `--spacing-xs…xl` no `@theme`. No Tailwind v4 esse
  namespace é o mesmo das utilities de tamanho: registrar `xs…xl` ali sequestra `max-w-xs` (vira
  8px), `max-w-md` (24px) e `max-w-xl` (48px), e faz `max-w-sm`, `max-w-lg` e `max-w-2xl` deixarem
  de existir. Usar os múltiplos de 4 nativos.
- **Não** cravar a altura da barra fixa: usar o token `--header-h` (68px no mobile, 84px a partir
  de `md`). `main`, o hero e o topo de `/precos` sangram por trás dela usando esse token.
- **Não** tratar a navegação como uma barra adaptativa: são **duas**. Acima de `md` valem as ilhas
  flutuantes (`site-header` + `header-actions`); abaixo, `mobile-nav`. Mexeu em uma, confira a
  outra.
- **Não** usar `overflow: hidden` em `Section`: use `overflow-x: clip`. O `hidden` cria contêiner
  de rolagem e anula qualquer `position: sticky` dentro da seção.
- **Não** julgar uma seção por captura de página inteira. O componente `Reveal` anima ao rolar, e o
  que ainda não entrou no viewport aparece **em branco** na captura. Já pareceu regressão e não
  era: role até a seção, ou leia o DOM.
- **Não** usar `#6366F1` como preenchimento de controle com texto: dá 4.47:1 com branco e reprova
  AA por margem mínima. O valor adotado é `#5457EE`; o original fica em `--color-brand-bright`,
  para glow e indicador, onde nunca há texto por cima.
- **Não** aplicar logotipo de terceiro como imagem na prova social: entra como **máscara CSS**
  (`.logo-mark`), para a cor vir do tema. Isso exige o arquivo em `public/`, servido
  estaticamente, e é por isso que mover `public/imgs` para `src/assets` quebraria a seção.
- **Não** mover `globals.css` para `src/styles`: a configuração do Tailwind v4 vive em
  `src/app/globals.css` por decisão registrada na regra 01, e é a convenção do Next.
- **Não** recriar os assets de exemplo do `create-next-app` (`file.svg`, `globe.svg`, `next.svg`,
  `vercel.svg`, `window.svg`). Foram removidos em 29/08/2026: ninguém os referenciava e eles
  entravam no export, ou seja, `rookhub.com.br/vercel.svg` respondia com o logotipo da Vercel
  servido pelo domínio do produto.
- ⚠️ **Conventional Commits é obrigatório aqui e proibido no `../System-web`.** A regra é por
  repositório, e a divergência já confundiu. A daqui é `rules/02-commits-e-branches.md`.
- **Nunca** commitar direto na `main`: sempre `feat/*`, `fix/*` ou `chore/*` e PR.
