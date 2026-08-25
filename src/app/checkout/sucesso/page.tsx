import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { OrganicGlow } from "@/components/ui/glow";
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
    <Section className="grid-backdrop relative overflow-hidden">
      <OrganicGlow className="-top-24 left-1/3 size-[30rem]" />

      <Container className="relative max-w-xl">
        <GlassCard elevated className="p-10 text-center">
          <p className="type-label-md text-accent uppercase">Tudo certo</p>
          <h1 className="type-headline-lg mt-3">Assinatura confirmada</h1>
          <p className="type-body-lg mt-4 text-muted text-pretty">
            Recebemos seu pagamento. A liberação do acesso é concluída assim que
            o Stripe confirmar a assinatura pelo webhook — você receberá um
            e-mail com as credenciais em instantes.
          </p>
          {typeof sessionId === "string" ? (
            <p className="tabular mt-6 text-xs break-all text-muted">
              Referência: {sessionId}
            </p>
          ) : null}
          <ButtonLink href="/" size="lg" className="mt-8">
            Voltar ao início
          </ButtonLink>
        </GlassCard>
      </Container>
    </Section>
  );
}
