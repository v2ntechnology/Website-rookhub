import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

interface GlassCardProps extends ComponentProps<"div"> {
  /**
   * Eleva a superfície acima dos painéis padrão (fundo 0.08, blur 24px),
   * conforme a regra de empilhamento do design system. Reserve para modais e
   * elementos de prioridade alta.
   */
  elevated?: boolean;
  /**
   * Renderiza como painel opaco, sem `backdrop-filter`, mantendo o raio e a
   * borda em gradiente. Use em grades repetidas: cada superfície de vidro
   * recompõe a cada frame, e o teto de vidro simultâneo da regra 04 é baixo
   * de propósito.
   */
  flat?: boolean;
}

/**
 * Superfície do design system. Raio de 20px e blur de 16px vêm do DESIGN.md;
 * a borda em gradiente 135deg é aplicada pelo pseudoelemento.
 *
 * O vidro só funciona sobre um fundo com variação (glow orgânico ou grid) —
 * sobre cor chapada não há o que refratar.
 */
export function GlassCard({
  className,
  elevated,
  flat,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        flat ? "panel" : "glass",
        !flat && elevated && "glass-elevated",
        "rounded-[var(--radius-card)]",
        className,
      )}
      {...props}
    />
  );
}
