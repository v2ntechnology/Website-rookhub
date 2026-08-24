import { ButtonLink } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Container, Section } from "@/components/ui/section";

const metrics = [
  { value: "-18%", label: "custo de combustível por km" },
  { value: "-42%", label: "paradas não programadas" },
  { value: "3.400", label: "caminhões monitorados" },
];

export function Hero() {
  return (
    <Section className="grid-backdrop relative overflow-hidden pt-20 pb-24">
      {/* Halo de marca: dá variação ao fundo para o vidro ter o que refratar. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
      />

      <Container className="relative grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
            Telemetria em tempo real para transportadoras
          </p>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Sua frota inteira em{" "}
            <span className="text-brand">um só painel</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
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
          <p className="text-sm font-medium text-muted">Resultado médio em 90 dias</p>
          <dl className="mt-6 space-y-6">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <span className="block text-4xl font-semibold tracking-tight text-brand">
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
