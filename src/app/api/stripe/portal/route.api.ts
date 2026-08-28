import { NextResponse } from "next/server";

import { siteUrl } from "@/lib/env";
import { getStripe } from "@/lib/stripe/server";

export const dynamic = "force-dynamic";

/**
 * Abre o Customer Portal do Stripe — upgrade, troca de cartão, faturas e
 * cancelamento são delegados ao Stripe, não reimplementados aqui.
 *
 * TODO(auth): o `customerId` precisa vir da sessão do usuário autenticado.
 * Enquanto não há autenticação, a rota responde 501 para não expor o portal de
 * um cliente arbitrário informado pelo browser.
 */
export async function POST() {
  const customerId = await resolveCustomerId();

  if (!customerId) {
    return NextResponse.json(
      { error: "Autenticação necessária para acessar o portal." },
      { status: 501 },
    );
  }

  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe] falha ao criar sessão do portal:", error);
    return NextResponse.json(
      { error: "Não foi possível abrir o portal de assinatura." },
      { status: 500 },
    );
  }
}

async function resolveCustomerId(): Promise<string | null> {
  // Substituir pela leitura do customer vinculado ao usuário autenticado
  // (sessão via `cookies()`), retornando o `cus_…` correspondente.
  return null;
}
