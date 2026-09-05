import type { ComparisonRow } from "@/types/marketing";

/** Assunto a assunto, o que a operação faz hoje e o que passa a fazer. */
export const COMPARISON_ROWS: readonly ComparisonRow[] = [
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
    today: "Calculado à mão na planilha, quando é calculado.",
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
      "Análise que prioriza as câmeras com maior chance de evento, a decisão continua humana.",
  },
  {
    topic: "Reação",
    today: "O número que decide o mês só existe no fechamento, e já é passado.",
    rookhub:
      "O desvio aparece no dia em que acontece, com a ação já ao lado do alerta.",
  },
];
