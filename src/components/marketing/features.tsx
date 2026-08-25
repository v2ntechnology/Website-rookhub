import { GlassCard } from "@/components/ui/glass-card";
import { OrganicGlow } from "@/components/ui/glow";
import { Container, Section, SectionHeading } from "@/components/ui/section";

const features = [
  {
    title: "Rastreamento em tempo real",
    description:
      "Posição, velocidade e status de cada caminhão atualizados continuamente, com cerca virtual e alertas de desvio de rota.",
  },
  {
    title: "Manutenção preventiva",
    description:
      "Planos por quilometragem e horas de motor. O sistema avisa antes da falha e organiza a agenda da oficina.",
  },
  {
    title: "Custo por quilômetro",
    description:
      "Combustível, pedágio, pneus e manutenção consolidados por veículo, rota e cliente — margem real por viagem.",
  },
  {
    title: "Score de direção",
    description:
      "Telemetria por motorista: frenagem brusca, excesso de velocidade e marcha lenta viram plano de treinamento.",
  },
  {
    title: "Jornada e documentos",
    description:
      "Controle de jornada, CNH, ASO e documentos do veículo com alerta de vencimento antes que vire multa.",
  },
  {
    title: "Integrações abertas",
    description:
      "API REST e webhooks para conectar ERP, TMS e roteirizador sem retrabalho de digitação.",
  },
];

const steps = [
  {
    step: "01",
    title: "Conecte a frota",
    description:
      "Integramos os rastreadores que você já usa. Sem trocar hardware, sem parar a operação.",
  },
  {
    step: "02",
    title: "Centralize os dados",
    description:
      "Abastecimento, manutenção e viagens deixam a planilha e passam a alimentar um histórico único.",
  },
  {
    step: "03",
    title: "Decida com indicadores",
    description:
      "Painéis mostram onde a margem vaza e quais veículos exigem ação nesta semana.",
  },
];

export function Features() {
  return (
    <>
      <Section id="recursos" className="relative overflow-hidden border-t border-border">
        <OrganicGlow className="top-1/4 -left-40 size-[30rem]" />

        <Container className="relative">
          <SectionHeading
            eyebrow="Plataforma"
            title="Tudo que a operação precisa, sem planilha paralela"
            description="Seis módulos que trabalham sobre a mesma base de dados da sua frota."
          />

          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <li key={feature.title}>
                <GlassCard flat className="h-full p-6">
                  <h3 className="type-headline-md">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {feature.description}
                  </p>
                </GlassCard>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Sem vidro de propósito: mantém o orçamento de backdrop-filter da
          landing dentro do teto definido na regra 04. */}
      <Section id="como-funciona" className="bg-surface-container">
        <Container>
          <SectionHeading
            eyebrow="Como funciona"
            title="Operando em semanas, não em trimestres"
          />

          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <li key={item.step} className="border-brand border-t-2 pt-5">
                <span className="type-label-md tabular text-brand-text">
                  {item.step}
                </span>
                <h3 className="type-headline-md mt-2">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </>
  );
}
