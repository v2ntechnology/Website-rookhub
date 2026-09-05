/**
 * Variáveis de ambiente do site.
 *
 * `process.env` não pode ser indexado dinamicamente no client: o Next substitui
 * `process.env.NEXT_PUBLIC_*` estaticamente no bundle. Por isso as públicas são
 * referenciadas literalmente, nunca por `process.env[nome]`.
 */

/** Base absoluta do sitemap, do robots e das URLs de Open Graph. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
