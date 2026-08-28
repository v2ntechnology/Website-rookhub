"use client";

import { useId, useRef, useState } from "react";

export type Pillar = {
  number: string;
  short: string;
  title: string;
  lead: string;
  features: string[];
};

export function PillarsCapsules({ pillars }: { pillars: Pillar[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /** Setas navegam entre as cápsulas, como manda o padrão de abas. */
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;

    event.preventDefault();
    const next = (active + step + pillars.length) % pillars.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  const current = pillars[active];

  return (
    <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10">
      {/* Texto do pilar selecionado */}
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active}`}
        className="max-w-[46ch]"
      >
        <p className="type-label-md uppercase text-muted">{current.number}</p>

        <h3 className="type-display-editorial mt-4 text-balance">
          {current.title}
        </h3>

        <p className="mt-5 text-[15px] leading-relaxed text-muted text-pretty">
          {current.lead}
        </p>

        <ul className="mt-7 space-y-3">
          {current.features.map((feature) => (
            <li key={feature} className="capsule-feature">
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Cápsulas */}
      <div
        role="tablist"
        aria-label="Pilares da plataforma"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="flex items-end justify-center gap-3 py-6 sm:gap-6"
      >
        {pillars.map((pillar, index) => {
          const selected = index === active;

          return (
            <button
              key={pillar.title}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              data-active={selected}
              className="capsule-slot"
            >
              <span className="capsule">
                <span className="capsule-knob">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </span>
              </span>

              <span className="capsule-label">{pillar.short}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
