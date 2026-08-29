import type { ReactNode } from "react";

import { MONTHS_IN_YEAR } from "@/lib/stripe/plans";
import { cn, formatBRL } from "@/lib/utils";
import type { BillingInterval, Plan } from "@/types/billing";

interface PlanCardProps {
  plan: Plan;
  interval: BillingInterval;
  /** Botão de ação: checkout em /precos, link para /precos na landing. */
  action: ReactNode;
}

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="price-check"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/**
 * Card de plano compartilhado entre a prévia da landing e a tabela de /precos,
 * para que a copy comercial exista em um lugar só (`lib/stripe/plans.ts`).
 *
 * A ordem é a de uma página de preço: nome, preço, ação e só então a lista.
 * Quem está comparando decide pelo preço e pelo botão — a lista é conferência.
 */
export function PlanCard({ plan, interval, action }: PlanCardProps) {
  const monthly =
    interval === "year" ? plan.price.year / MONTHS_IN_YEAR : plan.price.month;

  return (
    <div className={cn("price-card", plan.highlighted && "price-card-featured")}>
      {/* Envolve: em cartão estreito, "Profissional" + o selo não cabem na
          mesma linha e o selo empurrava o conteúdo para fora do cartão. */}
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <h3 className="font-display text-[19px] font-semibold">{plan.name}</h3>
        {plan.highlighted ? (
          <span className="price-badge">Mais contratado</span>
        ) : null}
      </div>

      <p className="mt-2 min-h-[42px] text-sm leading-relaxed text-muted">
        {plan.tagline}
      </p>

      <p className="mt-6 flex items-baseline gap-1.5">
        <span className="price-amount">{formatBRL(monthly)}</span>
        <span className="text-sm text-muted">/ mês</span>
      </p>
      <p className="mt-1.5 text-[13px] text-faint">
        {interval === "year"
          ? `${formatBRL(plan.price.year)} cobrados uma vez por ano`
          : "Cobrança mensal recorrente, sem fidelidade"}
      </p>

      <div className="mt-6">{action}</div>

      <p className="mt-7 text-[13px] font-semibold">{plan.fleet}</p>

      <ul className="mt-4 space-y-2.5 border-t border-border pt-5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2.5">
            <Check />
            <span className="text-[13.5px] leading-relaxed text-body">
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
