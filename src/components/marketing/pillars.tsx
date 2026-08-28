import type { Pillar } from "@/components/marketing/pillars-capsules";
import { PillarsCapsules } from "@/components/marketing/pillars-capsules";
import { Container, Section } from "@/components/ui/section";
import { SectionIntro } from "@/components/ui/section-intro";

const pillars: Pillar[] = [
  {
    number: "Pilar 01",
    short: "Assistente",
    title: "Pergunte à sua frota",
    lead: "Assistente de inteligência artificial por texto e por voz. Você pergunta em português — “qual veículo está gastando mais?” — e recebe o número, o gráfico e o botão de ação, sem abrir relatório nenhum.",
    features: [
      "Atalho global Ctrl+K e microfone flutuante; a resposta sempre aparece na tela, mesmo quando falada.",
      "Toda resposta mostra fonte e período considerados — auditável na hora.",
      "Respostas calculadas por funções auditadas do sistema, não por texto gerado sobre o banco.",
      "Quando não sabe, diz que não sabe e sugere a pergunta mais próxima.",
      "Respeita o perfil de quem pergunta: o que o usuário não vê na tela, o assistente não revela.",
    ],
  },
  {
    number: "Pilar 02",
    short: "Checklist",
    title: "Checklist digital e inspeção mobile",
    lead: "O bloco de papel de 30 itens vira um formulário no celular do motorista — na saída e na devolução — que funciona no pátio, de madrugada, sem sinal.",
    features: [
      "Funciona 100% offline, com fila de sincronização automática, fotos incluídas.",
      "Foto obrigatória em item crítico, capturada só pela câmera nativa — sem reaproveitar imagem da galeria.",
      "Item crítico bloqueante deixa o veículo indisponível na hora e avisa o gestor em tempo real.",
      "A liberação exige justificativa escrita, registrada com autor e horário.",
      "Todo “não conforme” vira pendência vinculada ao veículo, visível ao próximo motorista.",
    ],
  },
  {
    number: "Pilar 03",
    short: "Segurança",
    title: "Segurança na estrada",
    lead: "Você já tem as câmeras. O que falta é alguém capaz de olhar todas ao mesmo tempo. O RookHub não substitui a câmera — substitui o plantão humano que assiste a ela.",
    features: [
      "Prioriza e destaca as câmeras com maior probabilidade de evento, em vez de exibir oitenta.",
      "Catálogo de eventos: sonolência, colisão iminente, celular ao volante, distração prolongada e ausência de cinto.",
      "Alerta crítico chega ao gestor em tempo real, já com “ligar para o motorista” ao lado.",
      "Eventos do mesmo motorista se agrupam em um único aviso — nada de fadiga de alerta.",
      "Score de segurança de 0 a 100 por motorista, com direito a contestação registrada.",
    ],
  },
  {
    number: "Pilar 04",
    short: "Custos",
    title: "Custo operacional e combustível",
    lead: "O custo por quilômetro deixa de ser uma conta de fim de mês e passa a ser um número vivo, por veículo, por motorista e por composição, quando o veículo puxa implemento.",
    features: [
      "Custo por km em camadas, sempre com o rótulo do que está incluído — nunca dois números sem nome.",
      "Abastecimento entra por integração de cartão, por lançamento do operador ou por foto do cupom.",
      "Consumo calculado só entre tanques completos: o km/l que você vê é o km/l real.",
      "Alerta de anomalia em linguagem de negócio: “este veículo está consumindo 18% acima dos outros”.",
      "Divergência entre GPS e odômetro acima de 5% levanta bandeira de auditoria.",
    ],
  },
];

export function Pillars() {
  return (
    <Section id="pilares" className="surface-black border-b-0">
      <Container>
        <SectionIntro
          eyebrow="Pilares da plataforma"
          ghost="Pilares"
          title={
            <>
              Quatro pilares. Um único <span className="text-brand">hub</span>.
            </>
          }
          description="Cada pilar existe para responder uma pergunta que hoje fica sem resposta na sua operação. Toque em um deles para ver o que muda — o que a plataforma passa a fazer sozinha, e o que deixa de depender da memória de alguém."
        />

        <PillarsCapsules pillars={pillars} />
      </Container>
    </Section>
  );
}
