import type { FaqItem } from "@/types/marketing";

/** Perguntas frequentes ao pé de `/precos`. */
export const FAQ: readonly FaqItem[] = [
  {
    question: "Como é a cobrança?",
    answer:
      "Por veículo ativo na frota. Usuários são ilimitados em todos os planos, escritório, manutenção e motoristas entram no sistema sem custo adicional por pessoa.",
  },
  {
    question: "Posso trocar de plano depois?",
    answer:
      "Sim. A troca é feita no portal do cliente e o valor é ajustado proporcionalmente no ciclo vigente.",
  },
  {
    question: "Existe fidelidade?",
    answer:
      "Não. O cancelamento é feito a qualquer momento e o acesso permanece até o fim do período já pago.",
  },
  {
    question: "Quanto tempo leva a implantação?",
    answer:
      "O primeiro resultado concreto sai em até 30 dias, com as primeiras descobertas já na primeira semana, a importação do histórico por planilha é o que viabiliza esse prazo.",
  },
  {
    question: "Quais formas de pagamento?",
    answer:
      "Cartão de crédito e boleto para planos anuais. A contratação é feita com o nosso time, fale conosco pela página de contato.",
  },
] as const;
