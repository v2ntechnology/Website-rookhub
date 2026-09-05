"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonClasses } from "@/components/ui/button";

const navigation = [
  { href: "/", label: "Início" },
  { href: "/precos", label: "Planos e preços" },
  { href: "/contato", label: "Entrar" },
];

/**
 * Barra de navegação do mobile.
 *
 * É uma peça própria, não a cápsula do desktop encolhida: lá a navegação
 * inteira cabe atrás de um botão porque sobra largura; aqui o menu é o
 * caminho principal, então ele vira folha em tela cheia, cada link com
 * 60px de altura e o CTA ocupando a linha toda.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      setScrolled(window.scrollY > 8);
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // A folha aberta devolve a barra ao estado encaixado, mesmo com a página
  // rolada: ela vira o cabeçalho da folha em vez de uma ilha boiando sobre
  // ela. Fechar não guarda estado nenhum, a barra volta ao que a rolagem
  // disser naquele momento.
  const docked = !scrolled || open;

  // Trocar de rota fecha a folha, inclusive pelo botão "voltar" do browser.
  // Ajuste durante a renderização, não em efeito: evita o segundo passe de
  // pintura com a folha ainda aberta sobre a página nova.
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    // Trava a rolagem do fundo enquanto a folha cobre a tela.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="mob-nav" data-docked={docked}>
      <div className="nav-capsule mobile-bar pointer-events-auto relative z-[70]">
        <Link
          href="/"
          aria-label="RookHub, página inicial"
          onClick={() => setOpen(false)}
          className="flex items-center"
        >
          {/* Mesma troca por CSS do desktop, ver `desktop-nav.tsx`. */}
          <Image
            src="/images/rookhub-full-dark.svg"
            alt=""
            width={556}
            height={120}
            className="h-7 w-auto dark:hidden"
            priority
          />
          <Image
            src="/images/rookhub-full-white.svg"
            alt=""
            width={556}
            height={120}
            className="hidden h-7 w-auto dark:block"
            priority
          />
        </Link>

        <div className="flex items-center gap-1.5">
          <ThemeToggle className="size-11 rounded-full border-transparent" />

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="flex size-11 items-center justify-center rounded-full bg-surface-container text-foreground"
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
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        // `inert` tira a folha fechada da ordem de foco e do leitor de tela
        // sem `display: none`, a transição de saída continua visível.
        inert={!open}
        data-open={open}
        className="mobile-sheet pointer-events-auto"
      >
        <nav aria-label="Principal" className="overflow-y-auto">
          <ul>
            {navigation.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="mobile-link"
                >
                  {item.label}
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="size-5 shrink-0 text-faint"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-8">
          <Link
            href="/contato"
            onClick={() => setOpen(false)}
            className={buttonClasses("primary", "lg", "w-full rounded-full")}
          >
            Solicitar demonstração
          </Link>

          <p className="mt-5 text-center text-sm text-muted">
            Fale com a gente:{" "}
            <a
              href="mailto:contato@rookhub.com.br"
              className="font-semibold text-foreground"
            >
              contato@rookhub.com.br
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
