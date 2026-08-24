import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Superfície elevada com efeito glassmorphism. Use apenas em elementos que
 * flutuam sobre um fundo com variação — vidro sobre cor chapada não lê.
 */
export function GlassCard({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("glass rounded-2xl", className)} {...props} />;
}
