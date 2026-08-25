import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Logotipo RookHub. O asset colorido tem texto em Midnight (`#0B1220`) e o
 * branco tem texto em `#F8FAFC`, então cada tema usa o seu.
 *
 * A troca é feita por CSS, e não pelo tema resolvido em JS: assim o logo certo
 * já vem no HTML do servidor, sem flash nem custo de hidratação.
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <>
      <Image
        src="/imgs/logoCompletaColorida.svg"
        alt="RookHub"
        width={556}
        height={120}
        priority
        className={cn("dark:hidden", className)}
      />
      <Image
        src="/imgs/logoCompletaBranca.svg"
        alt="RookHub"
        width={556}
        height={120}
        priority
        aria-hidden="true"
        className={cn("hidden dark:block", className)}
      />
    </>
  );
}
