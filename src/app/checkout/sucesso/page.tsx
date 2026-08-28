import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Assinatura confirmada",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: PageProps<"/checkout/sucesso">) {
  // No Next 16 searchParams é uma Promise.
  const { session_id: sessionId } = await searchParams;

  return (
    <Section className="border-b-0">
      <Container className="max-w-xl">
        <Card className="p-8 text-center sm:p-10">
          <p className="type-label-md uppercase text-muted">Tudo certo</p>
          <h1 className="type-headline-lg mt-3">Assinatura confirmada</h1>
          <p className="type-body-lg mt-4 text-muted text-pretty">
            Recebemos seu pagamento. A liberação do acesso é concluída assim que
            o Stripe confirmar a assinatura pelo webhook — você receberá um
            e-mail com as credenciais em instantes.
          </p>
          {typeof sessionId === "string" ? (
            <p className="tabular mt-6 text-xs break-all text-faint">
              Referência: {sessionId}
            </p>
          ) : null}
          <ButtonLink href="/" size="lg" className="mt-8">
            Voltar ao início
          </ButtonLink>
        </Card>
      </Container>
    </Section>
  );
}
