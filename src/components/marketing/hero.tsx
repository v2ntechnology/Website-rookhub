import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

export function Hero() {
  return (
    <section className="hero-surface surface-deep relative isolate mt-[calc(var(--header-h)*-1)] flex min-h-svh items-center overflow-hidden px-4 pt-[calc(var(--header-h)+24px)] pb-16 sm:px-6">
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
          <ButtonLink href="/precos" size="md">
            Ver planos
          </ButtonLink>
          <ButtonLink href="#contato" size="md" variant="secondary">
            Falar com um consultor
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
