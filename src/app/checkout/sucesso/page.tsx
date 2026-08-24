import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
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
    <Section className="grid-backdrop">
      <Container className="max-w-xl">
        <GlassCard className="p-10 text-center">
          <p className="text-sm font-semibold tracking-widest text-brand uppercase">
            Tudo certo
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Assinatura confirmada
          </h1>
          <p className="mt-4 text-muted text-pretty">
            Recebemos seu pagamento. A liberação do acesso é concluída assim que
            o Stripe confirmar a assinatura pelo webhook — você receberá um
            e-mail com as credenciais em instantes.
          </p>
          {typeof sessionId === "string" ? (
            <p className="mt-6 font-mono text-xs break-all text-muted">
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
