import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

/**
 * Ícones flutuantes do hero. Enquanto o catálogo de arte não fica pronto,
 * os três assets de `public/imgs` se repetem apenas para avaliar a
 * composição — `x`/`y` são o centro do ícone em % da área do hero.
 *
 * Só existem a partir de `lg`: a dispersão pede as laterais vazias que o
 * mobile não tem, e lá o hero fica só com texto.
 */
type FloatingIcon = {
  src: string;
  alt: string;
  x: number;
  y: number;
  size: number;
  rotate: number;
};

const icons: FloatingIcon[] = [
  { src: "/imgs/combustivelIcone.png", alt: "Combustível", x: 9, y: 26, size: 124, rotate: -6 },
  { src: "/imgs/excelIcone.png", alt: "Planilhas", x: 23, y: 44, size: 66, rotate: 5 },
  { src: "/imgs/multaIcone.png", alt: "Multas", x: 7, y: 55, size: 92, rotate: 3 },
  { src: "/imgs/excelIcone.png", alt: "Planilhas", x: 21, y: 62, size: 82, rotate: -4 },
  { src: "/imgs/combustivelIcone.png", alt: "Combustível", x: 9, y: 80, size: 56, rotate: 8 },
  { src: "/imgs/multaIcone.png", alt: "Multas", x: 72, y: 34, size: 58, rotate: -5 },
  { src: "/imgs/excelIcone.png", alt: "Planilhas", x: 88, y: 24, size: 96, rotate: 4 },
  { src: "/imgs/combustivelIcone.png", alt: "Combustível", x: 84, y: 50, size: 116, rotate: -3 },
  { src: "/imgs/multaIcone.png", alt: "Multas", x: 74, y: 71, size: 88, rotate: 6 },
  { src: "/imgs/excelIcone.png", alt: "Planilhas", x: 90, y: 76, size: 54, rotate: -7 },
];

function FloatingIcons() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      {icons.map((icon, index) => (
        <span
          key={`${icon.src}-${index}`}
          className="hero-float absolute"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            width: icon.size,
            height: icon.size,
            marginLeft: -icon.size / 2,
            marginTop: -icon.size / 2,
            animationDelay: `${(index % 5) * -1.4}s`,
          }}
        >
          <Image
            src={icon.src}
            alt=""
            width={icon.size * 2}
            height={icon.size * 2}
            className="h-full w-full object-contain drop-shadow-[0_18px_40px_rgb(0_0_0/0.35)]"
            style={{ transform: `rotate(${icon.rotate}deg)` }}
          />
        </span>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero-surface surface-deep relative isolate mt-[calc(var(--header-h)*-1)] flex min-h-svh items-center overflow-hidden px-4 pt-[calc(var(--header-h)+24px)] pb-16 sm:px-6 md:pt-[var(--header-h)]">
      <FloatingIcons />

      <Container className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        <Image
          src="/imgs/logoOfficialBranca.svg"
          alt="RookHub"
          width={34}
          height={40}
          className="opacity-90 invert dark:invert-0"
          priority
        />

        <h1 className="type-display-hero mt-6 text-balance">
          Toda a frota
          <br />
          em um só <span className="text-brand">hub</span>.
        </h1>

        <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-muted text-pretty sm:text-base">
          Telemetria, combustível, multas e planilhas chegam de lugares
          diferentes. O RookHub reúne tudo e mostra o prejuízo enquanto ele
          ainda dá para estancar.
        </p>

        <div className="mt-8 flex w-full max-w-xs flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <ButtonLink href="/precos" size="md" className="md:h-9 md:px-3">
            Ver planos
          </ButtonLink>
          <ButtonLink
            href="#contato"
            size="md"
            variant="secondary"
            className="md:h-9 md:px-3"
          >
            Falar com um consultor
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
