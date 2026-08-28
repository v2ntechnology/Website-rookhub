import type { Metadata } from "next";

import { PricingTable } from "@/components/pricing/pricing-table";
import {
  Container,
  Section,
  SectionHeading,
  SectionTag,
} from "@/components/ui/section";

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

const faq = [
  {
    question: "Como é a cobrança?",
    answer:
      "Por veículo ativo na frota. Usuários são ilimitados em todos os planos — escritório, manutenção e motoristas entram no sistema sem custo adicional por pessoa.",
  },
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
    question: "Quanto tempo leva a implantação?",
    answer:
      "O primeiro resultado concreto sai em até 30 dias, com as primeiras descobertas já na primeira semana — a importação do histórico por planilha é o que viabiliza esse prazo.",
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
      <Section>
        <Container>
          <SectionTag>Planos</SectionTag>
          <SectionHeading
            title="Preço por porte de frota, sem surpresa"
            description="Todos os planos incluem atualizações, suporte e usuários ilimitados. Sem taxa de implantação."
          />
          <PricingTable />
        </Container>
      </Section>

      <Section className="border-b-0">
        <Container className="max-w-3xl">
          <h2 className="type-headline-lg">Perguntas frequentes</h2>
          <dl className="mt-7 divide-y divide-border border-y border-border">
            {faq.map((item) => (
              <div key={item.question} className="py-5">
                <dt className="font-display font-semibold">{item.question}</dt>
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
