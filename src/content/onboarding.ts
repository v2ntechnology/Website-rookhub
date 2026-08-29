import type { OnboardingStep } from "@/types/marketing";

/** As etapas prometidas na chamada final da landing. */
export const ONBOARDING_STEPS: readonly OnboardingStep[] = [
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
