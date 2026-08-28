"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { BillingInterval, PlanId } from "@/types/billing";

interface CheckoutButtonProps {
  planId: PlanId;
  interval: BillingInterval;
  label: string;
  variant?: "primary" | "secondary";
}

export function CheckoutButton({
  planId,
  interval,
  label,
  variant = "primary",
}: CheckoutButtonProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Enviamos apenas o id do plano: o priceId é resolvido no servidor.
        body: JSON.stringify({ planId, interval }),
      });

      const data: unknown = await response.json();
      const url =
        typeof data === "object" && data !== null && "url" in data
          ? (data as { url?: unknown }).url
          : undefined;

      if (!response.ok || typeof url !== "string") {
        throw new Error("checkout indisponível");
      }

      window.location.assign(url);
    } catch {
      setError("Não foi possível iniciar o checkout. Tente novamente.");
      setPending(false);
    }
  }

  return (
    <div>
      <Button
        variant={variant}
        size="lg"
        className="w-full"
        onClick={startCheckout}
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? "Redirecionando…" : label}
      </Button>
      {error ? (
        <p role="alert" className="text-danger mt-2 text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
