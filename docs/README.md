# Documentação do Website-rookhub

Este é o repositório do **site público**, não do painel. Se a busca é por login, frota, viagem ou
dado de operação, o projeto é `../System-web`, `../System-mobile` ou `../Backend-web`.

⚠️ **O site é estático e não tem cobrança.** A integração com o Stripe saiu em 05/09/2026: o que
existe hoje é a vitrine de planos, e os CTAs levam a `/contato`.

## Regras normativas

O **como** do repositório. Regra vence memória, e vence este índice, em caso de divergência.

| Documento | Assunto |
| --- | --- |
| [rules/01-stack.md](rules/01-stack.md) | Stack, versões e ferramentas permitidas |
| [rules/02-commits-e-branches.md](rules/02-commits-e-branches.md) | Mensagem de commit, branches, PRs |
| [rules/03-arquitetura.md](rules/03-arquitetura.md) | Estrutura de pastas, Server e Client, TypeScript |
| [rules/04-design-system.md](rules/04-design-system.md) | Tokens, temas, cor de marca, contraste |
| [rules/06-seo-performance.md](rules/06-seo-performance.md) | Metadata, Core Web Vitals, acessibilidade |
| [design/DESIGN.md](design/DESIGN.md) | Especificação de origem do design system |

O número 05 era a regra do Stripe, removida em 05/09/2026 junto com a integração. O lugar fica
vago de propósito: quando a cobrança voltar, a regra volta com o mesmo número. O texto antigo está
no histórico do Git.

⚠️ **O `design/DESIGN.md` está vencido no que for cor.** Ele descreve a paleta indigo e cyan; a
marca é terracota `#D5623A` desde 04/09/2026. O que continua valendo nele é tipografia, forma,
espaçamento e os critérios de contraste. A regra 04 registra a divergência.

## Operação

| Documento | Assunto |
| --- | --- |
| [deploy-cloudflare.md](deploy-cloudflare.md) | Como o export estático vai ao ar |

## Referência de produto

| Documento | Assunto |
| --- | --- |
| [prd_RookHub.md](prd_RookHub.md) | Requisitos do produto de gestão de frotas |

⚠️ **O PRD não é um documento deste site.** Ele descreve a plataforma de frotas e não menciona
landing nem planos. Fica aqui porque é a fonte das features que os planos vendem, e o
`src/content/plans.ts` o cita por esse motivo. Se um dia o PRD ganhar dono em outro repositório,
esse comentário precisa apontar para o novo lugar.

## O que não vive aqui

- **Instruções de agente**: `.claude/CLAUDE.md` (o operacional) e `.claude/memoria.md` (o porquê e
  as armadilhas). Só isso ficou no `.claude/`.
- **Documentação da plataforma**: PRD de app do motorista, contratos de API, arquitetura FSD,
  arquitetura de infraestrutura e estratégia de execução saíram daqui em 04/09/2026 e estão em
  `../docs-do-produto/`, na pasta guarda-chuva. Eles descrevem o produto, não o site, e ainda
  não têm repositório dono.
