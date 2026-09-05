/**
 * LAYOUT ARQUIVADO, “VS” com rolagem controlada (palco grudado, colunas
 * em contra-rolagem e o selo da marca no meio). Substituído pelo layout
 * editorial em `marketing/problem-solution.tsx`, mas mantido inteiro e funcional.
 *
 * Para voltar a ele, troque em `src/app/(marketing)/page.tsx`:
 *   import { ProblemSolution } from "@/components/marketing/problem-solution";
 * por:
 *   import { ProblemSolution } from "@/components/archive/problem-solution-vs";
 *
 * Depende de `archive/vs-scroller.tsx` e das classes `.vs-*` do `globals.css`.
 */
import type { Round } from "@/components/archive/vs-scroller";
import { VsScroller } from "@/components/archive/vs-scroller";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { Container, Section } from "@/components/ui/section";

/** Cada rodada confronta o mesmo assunto nos dois cenários. */
const rounds: Round[] = [
  {
    topic: "Fontes de dados",
    today:
      "Telemetria, rastreador, cartão de combustível e multas em quatro portais que não conversam.",
    rookhub:
      "Integrações com os sistemas que você já usa alimentam um modelo único de dados.",
  },
  {
    topic: "Inspeção do veículo",
    today:
      "Checklist em papel, com mais de 30 itens, que some no pátio ou volta ilegível.",
    rookhub:
      "Checklist digital no celular do motorista, com foto obrigatória no item crítico e funcionamento offline.",
  },
  {
    topic: "Custo por quilômetro",
    today:
      "Calculado à mão na planilha, quando é calculado.",
    rookhub:
      "Custo por km e consumo calculados sozinhos, por veículo, motorista e composição.",
  },
  {
    topic: "Manutenção preventiva",
    today: "Controlada por memória e pela agenda do gestor.",
    rookhub:
      "Plano que dispara pelo que vencer primeiro: quilometragem, tempo ou horímetro.",
  },
  {
    topic: "Câmeras a bordo",
    today:
      "Instaladas, mas com três a quatro pessoas assistindo vídeo 24 horas por dia.",
    rookhub:
      "Análise que prioriza as câmeras com maior chance de evento, e a decisão continua humana.",
  },
  {
    topic: "Tempo de reação",
    today:
      "O número que decide o mês só existe no fechamento, e já é passado.",
    rookhub:
      "O desvio aparece no dia em que acontece, com a ação já ao lado do alerta.",
  },
];

/** Fallback abaixo de lg: o mesmo confronto, empilhado e sem rolagem
 *  controlada, porque travar um palco de tela cheia em 360px é hostil. */
function StackedRound({ round }: { round: Round }) {
  return (
    <div>
      <p className="vs-topic mx-auto">{round.topic}</p>

      <div className="mt-4 grid gap-3">
        <article className="vs-box vs-box-today relative inset-auto min-h-[180px]">
          <p className="vs-statement">{round.today}</p>
          <span className="vs-tag">Hoje</span>
        </article>

        <div className="flex justify-center">
          <span aria-hidden className="vs-badge">
            VS
          </span>
        </div>

        <article className="vs-box vs-box-rookhub relative inset-auto min-h-[180px]">
          <p className="vs-statement">{round.rookhub}</p>
          <span className="vs-tag">Com o RookHub</span>
        </article>
      </div>
    </div>
  );
}

/** Um só cabeçalho para os dois caminhos: a pilha do mobile e o palco
 *  grudado do desktop. */
function Heading({ className }: { className?: string }) {
  return (
    <header className={cn("mx-auto max-w-5xl text-center", className)}>
      <h2 className="type-display-section text-balance">
        O concorrente do Rook<span className="text-brand">Hub</span>
        <br />
        não é a planilha. É o escuro.
      </h2>

      <p className="mx-auto mt-5 max-w-[52ch] text-[15px] leading-relaxed text-muted text-pretty">
        Você não perde dinheiro por falta de sistema. Perde por não conseguir
        juntar, no mesmo lugar e no mesmo dia, o que cada sistema já sabe
        separadamente.
      </p>
    </header>
  );
}

export function ProblemSolution() {
  return (
    <Section id="solucoes" className="surface-deep border-b-0">
      <Container>
        <Heading className="mb-12 lg:hidden" />

        <div className="space-y-10 lg:hidden">
          {rounds.map((round) => (
            <Reveal key={round.topic}>
              <StackedRound round={round} />
            </Reveal>
          ))}
        </div>
      </Container>

      <VsScroller rounds={rounds}>
        <Heading />
      </VsScroller>
    </Section>
  );
}
