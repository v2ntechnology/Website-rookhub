import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Une classes condicionais resolvendo conflitos de utilities do Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}
