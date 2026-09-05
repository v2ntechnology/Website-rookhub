import type { Metadata } from "next";

import { PlanComparison } from "@/components/pricing/plan-comparison";
import { TrustedBy } from "@/components/pricing/trusted-by";
import { PricingTable } from "@/components/pricing/pricing-table";
import { Container, Section } from "@/components/ui/section";
import { FAQ } from "@/content/faq";

export const metadata: Metadata = {
  title: "Planos e preços",
  description:
    "Planos de assinatura do RookHub por veículo ativo, com usuários ilimitados. Cobrança mensal ou anual, sem fidelidade.",
  alternates: { canonical: "/precos" },
  openGraph: {
    title: "Planos e preços · RookHub",
    description:
      "Escolha o plano de gestão de frota ideal para a sua operação.",
    url: "/precos",
  },
};

export default function PricingPage() {
  return (
    <>
      {/* Sangra por trás da barra fixa: sem isso, o `pt-[84px]` do `main`
          deixa uma faixa da cor do corpo acima da seção preta. */}
      <Section className="surface-deep mt-[calc(var(--header-h)*-1)] border-b-0 pt-[calc(3rem+var(--header-h))] sm:pt-[calc(5rem+var(--header-h))]">
        <Container>
          <header className="mx-auto max-w-3xl text-center">
            <h1 className="type-display-editorial text-balance">
              Preço por porte de frota, sem{" "}
              <span className="text-brand">surpresa</span>.
            </h1>

            <p className="mt-5 text-[15px] leading-[1.7] text-muted sm:text-base">
              Confira os preços dos planos Básico, Profissional e Enterprise.
            </p>
          </header>

          <div className="mt-10 sm:mt-12">
            <PricingTable />
          </div>

          <p className="mt-8 text-center text-xs text-faint">
            Valores em reais. A troca de plano e o cancelamento são feitos no
            portal do cliente, a qualquer momento.
          </p>
        </Container>
      </Section>

      <Section className="surface-deep border-b-0 pt-0">
        <Container>
          <TrustedBy />
        </Container>
      </Section>

      <Section className="surface-deep border-b-0 pt-0">
        <Container>
          <h2 className="type-display-section mb-10 text-center text-balance sm:mb-14">
            Compare os recursos dos planos
          </h2>

          <PlanComparison />

          <p className="mt-6 text-xs text-faint">
            Veículo ativo é o que esteve em operação no ciclo. Módulo não
            contratado aparece no menu em estado bloqueado, com convite para
            conhecer, nunca com dado de exemplo dentro da operação.
          </p>
        </Container>
      </Section>

      <Section className="surface-deep border-b-0">
        <Container className="max-w-4xl">
          <h2 className="type-display-section mb-8 text-balance sm:mb-10">
            Perguntas frequentes
          </h2>

          <dl className="border-b border-border">
            {FAQ.map((item) => (
              <div key={item.question} className="faq-row">
                <dt className="editorial-term">{item.question}</dt>
                <dd className="text-[14.5px] leading-relaxed text-body">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>
    </>
  );
}
