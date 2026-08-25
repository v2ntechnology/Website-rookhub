import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "tertiary";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] " +
  "font-medium transition-colors disabled:pointer-events-none disabled:opacity-60";

/**
 * As três variantes do DESIGN.md.
 *
 * O primário deveria usar o Spectrum Gradient, mas o documento não define
 * nenhum dos 7 stops — enquanto isso não chegar, usa preenchimento sólido
 * `--color-brand`. Ver "Pendências" na regra 04.
 */
const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-foreground hover:bg-brand-bright",
  secondary: "glass glass-elevated text-brand-text hover:text-foreground",
  tertiary: "text-brand-text hover:bg-surface-container",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
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
