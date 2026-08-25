import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Section({ className, ...props }: ComponentProps<"section">) {
  return (
    <section className={cn("px-4 py-20 sm:px-6 sm:py-28", className)} {...props} />
  );
}

/** Margem de 24px no desktop e 16px no mobile, conforme o grid fluido. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl", className)} {...props} />;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      {eyebrow ? (
        <p className="type-label-md text-brand-text uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="type-headline-lg mt-3 text-balance">{title}</h2>
      {description ? (
        <p className="type-body-lg mt-4 text-muted text-pretty">{description}</p>
      ) : null}
    </div>
  );
}
