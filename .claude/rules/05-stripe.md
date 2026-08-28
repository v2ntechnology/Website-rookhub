# 05 — Integração Stripe (Assinaturas Recorrentes)

> **Estado atual:** o site em produção é um export estático na Cloudflare e **não expõe as
> rotas `/api/stripe/*`** — o fluxo de assinatura só funciona no build completo
> (`npm run build` / `npm run dev`). O código abaixo continua válido e é o alvo quando o
> app voltar a rodar com servidor. Os handlers vivem em `route.api.ts` (ver regra 03).

## Modelo comercial

Um **Product** por plano (Starter, Pro, Enterprise) e dois **Prices** recorrentes por plano
(`month` e `year`). O catálogo do site vive em `src/lib/stripe/plans.ts` — é a fonte de
verdade para copy, features e mapeamento `plano+intervalo → priceId`.

## Variáveis de ambiente

| Variável | Escopo | Descrição |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | server | chave secreta (`sk_…`) — **nunca** no client |
| `STRIPE_WEBHOOK_SECRET` | server | segredo de verificação (`whsec_…`) |
| `NEXT_PUBLIC_STRIPE_PRICE_*` | client | IDs de price por plano/intervalo |
| `NEXT_PUBLIC_SITE_URL` | client | URL absoluta, base das URLs de retorno |

`.env.local` **nunca** é commitado. Mudou o contrato? Atualize `.env.example`.

## Fluxo de assinatura

1. Usuário escolhe plano e intervalo em `/precos`.
2. Client faz `POST /api/stripe/checkout` com `{ planId, interval }`.
3. O Route Handler resolve o `priceId` **no servidor** e cria a Checkout Session
   (`mode: "subscription"`), devolvendo a `url`.
4. Redirect para o Stripe; retorno em `/checkout/sucesso` ou `/checkout/cancelado`.
5. O provisionamento **só acontece via webhook**, nunca na página de sucesso.
6. Gestão da assinatura (upgrade, cartão, cancelamento) é delegada ao **Customer Portal**
   via `POST /api/stripe/portal` — não reimplemente essas telas.

## Regras de segurança (não negociáveis)

- **Nunca confie em preço, valor ou `priceId` vindos do client.** O client envia um
  identificador de plano; o servidor resolve o price real. Aceitar `priceId` arbitrário
  permite ao usuário assinar qualquer preço da conta.
- O webhook **precisa** verificar a assinatura com `stripe.webhooks.constructEvent` usando o
  corpo **bruto** (`await request.text()`). Nunca faça `request.json()` antes de verificar.
- Handler de webhook é **idempotente**: o Stripe reentrega eventos. Registre o `event.id`
  processado antes de aplicar efeitos colaterais.
- Responda `2xx` rápido. Trabalho pesado vai para fila; erro real devolve `4xx/5xx` para o
  Stripe reentregar.
- Route Handlers do Stripe são sempre dinâmicos (`export const dynamic = "force-dynamic"`).

## Eventos tratados

| Evento | Efeito |
| --- | --- |
| `checkout.session.completed` | vincula cliente ↔ assinatura, libera acesso |
| `customer.subscription.created` / `.updated` | sincroniza plano, status e período |
| `customer.subscription.deleted` | revoga acesso ao fim do período |
| `invoice.paid` | confirma renovação |
| `invoice.payment_failed` | marca inadimplência e notifica |

## Testes locais

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

Use sempre chaves de **test mode** em desenvolvimento. Cartão de teste: `4242 4242 4242 4242`.
