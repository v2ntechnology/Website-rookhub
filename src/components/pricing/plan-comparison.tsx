import Link from "next/link";

import { PLANS } from "@/lib/stripe/plans";

/** `true` = incluído · `false` = fora do plano · texto = limite ou nota. */
type Cell = boolean | string;

type Feature = { label: string; values: [Cell, Cell, Cell] };
type Group = { title: string; features: Feature[] };

/**
 * Matriz de comparação. Os valores vêm do catálogo em `lib/stripe/plans.ts`
 * — Segurança na Estrada e Pergunte à Sua Frota são reservados aos planos
 * superiores por RN-006, e o eixo comercial é veículo ativo (RN-016).
 */
const groups: Group[] = [
  {
    title: "Essenciais",
    features: [
      { label: "Veículos ativos", values: ["Até 10", "Até 50", "Ilimitado"] },
      {
        label: "Usuários",
        values: ["Ilimitado", "Ilimitado", "Ilimitado"],
      },
      {
        label: "Cadastro de veículos, implementos, motoristas e oficinas",
        values: [true, true, true],
      },
      {
        label: "Checklist digital de saída e devolução, com fotos e offline",
        values: [true, true, true],
      },
      {
        label: "Manutenção preventiva com catálogo por marca e modelo",
        values: [true, true, true],
      },
      {
        label: "Central de notificações e importação por planilha",
        values: [true, true, true],
      },
    ],
  },
  {
    title: "Custos e combustível",
    features: [
      {
        label: "Controle de abastecimento e consumo (km/l entre tanques completos)",
        values: [true, true, true],
      },
      { label: "Custo variável por quilômetro", values: [true, true, true] },
      {
        label: "Custo operacional por km (pedágio, motorista e seguro)",
        values: [false, true, true],
      },
      {
        label: "Custo total por km (TCO, com depreciação e financiamento)",
        values: [false, false, true],
      },
      {
        label: "Detecção de anomalia de consumo por veículo",
        values: [false, true, true],
      },
    ],
  },
  {
    title: "Inteligência e segurança",
    features: [
      {
        label: "Pergunte à sua frota — assistente de IA por texto e por voz",
        values: [false, true, true],
      },
      {
        label: "Painel do Dono e fechamento de período",
        values: [false, true, true],
      },
      {
        label: "Segurança na estrada — priorização de câmeras e eventos",
        values: [false, false, true],
      },
      {
        label: "Score de segurança por motorista, com contestação",
        values: [false, false, true],
      },
    ],
  },
  {
    title: "Integrações e conta",
    features: [
      {
        label: "Telemetria, rastreamento e cartão de combustível",
        values: [false, true, true],
      },
      {
        label: "SSO corporativo e trilha de auditoria",
        values: [false, false, true],
      },
      {
        label: "Implantação guiada com a equipe RookHub",
        values: [false, false, true],
      },
      {
        label: "Suporte",
        values: [
          "E-mail",
          "Prioritário, horário comercial",
          "CS dedicado e SLA",
        ],
      },
    ],
  },
];

function Value({ value, plan }: { value: Cell; plan: string }) {
  if (typeof value === "string") {
    return <span className="text-[13px] text-body">{value}</span>;
  }

  if (value) {
    return (
      <>
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="mx-auto size-[18px] text-brand"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
        <span className="sr-only">Incluído no {plan}</span>
      </>
    );
  }

  return (
    <>
      <span aria-hidden className="text-faint">
        —
      </span>
      <span className="sr-only">Não incluído no {plan}</span>
    </>
  );
}

export function PlanComparison() {
  return (
    <>
      {/* A tabela tem largura mínima de 720px e rola dentro do próprio
          contêiner. Sem barra de rolagem visível no site, a pista de que
          há mais coluna à direita precisa ser dita. */}
      <p aria-hidden className="mb-4 text-xs text-faint sm:hidden">
        Arraste para o lado para comparar os planos →
      </p>

      <div className="cmp-scroll">
        <table className="cmp">
          <caption className="sr-only">
            Comparação de recursos entre os planos Básico, Profissional e
            Enterprise
          </caption>

          <thead>
            <tr>
              <td />
              {PLANS.map((plan) => (
                <th key={plan.id} scope="col">
                  <span className="cmp-plan">{plan.name}</span>
                  <Link href={`#plano-${plan.id}`} className="cmp-cta">
                    {plan.cta}
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden
                      className="size-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>

          {groups.map((group) => (
            <tbody key={group.title}>
              <tr>
                <th scope="colgroup" colSpan={4} className="cmp-group">
                  {group.title}
                </th>
              </tr>

              {group.features.map((feature) => (
                <tr key={feature.label}>
                  <th scope="row" className="cmp-label">
                    {feature.label}
                  </th>
                  {feature.values.map((value, index) => (
                    <td key={PLANS[index].id} className="cmp-value">
                      <Value value={value} plan={PLANS[index].name} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </>
  );
}
