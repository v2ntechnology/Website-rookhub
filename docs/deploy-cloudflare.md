# Deploy — site estático na Cloudflare

Estado atual: **só o site institucional vai ao ar**, como export estático
(`output: "export"` → pasta `out/`). O site não tem rota de servidor: tudo que existe é
pré-renderizado.

## Build

```bash
NEXT_PUBLIC_SITE_URL=https://SEU-DOMINIO npm run build:static
```

`NEXT_PUBLIC_SITE_URL` é lida em tempo de build e alimenta `sitemap.xml`, `robots.txt` e
as URLs canônicas. **Sem ela o site publicado aponta para `http://localhost:3000`.**

É a única variável do projeto: não há chave de serviço nem segredo neste build.

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

- **`/precos` é vitrine, não cobrança.** Não há checkout: os CTAs de plano levam a `/contato`.
  A integração com o Stripe foi removida em 05/09/2026, justamente porque nunca chegou a
  existir no site publicado.
- Sem redirects, rewrites, headers ou proxy, que o export estático não suporta. Se
  precisarem, configure-os na Cloudflare (Rules).

## Se um dia voltar a haver rota de servidor

`npm run build` (sem `BUILD_TARGET`) produz o build normal do Next, com SSR disponível. Hoje os
dois alvos geram o mesmo conteúdo, porque todas as rotas são estáticas.

Ao alternar entre os alvos, limpe o cache de tipos antes (`rm -rf .next`): os tipos gerados pelo
build anterior ainda referenciam rotas que o outro alvo não gera.
