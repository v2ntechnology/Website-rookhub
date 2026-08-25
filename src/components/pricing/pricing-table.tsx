"use client";

import { useState } from "react";

import { CheckoutButton } from "@/components/pricing/checkout-button";
import { GlassCard } from "@/components/ui/glass-card";
import { MONTHS_IN_YEAR, PLANS } from "@/lib/stripe/plans";
import { cn, formatBRL } from "@/lib/utils";
import type { BillingInterval } from "@/types/billing";

const intervals: { value: BillingInterval; label: string }[] = [
  { value: "month", label: "Mensal" },
  { value: "year", label: "Anual" },
];

export function PricingTable() {
  const [interval, setInterval] = useState<BillingInterval>("month");

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Intervalo de cobrança"
        className="glass mx-auto mt-10 flex w-fit items-center gap-1 rounded-[var(--radius-control)] p-1"
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
                "rounded-[calc(var(--radius-control)-2px)] px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brand text-brand-foreground"
                  : "text-muted hover:text-foreground",
              )}
            >
              {option.label}
              {option.value === "year" ? (
                <span className={cn("ml-2 text-xs", !active && "text-brand-text")}>
                  2 meses grátis
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <ul className="mt-12 grid items-start gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <li key={plan.id}>
            <GlassCard
              className={cn(
                "flex h-full flex-col p-7",
                plan.highlighted && "ring-brand ring-2 lg:-my-4 lg:py-11",
              )}
            >
              {plan.highlighted ? (
                <p className="type-label-md bg-brand text-brand-foreground mb-4 w-fit rounded-full px-3 py-1">
                  Mais escolhido
                </p>
              ) : null}

              <h3 className="type-headline-md">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted">{plan.tagline}</p>

              <p className="mt-6 flex items-baseline gap-1">
                <span className="font-display tabular text-4xl font-bold tracking-tight">
                  {formatBRL(
                    interval === "year"
                      ? plan.price.year / MONTHS_IN_YEAR
                      : plan.price.month,
                  )}
                </span>
                <span className="text-sm text-muted">/mês</span>
              </p>
              <p className="mt-1 text-sm text-muted">
                {interval === "year"
                  ? `${formatBRL(plan.price.year)} cobrados anualmente`
                  : "Cobrança mensal recorrente"}
              </p>

              <p className="text-brand-text mt-4 text-sm font-medium">{plan.fleet}</p>

              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <svg
                      viewBox="0 0 20 20"
                      className="text-accent mt-0.5 size-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m4 10.5 4 4 8-9" />
                    </svg>
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <CheckoutButton
                  planId={plan.id}
                  interval={interval}
                  label={plan.cta}
                  variant={plan.highlighted ? "primary" : "secondary"}
                />
              </div>
            </GlassCard>
          </li>
        ))}
      </ul>
    </div>
  );
}
