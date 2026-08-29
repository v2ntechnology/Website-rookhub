import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Container, Section } from "@/components/ui/section";
import { SectionIntro } from "@/components/ui/section-intro";

const steps = [
  {
    term: "Semana 1",
    text: "Importamos sua frota e seu histórico por planilha, com validação linha a linha, e conectamos os sistemas que você já usa.",
  },
  {
    term: "Primeiras descobertas",
    text: "O primeiro desvio costuma aparecer ainda na primeira semana — sem consultoria e sem projeto de seis meses.",
  },
  {
    term: "Até 30 dias",
    text: "Você tem em tela o número que hoje não existe: custo por quilômetro por veículo, por motorista e por composição.",
  },
];

export function CallToAction() {
  return (
    <Section id="contato" className="surface-deep border-b-0">
      <Container>
        <Reveal>
          <SectionIntro
            eyebrow="Chamada final"
            ghost="Começar"
            title={
              <>
                Em 30 dias você tem o primeiro número que hoje{" "}
                <span className="text-brand">não existe</span>.
              </>
            }
            description={
              <>
                <p>
                  Demonstração de 30 minutos, com um veículo real da sua frota
                  na tela — não um ambiente de exemplo.
                </p>

                <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <ButtonLink href="/precos" size="lg">
                    Ver planos e começar
                  </ButtonLink>
                  <ButtonLink
                    href="mailto:contato@rookhub.com.br"
                    variant="secondary"
                    size="lg"
                  >
                    Agendar uma demonstração
                  </ButtonLink>
                </div>
              </>
            }
          />
        </Reveal>

        <div className="border-b border-border">
          {steps.map((step, index) => (
            <Reveal key={step.term} delay={index * 90}>
              <div className="editorial-row">
                <h3 className="editorial-term">{step.term}</h3>
                <p className="editorial-item">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
