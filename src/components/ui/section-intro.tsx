import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Abertura editorial compartilhada pelas seções escuras: rótulo com fio,
 * palavra fantasma atrás da manchete, título à esquerda e texto de apoio
 * à direita. Mantém as cinco seções abrindo do mesmo jeito.
 */
export function SectionIntro({
  eyebrow,
  ghost,
  title,
  description,
  className,
}: {
  eyebrow: string;
  /** Palavra decorativa atrás do título. Curta, ela não pode quebrar. */
  ghost: string;
  title: ReactNode;
  description: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-10 sm:mb-16", className)}>
      <p className="eyebrow">{eyebrow}</p>

      <div className="relative isolate mt-8 grid gap-6 border-t border-border pt-8 sm:mt-12 sm:gap-10 sm:pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="relative">
          <span aria-hidden className="ghost-word">
            {ghost}
          </span>
          <h2 className="type-display-editorial text-balance">{title}</h2>
        </div>

        <div className="text-[15px] leading-[1.7] text-muted text-pretty sm:text-base lg:pt-3">
          {description}
        </div>
      </div>
    </header>
  );
}
