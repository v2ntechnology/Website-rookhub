import { PlanCard } from "@/components/pricing/plan-card";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Container, Section } from "@/components/ui/section";
import { SectionIntro } from "@/components/ui/section-intro";
import { PLANS } from "@/lib/stripe/plans";

/**
 * Prévia dos planos na landing. Mostra sempre o valor mensal: a alternância
 * mensal/anual exige estado e vive em /precos, onde o checkout acontece —
 * assim a landing inteira permanece Server Component.
 */
export function PlansPreview() {
  return (
    <Section id="planos" className="surface-black border-b-0">
      <Container>
        <Reveal>
          <SectionIntro
            eyebrow="Planos e assinatura"
            ghost="Planos"
            title={
              <>
                Você paga por veículo ativo. Usuários são{" "}
                <span className="text-brand">ilimitados</span>.
              </>
            }
            description="Escritório inteiro, manutenção e motoristas dentro do sistema sem custo adicional por pessoa. O que muda entre os planos é o tamanho da frota e quais módulos entram."
          />
        </Reveal>

        <ul className="grid items-start gap-5 lg:grid-cols-3">
          {PLANS.map((plan, index) => (
            <li key={plan.id} className="h-full">
              <Reveal delay={index * 90} className="h-full">
                <PlanCard
                  plan={plan}
                  interval="month"
                  action={
                    <ButtonLink
                      href="/precos"
                      size="lg"
                      variant={plan.highlighted ? "primary" : "secondary"}
                      className="w-full"
                    >
                      {plan.cta}
                    </ButtonLink>
                  }
                />
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-8 border-t border-border pt-6 text-xs leading-relaxed text-faint">
          Valores em reais, por mês, sem fidelidade. Cobrança anual com 2 meses
          grátis em <strong className="font-semibold">Planos e preços</strong>.
          Módulos não contratados aparecem no menu em estado bloqueado, com
          convite para conhecer — nunca com dado de exemplo dentro da operação.
        </p>
      </Container>
    </Section>
  );
}
