import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { siteUrl } from "@/lib/env";
import {
  getPlan,
  isBillingInterval,
  isPlanId,
  resolvePriceId,
} from "@/lib/stripe/plans";
import { getStripe } from "@/lib/stripe/server";

export const dynamic = "force-dynamic";

/**
 * Cria uma Checkout Session de assinatura.
 *
 * O corpo traz apenas `planId` e `interval`. O `priceId` é resolvido aqui, no
 * servidor: aceitar um price vindo do browser permitiria ao usuário assinar
 * qualquer preço existente na conta Stripe.
 */
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const { planId, interval } = (body ?? {}) as Record<string, unknown>;

    if (!isPlanId(planId) || !isBillingInterval(interval)) {
      return NextResponse.json(
        { error: "Plano ou intervalo de cobrança inválido." },
        { status: 400 },
      );
    }

    const priceId = resolvePriceId(planId, interval);
    if (!priceId) {
      console.error(
        `[stripe] price não configurado para ${planId}/${interval}. Verifique .env`,
      );
      return NextResponse.json(
        { error: "Plano indisponível no momento." },
        { status: 503 },
      );
    }

    const plan = getPlan(planId);
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancelado`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      // Metadata é o que o webhook usa para saber o que provisionar.
      metadata: { planId, interval },
      subscription_data: {
        metadata: { planId, interval },
        description: plan ? `RookHub ${plan.name}` : undefined,
      },
    });

    if (!session.url) {
      throw new Error("Checkout Session criada sem URL de redirecionamento.");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    // O detalhe fica no log do servidor; o cliente recebe mensagem genérica.
    console.error("[stripe] falha ao criar checkout session:", error);
    return NextResponse.json(
      { error: "Não foi possível iniciar o checkout." },
      { status: 500 },
    );
  }
}
