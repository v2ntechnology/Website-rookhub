import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

/**
 * Ícones flutuantes do hero. Enquanto o catálogo de arte não fica pronto,
 * os três assets de `public/imgs` se repetem apenas para avaliar a
 * composição — `x`/`y` são o centro do ícone em % da área do hero.
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
            className="h-full w-full object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
            style={{ transform: `rotate(${icon.rotate}deg)` }}
          />
        </span>
      ))}
    </div>
  );
}

/** Faixa de ícones do mobile: a dispersão não cabe em 360px. */
function IconStrip() {
  return (
    <ul aria-hidden className="mt-10 flex items-center justify-center gap-4 lg:hidden">
      {icons.slice(0, 5).map((icon, index) => (
        <li key={`${icon.src}-strip-${index}`} className="h-12 w-12">
          <Image
            src={icon.src}
            alt=""
            width={96}
            height={96}
            className="h-full w-full object-contain"
          />
        </li>
      ))}
    </ul>
  );
}

export function Hero() {
  return (
    <section className="hero-dark relative isolate -mt-[84px] flex min-h-svh items-center overflow-hidden px-4 pt-[84px] pb-16 sm:px-6">
      <FloatingIcons />

      <Container className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        <Image
          src="/imgs/logoOfficialBranca.svg"
          alt="RookHub"
          width={34}
          height={40}
          className="opacity-90"
          priority
        />

        <h1 className="type-display-hero mt-6 text-balance">
          Toda a frota
          <br />
          em um só <span className="text-brand">hub</span>.
        </h1>

        <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-white/60 text-pretty">
          Telemetria, combustível, multas e planilhas chegam de lugares
          diferentes. O RookHub reúne tudo e mostra o prejuízo enquanto ele
          ainda dá para estancar.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/precos" size="sm" className="border-white bg-white text-black hover:bg-white/90">
            Ver planos
          </ButtonLink>
          <ButtonLink
            href="#contato"
            size="sm"
            variant="secondary"
            className="border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            Falar com um consultor
          </ButtonLink>
        </div>

        <IconStrip />
      </Container>
    </section>
  );
}
