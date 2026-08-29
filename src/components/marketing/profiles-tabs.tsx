"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";

export type ProfileRow = {
  label: string;
  text: string;
  module: string;
};

export type Profile = {
  title: string;
  short: string;
  meta: string;
  quote: string;
  rows: ProfileRow[];
};

export function ProfilesTabs({ profiles }: { profiles: Profile[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;

    event.preventDefault();
    const next = (active + step + profiles.length) % profiles.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  const current = profiles[active];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Perfis de usuário"
        onKeyDown={onKeyDown}
        className="flex flex-wrap justify-center gap-x-6 gap-y-1 sm:gap-x-12 sm:gap-y-2"
      >
        {profiles.map((profile, index) => (
          <button
            key={profile.title}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${index}`}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            data-active={index === active}
            className="ptab"
          >
            {profile.short}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active}`}
      >
        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 sm:mt-10">
          <p className="text-sm text-muted">{current.quote}</p>
          <p className="type-label-md uppercase text-faint">{current.meta}</p>
        </div>

        {/* A tabela tem largura mínima de 640px e rola dentro do próprio
            contêiner. Sem barra de rolagem visível no site, a pista de que
            há mais coluna à direita precisa ser dita. */}
        <p aria-hidden className="mt-6 text-xs text-faint sm:hidden">
          Arraste para o lado para ver a tabela →
        </p>

        <div className="ptab-scroll mt-3 sm:mt-6">
          <table className="ptab-table">
            <caption className="sr-only">
              O que {current.title} vê ao abrir o RookHub
            </caption>

            <thead>
              <tr>
                <th scope="col">Na tela</th>
                <th scope="col">O que responde</th>
                <th scope="col">Módulo</th>
              </tr>
            </thead>

            <tbody>
              {current.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>{row.text}</td>
                  <td>
                    <span className="ptab-chip">{row.module}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-center">
          <Link href="/precos" className="ptab-more">
            Ver planos e preços
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </p>
      </div>
    </div>
  );
}
