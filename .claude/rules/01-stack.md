# 01 — Stack e Ferramentas

## Versões fixadas

| Camada | Escolha | Versão |
| --- | --- | --- |
| Framework | Next.js (App Router, Server Components) | 16.x |
| Runtime UI | React / React DOM | 19.x |
| Linguagem | TypeScript (`strict: true`) | 5.x |
| Estilização | TailwindCSS (config em CSS, sem `tailwind.config.js`) | 4.x |
| Tema | `next-themes` (estratégia `class`) | 0.4.x |
| Pagamentos | `stripe` (server) + `@stripe/stripe-js` (client) | 22.x / 9.x |
| Utilidades | `clsx` + `tailwind-merge` (helper `cn`) | — |
| Lint | ESLint flat config (`eslint-config-next`) | 9.x |
| Gerenciador | **npm** (o `package-lock.json` é a fonte de verdade) | — |

## Regras de dependência

- **Não adicione bibliotecas sem necessidade real.** Antes de instalar, verifique se a
  plataforma (Next/React/Tailwind) já resolve o problema.
- Proibido: bibliotecas de CSS-in-JS runtime, jQuery, moment.js, `axios` (use `fetch`).
- Componentes de UI são escritos no próprio repositório (`src/components/ui`) — não
  adote uma biblioteca de componentes fechada sem decisão arquitetural registrada aqui.
- Toda nova dependência precisa de uma linha de justificativa no PR.

## Tailwind v4

Não existe `tailwind.config.js`. A configuração vive em `src/app/globals.css`:

- `@import "tailwindcss";`
- `@theme` define os tokens (cores, fontes, raios, sombras) e gera as utilities.
- `@custom-variant dark` conecta o Tailwind à classe `.dark` do `next-themes`.

## Scripts

```bash
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção
npm run start      # servidor de produção
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```
