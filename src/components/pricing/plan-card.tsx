import type { ReactNode } from "react";

import { Bullet, Card } from "@/components/ui/card";
import { MONTHS_IN_YEAR } from "@/lib/stripe/plans";
import { cn, formatBRL } from "@/lib/utils";
import type { BillingInterval, Plan } from "@/types/billing";

interface PlanCardProps {
  plan: Plan;
  interval: BillingInterval;
  /** Botão de ação: checkout em /precos, link para /precos na landing. */
  action: ReactNode;
}

/**
 * Card de plano compartilhado entre a prévia da landing e a tabela de /precos,
 * para que a copy comercial exista em um lugar só (`lib/stripe/plans.ts`).
 */
export function PlanCard({ plan, interval, action }: PlanCardProps) {
  const monthly =
    interval === "year" ? plan.price.year / MONTHS_IN_YEAR : plan.price.month;

  return (
    <Card
      className={cn(
        "flex h-full flex-col",
        plan.highlighted && "border-2 border-foreground",
      )}
    >
      {plan.highlighted ? (
        <p className="type-label-md mb-3 w-fit rounded-full border border-foreground px-2.5 py-1 uppercase">
          Mais contratado
        </p>
      ) : null}

      <h3 className="type-headline-md">{plan.name}</h3>
      <p className="mt-1.5 text-sm text-muted">{plan.tagline}</p>

      <p className="mt-5 flex items-baseline gap-1">
        <span className="font-display tabular text-[34px] font-bold tracking-[-0.02em]">
          {formatBRL(monthly)}
        </span>
        <span className="text-sm text-muted">/mês</span>
      </p>
      <p className="mt-1 text-sm text-muted">
        {interval === "year"
          ? `${formatBRL(plan.price.year)} cobrados anualmente`
          : "Cobrança mensal recorrente"}
      </p>

      <p className="my-4 border-y border-border py-3 text-[13px] text-muted">
        {plan.fleet}
      </p>

      <ul className="mb-5 flex-1 space-y-2">
        {plan.features.map((feature) => (
          <Bullet key={feature}>{feature}</Bullet>
        ))}
      </ul>

      <div className="mt-auto">{action}</div>
    </Card>
  );
}
