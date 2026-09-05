import type { TypingHeadline } from "@/types/marketing";

/**
 * Manchete do rodapé, digitada quando o bloco entra na tela.
 *
 * O prefixo é escrito uma vez; as palavras entram em rodízio no fim da
 * frase. Todas precisam concordar com "O futuro da frota é", ou seja,
 * adjetivo masculino singular, senão a frase quebra no meio do rodízio.
 */
export const FOOTER_HEADLINE: TypingHeadline = {
  prefix: "O futuro da frota é",
  words: [
    "inteligente",
    "previsível",
    "auditável",
    "transparente",
    "rastreável",
  ],
};
