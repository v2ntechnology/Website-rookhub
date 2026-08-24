export type BillingInterval = "month" | "year";

export type PlanId = "starter" | "pro" | "enterprise";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  /** Preço em centavos por intervalo de cobrança. */
  price: Record<BillingInterval, number>;
  /** Faixa de frota atendida, exibida no card. */
  fleet: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}
