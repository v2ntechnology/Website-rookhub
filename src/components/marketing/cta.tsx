import { ButtonLink } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { OrganicGlow } from "@/components/ui/glow";
import { Container, Section } from "@/components/ui/section";

export function CallToAction() {
  return (
    <Section className="grid-backdrop relative overflow-hidden">
      <OrganicGlow className="bottom-0 left-1/4 size-[32rem] translate-y-1/3" />
      <OrganicGlow
        tone="accent"
        className="right-1/4 bottom-0 size-[26rem] translate-y-1/3"
      />

      <Container className="relative">
        <GlassCard elevated className="px-8 py-14 text-center">
          <h2 className="type-headline-lg text-balance">
            Pronto para enxergar sua frota de verdade?
          </h2>
          <p className="type-body-lg mx-auto mt-4 max-w-xl text-muted text-pretty">
            Escolha um plano e comece hoje. A assinatura é mensal ou anual, com
            gestão pelo portal do cliente.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/precos" size="lg">
              Ver planos e preços
            </ButtonLink>
            <ButtonLink
              href="mailto:contato@rookhub.com.br"
              variant="secondary"
              size="lg"
            >
              Falar com um especialista
            </ButtonLink>
          </div>
        </GlassCard>
      </Container>
    </Section>
  );
}
