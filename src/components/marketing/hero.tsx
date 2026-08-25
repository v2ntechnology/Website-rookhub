import { ButtonLink } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { OrganicGlow } from "@/components/ui/glow";
import { Container, Section } from "@/components/ui/section";

const metrics = [
  { value: "-18%", label: "custo de combustível por km" },
  { value: "-42%", label: "paradas não programadas" },
  { value: "3.400", label: "caminhões monitorados" },
];

export function Hero() {
  return (
    <Section className="grid-backdrop relative overflow-hidden pt-20 pb-24">
      <OrganicGlow className="-top-32 -left-24 size-[34rem]" />
      <OrganicGlow tone="accent" className="-top-20 -right-32 size-[30rem]" />

      <Container className="relative grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="type-label-md glass text-brand-text inline-flex items-center gap-2 rounded-full px-3 py-1">
            <span
              className="bg-accent size-1.5 rounded-full"
              aria-hidden="true"
            />
            Telemetria em tempo real
          </p>

          <h1 className="type-display-lg mt-6 text-balance">
            Sua frota inteira em{" "}
            <span className="text-brand-text">um só painel</span>
          </h1>

          <p className="type-body-lg mt-6 max-w-xl text-muted text-pretty">
            O RookHub conecta rastreamento, manutenção preventiva e custo por
            quilômetro para você decidir com dados — e não com planilha atrasada.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/precos" size="lg">
              Ver planos
            </ButtonLink>
            <ButtonLink href="/#recursos" variant="secondary" size="lg">
              Conhecer a plataforma
            </ButtonLink>
          </div>

          <p className="mt-4 text-sm text-muted">
            14 dias de teste · Cancelamento a qualquer momento
          </p>
        </div>

        <GlassCard className="p-7">
          <p className="type-label-md text-muted uppercase">
            Resultado médio em 90 dias
          </p>
          <dl className="mt-6 space-y-6">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <span className="font-display tabular text-brand-text block text-4xl font-bold tracking-tight">
                    {metric.value}
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {metric.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </GlassCard>
      </Container>
    </Section>
  );
}
