import { cn } from "@/lib/utils";

/**
 * ARQUIVADO por ter sido superado. Wordmark textual da fase de wireframe, que
 * existia para não introduzir cor no protótipo em escala de cinza.
 *
 * Essa fase acabou em 04/09/2026: a marca foi reaplicada e `layout/desktop-nav`
 * e `layout/mobile-nav` usam os SVGs de `public/images/`. Guardado como
 * fallback textual da marca, para o caso de um contexto sem imagem.
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
