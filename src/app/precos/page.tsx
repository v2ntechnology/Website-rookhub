import type { Metadata } from "next";

import { PricingTable } from "@/components/pricing/pricing-table";
import { Container, Section, SectionHeading } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Planos e preços",
  description:
    "Planos de assinatura do RookHub para frotas de todos os tamanhos. Cobrança mensal ou anual, sem fidelidade.",
  alternates: { canonical: "/precos" },
  openGraph: {
    title: "Planos e preços · RookHub",
    description:
      "Escolha o plano de gestão de frota ideal para a sua transportadora.",
    url: "/precos",
  },
};

const faq = [
  {
    question: "Posso trocar de plano depois?",
    answer:
      "Sim. A troca é feita no portal do cliente e o valor é ajustado proporcionalmente no ciclo vigente.",
  },
  {
    question: "Existe fidelidade?",
    answer:
      "Não. O cancelamento é feito a qualquer momento e o acesso permanece até o fim do período já pago.",
  },
  {
    question: "Quais formas de pagamento?",
    answer:
      "Cartão de crédito e boleto para planos anuais, processados com segurança pelo Stripe.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Section className="grid-backdrop pb-8">
        <Container>
          <SectionHeading
            eyebrow="Planos"
            title="Preço por porte de frota, sem surpresa"
            description="Todos os planos incluem atualizações, suporte e usuários ilimitados. Sem taxa de implantação."
          />
          <PricingTable />
        </Container>
      </Section>

      <Section className="pt-8">
        <Container className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">
            Perguntas frequentes
          </h2>
          <dl className="mt-8 divide-y divide-border border-y border-border">
            {faq.map((item) => (
              <div key={item.question} className="py-6">
                <dt className="font-medium">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">
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
