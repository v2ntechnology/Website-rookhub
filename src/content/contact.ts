import type { ContactChannel } from "@/types/marketing";

/**
 * Canais de contato da página `/contato`.
 *
 * Todos resolvem fora do site: o build é export estático e não tem servidor
 * para receber um formulário. Enquanto não existir endpoint, o caminho é o
 * cliente sair daqui para um canal que já funciona.
 */
export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    term: "E-mail",
    text: "Escreva contando o tamanho da frota e o que hoje não aparece. A resposta sai no mesmo dia útil.",
    action: { label: "contato@rookhub.com.br", href: "mailto:contato@rookhub.com.br" },
  },
  {
    term: "Demonstração",
    text: "Trinta minutos, com um veículo real da sua frota na tela, não um ambiente de exemplo.",
    action: {
      label: "Agendar uma demonstração",
      href: "mailto:contato@rookhub.com.br?subject=Agendar%20uma%20demonstra%C3%A7%C3%A3o",
    },
  },
  {
    term: "Planos",
    text: "Se você já sabe o porte da operação, o preço está publicado e a assinatura começa sem passar por vendas.",
    action: { label: "Ver planos e preços", href: "/precos" },
  },
];
