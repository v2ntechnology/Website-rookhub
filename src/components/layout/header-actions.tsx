"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonClasses } from "@/components/ui/button";

const navigation = [
  { href: "/", label: "Início" },
  { href: "/precos", label: "Planos e preços" },
  { href: "/#contato", label: "Entrar" },
];

/**
 * Cápsula flutuante de ações do desktop. Toda a navegação vive atrás do
 * botão de menu — a barra é uma ilha, não uma faixa de largura total.
 *
 * No mobile quem manda é `mobile-nav.tsx`; este componente não é montado lá.
 */
export function HeaderActions() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (target instanceof Node && !containerRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <div className="nav-capsule flex items-center gap-2 p-2">
        <ThemeToggle className="size-11 rounded-full" />

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="menu-principal"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="flex size-11 items-center justify-center rounded-full bg-surface-container text-foreground transition-colors hover:bg-border"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>

        <Link
          href="/#contato"
          className={buttonClasses("primary", "md", "h-11 rounded-full px-5")}
        >
          Solicitar demonstração
        </Link>
      </div>

      <nav
        id="menu-principal"
        aria-label="Principal"
        hidden={!open}
        className="nav-capsule absolute right-0 top-[calc(100%+8px)] w-64 rounded-[20px] p-2"
      >
        <ul>
          {navigation.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-[14px] px-4 py-3 text-[15px] font-semibold hover:bg-surface-container"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
