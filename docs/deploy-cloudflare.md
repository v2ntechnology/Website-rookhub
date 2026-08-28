# Deploy — site estático na Cloudflare

Estado atual: **só o site institucional vai ao ar**, como export estático
(`output: "export"` → pasta `out/`). As rotas `/api/stripe/*` ficam fora deste build.

## Build

```bash
NEXT_PUBLIC_SITE_URL=https://SEU-DOMINIO npm run build:static
```

`NEXT_PUBLIC_SITE_URL` é lida em tempo de build e alimenta `sitemap.xml`, `robots.txt` e
as URLs canônicas. **Sem ela o site publicado aponta para `http://localhost:3000`.**

As variáveis do Stripe não são necessárias neste build — nenhuma rota de servidor é gerada.

## Publicação

Duas opções, escolha uma:

**A) Workers com Static Assets via CLI** (config já versionada em `wrangler.jsonc`):

```bash
npx wrangler deploy          # publica o conteúdo de out/
npx wrangler dev             # preview local do que será publicado
```

Ajuste `name` no `wrangler.jsonc` se o projeto na Cloudflare tiver outro nome.

**B) Integração Git (Workers/Pages pelo painel):**

| Campo | Valor |
| --- | --- |
| Build command | `npm run build:static` |
| Output directory | `out` |
| Variável de build | `NEXT_PUBLIC_SITE_URL=https://SEU-DOMINIO` |

## Limitações conhecidas desta versão

- O botão de assinatura em `/precos` chama `/api/stripe/checkout`, que **não existe** no
  site estático: o usuário vê a mensagem de erro do próprio botão. Enquanto o fluxo de
  pagamento não sobe, trate `/precos` como vitrine.
- `/checkout/sucesso` é pré-renderizada; o `session_id` é lido no browser
  (`useSearchParams`), então a página funciona, mas não há provisionamento sem o webhook.
- Sem redirects, rewrites, headers ou proxy — o export estático não os suporta. Se
  precisarem, configure-os na Cloudflare (Rules) ou volte para o build completo.

## Voltar ao build completo

`npm run build` (sem `BUILD_TARGET`) reativa SSR e os Route Handlers do Stripe — os
handlers seguem versionados como `route.api.ts` (ver `.claude/rules/03-arquitetura.md`).

Ao alternar entre os dois alvos, limpe o cache de tipos antes: `rm -rf .next` — os tipos
gerados pelo build anterior ainda referenciam rotas que o outro alvo não gera.
