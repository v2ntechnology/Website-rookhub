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
  /** Palavra decorativa atrás do título. Curta — ela não pode quebrar. */
  ghost: string;
  title: ReactNode;
  description: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-16", className)}>
      <p className="eyebrow">{eyebrow}</p>

      <div className="relative isolate mt-12 grid gap-10 border-t border-border pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="relative">
          <span aria-hidden className="ghost-word">
            {ghost}
          </span>
          <h2 className="type-display-editorial text-balance">{title}</h2>
        </div>

        <div className="text-[16px] leading-[1.7] text-muted text-pretty lg:pt-3">
          {description}
        </div>
      </div>
    </header>
  );
}
