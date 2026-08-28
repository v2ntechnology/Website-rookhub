"use client";

import { useSearchParams } from "next/navigation";

/**
 * Mostra o `session_id` devolvido pelo Stripe. É client porque a página é
 * pré-renderizada estaticamente — o parâmetro só existe no browser.
 */
export function SessionReference() {
  const sessionId = useSearchParams().get("session_id");

  if (!sessionId) {
    return null;
  }

  return (
    <p className="tabular mt-6 text-xs break-all text-faint">
      Referência: {sessionId}
    </p>
  );
}
