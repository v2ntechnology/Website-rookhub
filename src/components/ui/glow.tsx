import { cn } from "@/lib/utils";

/**
 * Glow orgânico: radial suave com blur de 100px a 15% de opacidade, atrás das
 * camadas de vidro. É o que dá ao vidro algo para refratar — sem isso a
 * superfície translúcida não lê.
 */
export function OrganicGlow({
  tone = "brand",
  className,
}: {
  tone?: "brand" | "accent";
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "organic-glow",
        tone === "brand" ? "organic-glow-brand" : "organic-glow-accent",
        className,
      )}
    />
  );
}
