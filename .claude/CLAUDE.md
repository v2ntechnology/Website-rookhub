# Instruções para Claude — RookHub Website-rookhub (pt-BR)

> **Fonte única de verdade.** É proibido criar `.cursor/`, `.codex/`,
> `.github/copilot-instructions.md` ou qualquer outra pasta paralela de instruções para IA.
>
> ⚠️ **A documentação mudou de lugar em 04/09/2026**, por decisão do usuário. As regras numeradas e
> a especificação de design saíram de `.claude/` e vivem em **`docs/rules/`** e
> **`docs/design/`**, junto do resto da documentação do repositório. O `.claude/` ficou só com o
> que é de agente: este arquivo, a `memoria.md` e as configurações.
>
> Este arquivo é o operacional: o que você precisa saber **antes** de escrever a primeira linha.
> Para o detalhe de um assunto, a regra numerada correspondente é mais completa e **vence** em caso
> de divergência. A `memoria.md` guarda o **porquê** e o que já custou retrabalho.

## Comportamento

- Responder sempre em pt-BR, direto e objetivo, resumo breve no fim.
- **Nunca usar travessão (`—`)** em texto de interface, README, documentação, comentário de código
  ou mensagem de commit (decisão do usuário em 15/08/2026, vale nos quatro projetos). ⚠️ **Trocar
  por vírgula** (decisão do usuário em 04/09/2026, que substitui a orientação anterior de quebrar a
  frase em duas). Onde a vírgula emendar duas orações independentes e prejudicar a leitura, quebrar
  a frase e avisar.
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

- Stack: Next.js 16 (App Router), React 19, TypeScript estrito, Tailwind v4 em CSS e
  `next-themes`. Detalhe e versões em [rules/01-stack.md](../docs/rules/01-stack.md).
- ⚠️ **O site é estático e não tem back-end.** Sem Stripe, sem Route Handler, sem Server Action,
  sem SDK de serviço externo. A integração de cobrança saiu em 05/09/2026 e está no histórico do
  Git. `/precos` é vitrine, e os CTAs de plano levam a `/contato`.
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

A árvore normativa está em [rules/03-arquitetura.md](../docs/rules/03-arquitetura.md). O resumo:

| O que você está escrevendo | Onde |
| --- | --- |
| Página institucional nova | `src/app/(marketing)/<rota>/page.tsx`, e entra no `sitemap.ts` |
| Bloco de seção da landing | `src/components/marketing/` |
| Planos e cobrança | `src/components/pricing/` |
| Cabeçalho, rodapé, navegação | `src/components/layout/` |
| Primitivo reutilizável | `src/components/ui/` |
| Variante substituída que pode voltar | `src/components/archive/`, e só ela |
| **Texto, lista ou tabela de conteúdo** | `src/content/`, **nunca** dentro do JSX |
| Regra de negócio, integração, helper | `src/lib/` |
| Tipo usado por mais de um módulo | `src/types/` |
| Token, classe de tipografia, estilo | `src/app/globals.css` |
| Imagem, ícone ou logotipo da RookHub | `public/images/` |
| Logotipo de outra empresa (prova social) | `public/logos/` |
| Convenção nova | `docs/rules/`, **nunca** só no README |

- **`app/` só tem roteamento.** O que está lá vira URL. Componente que não é rota não mora ali.
- **Componente desenha, `content/` diz o quê.** O componente recebe o dado por prop e não sabe de
  onde veio. Os tipos desse conteúdo ficam em `src/types/`, nunca no componente, senão a
  dependência se inverte.
- ⚠️ **`content/plans.ts` é o catálogo comercial**, e é conteúdo como qualquer outro: copy, preço
  e features dos três planos. Viveu em `lib/stripe/` enquanto resolvia `priceId`, o que fazia dele
  regra de negócio; sem a integração, virou texto.

### Server e client

- **Server Component é o padrão.** `"use client"` só com estado, efeito, evento de navegador ou API
  do navegador, e sempre empurrado para a folha da árvore.
- As ilhas de interação de hoje, como referência do que justifica virar client: `theme-provider`,
  `theme-toggle`, `back-to-top`, `desktop-nav`, `mobile-nav`, `typing-headline`, `reveal`,
  `pillars-capsules`, `profiles-tabs`, `pricing-table` e o arquivado `archive/vs-scroller`. `header-actions` deixou de ter estado quando o menu sanduíche
  saiu do desktop: hoje é só o par tema mais CTA.
- ⚠️ **`components/archive/` guarda variante substituída, e a pasta inteira é órfã de propósito.**
  Nada ali é importado pelo site. Não apagar: o inventário e a regra estão no `README.md` de lá.
- Se um dia voltar a existir segredo ou SDK server-side, ele vive **apenas** no servidor, e o
  módulo é marcado com `import "server-only"`. Hoje o site não tem nenhum dos dois.

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
- ⚠️ **A navegação são duas peças, uma por faixa de largura, e as duas têm dois estados.** Acima de
  `md` vale `desktop-nav`: encaixada no topo ela é a faixa do site inteira, e ao rolar vira um
  retângulo arredondado de 1120px com vidro. Abaixo de `md` vale `mobile-nav`, com o mesmo par de
  estados, e a folha de navegação aberta força o estado encaixado. Mexeu em uma, confira a outra.
- Classe de seção vive em `@layer components` do `globals.css`, agrupada por bloco (`.capsule*`,
  `.ptab*`, `.cmp*`, `.price-*`, `.editorial-*`, `.desk-*`, `.mob-*`). Bloco novo entra lá, não em
  estilo inline.
- ⚠️ **A cor da marca é terracota `#D5623A`**, e a fase de wireframe em escala de cinza **acabou**
  em 04/09/2026. São dois tokens, não um: `--color-brand` para preenchimento e texto grande,
  `--color-brand-text` para texto de corpo, rótulo e chip. A cor pura reprova AA como texto pequeno.
  Detalhe e números medidos em [rules/04-design-system.md](../docs/rules/04-design-system.md).
- Revisar a mudança nos **dois temas** e em viewport móvel de 360px é parte do pronto.

### Build, rotas e deploy

- Dois alvos a partir do mesmo código: `npm run build` (build normal) e `npm run build:static`
  (export em `out/`, o que vai ao ar na Cloudflare). ⚠️ **Desde 05/09/2026 os dois geram o mesmo
  conteúdo**, porque todas as rotas são estáticas; a distinção sobrou só para produzir `out/`.
- **Nenhuma página pode depender de servidor**. Sem `cookies()`, sem `searchParams`
  em Server Component, sem Server Action. `searchParams` só via `useSearchParams()` em Client
  Component dentro de `<Suspense>`. Rota de metadado exporta `dynamic = "force-static"`.
- **Rota nova entra no `sitemap.ts`**, que não descobre sozinho, e recebe `metadata` própria.
- Antes de qualquer PR, os três precisam passar:
  `npm run lint && npm run typecheck && npm run build`.
- `npm run build:static` passa por `scripts/build-static.mjs`, que define `BUILD_TARGET`, chama o
  `next build` e roda `flatten-rsc-segments.mjs` em seguida. Roda no Windows e no bash.
- ⚠️ **O flatten não é opcional.** O export do Next 16 grava o payload RSC de cada segmento como
  pasta aninhada, mas o cliente o pede com o caminho achatado por pontos. Sem a cópia, todo
  prefetch responde 404 em produção. Detalhe na [memoria.md](memoria.md).

## Segredos

- O arquivo é o **`.env` da raiz**, ignorado pelo Git. **Nenhum arquivo de ambiente é versionado,
  nem um de exemplo**: a referência de quais variáveis existem é o próprio `.env`, que nasce com as
  chaves comentadas e a explicação de cada uma. Mesmo combinado dos outros três projetos.
- Só `NEXT_PUBLIC_*` chega ao navegador. Nada sigiloso pode usar esse prefixo.
- ⚠️ **As públicas são referenciadas literalmente em `src/lib/env.ts`**, e não por índice dinâmico:
  o Next substitui `process.env.NEXT_PUBLIC_*` estaticamente no bundle, então `process.env[nome]`
  não funcionaria no cliente.
- Hoje **`NEXT_PUBLIC_SITE_URL` é a única variável do projeto**, e ela tem valor padrão. Não há
  segredo neste repositório: quem precisar de um está criando back-end onde não existe.
- Nunca pôr o literal de um segredo em comando de shell (a harness grava comandos como permissão no
  `settings.local.json`); buscar pelo nome da variável.

## Git / autoria

- Repo: `https://github.com/v2ntechnology/Website-rookhub.git`. Detalhe em
  [rules/02-commits-e-branches.md](../docs/rules/02-commits-e-branches.md).
- Commits pequenos, mensagem em pt-BR e **sem prefixo de Conventional Commits** (decisão do usuário
  em 29/08/2026): nada de `feat:`, `fix(escopo):`, `docs:` ou `chore:`. O assunto explica em uma
  frase o que a mudança faz. Mesma regra dos outros três projetos.
- ⚠️ **O histórico anterior a 29/08/2026 usa o formato antigo.** Não imitar, e não reescrever:
  commit publicado fica como está.
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

As regras vivem em `docs/`, e a pasta tem o próprio índice em
[docs/README.md](../docs/README.md).

| Documento | Conteúdo |
| --- | --- |
| [memoria.md](memoria.md) | Decisões, história e armadilhas. O **porquê**, não normativo |
| [docs/rules/01-stack.md](../docs/rules/01-stack.md) | Stack, versões e ferramentas permitidas |
| [docs/rules/02-commits-e-branches.md](../docs/rules/02-commits-e-branches.md) | Mensagem de commit, branches, PRs |
| [docs/rules/03-arquitetura.md](../docs/rules/03-arquitetura.md) | Estrutura de pastas, Server/Client, TypeScript |
| [docs/rules/04-design-system.md](../docs/rules/04-design-system.md) | Tokens, temas, cor de marca, contraste |
| [docs/design/DESIGN.md](../docs/design/DESIGN.md) | Especificação de origem do design system, vencida no que for cor |
| [docs/rules/06-seo-performance.md](../docs/rules/06-seo-performance.md) | Metadata, Core Web Vitals, acessibilidade |
| [docs/deploy-cloudflare.md](../docs/deploy-cloudflare.md) | Como o export estático vai ao ar |
