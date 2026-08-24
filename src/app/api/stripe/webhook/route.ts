import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { serverEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe/server";

export const dynamic = "force-dynamic";

/**
 * Recebe os eventos de assinatura do Stripe.
 *
 * Duas regras inegociáveis:
 * 1. A assinatura é verificada sobre o corpo BRUTO (`request.text()`). Chamar
 *    `request.json()` antes invalida a verificação.
 * 2. O processamento é idempotente — o Stripe reentrega o mesmo evento.
 */
export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Assinatura ausente." },
      { status: 400 },
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      serverEnv.stripeWebhookSecret,
    );
  } catch (error) {
    console.error("[stripe] assinatura de webhook inválida:", error);
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  if (await alreadyProcessed(event.id)) {
    return NextResponse.json({ received: true, duplicated: true });
  }

  try {
    await handleEvent(event);
    await markProcessed(event.id);
  } catch (error) {
    // Erro real: devolve 500 para o Stripe reentregar o evento.
    console.error(`[stripe] falha ao processar ${event.type}:`, error);
    return NextResponse.json(
      { error: "Falha ao processar evento." },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}

async function handleEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      // TODO(persistência): vincular customer + subscription à conta e liberar acesso.
      console.info(
        `[stripe] checkout concluído: customer=${String(session.customer)} ` +
          `subscription=${String(session.subscription)} plano=${session.metadata?.planId}`,
      );
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      // TODO(persistência): sincronizar plano, status e fim do período.
      console.info(
        `[stripe] assinatura ${event.type}: id=${subscription.id} status=${subscription.status}`,
      );
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      // TODO(persistência): revogar acesso ao fim do período pago.
      console.info(`[stripe] assinatura cancelada: id=${subscription.id}`);
      break;
    }

    case "invoice.paid": {
      // TODO(persistência): registrar renovação bem-sucedida.
      console.info(`[stripe] fatura paga: id=${event.data.object.id}`);
      break;
    }

    case "invoice.payment_failed": {
      // TODO(persistência): marcar inadimplência e notificar o cliente.
      console.warn(`[stripe] pagamento falhou: fatura=${event.data.object.id}`);
      break;
    }

    default:
      // Eventos não assinados são ignorados de propósito.
      break;
  }
}

/**
 * Guarda de idempotência.
 *
 * TODO(persistência): trocar pelo armazenamento durável do `event.id` (tabela
 * ou Redis). Em memória isto não sobrevive a restart nem escala horizontalmente.
 */
const processedEvents = new Set<string>();

async function alreadyProcessed(eventId: string): Promise<boolean> {
  return processedEvents.has(eventId);
}

async function markProcessed(eventId: string): Promise<void> {
  processedEvents.add(eventId);
}
