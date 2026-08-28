<div align="center">
  <img src="public/imgs/logoCompletaColorida.svg#gh-light-mode-only" alt="RookHub" width="360">
  <img src="public/imgs/logoCompletaBranca.svg#gh-dark-mode-only" alt="RookHub" width="360">
  <p><strong>Gestão inteligente de frotas de caminhões</strong></p>
</div>

---

Site institucional e plataforma de assinaturas do **RookHub** — um SaaS B2B que reúne
telemetria, manutenção preventiva e custo por quilômetro em um único painel para
transportadoras.

Este repositório contém hoje o site público (landing page e planos) e o fluxo completo de
assinatura recorrente via Stripe. A plataforma autenticada de gestão de frota ainda não faz
parte deste código.

## Stack

| Camada     | Escolha                                                         |
| ---------- | --------------------------------------------------------------- |
| Framework  | Next.js 16 · App Router · Server Components · Turbopack         |
| Linguagem  | TypeScript em modo estrito                                      |
| UI         | React 19                                                        |
| Estilos    | TailwindCSS 4 (configuração em CSS, sem `tailwind.config.js`)   |
| Tipografia | Sora (títulos) + Inter (corpo), auto-hospedadas via `next/font` |
| Tema       | `next-themes`, estratégia de classe, claro e escuro             |
| Pagamentos | Stripe — Checkout Sessions, Customer Portal e Webhooks          |

## Começando

Requisitos: **Node.js 20+** e npm.

```bash
npm install
cp .env.example .env.local   # preencha as chaves
npm run dev
```

A aplicação sobe em <http://localhost:3000>.

### Variáveis de ambiente

| Variável                                       | Escopo   | Descrição                                         |
| ---------------------------------------------- | -------- | ------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                         | público  | URL absoluta; base das URLs de retorno do Stripe  |
| `STRIPE_SECRET_KEY`                            | servidor | chave secreta (`sk_…`) — nunca exposta ao browser |
| `STRIPE_WEBHOOK_SECRET`                        | servidor | segredo de verificação do webhook (`whsec_…`)     |
| `NEXT_PUBLIC_STRIPE_PRICE_<PLANO>_<INTERVALO>` | público  | ID do Price recorrente de cada plano              |

São seis Price IDs: `STARTER`, `PRO` e `ENTERPRISE`, cada um em `MONTHLY` e `YEARLY`.
Sem eles, `/api/stripe/checkout` responde `503` — é o comportamento esperado, não um bug.

`.env.local` nunca é commitado. Mudou o contrato de variáveis? Atualize o `.env.example`.

## Scripts

```bash
npm run dev        # desenvolvimento
npm run build      # build de produção
npm run start      # servidor de produção
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

Os três últimos precisam passar antes de qualquer PR.

## Estrutura

```
.claude/                 # regras do projeto — leia antes de contribuir
├── CLAUDE.md            # índice e regras inegociáveis
├── design/DESIGN.md     # especificação do design system (normativa)
└── rules/               # stack, commits, arquitetura, design, Stripe, SEO
src/
├── app/                 # App Router: rotas e composição
│   ├── precos/          # tabela de planos
│   ├── checkout/        # páginas de retorno do Stripe
│   └── api/stripe/      # checkout, portal e webhook
├── components/          # layout, marketing, pricing, theme, ui
├── lib/                 # env, utils e integração Stripe
└── types/               # tipos de domínio
docs/                    # PRD, arquitetura e especificações de produto
public/imgs/             # logotipos e ícones
public/wireframe/        # referência estática do wireframe validado
```

## Fluxo de assinatura

1. O visitante escolhe plano e intervalo em `/precos`.
2. O client chama `POST /api/stripe/checkout` enviando **apenas** `{ planId, interval }`.
3. O servidor resolve o `priceId` correspondente e cria a Checkout Session.
4. O Stripe redireciona para `/checkout/sucesso` ou `/checkout/cancelado`.
5. O provisionamento acontece **exclusivamente pelo webhook**, nunca na página de sucesso.

> **Por que o client não envia o `priceId`:** aceitar um preço vindo do browser permitiria a
> qualquer visitante assinar qualquer Price da conta Stripe, inclusive um de R$ 0. O
> identificador do plano é traduzido para preço no servidor, em `src/lib/stripe/plans.ts`.

### Testando webhooks localmente

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

Use sempre chaves de **test mode** em desenvolvimento. Cartão de teste: `4242 4242 4242 4242`.

## Design system

A especificação vive em [`.claude/design/DESIGN.md`](.claude/design/DESIGN.md) e as decisões
de implementação em [`.claude/rules/04-design-system.md`](.claude/rules/04-design-system.md).

> **Fase atual: wireframe em escala de cinza.** O site está reduzido a um protótipo de baixa
> fidelidade para validar estrutura de seções, hierarquia e copy sem que a estética interfira
> na leitura. O que vale hoje em `src/`:
>
> - Só preto, branco e cinzas. **Nenhuma cor cromática entra** enquanto o protótipo estiver em
>   validação — sem Indigo, sem Cyan, sem Spectrum Gradient, sem glassmorphism, sem glow. A
>   exceção única e registrada é o `--color-brand` do "hub" na assinatura de rodapé.
> - Raio único de `6px`; superfícies são caixas com borda de `1px`.
> - Preservados do design system: as duas famílias (Sora/Inter), a escala tipográfica,
>   `tabular-nums`, alvo de toque de 44px e respeito a `prefers-reduced-motion`.
>
> A marca (**Total Glassmorphism**: painéis translúcidos sobre fundo escuro com glows
> orgânicos) continua normativa para a reaplicação depois da validação de conteúdo. A
> implementação anterior — tokens de marca, `glass-card`, `glow`, `spectrum-edge` — está
> recuperável no commit `4105812`.

Dois pontos da especificação que valem para quando a marca voltar:

- O indigo de preenchimento é `#5457EE`, e não o `#6366F1` da especificação — o original
  reprova AA com texto branco (4.47:1). O `#6366F1` segue reservado a glows e indicadores,
  onde nunca há texto por cima.
- Superfície de vidro tem orçamento: `backdrop-filter` recompõe a cada frame, então o teto é
  de ~6 superfícies simultâneas no viewport.

## Contribuindo

As regras completas estão em [`.claude/`](.claude/) — essa pasta é a **fonte única** de
diretrizes do projeto. Não crie `.cursor/`, `.codex/` ou equivalentes.

O essencial:

- **Conventional Commits** obrigatório: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`…
- **Nunca commite direto na `main`.** Trabalhe em `feat/*` ou `fix/*` e abra PR.
- Nenhum commit pode atribuir autoria a IA — sem `Co-Authored-By` de assistente, sem
  assinatura de ferramenta. A autoria é dos desenvolvedores.
- `lint`, `typecheck` e `build` verdes antes de pedir review.
- Revise a mudança nos **dois temas** e em viewport móvel.
