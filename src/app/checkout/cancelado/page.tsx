import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Checkout cancelado",
  robots: { index: false, follow: false },
};

export default function CheckoutCanceledPage() {
  return (
    <Section className="border-b-0">
      <Container className="max-w-xl">
        <Card className="p-6 text-center sm:p-10">
          <h1 className="type-headline-lg">Checkout cancelado</h1>
          <p className="type-body-lg mt-4 text-muted text-pretty">
            Nenhuma cobrança foi realizada. Você pode retomar a assinatura
            quando quiser — ou falar com o time se ficou alguma dúvida sobre os
            planos.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <ButtonLink href="/precos" size="lg">
              Voltar aos planos
            </ButtonLink>
            <ButtonLink
              href="mailto:contato@rookhub.com.br"
              variant="secondary"
              size="lg"
            >
              Falar com vendas
            </ButtonLink>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
