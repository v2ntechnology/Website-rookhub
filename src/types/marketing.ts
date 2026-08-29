/**
 * Tipos do conteúdo editorial da landing.
 *
 * Ficam aqui, e não no componente que os desenha, para que `src/content/` não
 * precise importar de `src/components/`. Conteúdo depender de componente
 * inverte a direção da dependência: o dado passa a existir em função da tela.
 */

/** Um pilar da plataforma, na seção de capsulas. */
export type Pillar = {
  number: string;
  short: string;
  title: string;
  lead: string;
  features: string[];
};

/** Uma linha do que cada perfil enxerga. */
export type ProfileRow = {
  label: string;
  text: string;
  module: string;
};

/** Um perfil de uso, nas abas da seção de perfis. */
export type Profile = {
  title: string;
  short: string;
  meta: string;
  quote: string;
  rows: ProfileRow[];
};

/** Um assunto comparado entre a operação de hoje e a com o RookHub. */
export type ComparisonRow = {
  topic: string;
  today: string;
  rookhub: string;
};

/** Uma etapa da implantação, na chamada final. */
export type OnboardingStep = {
  term: string;
  text: string;
};
