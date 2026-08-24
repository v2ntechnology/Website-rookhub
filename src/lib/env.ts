/**
 * Leitura de variáveis de ambiente com falha explícita.
 *
 * `process.env` não pode ser indexado dinamicamente no client: o Next substitui
 * `process.env.NEXT_PUBLIC_*` estaticamente no bundle. Por isso as públicas são
 * referenciadas literalmente.
 */

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Variável de ambiente ausente: ${name}. Consulte .env.example.`,
    );
  }
  return value;
}

/** Só pode ser chamado no servidor. */
export const serverEnv = {
  get stripeSecretKey() {
    return required(process.env.STRIPE_SECRET_KEY, "STRIPE_SECRET_KEY");
  },
  get stripeWebhookSecret() {
    return required(process.env.STRIPE_WEBHOOK_SECRET, "STRIPE_WEBHOOK_SECRET");
  },
};

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** IDs de price expostos ao bundle — não são segredos. */
export const publicPriceIds = {
  starter: {
    month: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY,
    year: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY,
  },
  pro: {
    month: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
    year: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY,
  },
  enterprise: {
    month: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY,
    year: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY,
  },
} as const;
