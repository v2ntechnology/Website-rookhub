# Memória do Projeto — RookHub Website-rookhub

> Documento versionado e compartilhado pelo time. Guarda decisões, limites e armadilhas que não
> ficam claros lendo um arquivo isolado.
>
> ⚠️ **As regras normativas não estão aqui.** Elas vivem em `docs/rules/` e em
> `docs/design/DESIGN.md`. Este arquivo guarda o **porquê** e o que já custou retrabalho; as
> regras dizem o **como**. Divergiu? A regra vence, e este arquivo é que está velho.
>
> ⚠️ **As regras saíram do `.claude/` em 04/09/2026**, por decisão do usuário. O `.claude/` ficou
> só com o que é de agente: `CLAUDE.md`, este arquivo e as configurações. Quem procurar regra em
> `.claude/rules/` não vai achar: o caminho é `docs/rules/`.

> **Como usar:** localize os títulos com `rg -n "^#{2,3} " .claude/memoria.md`, leia a seção ligada
> à tarefa e sempre `Gotchas`. Nunca o arquivo inteiro.

**Índice:** Visão geral · História do repositório · Estrutura · Fase de wireframe · Stripe,
removido em 05/09/2026 · Build e deploy · Variáveis de ambiente · Arquivos de agente ·
Hero com vídeo · Escopo do README · Estado e pendências · Gotchas

---

## Visão geral

- Site institucional do RookHub. Não é o painel: quem faz login e opera frota está em
  `../System-web` ou `../System-mobile`.
- Next.js 16 com App Router, React 19, TypeScript estrito, Tailwind v4 em CSS e `next-themes`.
- ⚠️ **Site 100% estático, sem back-end e sem cobrança** desde 05/09/2026. Três rotas públicas:
  `/`, `/precos` e `/contato`.
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

A árvore normativa está em `docs/rules/03-arquitetura.md`. O que não cabe lá:

- **`app/` só tem roteamento.** O que está em `src/app` vira URL. Componente que não é rota não
  mora ali, senão o mapa de rotas deixa de ser legível de relance.
- **`content/` existe para separar copy de código.** Texto de marketing muda por decisão de
  produto, não de engenharia. Dentro do JSX, corrigir uma vírgula obriga a abrir um componente
  React e a troca aparece no diff como mudança de código. Componente desenha, `content/` diz o quê.
- Os tipos desse conteúdo ficam em `src/types/`, nunca no componente que os desenha. Se `content/`
  importasse tipo de `components/`, a dependência ficaria invertida: o dado passaria a existir em
  função da tela.
- ⚠️ **`content/plans.ts` é conteúdo, e nem sempre foi.** Enquanto resolvia `priceId` no servidor
  era regra de negócio e vivia em `lib/stripe/`. Sem a integração, sobrou a copy dos planos, e ele
  passou a morar com o resto do texto do site.

### Layout arquivado

⚠️ **Órfão em `components/archive/` é o estado esperado, e não é código morto.** A pasta inteira
não é importada por ninguém. Ler o cabeçalho antes de apagar, e o inventário está no
`README.md` de lá.

Em 05/09/2026 os quatro saíram do meio dos componentes vivos e ganharam pasta própria:
`pillars-bento.tsx`, `problem-solution-vs.tsx`, `vs-scroller.tsx` (que só serve ao anterior) e
`brand-logo.tsx`.

**Por que a pasta:** antes, o que separava arquivo guardado de sobra esquecida era um comentário
no topo do arquivo, que só aparecia para quem abrisse. Na árvore, `pillars-bento.tsx` e
`pillars.tsx` eram indistinguíveis, e `marketing/` mostrava 10 componentes quando só 6 estavam
em uso. A pasta move a distinção para onde ela se vê.

⚠️ **`brand-logo.tsx` não estava arquivado, estava vencido.** O cabeçalho dizia que os SVGs
"voltam quando a marca for reaplicada", e a marca foi reaplicada em 04/09/2026, o que fazia o
comentário mentir sobre o estado do projeto. Hoje o cabeçalho diz que ele é fallback textual.

## Cor da marca, e o fim da fase de wireframe

⚠️ **A cor da marca é terracota `#D5623A` desde 04/09/2026**, decisão do usuário, no lugar do
indigo `#6366F1`. A troca foi total: tokens, os SVGs de logotipo, o ícone da aba e o gradiente.

- **Foram necessários dois tons, não um.** `#D5623A` puro reprova AA como texto pequeno (3,56:1 no
  claro, 3,01:1 no container) e com texto branco por cima (3,73:1). É a mesma armadilha que o
  indigo tinha. Por isso `--color-brand` é a cor pura, para preenchimento e texto grande, e
  `--color-brand-text` (`#A24A2C` claro, `#DB7A58` escuro) é o par de texto.
- ⚠️ **O tom de texto foi calibrado contra o chip, não contra a página**, e essa distinção custou
  uma rodada. O `price-badge` tem fundo da própria marca a 16%, que resolve em `rgb(246,228,221)`;
  um tom calibrado só contra o fundo da página dava 4,33:1 ali e reprovava. Sempre calibrar contra
  o pior fundo real, medido no navegador, e não contra o fundo nominal.
- ⚠️ **Grep de hex não encontra tudo.** Depois de trocar todos os `#6366F1`, sobraram três usos em
  `rgb(99 102 241 / …)` e um gradiente inteiro em `#8f92f8`/`#8285f7`/`#4f52e0`. O que funcionou
  foi varrer o CSS **por matiz**, calculando o hue de cada cor e listando o que caía na faixa
  azul/roxo. Vale para qualquer troca de paleta futura.
- O gradiente do logotipo tem **sete** stops, e não seis como a regra 04 registrava em aberto. O
  sétimo é a ponta clara, que era o cyan `#06B6D4`. Cada stop foi remapeado preservando a
  luminância, para o desenho do logotipo não mudar.
- ⚠️ **No logotipo, o mesmo `#0B1220` tinha DOIS papéis, e eles se separaram.** Ele pintava o
  texto "Rook" (`fill`) e fechava o gradiente do símbolo (`stop-color`). Remapear a cor de uma vez
  só errou os dois lados, em duas rodadas: primeiro deixou o "Rook" cor de ferrugem, depois, ao
  reverter tudo para preto, deixou a base do símbolo preta. Como ficou, por decisão do usuário em
  04/09/2026:
  - **`fill` do "Rook": preto `#0B1220`.** Não acompanha a cor de marca, e não vira laranja.
  - **`stop-color` do símbolo: rampa laranja que termina em terracota, nunca em preto.**
  A regra prática: em logotipo, `fill` é identidade e `stop-color` é a rampa. Tratar os dois com o
  mesmo find-and-replace erra sempre um dos lados. O `fill="#D5623A"` do "Hub" cai na mesma
  armadilha pelo lado oposto: ele também aparece como `stop-color` no gradiente.
- ⚠️ **O ícone da aba NÃO tem arquivo próprio: ele reusa o símbolo da marca.** São
  `rookhub-symbol-dark.svg` na aba clara e `rookhub-symbol-white.svg` na escura, declarados em
  `metadata.icons` com `media: (prefers-color-scheme: …)`. Cheguei a criar um par
  `favicon-light/dark.svg`, e o usuário apontou em 04/09/2026 que eram cópias do que já existia:
  reusar os arquivos da marca mantém uma fonte de verdade só, e mexer no símbolo atualiza a aba
  junto. Conferido nas quatro cores de aba do Chrome, em 16, 32 e 64px.
- ⚠️ **`app/icon.svg` foi REMOVIDO de propósito, e não deve voltar.** Com a convenção do Next
  presente, o `<head>` sai com três `<link rel="icon">`: o dela, **sem** `media`, mais os dois de
  `metadata.icons`. O navegador pode preferir o sem `media`, e aí a troca por tema nunca acontece.
- Os cinzas do tema continuam **frios** (matiz ~215) e não acompanharam a virada para o quente.
  Ficou em aberto se migram.

A fase de baixa fidelidade em cinzas, decidida em 27/08/2026, **acabou**. O que ela deixou é a base
editorial: cinzas de superfície, raio de 6px, caixas com borda de 1px e `.surface-deep`. A
implementação de marca anterior (`glass-card`, `glow`, `spectrum-edge`) segue recuperável no commit
`4105812`, mas com a paleta velha.

## Stripe, removido em 05/09/2026

A integração saiu inteira a pedido do usuário: o site é só front-end por enquanto, e nada disso
rodava. Saíram os três Route Handlers (`checkout`, `portal`, `webhook`), as páginas
`/checkout/sucesso` e `/checkout/cancelado`, o `session-reference`, o `checkout-button`, o
`lib/stripe/server.ts`, as dependências `stripe` e `@stripe/stripe-js`, as variáveis do `.env` e a
regra `docs/rules/05-stripe.md`.

**O que sobreviveu, e por quê:** o catálogo `PLANS` foi para `content/plans.ts`. Ele é a copy da
página de preços, que continua no ar; sem `resolvePriceId`, deixou de ser regra de negócio e virou
conteúdo. `types/billing.ts` ficou onde estava, porque `Plan` e `BillingInterval` ainda descrevem a
tabela e o alternador mensal/anual.

⚠️ **O CTA de plano agora é um `ButtonLink` para `/contato`.** A copy de cada plano não mudou, então
"Assinar o Profissional" leva a um formulário de contato. Se isso incomodar, o texto está em
`content/plans.ts`, campo `cta`.

⚠️ **`@stripe/stripe-js` nunca foi importado por ninguém.** Estava em `dependencies` desde o começo
sem um único uso, o que só apareceu quando varri o grafo de importações.

⚠️ **A copy do FAQ prometia "processados com segurança pelo Stripe"**, e isso era texto visível em
`/precos`, não comentário. Só apareceu porque varri o HTML gerado atrás da palavra, depois de o
build já estar verde. Lição: com integração removida, procurar o nome dela **no `out/`**, não só no
`src/`. O FAQ estava declarado dentro de `app/(marketing)/precos/page.tsx`, contra a regra de
conteúdo, e foi para `content/faq.ts` na mesma passada.

Se a cobrança voltar: o código todo está no histórico do Git, e o número 05 das regras foi deixado
vago de propósito para a regra voltar com o mesmo nome.

## Build e deploy

- **Dois alvos a partir do mesmo código.** `npm run build` é o build normal, `npm run build:static`
  gera `out/` para a Cloudflare.
- ⚠️ **Desde 05/09/2026 os dois produzem o mesmo conteúdo**, porque todas as rotas viraram
  estáticas com a saída do Stripe. A distinção sobrou só para gerar `out/`. O `pageExtensions`
  condicional do `next.config.ts` foi removido junto, porque existia exclusivamente para os
  `route.api.ts`.
- **Nenhuma página pode depender de servidor**. `searchParams` só via `useSearchParams()` em
  Client Component dentro de `<Suspense>`.
- Deploy por Cloudflare Workers Static Assets, projeto `rookhub-site`, configurado em
  `wrangler.jsonc`.

## Variáveis de ambiente

Em 29/08/2026 o `.env.example` foi removido e o arquivo passou a ser um `.env` local, ignorado pelo
Git. Alinha este projeto com os outros três, onde o exemplo já tinha sido removido em 10/08.

- A referência de quais variáveis existem é o próprio `.env`, que nasce com as chaves **comentadas**
  e a explicação de cada uma.
- ⚠️ **Desde 05/09/2026 só resta `NEXT_PUBLIC_SITE_URL`.** As seis de Price e as duas secretas do
  Stripe saíram com a integração. A regra de manter chave comentada em vez de valor de exemplo
  nasceu justamente ali: um `price_xxx` truthy derrubava o guarda de `503` e fazia a rota devolver
  `500`. Vale de novo no dia em que houver outra chave.
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

## Hero com vídeo, e o que ele quebra

Desde 05/09/2026 a primeira seção é um vídeo em tela cheia (`public/video/hero.mp4`, 9 MB, 14 s,
sem áudio), com o conteúdo ancorado embaixo e entrada escalonada saindo do desfoque.

⚠️ **O desfoque NÃO cria contraste.** `backdrop-filter: blur()` espalha a luz; uma área clara
borrada continua clara. Medido sobre este vídeo, só com o blur reprovavam o texto de apoio (3,83),
a linha de sinais (3,19), os links da barra (2,77) e o acento da marca (1,22, contra mínimo 3).
Quem resolve é o `.hero-veil`, e as opacidades dele são medidas, não estéticas.

⚠️ **A cor da marca não serve sobre mídia.** O terracota `#D5623A` tem luminância 0,23, perto
demais do céu do vídeo, e escurecer o fundo só aproxima os dois. Existe `--color-brand-on-media`
(`#F7AC86`) para isso, usado pela classe `.hero-accent`. Não usar fora de mídia.

⚠️ **Não dá para sobrescrever uma utility do Tailwind a partir de `@layer components`.** Tentei
`.hero-over-video .text-brand` e não pegou: `utilities` é uma layer posterior, e layer vence
especificidade. A saída foi criar a classe própria `.hero-accent`.

⚠️ **A barra encaixada sobre mídia precisa de cor fixa, e só ali.** Os tokens de tema deixam os
links quase pretos sobre o vídeo no tema claro. As regras usam `body:has(.hero-over-video)` para
valer só na home. **Sem esse `:has()` o botão de tema sumia em `/precos`**, branco sobre branco.
Custou uma rodada: a primeira versão da regra pegava toda barra encaixada.

⚠️ **O `<video>` fica com `preload="none"`.** Com 9 MB, baixá-lo junto com a página atrasaria o
primeiro contato. O pôster (12 KB, WebP) segura a composição.

⚠️ **Screenshot de página inteira não dispara `IntersectionObserver`.** O Playwright não rola de
verdade, então os blocos com `Reveal` saem invisíveis na captura. Isso é artefato da ferramenta,
não defeito: para conferir, rolar até cada bloco e só então capturar.

⚠️ **O viewport do Playwright nesta máquina é 1920x937**, não 1440x900. Medição de pixel que
assume a largura errada estoura a região de recorte.

Não há ffmpeg nesta máquina, então o vídeo não pôde ser recomprimido. Se aparecer, vale gerar um
WebM e um corte menor para mobile.

## Escopo do README

Decisão do usuário em 05/09/2026, depois de o arquivo ter crescido até virar um resumo das regras.
O README fala **do site, e só dele**.

**Entra:** o que o site é, tecnologias e versões, bibliotecas, estrutura de pastas, como executar,
variáveis de ambiente, build e deploy, equipe.

**Não entra:**
- ⚠️ **Qualquer coisa dos projetos irmãos.** Saiu a tabela que listava `System-web`, `System-mobile`
  e `Backend-web`, e saíram as comparações do tipo "ao contrário do System-web" e "vindo dos
  projetos irmãos". Quem chega aqui está lendo sobre este repositório.
- ⚠️ **O que já tem arquivo próprio.** Design, tokens, cor da marca e contraste são de
  `docs/rules/04`; a tabela "onde cada arquivo mora" é de `docs/rules/03`; o passo a passo do deploy
  é de `docs/deploy-cloudflare.md`. O README aponta, não copia. Quando ele repete a regra, as duas
  versões divergem e ninguém sabe qual vale.

Sobrou uma seção `Convenções` curta, com os cinco pontos que derrubam alguém no primeiro dia e um
ponteiro para `docs/README.md`. Caiu de 290 para 239 linhas.

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
  estaticamente, e é por isso que mover `public/images` para `src/assets` quebraria a seção. A
  pasta se chamou `public/imgs` até 04/09/2026, quando foi renomeada para o nome em inglês e os
  arquivos ganharam nome descritivo. O sufixo diz o FUNDO em que a peça se aplica, e não a cor dela:
  `-dark` para fundo claro ("Rook" preto), `-white` para fundo escuro. São três peças no par
  completo: `rookhub-full-*`, `rookhub-symbol-*` e `rookhub-wordmark-*`. O `wordmark` só tinha a
  versão branca, e a escura foi criada em 04/09/2026. Também entraram `icon-fuel` e
  afins. No mesmo dia os logotipos de terceiros saíram para `public/logos/`, para a pasta de
  imagens não misturar marca própria com marca de cliente.
- ⚠️ **Marca é SVG, arte rasterizada é WebP, e nada é PNG.** Em 04/09/2026 os PNGs duplicados da
  marca foram apagados (todos tinham SVG equivalente) e os três ícones do hero mais o logotipo da
  Amazonas viraram WebP redimensionado: **4,8 MB passaram a 176 KB**. Renderização 3D não vira SVG,
  e insistir nisso só produz borrão ou um vetor de vários MB. Detalhe que torna isso crítico: com
  `output: export` e `images.unoptimized`, **o Next serve o arquivo do disco como ele está**, então
  o peso do asset é o peso que o visitante baixa.
- **Não** mover `globals.css` para `src/styles`: a configuração do Tailwind v4 vive em
  `src/app/globals.css` por decisão registrada na regra 01, e é a convenção do Next.
- **Não** recriar os assets de exemplo do `create-next-app` (`file.svg`, `globe.svg`, `next.svg`,
  `vercel.svg`, `window.svg`). Foram removidos em 29/08/2026: ninguém os referenciava e eles
  entravam no export, ou seja, `rookhub.com.br/vercel.svg` respondia com o logotipo da Vercel
  servido pelo domínio do produto.
- ⚠️ **Sem prefixo de Conventional Commits desde 29/08/2026.** Este era o único dos quatro projetos
  que exigia `feat:` e `docs:`, e passou a seguir o padrão dos irmãos: uma frase em pt-BR, sem
  prefixo. O histórico anterior mantém o formato antigo e não será reescrito, então o `git log`
  mostra os dois estilos.
- **Nunca** commitar direto na `main`: sempre `feat/*`, `fix/*` ou `chore/*` e PR.
