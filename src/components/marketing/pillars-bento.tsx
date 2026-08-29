/**
 * LAYOUT ARQUIVADO — painéis “bento” pretos empilhados em baralho
 * (`position: sticky` com degraus de 16px). Substituído pelas cápsulas
 * interativas em `pillars.tsx`, mas mantido inteiro e funcional.
 *
 * Para voltar a ele, troque em `src/app/page.tsx`:
 *   import { Pillars } from "@/components/marketing/pillars";
 * por:
 *   import { Pillars } from "@/components/marketing/pillars-bento";
 *
 * Depende das classes `.bento*` do `globals.css` e de `ui/reveal.tsx`.
 */
import { Reveal } from "@/components/ui/reveal";
import { Container, Section } from "@/components/ui/section";

type Feature = { label: string; text: string };

type Pillar = {
  number: string;
  title: string;
  lead: string;
  /** O primeiro item ocupa a célula larga, com o visual; os quatro
   *  seguintes formam a grade 2×2 abaixo. */
  features: [Feature, Feature, Feature, Feature, Feature];
  visual: string;
};

const pillars: Pillar[] = [
  {
    number: "Pilar 01",
    title: "Pergunte à sua frota",
    lead: "Assistente de inteligência artificial por texto e por voz. Você pergunta em português — “qual veículo está gastando mais?” — e recebe o número, o gráfico e o botão de ação, sem abrir relatório nenhum.",
    visual: "Conversa: pergunta → número → gráfico → ação",
    features: [
      {
        label: "Atalho global",
        text: "Ctrl+K e microfone flutuante. A resposta sempre aparece na tela, mesmo quando falada.",
      },
      {
        label: "Fonte e período à vista",
        text: "Toda resposta mostra de onde veio o número e que intervalo considerou — auditável na hora.",
      },
      {
        label: "Cálculo auditado",
        text: "As respostas vêm de funções do sistema, não de texto gerado sobre o banco.",
      },
      {
        label: "Admite o que não sabe",
        text: "Quando não tem a resposta, diz que não sabe e sugere a pergunta mais próxima.",
      },
      {
        label: "Respeita o perfil",
        text: "O que o usuário não vê na tela, o assistente também não revela.",
      },
    ],
  },
  {
    number: "Pilar 02",
    title: "Checklist digital e inspeção mobile",
    lead: "O bloco de papel de 30 itens vira um formulário no celular do motorista — na saída e na devolução — que funciona no pátio, de madrugada, sem sinal.",
    visual: "Fluxo: saída → inspeção → devolução → pendência",
    features: [
      {
        label: "Funciona offline",
        text: "100% sem sinal, com fila de sincronização automática assim que a conexão volta — fotos incluídas.",
      },
      {
        label: "Foto pela câmera nativa",
        text: "Item crítico exige foto capturada na hora, sem reaproveitar imagem da galeria.",
      },
      {
        label: "Bloqueio imediato",
        text: "Item crítico deixa o veículo indisponível na hora e avisa o gestor em tempo real.",
      },
      {
        label: "Liberação justificada",
        text: "Liberar exige justificativa escrita, registrada com autor e horário.",
      },
      {
        label: "Pendência que persiste",
        text: "Todo “não conforme” fica vinculado ao veículo, visível ao próximo motorista.",
      },
    ],
  },
  {
    number: "Pilar 03",
    title: "Segurança na estrada",
    lead: "Você já tem as câmeras. O que falta é alguém capaz de olhar todas ao mesmo tempo. O RookHub não substitui a câmera — substitui o plantão humano que assiste a ela.",
    visual: "Mural de câmeras priorizado por risco",
    features: [
      {
        label: "Triagem por probabilidade",
        text: "Prioriza e destaca as câmeras com maior chance de evento, em vez de exibir oitenta ao mesmo tempo.",
      },
      {
        label: "Catálogo de eventos",
        text: "Sonolência, colisão iminente, celular ao volante, distração prolongada e ausência de cinto.",
      },
      {
        label: "Alerta com ação ao lado",
        text: "O crítico chega ao gestor em tempo real, já com “ligar para o motorista” disponível.",
      },
      {
        label: "Sem fadiga de alerta",
        text: "Eventos do mesmo motorista se agrupam em um único aviso.",
      },
      {
        label: "Score contestável",
        text: "De 0 a 100 por motorista, com direito a contestação registrada.",
      },
    ],
  },
  {
    number: "Pilar 04",
    title: "Custo operacional e combustível",
    lead: "O custo por quilômetro deixa de ser uma conta de fim de mês e passa a ser um número vivo, por veículo, por motorista e por composição, quando o veículo puxa implemento.",
    visual: "Custo por km, camada por camada",
    features: [
      {
        label: "Custo por km em camadas",
        text: "Sempre com o rótulo do que está incluído — nunca dois números sem nome.",
      },
      {
        label: "Três formas de entrada",
        text: "Abastecimento por integração de cartão, lançamento do operador ou foto do cupom.",
      },
      {
        label: "km/l real",
        text: "Consumo calculado só entre tanques completos: o número que você vê é o número que aconteceu.",
      },
      {
        label: "Anomalia em português",
        text: "“Este veículo está consumindo 18% acima dos outros” — não um desvio-padrão na tela.",
      },
      {
        label: "Bandeira de auditoria",
        text: "Divergência entre GPS e odômetro acima de 5% levanta alerta.",
      },
    ],
  },
];

/** Marcas geométricas neutras — uma por posição na grade. */
const glyphs = [
  "M4 18 L12 5 L20 18 Z",
  "M5 5h14v14H5z M5 12h14",
  "M12 4 L20 8 L20 16 L12 20 L4 16 L4 8 Z",
  "M4 12h16 M12 4v16",
  "M4 16 L9 9 L14 14 L20 6",
];

function Glyph({ index }: { index: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="size-6 text-[color:var(--bento-muted)]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={glyphs[index % glyphs.length]} />
    </svg>
  );
}

function PillarPanel({ pillar }: { pillar: Pillar }) {
  const [wide, ...rest] = pillar.features;

  return (
    <article className="bento grid gap-px overflow-hidden sm:grid-cols-2">
      {/* Cabeçalho: manchete à esquerda, promessa à direita. */}
      <header className="bento-cell bento-head grid gap-6 p-7 sm:col-span-2 sm:grid-cols-2 sm:p-8">
        <div>
          <p className="type-label-md uppercase text-[color:var(--bento-muted)]">
            {pillar.number}
          </p>
          <h3 className="type-headline-lg mt-3 max-w-[18ch] text-balance">
            {pillar.title}
          </h3>
        </div>
        <p className="text-[14.5px] leading-relaxed text-[color:var(--bento-muted)] text-pretty sm:self-end">
          {pillar.lead}
        </p>
      </header>

      {/* Célula larga: o destaque do pilar, com o visual ao lado. */}
      <div className="bento-cell grid items-center gap-7 p-7 sm:col-span-2 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <Glyph index={0} />
          <p className="mt-4 text-[15px] font-semibold">{wide.label}</p>
          <p className="mt-1 text-[14px] leading-relaxed text-[color:var(--bento-muted)]">
            {wide.text}
          </p>
        </div>
        <div className="bento-visual relative h-36 p-6 text-xs">
          {pillar.visual}
          <span className="bento-pill absolute right-3 bottom-3">
            {pillar.number}
          </span>
        </div>
      </div>

      {/* Grade 2×2 com o restante. */}
      {rest.map((feature, index) => (
        <div key={feature.label} className="bento-cell p-7">
          <Glyph index={index + 1} />
          <p className="mt-4 text-[15px] font-semibold">{feature.label}</p>
          <p className="mt-1 text-[14px] leading-relaxed text-[color:var(--bento-muted)]">
            {feature.text}
          </p>
        </div>
      ))}
    </article>
  );
}

export function Pillars() {
  return (
    <Section id="pilares" className="surface-deep border-b-0">
      <Container>
        <header className="mx-auto max-w-5xl text-center">
          <h2 className="type-display-section text-balance">
            Quatro pilares.
            <br />
            Um único <span className="text-brand">hub</span>.
          </h2>

          <p className="mx-auto mt-5 mb-14 max-w-[46ch] text-[15px] leading-relaxed text-muted text-pretty">
            Cada pilar existe para responder uma pergunta que hoje fica sem
            resposta na sua operação. Role para conhecer um de cada vez.
          </p>
        </header>

        {/* Baralho: a partir de lg cada painel gruda logo abaixo da barra e
            o seguinte sobe por cima, um degrau mais baixo. Abaixo de lg é
            uma pilha normal — travar painel alto em tela pequena é hostil. */}
        <div className="space-y-6 lg:space-y-0 lg:pb-[30vh]">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              style={{ top: `${88 + index * 16}px` }}
              className="lg:sticky lg:pt-6"
            >
              <Reveal>
                <PillarPanel pillar={pillar} />
              </Reveal>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
