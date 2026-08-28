import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Section({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn("border-b border-dashed border-border px-4 py-16 sm:px-6 sm:py-20", className)}
      {...props}
    />
  );
}

/** Margem de 24px no desktop e 16px no mobile, conforme o grid fluido. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl", className)} {...props} />;
}

/**
 * Marcador de seção do protótipo. Nomeia o bloco para a rodada de revisão
 * de conteúdo — não faz parte da interface final.
 */
export function SectionTag({ children }: { children: string }) {
  return <p className="wf-tag type-label-md mb-5">{children}</p>;
}

export function SectionHeading({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-[64ch]", className)}>
      <h2 className="type-headline-lg text-balance">{title}</h2>
      {description ? (
        <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty">
          {description}
        </p>
      ) : null}
    </div>
  );
}
