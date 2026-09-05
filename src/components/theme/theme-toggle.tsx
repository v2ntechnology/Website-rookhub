"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  // O tema resolvido só existe no client: renderizar o ícone antes da
  // hidratação causaria flash do tema errado. `useSyncExternalStore` devolve
  // `false` no servidor e `true` no client, sem setState dentro de efeito.
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      data-theme-state={mounted ? (isDark ? "dark" : "light") : "unknown"}
      // O rótulo depende do tema resolvido, que só existe no client: antes
      // da hidratação ele precisa ser neutro, senão o servidor manda
      // "escuro" e o client corrige para "claro", divergência de hidratação.
      aria-label={
        mounted
          ? isDark
            ? "Ativar tema claro"
            : "Ativar tema escuro"
          : "Alternar tema"
      }
      className={cn("theme-toggle", className)}
    >
      {/* Os dois ícones existem sempre e se cruzam na troca: um sai girando e
          encolhendo enquanto o outro entra. Trocar o SVG condicionalmente,
          como antes, não permite transição, porque o elemento que sairia já
          foi desmontado. `aria-hidden` nos dois, o nome do controle vem do
          `aria-label`. */}
      <span className="theme-toggle-stage" aria-hidden>
        <svg
          viewBox="0 0 24 24"
          className="theme-toggle-icon theme-toggle-sun"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>

        <svg
          viewBox="0 0 24 24"
          className="theme-toggle-icon theme-toggle-moon"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      </span>
    </button>
  );
}

/** Store imutável: nunca emite, serve só para diferenciar server de client. */
function subscribeToNothing() {
  return () => {};
}
