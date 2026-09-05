import { Reveal } from "@/components/ui/reveal";
import { Container, Section } from "@/components/ui/section";
import { SectionIntro } from "@/components/ui/section-intro";
import { COMPARISON_ROWS } from "@/content/comparison";
import type { ComparisonRow } from "@/types/marketing";

function RowItem({ row }: { row: ComparisonRow }) {
  return (
    <div className="editorial-row">
      <h3 className="editorial-term">{row.topic}</h3>

      <div className="space-y-2">
        <p className="editorial-today">
          <span aria-hidden className="editorial-mark">
            ×
          </span>
          <span className="sr-only">Hoje: </span>
          {row.today}
        </p>
        <p className="editorial-rookhub">
          <span aria-hidden className="editorial-mark">
            →
          </span>
          <span className="sr-only">Com o RookHub: </span>
          {row.rookhub}
        </p>
      </div>
    </div>
  );
}

export function ProblemSolution() {
  return (
    <Section id="solucoes" className="surface-deep border-b-0">
      <Container>
        <Reveal>
          <SectionIntro
            eyebrow="O que muda com o RookHub"
            ghost="Problema"
            title={
              <>
                O concorrente do Rook<span className="text-brand">Hub</span> não
                é a planilha. É o escuro.
              </>
            }
            description="Você não perde dinheiro por falta de sistema. Perde por não conseguir juntar, no mesmo lugar e no mesmo dia, o que cada sistema já sabe separadamente. Cada linha abaixo é um assunto em que a operação hoje anda no escuro, e o que passa a existir no lugar."
          />
        </Reveal>

        <div className="grid border-b border-border lg:grid-cols-2 lg:gap-x-14">
          {COMPARISON_ROWS.map((row, index) => (
            <Reveal key={row.topic} delay={(index % 2) * 80}>
              <RowItem row={row} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
