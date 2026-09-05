import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/section";
import { cn } from "@/lib/utils";

/**
 * Hero cinematográfico: vídeo em tela cheia, conteúdo ancorado embaixo e
 * entrada escalonada saindo do desfoque.
 *
 * ⚠️ **O vídeo é decoração, e nada depende dele.** Título, texto e botões são
 * HTML e aparecem antes de qualquer byte de mídia. Se o vídeo falhar, o
 * `poster` cobre o fundo; se o poster falhar, sobra a superfície escura.
 *
 * ⚠️ **`preload="none"` é deliberado.** O arquivo tem 9 MB, e baixá-lo junto
 * com a página atrasaria o primeiro contato com a marca. O pôster, de 12 KB,
 * segura a composição enquanto o vídeo chega.
 *
 * Com `prefers-reduced-motion` o vídeo some e o pôster fica no lugar dele,
 * parado. O bloco global de movimento reduzido já zera as animações de entrada.
 */

/** Sinais do produto, na linha acima do título. Traço simples, 1,6px. */
const SIGNALS: { label: string; path: string }[] = [
  {
    label: "Checklist digital em campo",
    path: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  },
  {
    label: "Assistente de IA por voz",
    path: "M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v3",
  },
  {
    label: "Custo por quilômetro",
    path: "M3 3v18h18M7 15l4-5 4 3 5-7",
  },
];

function Signal({ label, path }: { label: string; path: string }) {
  return (
    <li className="flex items-center gap-2">
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="size-4 shrink-0 sm:size-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={path} />
      </svg>
      {label}
    </li>
  );
}

/** Pílula de vidro usada nos botões secundários. */
function GlassLink({
  href,
  children,
  className,
  style,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Link
      href={href}
      style={style}
      className={cn(
        "liquid-glass inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white transition-colors sm:px-8 sm:py-3",
        "hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Hero() {
  return (
    <section className="hero-over-video surface-deep relative isolate mt-[calc(var(--header-h)*-1)] flex min-h-svh flex-col justify-end overflow-hidden px-4 pt-[calc(var(--header-h)+24px)] pb-12 sm:px-6 md:pb-16">
      <video
        className="hero-media motion-reduce:hidden"
        poster="/video/hero-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        tabIndex={-1}
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Ocupa o lugar do vídeo quando o visitante pede menos movimento. */}
      <Image
        src="/video/hero-poster.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-media hidden motion-reduce:block"
      />

      <div aria-hidden className="hero-blur" />
      <div aria-hidden className="hero-veil" />

      <Container className="relative z-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <ul
              className="hero-meta animate-blur-fade-up flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:gap-x-7 sm:text-sm"
              style={{ "--delay": "300ms" } as React.CSSProperties}
            >
              {SIGNALS.map((signal) => (
                <Signal key={signal.label} {...signal} />
              ))}
            </ul>

            <h1
              className="type-display-hero animate-blur-fade-up mt-6 text-balance md:mt-8"
              style={{ "--delay": "400ms" } as React.CSSProperties}
            >
              Atravesse.
              <br />
              Opere com <span className="hero-accent">clareza</span>.
            </h1>

            <p
              className="hero-lead animate-blur-fade-up mt-5 max-w-[52ch] text-base leading-relaxed text-pretty sm:text-lg md:mt-6"
              style={{ "--delay": "500ms" } as React.CSSProperties}
            >
              Telemetria, combustível, multas e planilhas chegam de lugares
              diferentes. O RookHub reúne tudo e mostra onde organizar a
              operação para alcançar resultados melhores.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4 md:mt-12">
              <Link
                href="/precos"
                className="animate-blur-fade-up inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-8 sm:py-3"
                style={{ "--delay": "600ms" } as React.CSSProperties}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="size-[18px]"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Ver planos
              </Link>

              <GlassLink
                href="/contato"
                className="animate-blur-fade-up"
                style={{ "--delay": "700ms" } as React.CSSProperties}
              >
                Falar com um consultor
              </GlassLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
