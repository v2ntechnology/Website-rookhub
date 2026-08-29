import { Suspense } from "react";
import type { Metadata } from "next";

import { SessionReference } from "@/components/checkout/session-reference";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Assinatura confirmada",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <Section className="border-b-0">
      <Container className="max-w-xl">
        <Card className="p-6 text-center sm:p-10">
          <p className="type-label-md uppercase text-muted">Tudo certo</p>
          <h1 className="type-headline-lg mt-3">Assinatura confirmada</h1>
          <p className="type-body-lg mt-4 text-muted text-pretty">
            Recebemos seu pagamento. A liberação do acesso é concluída assim que
            o Stripe confirmar a assinatura pelo webhook — você receberá um
            e-mail com as credenciais em instantes.
          </p>
          <Suspense fallback={null}>
            <SessionReference />
          </Suspense>
          <ButtonLink href="/" size="lg" className="mt-8 w-full sm:w-auto">
            Voltar ao início
          </ButtonLink>
        </Card>
      </Container>
    </Section>
  );
}
