import { Reveal } from "@/components/ui/reveal";
import { Container, Section } from "@/components/ui/section";
import { SectionIntro } from "@/components/ui/section-intro";

type Row = {
  topic: string;
  today: string;
  rookhub: string;
};

const rows: Row[] = [
  {
    topic: "Fontes de dados",
    today:
      "Telemetria, rastreador, cartão de combustível e multas em quatro portais que não conversam.",
    rookhub:
      "Integrações com os sistemas que você já usa alimentam um modelo único de dados.",
  },
  {
    topic: "Inspeção",
    today:
      "Checklist em papel, com mais de 30 itens, que some no pátio ou volta ilegível.",
    rookhub:
      "Checklist digital no celular do motorista, com foto obrigatória no item crítico e funcionamento offline.",
  },
  {
    topic: "Custo por km",
    today: "Calculado à mão na planilha — quando é calculado.",
    rookhub:
      "Custo por km e consumo calculados sozinhos, por veículo, motorista e composição.",
  },
  {
    topic: "Manutenção",
    today: "Controlada por memória e pela agenda do gestor.",
    rookhub:
      "Plano que dispara pelo que vencer primeiro: quilometragem, tempo ou horímetro.",
  },
  {
    topic: "Câmeras",
    today:
      "Instaladas, mas com três a quatro pessoas assistindo vídeo 24 horas por dia.",
    rookhub:
      "Análise que prioriza as câmeras com maior chance de evento — a decisão continua humana.",
  },
  {
    topic: "Reação",
    today: "O número que decide o mês só existe no fechamento — e já é passado.",
    rookhub:
      "O desvio aparece no dia em que acontece, com a ação já ao lado do alerta.",
  },
];

function RowItem({ row }: { row: Row }) {
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
            description="Você não perde dinheiro por falta de sistema. Perde por não conseguir juntar, no mesmo lugar e no mesmo dia, o que cada sistema já sabe separadamente. Cada linha abaixo é um assunto em que a operação hoje anda no escuro — e o que passa a existir no lugar."
          />
        </Reveal>

        <div className="grid border-b border-border lg:grid-cols-2 lg:gap-x-14">
          {rows.map((row, index) => (
            <Reveal key={row.topic} delay={(index % 2) * 80}>
              <RowItem row={row} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
