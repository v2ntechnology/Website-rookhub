import type { Profile } from "@/types/marketing";

/** O que cada perfil enxerga ao abrir o RookHub, nas abas da landing. */
export const PROFILES: readonly Profile[] = [
  {
    title: "o Dono / Diretor",
    short: "Dono",
    meta: "Acesso diário, curto · Web e celular",
    quote: "“Saber onde está vazando o dinheiro.”",
    rows: [
      {
        label: "Dinheiro",
        text: "Estou ganhando ou perdendo neste período?",
        module: "Custos",
      },
      {
        label: "Alertas do dia",
        text: "O que está fora do padrão agora?",
        module: "Alertas",
      },
      {
        label: "Estado da frota",
        text: "Quantos veículos rodando, parados e em manutenção?",
        module: "Frota",
      },
      {
        label: "Ranking de custo",
        text: "Onde exatamente está o vazamento, por veículo e por motorista.",
        module: "Custos",
      },
      {
        label: "Painel enxuto",
        text: "Abre em segundos, entre uma reunião e outra — decisão de projeto.",
        module: "Produto",
      },
      {
        label: "Fechamento de período",
        text: "O número que você viu ontem continua o mesmo hoje.",
        module: "Custos",
      },
    ],
  },
  {
    title: "o Gestor de Frota",
    short: "Gestor de frota",
    meta: "Acesso diário, longo · Web",
    quote: "“Manter a operação rodando sem surpresas.”",
    rows: [
      {
        label: "Aprovação de saída",
        text: "Liberar veículo bloqueado por checklist, com justificativa registrada.",
        module: "Checklist",
      },
      {
        label: "Fila de pendências",
        text: "Ordens de serviço, com aprovação das que passam do valor-limite.",
        module: "Manutenção",
      },
      {
        label: "Alertas de segurança",
        text: "Em tempo real, agrupados por motorista, com a ação embutida.",
        module: "Segurança",
      },
      {
        label: "Vencimento de CNH",
        text: "Avisado com antecedência; motorista com CNH vencida não entra em viagem.",
        module: "Frota",
      },
      {
        label: "Ranking de motoristas",
        text: "Consumo e score de segurança para conduzir o plano de ação.",
        module: "Segurança",
      },
    ],
  },
  {
    title: "o Operador de Escritório",
    short: "Operador",
    meta: "Acesso contínuo · Web",
    quote: "“Lançar, conferir e organizar rápido.”",
    rows: [
      {
        label: "Velocidade acima de tudo",
        text: "Lançar no RookHub tem que ser mais rápido do que lançar na planilha de hoje.",
        module: "Produto",
      },
      {
        label: "Abastecimento",
        text: "Até 5 campos e 20 segundos — meta medida a cada versão.",
        module: "Custos",
      },
      {
        label: "Importação em lote",
        text: "Por planilha, com validação prévia e relatório de erro linha a linha.",
        module: "Dados",
      },
      {
        label: "Correção com histórico",
        text: "Quem mudou, quando, e de quanto para quanto.",
        module: "Dados",
      },
      {
        label: "Visibilidade financeira",
        text: "Uma chave nas mãos do dono — ligada ou desligada.",
        module: "Permissões",
      },
    ],
  },
  {
    title: "o Motorista",
    short: "Motorista",
    meta: "2× por viagem · App no celular",
    quote: "“Cumprir o checklist sem perder tempo.”",
    rows: [
      {
        label: "Entrada simples",
        text: "CPF e PIN de 6 dígitos; o primeiro acesso vem por QR code do escritório.",
        module: "Permissões",
      },
      {
        label: "Checklist no celular",
        text: "Saída e devolução, funcionando sem sinal.",
        module: "Checklist",
      },
      {
        label: "Pendências do veículo",
        text: "Vê o que está aberto no veículo que vai pegar.",
        module: "Checklist",
      },
      {
        label: "Próprio score",
        text: "Vê como foi calculado — e pode contestar um evento.",
        module: "Segurança",
      },
      {
        label: "Fila de envio",
        text: "Indicador permanente de itens ainda pendentes de sincronização.",
        module: "Checklist",
      },
    ],
  },
];
