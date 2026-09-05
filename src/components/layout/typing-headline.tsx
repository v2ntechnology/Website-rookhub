"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import type { TypingHeadline as Headline } from "@/types/marketing";

/** Ritmo da digitação, em milissegundos. */
const TYPE_MS = 55;
const DELETE_MS = 30;
const HOLD_MS = 1900;
/** Pausa depois de apagar, antes de a próxima palavra entrar. */
const SWAP_MS = 320;

type Phase = "idle" | "prefix" | "typing" | "holding" | "deleting";

/**
 * Manchete do rodapé, escrita à máquina.
 *
 * Só começa quando o bloco entra na tela: a frase é a última coisa da
 * página, e digitar fora de vista gastaria a animação sem ninguém ver. O
 * prefixo é escrito uma única vez, e daí em diante só a última palavra
 * entra em rodízio, apagando e reescrevendo.
 *
 * O símbolo da marca aparece entre o prefixo e a palavra, e só depois que o
 * prefixo termina: mostrá-lo desde o início deixaria um bloco sólido parado
 * no meio de uma linha vazia.
 *
 * Com `prefers-reduced-motion` nada disso roda. O que é exibido vem de
 * `reduced` no próprio render, e não de um estado que o efeito corrige
 * depois, senão o primeiro quadro sairia vazio para quem pediu menos
 * movimento.
 */
export function TypingHeadline({ prefix, words }: Headline) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [wordIndex, setWordIndex] = useState(0);
  const [prefixLength, setPrefixLength] = useState(0);
  const [wordLength, setWordLength] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);

  // O valor só existe no navegador. No servidor é `false`, então o HTML
  // enviado é o mesmo dos dois lados e a hidratação não diverge.
  const reduced = useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  const word = words[wordIndex] ?? words[0] ?? "";

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPhase("prefix");
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (phase === "idle" || reduced) return;

    let timer: ReturnType<typeof setTimeout>;

    if (phase === "prefix") {
      timer = setTimeout(
        () =>
          prefixLength < prefix.length
            ? setPrefixLength((n) => n + 1)
            : setPhase("typing"),
        TYPE_MS,
      );
    } else if (phase === "typing") {
      timer = setTimeout(
        () =>
          wordLength < word.length
            ? setWordLength((n) => n + 1)
            : setPhase("holding"),
        TYPE_MS,
      );
    } else if (phase === "holding") {
      timer = setTimeout(() => setPhase("deleting"), HOLD_MS);
    } else {
      timer = setTimeout(
        () => {
          if (wordLength > 0) {
            setWordLength((n) => n - 1);
            return;
          }
          setWordIndex((i) => (i + 1) % words.length);
          setPhase("typing");
        },
        wordLength > 0 ? DELETE_MS : SWAP_MS,
      );
    }

    return () => clearTimeout(timer);
  }, [phase, prefixLength, wordLength, prefix, word, words.length, reduced]);

  const shownPrefix = reduced ? prefix : prefix.slice(0, prefixLength);
  const shownWord = reduced ? (words[0] ?? "") : word.slice(0, wordLength);
  const showLogo = reduced || prefixLength >= prefix.length;

  return (
    <p
      ref={ref}
      className="type-display-hero flex min-h-[1.15em] flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center"
    >
      {/* O que o leitor de tela recebe: a frase inteira e estável. O rodízio
          é decoração, e anunciar cada troca viraria ruído. */}
      <span className="sr-only">{`${prefix} ${words[0] ?? ""}`}</span>

      <span aria-hidden className="contents">
        <span>{shownPrefix}</span>

        {showLogo ? (
          <span className="inline-flex size-[0.95em] items-center justify-center rounded-[0.22em] bg-foreground">
            <Image
              src="/images/rookhub-symbol-white.svg"
              alt=""
              width={40}
              height={48}
              className="h-[0.5em] w-auto dark:invert"
            />
          </span>
        ) : null}

        <span className="inline-flex items-center">
          {shownWord}
          {phase !== "idle" && !reduced ? (
            <span className="typing-caret" data-blinking={phase === "holding"} />
          ) : null}
        </span>
      </span>
    </p>
  );
}

function subscribeToReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
