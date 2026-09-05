"use client";

/**
 * ARQUIVADO por dependência, é a mecânica de rolagem de
 * `archive/problem-solution-vs.tsx` e não tem uso fora dele. Se aquele layout
 * for restaurado, este vem junto; se for descartado, os dois saem juntos.
 */
import { useEffect, useRef, useState } from "react";

export type Round = {
  topic: string;
  today: string;
  rookhub: string;
};

/** Deslocamento máximo de cada coluna, em px. As laterais correm em
 *  direções opostas, e é isso que dá a sensação de contra-rolagem. */
const SHIFT_TODAY = 340;
const SHIFT_ROOKHUB = -240;

function setBox(node: HTMLElement | null, delta: number, shift: number) {
  if (!node) return;
  const opacity = Math.max(0, Math.min(1, 1 - Math.abs(delta) * 1.25));
  node.style.transform = `translate3d(0, ${(delta * shift).toFixed(2)}px, 0)`;
  node.style.opacity = opacity.toFixed(3);
  node.style.visibility = opacity <= 0.01 ? "hidden" : "visible";
}

export function VsScroller({
  rounds,
  children,
}: {
  rounds: Round[];
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const todayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rookhubRefs = useRef<(HTMLDivElement | null)[]>([]);
  const topicRefs = useRef<(HTMLDivElement | null)[]>([]);

  const total = rounds.length;

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      // Posição contínua entre as rodadas: 0 = primeira, total-1 = última.
      const position = progress * (total - 1);

      for (let index = 0; index < total; index += 1) {
        const delta = index - position;

        setBox(todayRefs.current[index], delta, SHIFT_TODAY);
        setBox(rookhubRefs.current[index], delta, SHIFT_ROOKHUB);
        setBox(topicRefs.current[index], delta, 40);
      }

      setActive(Math.round(position));
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [total]);

  return (
    <div
      ref={trackRef}
      className="relative hidden lg:block"
      style={{ height: `${total * 100}vh` }}
    >
      {/* O cabeçalho viaja junto com o palco: fora dele, a rolagem abria
          uma tela inteira de vazio entre o título e as colunas. */}
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-24 overflow-hidden px-4 pt-[84px] sm:px-6 xl:gap-32">
        {children}

        <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-10">
          {/* Coluna 1, como é hoje */}
          <div className="relative h-[320px]">
            {rounds.map((round, index) => (
              <div
                key={round.topic}
                ref={(node) => {
                  todayRefs.current[index] = node;
                }}
                aria-hidden={index !== active}
                className="vs-box vs-box-today"
              >
                <p className="vs-statement">{round.today}</p>
                <span className="vs-tag">Hoje</span>
              </div>
            ))}
          </div>

          {/* Coluna 2, tópico da rodada e o selo */}
          <div className="relative flex h-[320px] min-w-[240px] flex-col items-center justify-center px-2">
            {/* A pill do tópico sobe para o topo da linha; o selo fica no
                centro, alinhado com as duas caixas laterais. */}
            <div className="absolute inset-x-0 top-0 h-7">
              {rounds.map((round, index) => (
                <div
                  key={round.topic}
                  ref={(node) => {
                    topicRefs.current[index] = node;
                  }}
                  aria-hidden={index !== active}
                  className="absolute inset-x-0 flex justify-center"
                >
                  <span className="vs-topic">{round.topic}</span>
                </div>
              ))}
            </div>

            <span aria-hidden className="vs-badge">
              VS
            </span>
          </div>

          {/* Coluna 3, como fica com o RookHub */}
          <div className="relative h-[320px]">
            {rounds.map((round, index) => (
              <div
                key={round.topic}
                ref={(node) => {
                  rookhubRefs.current[index] = node;
                }}
                aria-hidden={index !== active}
                className="vs-box vs-box-rookhub"
              >
                <p className="vs-statement">{round.rookhub}</p>
                <span className="vs-tag">Com o RookHub</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
