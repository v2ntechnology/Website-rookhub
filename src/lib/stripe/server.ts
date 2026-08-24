import "server-only";

import Stripe from "stripe";

import { serverEnv } from "@/lib/env";

let client: Stripe | undefined;

/**
 * Instância única do SDK do Stripe. Criada sob demanda para que o build não
 * exija `STRIPE_SECRET_KEY` presente em tempo de compilação.
 */
export function getStripe(): Stripe {
  if (!client) {
    client = new Stripe(serverEnv.stripeSecretKey, {
      appInfo: { name: "RookHub", url: "https://rookhub.com.br" },
      typescript: true,
    });
  }
  return client;
}
