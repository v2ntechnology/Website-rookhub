"use client";

import { useState } from "react";

import { PlanCard } from "@/components/pricing/plan-card";
import { ButtonLink } from "@/components/ui/button";
import { PLANS } from "@/content/plans";
import type { BillingInterval } from "@/types/billing";

const intervals: { value: BillingInterval; label: string; note?: string }[] = [
  { value: "month", label: "Mensal" },
  { value: "year", label: "Anual", note: "2 meses grátis" },
];

export function PricingTable() {
  const [interval, setInterval] = useState<BillingInterval>("month");

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Intervalo de cobrança"
        className="price-toggle mx-auto"
      >
        {intervals.map((option) => {
          const active = interval === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setInterval(option.value)}
              data-active={active}
              className="price-toggle-option"
            >
              {option.label}
              {option.note ? (
                <span className="price-toggle-note">{option.note}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Até `lg` os cartões ficam em coluna única: com três planos, duas
          colunas deixariam o terceiro órfão, e três colunas em 768px dão
          226px de largura, estreito demais para preço, botão e lista.
          A coluna é centrada e limitada para o cartão não esticar. */}
      <ul className="mx-auto mt-10 grid max-w-md items-start gap-5 sm:mt-12 lg:max-w-none lg:grid-cols-3">
        {PLANS.map((plan) => (
          <li key={plan.id} id={`plano-${plan.id}`} className="h-full scroll-mt-28">
            <PlanCard
              plan={plan}
              interval={interval}
              action={
                <ButtonLink
                  href="/contato"
                  size="lg"
                  variant={plan.highlighted ? "primary" : "secondary"}
                  className="w-full"
                >
                  {plan.cta}
                </ButtonLink>
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
