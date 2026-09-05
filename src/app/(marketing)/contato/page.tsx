import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { CONTACT_CHANNELS } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com o time do RookHub por e-mail ou agende uma demonstração de 30 minutos com um veículo real da sua frota na tela.",
  alternates: { canonical: "/contato" },
  openGraph: {
    title: "Contato · RookHub",
    description:
      "Fale com o time do RookHub ou agende uma demonstração da plataforma.",
    url: "/contato",
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Sangra por trás da barra fixa, como o topo de `/precos`: sem isso o
          `pt-[var(--header-h)]` do `main` deixa uma faixa da cor do corpo
          acima da seção escura. */}
      <Section className="surface-deep mt-[calc(var(--header-h)*-1)] border-b-0 pt-[calc(3rem+var(--header-h))] sm:pt-[calc(5rem+var(--header-h))]">
        <Container>
          <header className="mx-auto max-w-3xl text-center">
            <h1 className="type-display-editorial text-balance">
              Comece pela conversa que{" "}
              <span className="text-brand">encurta</span> o resto.
            </h1>

            <p className="mt-5 text-[15px] leading-[1.7] text-muted text-pretty sm:text-base">
              Conte o tamanho da frota e o que hoje só aparece no fechamento do
              mês. A partir daí a demonstração já sai com os seus números.
            </p>
          </header>

          {/* Sem os fios do `editorial-row`: aqui a lista tem três itens e
              cada um termina num link, então a régua horizontal competia com
              o sublinhado da ação logo acima dela. O respiro entre os blocos
              fica por conta do padding da própria linha. */}
          <div className="mx-auto mt-12 max-w-3xl sm:mt-16">
            {CONTACT_CHANNELS.map((channel) => (
              <div key={channel.term} className="editorial-row border-t-0">
                <h2 className="editorial-term">{channel.term}</h2>
                <div className="editorial-item">
                  <p>{channel.text}</p>
                  <Link
                    href={channel.action.href}
                    className="mt-3 inline-flex font-semibold text-foreground hover:underline hover:underline-offset-4"
                  >
                    {channel.action.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 flex max-w-3xl flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <ButtonLink href="/precos" size="lg">
              Ver planos e começar
            </ButtonLink>
            <ButtonLink
              href="mailto:contato@rookhub.com.br"
              variant="secondary"
              size="lg"
            >
              Escrever agora
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
