import { cn } from "@/lib/utils";

/**
 * Wordmark textual do wireframe.
 *
 * Os SVGs coloridos (`logoCompletaColorida.svg` / `logoCompletaBranca.svg`)
 * continuam em `public/imgs/` e voltam quando a marca for reaplicada — nesta
 * fase o logotipo é texto para não introduzir cor no protótipo.
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-lg font-bold tracking-[-0.02em] text-foreground",
        className,
      )}
    >
      RookHub
    </span>
  );
}
