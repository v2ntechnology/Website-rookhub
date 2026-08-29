import { PillarsCapsules } from "@/components/marketing/pillars-capsules";
import { Container, Section } from "@/components/ui/section";
import { SectionIntro } from "@/components/ui/section-intro";
import { PILLARS } from "@/content/pillars";

export function Pillars() {
  return (
    <Section id="pilares" className="surface-deep border-b-0">
      <Container>
        <SectionIntro
          eyebrow="Pilares da plataforma"
          ghost="Pilares"
          title={
            <>
              Quatro pilares. Um único <span className="text-brand">hub</span>.
            </>
          }
          description="Cada pilar existe para responder uma pergunta que hoje fica sem resposta na sua operação. Toque em um deles para ver o que muda — o que a plataforma passa a fazer sozinha, e o que deixa de depender da memória de alguém."
        />

        <PillarsCapsules pillars={PILLARS} />
      </Container>
    </Section>
  );
}
