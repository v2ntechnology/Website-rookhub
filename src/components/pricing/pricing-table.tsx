"use client";

import { useState } from "react";

import { CheckoutButton } from "@/components/pricing/checkout-button";
import { PlanCard } from "@/components/pricing/plan-card";
import { PLANS } from "@/lib/stripe/plans";
import { cn } from "@/lib/utils";
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
        className="mt-8 flex w-fit overflow-hidden rounded-[var(--radius-control)] border border-border bg-surface"
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
              className={cn(
                "px-4 py-2.5 text-sm transition-colors",
                active
                  ? "bg-foreground font-semibold text-background"
                  : "text-muted hover:text-foreground",
              )}
            >
              {option.label}
              {option.note ? (
                <span className="ml-2 text-xs">· {option.note}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <ul className="mt-8 grid items-start gap-5 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <li key={plan.id} className="h-full">
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
