import { publicPriceIds } from "@/lib/env";
import type { BillingInterval, Plan, PlanId } from "@/types/billing";

/**
 * Catálogo comercial do RookHub — fonte de verdade da copy e do mapeamento
 * `plano + intervalo → priceId`. Preços em centavos (BRL).
 */
export const PLANS: readonly Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Para transportadoras que estão saindo da planilha.",
    price: { month: 24900, year: 249000 },
    fleet: "Até 10 caminhões",
    features: [
      "Rastreamento de posição em tempo real",
      "Checklist digital de viagem",
      "Controle de abastecimento e consumo",
      "Alertas de manutenção preventiva",
      "Relatórios mensais de frota",
      "Suporte por e-mail",
    ],
    highlighted: false,
    cta: "Começar agora",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Operação multi-filial com inteligência de custos.",
    price: { month: 69900, year: 699000 },
    fleet: "Até 50 caminhões",
    features: [
      "Tudo do Starter",
      "Roteirização inteligente com previsão de consumo",
      "Telemetria e score de direção por motorista",
      "Gestão de jornada e documentos do motorista",
      "Custo por quilômetro rodado em tempo real",
      "Integrações via API e webhooks",
      "Suporte prioritário em horário comercial",
    ],
    highlighted: true,
    cta: "Assinar o Pro",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Frotas grandes, SLA dedicado e governança.",
    price: { month: 189900, year: 1899000 },
    fleet: "Frota ilimitada",
    features: [
      "Tudo do Pro",
      "Previsão de falhas com modelos preditivos",
      "Painéis e indicadores personalizados",
      "SSO corporativo e trilha de auditoria",
      "Ambiente de homologação dedicado",
      "Customer Success dedicado e SLA 24/7",
    ],
    highlighted: false,
    cta: "Falar com vendas",
  },
] as const;

export function getPlan(planId: string): Plan | undefined {
  return PLANS.find((plan) => plan.id === planId);
}

export function isBillingInterval(value: unknown): value is BillingInterval {
  return value === "month" || value === "year";
}

export function isPlanId(value: unknown): value is PlanId {
  return PLANS.some((plan) => plan.id === value);
}

/**
 * Resolve o Price do Stripe. Chamado apenas no servidor: o client envia o id do
 * plano, nunca um `priceId` — aceitar preço vindo do browser permitiria assinar
 * qualquer valor da conta Stripe.
 */
export function resolvePriceId(
  planId: PlanId,
  interval: BillingInterval,
): string | undefined {
  return publicPriceIds[planId][interval];
}

/** Usado para exibir o equivalente mensal do plano anual. */
export const MONTHS_IN_YEAR = 12;
