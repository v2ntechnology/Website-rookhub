"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { HeaderActions } from "@/components/layout/header-actions";

const navigation = [
  { href: "/", label: "Início" },
  { href: "/precos", label: "Planos e preços" },
  { href: "/contato", label: "Entrar" },
];

/**
 * Barra de navegação do desktop.
 *
 * Tem dois estados. No topo da página ela fica **encaixada** no bloco de
 * cima: largura total, cantos retos e sem fundo próprio, lida como a faixa
 * do site. Ao rolar ela **desencaixa** e vira um retângulo arredondado
 * flutuante. A forma vive em `.desk-nav` no `globals.css`; aqui só se
 * decide o estado.
 *
 * A navegação fica exposta, não atrás de um botão: o menu sanduíche é do
 * mobile (`mobile-nav.tsx`), onde a largura não comporta os links.
 */
export function DesktopNav() {
  const [docked, setDocked] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      // A folga de 8px evita a barra piscar entre os dois estados com o
      // repique de rolagem de trackpad e de teclado.
      setDocked(window.scrollY <= 8);
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

  return (
    <div className="desk-nav" data-docked={docked}>
      <div className="desk-nav-shell">
        <Link
          href="/"
          aria-label="RookHub, página inicial"
          className="pointer-events-auto flex shrink-0 items-center"
        >
          {/* As duas versões são renderizadas e o tema esconde uma por CSS.
              Escolher a fonte por `useTheme` custaria um flash da logo errada
              entre o servidor e a hidratação. */}
          <Image
            src="/images/rookhub-full-dark.svg"
            alt=""
            width={556}
            height={120}
            className="h-8 w-auto dark:hidden"
            priority
          />
          <Image
            src="/images/rookhub-full-white.svg"
            alt=""
            width={556}
            height={120}
            className="hidden h-8 w-auto dark:block"
            priority
          />
        </Link>

        {/* Centrado no viewport, não entre o logotipo e as ações: como os dois
            lados têm larguras diferentes, o fluxo deixaria os links fora do
            eixo da tela. O shell é simétrico nos dois estados, então metade
            dele é metade da tela. */}
        <nav
          aria-label="Principal"
          className="pointer-events-auto absolute left-1/2 flex -translate-x-1/2 items-center gap-1"
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.href === pathname ? "page" : undefined}
              className="desk-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pointer-events-auto ml-auto shrink-0">
          <HeaderActions />
        </div>
      </div>
    </div>
  );
}
