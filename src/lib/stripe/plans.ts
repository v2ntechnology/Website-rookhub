import { publicPriceIds } from "@/lib/env";
import type { BillingInterval, Plan, PlanId } from "@/types/billing";

/**
 * Catálogo comercial do RookHub — fonte de verdade da copy e do mapeamento
 * `plano + intervalo → priceId`. Preços em centavos (BRL).
 *
 * As features vêm do PRD (`docs/prd_RookHub.md`). A versão anterior deste
 * catálogo vendia "roteirização inteligente", "gestão de jornada" e "previsão
 * de falhas com modelos preditivos" — os três estão em Fase 2 ou fora de
 * escopo (§2.2 e §2.3 do PRD); roteirização está fora de escopo em definitivo.
 *
 * O eixo comercial é `RN-016`: usuários ilimitados em todos os planos, receita
 * atrelada a veículo ativo. O que muda entre planos é o porte da frota e
 * quais módulos entram — `RN-006` reserva Segurança na Estrada e Pergunte à
 * Sua Frota para os planos superiores.
 *
 * Os valores em reais ainda NÃO foram validados comercialmente: são os do
 * catálogo anterior, mantidos para dar forma ao card.
 */
export const PLANS: readonly Plan[] = [
  {
    id: "starter",
    name: "Básico",
    tagline:
      "Para quem está saindo da planilha e quer o custo por km funcionando.",
    price: { month: 24900, year: 249000 },
    fleet: "Até 10 veículos ativos · usuários ilimitados",
    features: [
      "Cadastro de veículos, implementos, motoristas e oficinas",
      "Checklist digital de saída e devolução, com fotos e modo offline",
      "Controle de abastecimento e consumo (km/l entre tanques completos)",
      "Custo variável por quilômetro",
      "Manutenção preventiva com catálogo por marca e modelo",
      "Central de notificações e importação por planilha",
      "Suporte por e-mail",
    ],
    highlighted: false,
    cta: "Começar agora",
  },
  {
    id: "pro",
    name: "Profissional",
    tagline:
      "Para a operação que já roda e agora precisa enxergar o desvio no mesmo dia.",
    price: { month: 69900, year: 699000 },
    fleet: "Até 50 veículos ativos · usuários ilimitados",
    features: [
      "Tudo do Básico",
      "Pergunte à sua frota — assistente de IA por texto e por voz",
      "Custo operacional por km, com pedágio, motorista e seguro",
      "Detecção de anomalia de consumo por veículo",
      "Integrações de telemetria, rastreamento e cartão de combustível",
      "Painel do Dono e fechamento de período",
      "Suporte prioritário em horário comercial",
    ],
    highlighted: true,
    cta: "Assinar o Profissional",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline:
      "Para frotas grandes que querem trocar o plantão de monitoramento por análise.",
    price: { month: 189900, year: 1899000 },
    fleet: "Frota ilimitada · usuários ilimitados",
    features: [
      "Tudo do Profissional",
      "Segurança na estrada — priorização de câmeras, eventos e score de motorista",
      "Custo total por km (TCO), com depreciação e financiamento",
      "SSO corporativo e trilha de auditoria",
      "Implantação guiada com a equipe RookHub",
      "Customer Success dedicado e SLA",
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
