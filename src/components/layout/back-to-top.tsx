"use client";

import { useEffect, useState } from "react";

/**
 * Volta ao topo. Aparece depois de uma tela de rolagem, antes disso o
 * topo está logo ali e o botão só ocuparia espaço.
 *
 * Existe também porque a barra de rolagem do site é oculta: sem ela, esta
 * é a única pista visível de "você desceu bastante".
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight * 0.8);
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

  function toTop() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Voltar ao topo"
      tabIndex={visible ? 0 : -1}
      data-visible={visible}
      className="back-to-top nav-capsule"
    >
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
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
