import { Reveal } from "@/components/ui/reveal";
import { Container, Section } from "@/components/ui/section";
import { SectionIntro } from "@/components/ui/section-intro";

const profiles = [
  {
    title: "O Dono / Diretor",
    meta: "Acesso diário, curto · Web e celular",
    quote: "“Saber onde está vazando o dinheiro.”",
    items: [
      "Dinheiro: estou ganhando ou perdendo neste período?",
      "Alertas do dia: o que está fora do padrão agora?",
      "Estado da frota: quantos veículos rodando, parados e em manutenção?",
      "Ranking de custo: onde exatamente está o vazamento, por veículo e por motorista.",
      "Painel enxuto por decisão de projeto — abre em segundos, entre uma reunião e outra.",
      "Fechamento de período: o número que você viu ontem continua o mesmo hoje.",
    ],
  },
  {
    title: "O Gestor de Frota",
    meta: "Acesso diário, longo · Web",
    quote: "“Manter a operação rodando sem surpresas.”",
    items: [
      "Aprovação de saída: liberar veículo bloqueado por checklist, com justificativa registrada.",
      "Fila de pendências e ordens de serviço, com aprovação das que passam do valor-limite.",
      "Alertas de segurança em tempo real, agrupados por motorista, com ação embutida.",
      "Vencimento de CNH avisado com antecedência — e motorista com CNH vencida não entra em viagem.",
      "Ranking de consumo e de score por motorista para conduzir o plano de ação.",
    ],
  },
  {
    title: "O Operador de Escritório",
    meta: "Acesso contínuo · Web",
    quote: "“Lançar, conferir e organizar rápido.”",
    items: [
      "Princípio inegociável do produto: lançar no RookHub tem que ser mais rápido do que lançar na planilha de hoje.",
      "Abastecimento em até 5 campos e 20 segundos — meta medida a cada versão.",
      "Importação em lote por planilha, com validação prévia e relatório de erro linha a linha.",
      "Todo lançamento pode ser corrigido, com histórico de quem mudou, quando e de quanto para quanto.",
      "A visibilidade financeira do operador é uma chave nas mãos do dono — ligada ou desligada.",
    ],
  },
  {
    title: "O Motorista",
    meta: "2× por viagem · App no celular",
    quote: "“Cumprir o checklist sem perder tempo.”",
    items: [
      "Entra com CPF e PIN de 6 dígitos — primeiro acesso liberado por QR code do escritório.",
      "Checklist de saída e de devolução no celular, funcionando sem sinal.",
      "Vê as pendências abertas do veículo que vai pegar.",
      "Vê o próprio score de segurança e como ele foi calculado — e pode contestar um evento.",
      "Indicador permanente de itens ainda pendentes de envio.",
    ],
  },
];

export function Profiles() {
  return (
    <Section id="perfis" className="surface-black border-b-0">
      <Container>
        <Reveal>
          <SectionIntro
            eyebrow="Visões por perfil"
            ghost="Perfis"
            title={
              <>
                Cada pessoa abre o Rook
                <span className="text-brand">Hub</span> e vê o que precisa
                decidir.
              </>
            }
            description="Mesmo hub, quatro leituras. O dono não navega em tela de lançamento, e o operador não esbarra em número que não é dele — a permissão define o que existe na tela, não só o que está bloqueado nela."
          />
        </Reveal>

        <div className="border-b border-border">
          {profiles.map((profile) => (
            <Reveal key={profile.title}>
              <div className="editorial-row">
                <div>
                  <h3 className="editorial-term">{profile.title}</h3>
                  <p className="type-label-md mt-3 uppercase text-faint">
                    {profile.meta}
                  </p>
                  <p className="mt-3 text-sm text-muted">{profile.quote}</p>
                </div>

                <ul className="space-y-2">
                  {profile.items.map((item) => (
                    <li key={item} className="editorial-item">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
