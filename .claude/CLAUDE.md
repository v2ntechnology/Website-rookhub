# RookHub — Diretrizes do Projeto

> **Fonte única de verdade.** Toda regra, convenção e especificação deste repositório vive
> em `.claude/`. É proibido criar `.cursor/`, `.codex/`, `.github/copilot-instructions.md`
> ou qualquer outra pasta/arquivo paralelo de instruções para IA. Qualquer agente ou
> ferramenta que atue neste repositório **deve** ler `.claude/` antes de escrever código.
>
> **Não existe `CLAUDE.md` nem `AGENTS.md` na raiz** (decisão do usuário em 29/08/2026). Os dois
> foram removidos e estão no `.gitignore`. Este arquivo é o ponto de entrada, e não há ponteiro
> na raiz apontando para ele.
>
> ⚠️ **Eles voltam a aparecer no seu disco, e isso é esperado.** O Next 16 recria os dois sempre
> que o `next dev` roda de dentro de um agente de IA: ele detecta pelo `@vercel/detect-agent`, e
> num terminal comum nada acontece. Não existe opção de desligar (a lógica está em
> `node_modules/next/dist/server/lib/generate-agent-files.js`). Por isso estão ignorados: quando
> reaparecerem, **não commite**.
>
> ⚠️ **Nunca apague só um dos dois.** Se o `AGENTS.md` sumir e o `CLAUDE.md` existir, o Next
> injeta o bloco inteiro dele **dentro do `CLAUDE.md`**. Ou os dois existem, ou nenhum.

## O produto

**RookHub** é um SaaS B2B de gestão inteligente de frotas de caminhões, vendido a
transportadoras via assinatura recorrente (mensal/anual) processada pelo Stripe.

Escopo atual do repositório:
1. Site institucional (landing page, planos/preços).
2. Fluxo de assinatura: Stripe Checkout → Customer Portal → Webhooks.
3. (Futuro) Plataforma autenticada de gestão de frota.

## Índice das regras

| Documento | Conteúdo |
| --- | --- |
| [rules/01-stack.md](rules/01-stack.md) | Stack, versões e ferramentas permitidas |
| [rules/02-commits-e-branches.md](rules/02-commits-e-branches.md) | Conventional Commits, branches, PRs |
| [rules/03-arquitetura.md](rules/03-arquitetura.md) | Estrutura de pastas, Server/Client Components, TS |
| [rules/04-design-system.md](rules/04-design-system.md) | Tokens, Dark/Light Mode, Glassmorphism |
| [design/DESIGN.md](design/DESIGN.md) | Especificação de origem do design system (normativa) |
| [rules/05-stripe.md](rules/05-stripe.md) | Checkout, Portal, Webhooks, segurança |
| [rules/06-seo-performance.md](rules/06-seo-performance.md) | Metadata, Core Web Vitals, acessibilidade |

## Regras inegociáveis (resumo)

1. **`.claude/` é a única pasta de regras.** Atualize-a sempre que uma convenção mudar.
2. **Conventional Commits obrigatório**, sem qualquer menção a IA/Claude/Cursor em autor,
   co-autor, trailer ou corpo da mensagem. A autoria é exclusivamente dos desenvolvedores.
3. **Nunca commite direto na `main`.** Sempre `feat/*`, `fix/*`, `chore/*` → PR → merge.
4. **TypeScript estrito.** Sem `any`, sem `@ts-ignore`, sem `!` para silenciar o compilador.
5. **Segredos nunca no client.** `STRIPE_SECRET_KEY` e afins só em Server Components,
   Route Handlers ou Server Actions. Toda variável exposta ao browser usa `NEXT_PUBLIC_`.
6. **Este Next.js é a v16 (App Router).** As Request APIs são assíncronas
   (`headers()`, `cookies()`, `params`, `searchParams` retornam `Promise`) e `middleware.ts`
   foi substituído por `proxy.ts`. Consulte `node_modules/next/dist/docs/` antes de assumir
   qualquer API — a documentação empacotada tem precedência sobre memória prévia.

## Definition of Done

Antes de abrir um PR, os três comandos abaixo precisam passar:

```bash
npm run lint
npm run typecheck
npm run build
```
