import { ButtonLink } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Container, Section } from "@/components/ui/section";

export function CallToAction() {
  return (
    <Section className="grid-backdrop relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 size-[36rem] -translate-x-1/2 translate-y-1/3 rounded-full bg-brand/20 blur-3xl"
      />
      <Container className="relative">
        <GlassCard className="px-8 py-14 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Pronto para enxergar sua frota de verdade?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted text-pretty">
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
