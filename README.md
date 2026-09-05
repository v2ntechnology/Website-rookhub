<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/images/rookhub-full-white.svg"/>
    <img alt="RookHub" src="public/images/rookhub-full-dark.svg" width="230"/>
  </picture>
</p>

<h2 align="center">Site Institucional</h2>

<p align="center">
  <strong>Plataforma SaaS de gestão inteligente de frotas</strong><br/>
  A porta de entrada do produto. <em>A inteligência por trás de cada frota.</em>
</p>

<div data-importer="techs" align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.simpleicons.org/nextdotjs/FFFFFF"/>
    <img src="https://cdn.simpleicons.org/nextdotjs/000000" height="40" alt="next.js logo"  />
  </picture>
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" alt="react logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="40" alt="typescript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" height="40" alt="tailwindcss logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="40" alt="nodejs logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg" height="40" alt="eslint logo"  />
</div>

---

## Sobre o projeto

Uma transportadora acompanha a operação em pedaços: rastreador num site, abastecimento numa
planilha, multas por e-mail, e o custo por quilômetro só no fechamento do mês, quando já não dá
para corrigir.

Este é o **site público** que explica isso para quem ainda não é cliente e apresenta os planos.

| | |
| --- | --- |
| **Rotas** | `/`, `/precos` e `/contato`, mais `sitemap.xml` e `robots.txt` |
| **Renderização** | Inteiramente estático, sem rota de servidor e sem cobrança |
| **Publicação** | Export estático na Cloudflare Workers |
| **Idioma** | Interface em pt-BR, código em inglês |

Os CTAs de plano levam a `/contato`. Fora do escopo desta fase: área autenticada, cobrança, CMS,
blog e analytics.

---

## Tecnologias utilizadas

| Categoria     | Ferramenta                                                                  | Versão            |
| ------------- | --------------------------------------------------------------------------- | ----------------- |
| Execução      | [Node.js LTS](https://nodejs.org/pt-br/download)                            | 20 LTS ou superior |
| Framework     | [Next.js](https://nextjs.org/) (App Router + Turbopack)                     | 16.3.2            |
| Biblioteca UI | [React](https://react.dev/)                                                 | 19.2.8            |
| Linguagem     | [TypeScript](https://www.typescriptlang.org/) (`strict`)                    | 5.x               |
| Estilização   | [Tailwind CSS](https://tailwindcss.com/) (CSS-first, `@theme`)              | 4.x               |
| Tema          | [next-themes](https://github.com/pacocoursey/next-themes)                   | 0.4.6             |
| Utilidades    | [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 2.1.1 / 3.6.0 |
| Qualidade     | [ESLint](https://eslint.org/) (`eslint-config-next`)                        | 9.x               |

**npm, não pnpm:** projeto único, sem workspace. **Turbopack** é o padrão desde o Next 16, sem flag.

> ⚠️ **Não existe `tailwind.config.js`.** Na v4 a configuração é CSS: os tokens ficam no `@theme` de
> `src/app/globals.css`, e é ele que gera as utilities.

> ⚠️ **Não há Prettier nem suíte de testes neste projeto.** Os gates são `lint`, `typecheck` e
> `build`.

---

## Estrutura do projeto

```
Website-rookhub/
├── .claude/              # Instruções de agente
├── docs/                 # Regras, design, deploy e PRD
├── public/images/        # Marca RookHub
├── public/logos/         # Logotipos de outras empresas
├── scripts/dev.mjs       # Envoltório do `next dev`
└── src/
    ├── app/              # App Router: só o que vira URL
    │   ├── (marketing)/  # → /, /precos e /contato. Os parênteses não entram na URL
    │   ├── globals.css   # Tailwind v4, tokens e classes do projeto
    │   └── layout.tsx · robots.ts · sitemap.ts
    ├── components/
    │   ├── ui/           # Primitivos reutilizáveis
    │   ├── layout/       # Cabeçalho, rodapé e navegação
    │   ├── marketing/    # Seções da landing
    │   ├── pricing/      # Vitrine de planos e comparativo
    │   ├── theme/        # Provider e alternador de tema
    │   └── archive/      # Variantes substituídas, guardadas de propósito
    ├── content/          # Todo o texto do site, tipado e fora do JSX
    ├── lib/              # env e utils
    └── types/            # Tipos de domínio
```

Três princípios sustentam essa divisão:

- **`app/` só tem roteamento.** O que está lá vira URL. Componente que não é rota não mora ali.
- **Componente desenha, `content/` diz o quê.** Copy muda por decisão de produto; dentro do JSX,
  corrigir uma vírgula apareceria no diff como mudança de código.
- **`archive/` é guardado, não morto.** A pasta inteira aparece como órfã em varredura de
  importações, e esse é o estado esperado. O inventário está no
  [`README.md`](src/components/archive/README.md) de lá.

A árvore normativa, com a regra de onde cada tipo de arquivo mora, está em
[`docs/rules/03-arquitetura.md`](docs/rules/03-arquitetura.md).

---

## Como executar

Requisitos: **Node.js 20 LTS ou superior** e npm.

```bash
git clone https://github.com/v2ntechnology/Website-rookhub.git
cd Website-rookhub
npm install
npm run dev
```

Acesse em [http://localhost:3000](http://localhost:3000). O site sobe e navega inteiro sem `.env`:
a única variável que existe é a URL base, e ela tem valor padrão para desenvolvimento.

| Comando | Descrição |
| ------- | --------- |
| `npm run dev` | Desenvolvimento na porta 3000 |
| `npm run build` | Build de produção |
| `npm run build:static` | Export estático em `out/`, usado no deploy |
| `npm start` | Serve o build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

### Variáveis de ambiente

O arquivo é o `.env` da raiz, ignorado pelo Git. **Nenhum arquivo de ambiente é versionado, nem um
de exemplo:** a referência de quais variáveis existem é o próprio `.env`, que nasce com as chaves
comentadas e a explicação de cada uma. Peça o modelo ao time.

| Variável | Para quê |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Base absoluta do `sitemap.xml`, do `robots.txt` e das URLs canônicas |

Só o prefixo `NEXT_PUBLIC_` chega ao navegador, então nada sigiloso pode usá-lo.

---

## Build e deploy

Antes de abrir qualquer PR, os três precisam passar:

```bash
npm run lint && npm run typecheck && npm run build
```

O site vai ao ar como **export estático** na Cloudflare (`npm run build:static` gera `out/`).
Configuração do Worker em `wrangler.jsonc`, e o passo a passo em
[`docs/deploy-cloudflare.md`](docs/deploy-cloudflare.md).

⚠️ **Nenhuma página pode depender de servidor.** Sem `cookies()`, sem `searchParams` em Server
Component, sem Server Action e sem Route Handler. Rota de metadado exporta
`dynamic = "force-static"`.

⚠️ **`npm run build:static` faz duas coisas**, por `scripts/build-static.mjs`: o export do Next e,
em seguida, `scripts/flatten-rsc-segments.mjs`. O segundo passo não é opcional. O export do Next 16
grava o payload de prefetch de cada segmento como pasta aninhada, mas o cliente o pede com o
caminho achatado por pontos, então sem a cópia todo prefetch responde 404 em produção.

---

## Convenções

A documentação do repositório tem índice próprio em [`docs/README.md`](docs/README.md), com as
regras numeradas de stack, commits, arquitetura, design system e SEO. As instruções de agente ficam
em [`.claude/`](.claude/), que é a **fonte única**: não crie `.cursor/`, `.codex/` nem
`.github/copilot-instructions.md`.

O mínimo para não tropeçar no primeiro dia:

- **Tipografia é classe própria**, não utilitário do Tailwind. Use `.type-display-hero`,
  `.type-headline-md` e as outras: elas já trazem família, peso e `clamp()` responsivo.
- **Cor literal nunca no componente.** Os tokens ficam no `globals.css`, e todo token existe nos
  dois temas.
- **Mensagem de commit é uma frase em pt-BR, sem prefixo.** Nada de `feat:`, `fix:` ou `docs:`.
- **Nunca commite direto na `main`.** Sempre `feat/*`, `fix/*` ou `chore/*`, e PR.
- Server Component é o padrão, exportação nomeada, sem `any`, e a revisão passa pelos **dois temas**
  e por 360px de largura.

⚠️ **A raiz não tem `CLAUDE.md` nem `AGENTS.md`, e não deve voltar a ter.** O Next 16 os gera quando
o `dev` roda dentro de um agente de IA, e não há como desligar. Por isso o `npm run dev` passa por
`scripts/dev.mjs`, que limpa as variáveis que denunciam o agente. Chamar `next dev` direto recria
os dois.

---

## Equipe

<table align="center">
  <tr>
    <td align="center" width="200">
      <a href="https://github.com/LucasDias777">
        <img src="https://github.com/LucasDias777.png?size=200" width="100" alt="Avatar de Lucas Dias"/>
      </a>
      <br/><br/>
      <a href="https://github.com/LucasDias777">
        <img src="https://img.shields.io/badge/Lucas%20Dias-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub de Lucas Dias"/>
      </a>
    </td>
    <td align="center" width="200">
      <a href="https://github.com/vinicim002">
        <img src="https://github.com/vinicim002.png?size=200" width="100" alt="Avatar de Vinicius"/>
      </a>
      <br/><br/>
      <a href="https://github.com/vinicim002">
        <img src="https://img.shields.io/badge/Vinicius-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub de Vinicius"/>
      </a>
    </td>
    <td align="center" width="200">
      <a href="https://github.com/Felipy116">
        <img src="https://github.com/Felipy116.png?size=200" width="100" alt="Avatar de Felipy"/>
      </a>
      <br/><br/>
      <a href="https://github.com/Felipy116">
        <img src="https://img.shields.io/badge/Felipy-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub de Felipy"/>
      </a>
    </td>
  </tr>
</table>

---

<p align="center">
  Feito com dedicação pela equipe <strong>V2N Tech</strong>
</p>
