"use client";

import { useState } from "react";

import { CheckoutButton } from "@/components/pricing/checkout-button";
import { PlanCard } from "@/components/pricing/plan-card";
import { PLANS } from "@/lib/stripe/plans";
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

      <ul className="mt-12 grid items-start gap-5 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <li key={plan.id} id={`plano-${plan.id}`} className="h-full scroll-mt-28">
            <PlanCard
              plan={plan}
              interval={interval}
              action={
                <CheckoutButton
                  planId={plan.id}
                  interval={interval}
                  label={plan.cta}
                  variant={plan.highlighted ? "primary" : "secondary"}
                />
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
