import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Container, Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Checkout cancelado",
  robots: { index: false, follow: false },
};

export default function CheckoutCanceledPage() {
  return (
    <Section className="grid-backdrop">
      <Container className="max-w-xl">
        <GlassCard className="p-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Checkout cancelado
          </h1>
          <p className="mt-4 text-muted text-pretty">
            Nenhuma cobrança foi realizada. Você pode retomar a assinatura quando
            quiser — ou falar com o time se ficou alguma dúvida sobre os planos.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
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
        </GlassCard>
      </Container>
    </Section>
  );
}
