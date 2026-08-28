import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Superfície do wireframe. Substitui o `GlassCard` do design system:
 * caixa delimitadora simples, sem blur, sem sombra, sem gradiente.
 */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-border bg-surface p-6",
        className,
      )}
      {...props}
    />
  );
}

/** Item de lista com marcador quadrado neutro. */
export function Bullet({ className, children, ...props }: ComponentProps<"li">) {
  return (
    <li
      className={cn("relative pl-5 text-[14.5px] text-body", className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute top-2 left-0 size-2 rounded-[2px] border border-muted"
      />
      {children}
    </li>
  );
}

/** Variante negativa: o que a operação sofre hoje, sem o produto. */
export function BulletCross({
  className,
  children,
  ...props
}: ComponentProps<"li">) {
  return (
    <li
      className={cn("relative pl-5 text-[14.5px] text-body", className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 leading-6 text-muted"
      >
        ×
      </span>
      {children}
    </li>
  );
}
