import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "tertiary";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] " +
  "border font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60";

/**
 * Wireframe: as três variantes se distinguem por peso de borda e
 * preenchimento, nunca por cor. Alvo mínimo de 44px no tamanho `md`.
 */
const variants: Record<Variant, string> = {
  primary:
    "border-foreground bg-foreground text-background hover:bg-body hover:border-body",
  secondary:
    "border-foreground bg-surface text-foreground hover:bg-surface-container",
  tertiary:
    "border-transparent text-body hover:bg-surface-container hover:text-foreground",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props} />
  );
}

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
