# Arquitetura FSD — RookHub

**Estrutura de Pastas, Módulos e Organização de Código sob Feature-Sliced Design**

Documento normativo de arquitetura de código. Destinado à equipe de desenvolvimento frontend, fullstack e backend.

---

## 0. Controle do Documento

| Campo | Valor |
|---|---|
| Versão | 1.0 |
| Status | Aprovado |
| Metodologia | Feature-Sliced Design **2.1** |
| Escopo | Frontend (3 apps) + fronteira com Spring Modulith |
| Documentos-fonte | `visao_e_escopo_negocio_RookHub.md`, `prd_RookHub.md`, `arquitetura_e_decisoes_tecnicas_RookHub.md`, `arquitetura_free_tier_MVP_RookHub.md`, `DESIGN.md` |
| Precedência | Em conflito, prevalece `arquitetura_e_decisoes_tecnicas_RookHub.md` para stack e este documento para organização de código |

### 0.1 Como ler este documento

Cada decisão recebe um identificador `FSD-NN`, estável e citável em código, PR e ticket. Quando uma regra é fiscalizada automaticamente, isso está indicado por **`[CI]`** — significa que a violação **quebra o build**, não gera aviso.

### 0.2 Princípio condutor

> **A arquitetura só existe se o build a defender.**

O RookHub já estabeleceu esse padrão cultural em outras frentes: RN-002 falha o build se uma tabela nascer sem RLS; `FE-07` falha o build por violação de contraste WCAG AA. A organização de código segue o mesmo regime. Convenção sem fiscalização é decoração.

### 0.3 Índice de decisões

| ID | Decisão |
|---|---|
| `FSD-00` | Versão do FSD: 2.1, camada `processes` descartada |
| `FSD-01` | Escopo de adoção: `web` completo, `driver` reduzido, `site` fora |
| `FSD-02` | Fronteira `packages/*` × `shared` por número de consumidores |
| `FSD-03` | Camadas canônicas completas + critério widget × feature |
| `FSD-04` | Segmentos `ui/ model/ api/ lib/ config/`, com `queries.ts` × `store.ts` |
| `FSD-05` | Roteamento híbrido: rota colocada, guard centralizado |
| `FSD-06` | Código em inglês, UI em PT-BR, glossário versionado |
| `FSD-07` | Features atômicas com prefixo verbal obrigatório |
| `FSD-08` | `packages/domain-*` em TypeScript puro |
| `FSD-09` | `entities/sync-queue` como cidadã de primeira classe |
| `FSD-10` | Assistente como widget compondo features atômicas |
| `FSD-11` | Conexão WebSocket única em `shared/lib/realtime` |
| `FSD-12` | Entitlement + RBAC em três camadas de gate |
| `FSD-13` | Entities por agregado — 17 raízes fechadas |
| `FSD-14` | Cross-import `@x` limitado a tipos e seletores |
| `FSD-15` | `session` × `tenant` separadas, injetadas via provider |
| `FSD-16` | Mapper DTO → domínio obrigatório |
| `FSD-17` | Key factory por entity + barramento de eventos de domínio |
| `FSD-18` | Stores Zustand locais ao slice |
| `FSD-19` | Máquinas de estado em `domain-*` + testes de contrato |
| `FSD-20` | Public API por export nomeado explícito |
| `FSD-21` | Steiger + boundaries + dependency-cruiser, tudo `error` |
| `FSD-22` | Aliases por camada |
| `FSD-23` | Regras custom R1, R2, R3 |
| `FSD-24` | Testes colocalizados + `README.md` com rastreabilidade |
| `FSD-25` | Presets de lint por app |
| `FSD-26` | Paridade de nomes nas raízes de agregado |
| `FSD-27` | Contrato spec-first com validação automática |
| `FSD-28` | Backend organizado por módulo, não por camada |
| `FSD-29` | Catálogo único de eventos de domínio |
| `FSD-30` | Fixtures de contrato em `packages/contracts` |
| `FSD-31` | API sem versão + gate de breaking change |

---

## 1. Escopo de Adoção

### `FSD-01` — Nem todo app recebe FSD

| App | Tecnologia | Regime | Justificativa |
|---|---|---|---|
| `apps/web` | Vite + React 19 + React Router v7 | **FSD completo** (`fsd-full`) | 148 RNs, 6 papéis, alta densidade informacional. É o app que justifica a metodologia. |
| `apps/driver` | Vite + React 19 + Workbox + Dexie | **FSD reduzido** (`fsd-lite`) — sem `widgets` | Domínio real (checklist, fila offline, sessão), mas ~7 telas. `widgets` seria cerimônia sobre pouca composição. |
| `apps/site` | Next.js 15 | **Fora do FSD** (`next-site`) | Vitrine de marketing. `pages` do FSD colide com o App Router e não há domínio a fatiar. Organização por seções de conteúdo. |

**Regra derivada:** no `driver`, a camada `widgets` não é apenas ausente — é **proibida** **`[CI]`**. Camada opcional é camada que reaparece por acidente. Composição de tela no `driver` acontece em `pages`.

### `FSD-02` — Fronteira entre `packages/*` e `shared`

O monorepo já possui packages que são, conceitualmente, `shared` extraída para fora. A regra de fronteira é **objetiva e verificável em code review**:

> **Usado por dois ou mais apps → `packages/`. Usado por um app só → `shared/` local.**

| Código | Local | Motivo |
|---|---|---|
| Primitivos glassmorphism (`GlassCard`, `SpectrumButton`) | `packages/ui` | Consumidos por `web` e `site` |
| Tokens do `DESIGN.md` → CSS vars + preset Tailwind | `packages/tokens` | Três apps |
| Cliente gerado do OpenAPI | `packages/api-client` | `web` e `driver` |
| Regra de negócio pura | `packages/domain-*` | `web` e `driver` (e app nativo na Fase 2) |
| Componentes de alto contraste do motorista | `apps/driver/src/shared/ui` | Só o `driver` — RNF-029 abandona o glassmorphism |
| Formatadores de moeda e km | `packages/ui` ou `shared/lib` conforme consumidores | Aplicar a regra |

**Promoção.** Quando um segundo consumidor aparece, o código é **promovido** de `shared` para `packages` no mesmo PR que introduz o consumidor. Promoção adiada é duplicação garantida.

---

## 2. Estrutura do Monorepo

```
rookhub/
├─ apps/
│  ├─ web/                    Vite SPA — painel administrativo (FSD completo)
│  ├─ driver/                 Vite PWA — aplicativo do motorista (FSD reduzido)
│  └─ site/                   Next.js 15 — vitrine e planos (fora do FSD)
│
├─ packages/
│  ├─ ui/                     primitivos glassmorphism (web + site)
│  ├─ tokens/                 tokens do DESIGN.md → CSS vars + preset Tailwind
│  ├─ types/                  contratos de domínio compartilhados + catálogo de eventos
│  ├─ api-client/             cliente TypeScript GERADO do OpenAPI
│  ├─ contracts/              fixtures de máquinas de estado (front + back)
│  ├─ config-eslint/          presets fsd-full · fsd-lite · next-site
│  ├─ config-tsconfig/        bases de TypeScript
│  ├─ domain-checklist/       TS puro — regra do checklist e bloqueio
│  ├─ domain-fuel/            TS puro — consumo, baseline, anomalia
│  └─ domain-maintenance/     TS puro — gatilhos de plano e ciclo de OS
│
├─ backend/                   Java 21 · Spring Boot 3 · Spring Modulith
├─ infra/                     Terraform / OpenTofu
└─ openapi/                   spec 3.1 — fonte de verdade do contrato (spec-first)
```

Ferramenta: **Turborepo + pnpm workspaces**.

---

## 3. Camadas

### `FSD-03` — Conjunto canônico

```
app  →  pages  →  widgets  →  features  →  entities  →  shared
```

A dependência flui **estritamente da esquerda para a direita**. Uma camada pode importar de qualquer camada à sua direita, jamais à esquerda, jamais de si mesma — com a única exceção do cross-import `@x` (`FSD-14`).

| Camada | Responsabilidade | Não pode conter |
|---|---|---|
| `app` | Providers, roteador, guards, estilos globais, inicialização | Regra de negócio |
| `pages` | Composição de uma rota + `RouteObject` | Lógica de domínio própria |
| `widgets` | Composição de layout reutilizável, **sem regra de negócio própria** | Chamada de API direta |
| `features` | Uma interação do usuário que produz **efeito no domínio** | Import de outra feature |
| `entities` | Um agregado do negócio: tipos, queries, store, UI de apresentação | Import de feature ou widget |
| `shared` | Genérico, reutilizável, **sem conhecimento do domínio RookHub** | Nome de entidade do negócio |

### Critério widget × feature — regra sem exceção

> **`widget`** = composição de layout **sem regra de negócio própria**.
> **`feature`** = interação do usuário que **produz efeito no domínio**.

Aplicação prática:

- Os 4 blocos do Painel do Dono (RF-032) são **widgets** — eles compõem e exibem, não decidem.
- "Registrar abastecimento" (RF-020) é **feature** — produz um `fueling`, dispara recálculo de baseline.
- "Bloquear veículo" (RF-015) é **feature** — muda o estado do agregado `vehicle`.
- O Spotlight do assistente é **widget** que compõe features (`FSD-10`).

### `FSD-04` — Segmentos internos de cada slice

```
<slice>/
├─ ui/            componentes React
├─ model/
│  ├─ queries.ts  TanStack Query v5 — server state
│  ├─ store.ts    Zustand — client state
│  ├─ types.ts    modelo de domínio do frontend
│  └─ selectors.ts
├─ api/           chamadas + MAPPER DTO → domínio
├─ lib/           helpers internos do slice
├─ config/        constantes do slice
├─ README.md      obrigatório em entities e widgets
└─ index.ts       Public API
```

A separação `queries.ts` × `store.ts` é obrigatória. A decisão `FE-08` define duas naturezas distintas de estado — a estrutura de pastas torna isso **visível**, não implícito. Um dado que veio do servidor nunca mora no Zustand; um estado de UI nunca mora no cache do Query.

### `FSD-06` — Idioma

| Elemento | Idioma |
|---|---|
| Pastas, arquivos, variáveis, tipos, funções | **Inglês** |
| Textos de interface | **PT-BR**, sempre via i18n |
| `README.md` de slice, comentários, ADRs | PT-BR |

O **Anexo B do PRD (Glossário de Domínio)** é promovido a artefato versionado em `packages/types/glossary.md` e é a fonte de verdade da tradução. Nenhum termo novo entra no código sem entrada no glossário.

| PT-BR | Inglês no código |
|---|---|
| Cavalo mecânico | `tractor` (subtipo de `vehicle`) |
| Implemento / carreta | `trailer` (subtipo de `vehicle`) |
| Composição | `vehicleComposition` |
| Checklist de saída / devolução | `departureChecklist` / `returnChecklist` |
| Item bloqueante | `blockingItem` |
| Pendência | `pendency` |
| Ordem de Serviço | `workOrder` |
| Abastecimento | `fueling` |
| Tanque completo | `fullTank` |
| Baseline de consumo | `consumptionBaseline` |
| Score de segurança | `safetyScore` |
| Digest diário | `dailyDigest` |
| Camada de anticorrupção | `anticorruptionLayer` |

---

## 4. Árvore de Pastas — `apps/web`

```
apps/web/src/
│
├─ app/
│  ├─ providers/
│  │  ├─ QueryProvider.tsx
│  │  ├─ RealtimeProvider.tsx          conexão STOMP única — FSD-11
│  │  ├─ AccessProvider.tsx            injeta session+tenant p/ shared — FSD-15
│  │  ├─ DomainEventsProvider.tsx      barramento — FSD-17
│  │  └─ ThemeProvider.tsx
│  ├─ router/
│  │  ├─ routes.tsx                    agrega RouteObjects das pages
│  │  ├─ guards/
│  │  │  ├─ withAuth.tsx
│  │  │  ├─ withRole.tsx               RBAC — Anexo A do PRD
│  │  │  └─ withEntitlement.tsx        plano contratado — RF-002
│  │  └─ applyGuards.ts                wrapper obrigatório — [CI]
│  ├─ layouts/
│  │  ├─ AuthenticatedLayout.tsx       monta Spotlight, Toaster, Sino
│  │  └─ PublicLayout.tsx
│  ├─ styles/
│  │  └─ globals.css                   @theme do Tailwind v4
│  └─ main.tsx
│
├─ pages/
│  ├─ login/
│  ├─ owner-dashboard/                 RF-032
│  ├─ vehicles/  vehicle-detail/
│  ├─ drivers/   driver-detail/
│  ├─ trips/
│  ├─ checklists/  checklist-detail/
│  ├─ pendencies/
│  ├─ fuelings/
│  ├─ costs/
│  ├─ maintenance-plans/
│  ├─ work-orders/  work-order-detail/
│  ├─ safety-events/  safety-event-detail/
│  ├─ driver-scores/
│  ├─ notifications/
│  ├─ integrations/
│  ├─ users/
│  ├─ plans/                           teaser permitido — RN-004
│  ├─ settings/
│  └─ onboarding/                      RF-039
│
├─ widgets/
│  ├─ app-shell/                       sidebar com módulos bloqueados
│  ├─ owner-money-block/               1º nível — RF-032
│  ├─ owner-alerts-block/              2º nível
│  ├─ owner-fleet-status-block/        3º nível
│  ├─ owner-cost-ranking-block/        4º nível
│  ├─ assistant-spotlight/             FSD-10 — Ctrl+K
│  ├─ safety-alert-toaster/            sempre montado — RN-087
│  ├─ notification-bell/               RF-038
│  ├─ fleet-map/                       Mapbox, instância única — FE-10
│  └─ vehicle-summary-header/
│
├─ features/                           ver catálogo na seção 6
│
├─ entities/                           ver catálogo na seção 5
│
└─ shared/
   ├─ ui/
   │  ├─ Gated.tsx                     entitlement + RBAC + financeiro — FSD-12
   │  ├─ DataTable.tsx                 Inter tabular — RNF-027
   │  └─ ...
   ├─ lib/
   │  ├─ realtime/                     cliente STOMP único + registry de tópicos
   │  ├─ domain-events/                barramento — FSD-17
   │  ├─ format/                       moeda, km, litro, data
   │  └─ access-context.ts             contexto lido pelo Gated
   ├─ api/
   │  └─ http.ts                       interceptors, refresh rotativo
   └─ config/
```

### Árvore de `apps/driver` (regime `fsd-lite`)

```
apps/driver/src/
├─ app/                    providers, rotas, service worker, registro de PIN
├─ pages/
│  ├─ pin-login/
│  ├─ home/
│  ├─ checklist-run/       o coração do PWA — RF-012 a RF-017
│  ├─ checklist-summary/
│  ├─ vehicle-pendencies/  consulta offline — RN-052
│  ├─ trip-events/
│  └─ sync-status/         RNF-013
├─ features/
├─ entities/
└─ shared/
   ├─ ui/                  alto contraste, alvos grandes — RNF-029
   └─ lib/persistence/     Dexie + Workbox + Background Sync
```

> **`widgets` não existe no `driver`** — proibida por lint (`FSD-25`).

---

## 5. Catálogo de Entities

### `FSD-13` — Entities por agregado

O Anexo D do PRD lista ~40 tabelas. **Uma entity por tabela seria ruído**: nenhum daqueles registros tem sentido isolado, e toda feature precisaria importar cinco entities. A camada `entities` mapeia **raízes de agregado**, e os satélites viram tipos internos do slice.

| Entity | Satélites absorvidos | RFs | App |
|---|---|---|---|
| `tenant` | `tenant_settings`, `tenant_modules` | RF-001, RF-002, RF-007 | web |
| `session` | contexto de autenticação, papel, tenant ativo | RF-003 a RF-005 | web, driver |
| `user` | ciclo de vida, convite, MFA | RF-004, RF-006 | web |
| `vehicle` | `vehicle_composition`, `vehicle_status_history` | RF-008, RF-015 | web, driver |
| `driver` | `driver_document` | RF-009 | web |
| `trip` | `trip_event` | RF-011 | web, driver |
| `checklist` | `checklist_template`, `_section`, `_item`, `_submission`, `_answer`, `_photo` | RF-012 a RF-017 | web, driver |
| `pendency` | — (**raiz própria**) | RF-016 | web, driver |
| `fueling` | `consumption_baseline` | RF-020, RF-021 | web |
| `odometer` | `odometer_reading` | RF-019 | web, driver |
| `cost-entry` | categorias de custo | RF-018, RF-022 | web |
| `maintenance-plan` | `maintenance_plan_catalog` | RF-023 | web |
| `work-order` | `work_order_item` | RF-024 | web |
| `safety-event` | `safety_event_label`, `safety_dispute` | RF-025 a RF-030 | web |
| `driver-score` | `driver_safety_score` | RF-031 | web |
| `notification` | — | RF-038 | web, driver |
| `integration` | `integration_connection`, `integration_sync_log` | RF-041, RF-042 | web |
| `assistant-session` | `ai_conversation`, `ai_message`, `ai_intent_gap` | RF-033 a RF-037 | web |
| `sync-queue` | fila local, prioridade, estado | RNF-010 a RNF-013 | driver |

**Duas escolhas que exigem justificativa explícita:**

1. **`pendency` é raiz própria, não satélite de `checklist`.** Ela nasce no checklist, é consumida pela manutenção, aparece para o próximo motorista e sobrevive à submissão que a originou. Tem ciclo de vida independente — logo, agregado independente. Torná-la satélite acoplaria manutenção a checklist permanentemente.

2. **`sync-queue` é entity, não infraestrutura.** No RookHub a fila é algo que o motorista **vê** (RNF-013 exige indicador visual permanente de estado). Com casa própria, `RNF-010` (7 dias de capacidade), `RNF-011` (prioridade de dados sobre fotos) e `RNF-013` passam a ter um único dono no código. O transporte cru — Dexie, Workbox, Background Sync — permanece em `shared/lib/persistence`; `entities/sync-queue` orquestra em cima.

### `FSD-14` — Cross-import entre entities (`@x`)

Uma `Trip` referencia veículo e motorista. Uma `WorkOrder` referencia veículo e pendências. Sem regra, o time viola a camada na primeira sprint.

```
entities/vehicle/
├─ @x/
│  ├─ trip.ts             API pública dedicada ao slice trip
│  ├─ work-order.ts
│  └─ safety-event.ts
└─ index.ts
```

```ts
// entities/trip/model/types.ts
import type { VehicleRef } from '@entities/vehicle/@x/trip';
```

**Regra de contenção — obrigatória:**

> `@x` expõe **somente tipos e seletores leves**. Nunca hooks de query, nunca componentes React, nunca stores.

Se uma entity precisa da UI de outra, a composição acontece na camada acima (widget ou page). Isso mantém o grafo de dependência raso, auditável e sem ciclos.

### `FSD-15` — `session` e `tenant`

Separação obrigatória:

- **`entities/session`** — quem sou eu, qual meu papel, meu token.
- **`entities/tenant`** — qual empresa, quais módulos contratados, quais flags.

O `SUPER_ADMIN` (RN-003) **troca de tenant sem trocar de session**. A modelagem suporta isso desde o dia 1, e a troca dispara obrigatoriamente o registro no log de auditoria imutável com usuário, tenant, timestamp e motivo informado.

**Problema de camada e sua solução.** `shared/ui/Gated` precisa dos entitlements, mas `shared` **não pode importar de `entities`**. Solução:

```
entities/session + entities/tenant
        ↓ (dados)
app/providers/AccessProvider
        ↓ (React Context — sem import estático)
shared/lib/access-context  ←  shared/ui/Gated lê daqui
```

`shared` permanece genérico e reutilizável; a direção de dependência permanece íntegra.

### `FSD-16` — Mapper obrigatório DTO → domínio

`packages/api-client` é **gerado** do OpenAPI. Seus tipos **não circulam** pelo app.

```ts
// entities/vehicle/api/mapper.ts
import type { VehicleDto } from '@rookhub/api-client';
import type { Vehicle } from '../model/types';

export function toVehicle(dto: VehicleDto): Vehicle {
  return {
    id: dto.id,
    plate: dto.plate,
    kind: dto.vehicle_kind,              // snake_case não vaza para a UI
    status: dto.status,
    blockedAt: dto.blocked_at ? new Date(dto.blocked_at) : null,  // Date, não string
    openPendencyCount: dto.open_pendency_count,
    isBlocked: dto.status === 'BLOCKED',  // derivado, calculado uma vez
  };
}
```

**Justificativa específica do RookHub.** O backend usa **jOOQ para as consultas analíticas** (`BE-10`), cujas respostas são moldadas por performance de SQL, não por necessidade de UI. O Painel do Dono e o assistente consomem exatamente essas respostas. Sem mapper, a forma da query vira a forma do componente React — e otimizar o SQL passa a quebrar a interface.

### `FSD-17` — Cache e invalidação cross-entity

Cenário real: motorista sincroniza checklist com item bloqueante → `pendency` criada → `vehicle` vai para bloqueado → notificação chega por WebSocket. **Um evento, quatro caches.**

**Key factory por entity:**

```ts
// entities/vehicle/model/queries.ts
export const vehicleKeys = {
  all: ['vehicle'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (filters: VehicleFilters) => [...vehicleKeys.lists(), filters] as const,
  detail: (id: string) => [...vehicleKeys.all, 'detail', id] as const,
};
```

**Barramento de eventos de domínio:**

```ts
// entities/vehicle/model/subscriptions.ts
onDomainEvent('checklist.submitted', ({ vehicleId }) => {
  queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(vehicleId) });
});

onDomainEvent('vehicle.blocked', ({ vehicleId }) => {
  queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
});
```

Cada entity é dona da própria invalidação. Nenhuma feature conhece o cache alheio. O WebSocket é apenas mais um produtor no mesmo barramento — mudança local e mudança remota percorrem o **mesmo caminho**.

**Depurabilidade obrigatória:** log de eventos no console em desenvolvimento e breadcrumb no Sentry em produção. Indireção sem rastro é indireção que ninguém consegue depurar às 2h da manhã.

### `FSD-18` — Zustand

Stores **pequenas e locais** ao slice que precisar. Sem store global fatiada — isso reintroduz o Redux que `FE-08` deliberadamente evitou.

Client state legítimo no RookHub: filtros de tabela não persistidos, estado do Spotlight (escutando/pensando/falando), passo atual do wizard de onboarding, preferência "modo alto desempenho" (`FE-07`), progresso local do checklist antes da submissão.

---

## 6. Catálogo de Features

### `FSD-07` — Atômicas com prefixo verbal

Uma feature = **uma ação do usuário**. Prefixo verbal obrigatório **`[CI]`**. É o prefixo que mantém ~70 pastas navegáveis: lendo a camada `features/`, enxerga-se o backlog do PRD.

Verbos permitidos: `create-` `edit-` `delete-` `fill-` `submit-` `review-` `approve-` `reject-` `contest-` `resolve-` `block-` `unblock-` `link-` `import-` `export-` `register-` `configure-` `invite-` `ask-` `capture-` `render-` `switch-` `acknowledge-`.

| Domínio | Features | RFs |
|---|---|---|
| **Acesso** | `sign-in-email` · `sign-in-google` · `sign-in-driver-pin` · `configure-mfa` · `invite-user` · `reset-driver-pin` · `create-driver-qr` · `switch-tenant` · `configure-financial-visibility` | RF-003 a RF-007 |
| **Cadastros** | `create-vehicle` · `edit-vehicle` · `link-vehicle-composition` · `create-driver` · `register-driver-document` · `create-workshop` · `create-supplier` · `import-spreadsheet` | RF-008 a RF-010, RF-040 |
| **Viagens** | `create-trip` · `close-trip` · `register-trip-event` | RF-011 |
| **Checklist** | `fill-checklist` · `capture-checklist-photo` · `submit-checklist` · `review-checklist` · `block-vehicle` · `unblock-vehicle` · `resolve-pendency` · `configure-checklist-template` | RF-012 a RF-017 |
| **Custos** | `register-fueling` · `register-odometer` · `register-cost-entry` · `review-consumption-anomaly` · `export-cost-report` | RF-018 a RF-022 |
| **Manutenção** | `create-maintenance-plan` · `import-plan-catalog` · `create-work-order` · `advance-work-order` · `close-work-order` | RF-023, RF-024 |
| **Segurança** | `review-safety-event` · `classify-safety-event` · `contest-safety-event` · `resolve-safety-dispute` · `acknowledge-cabin-alert` | RF-025 a RF-031 |
| **Assistente** | `ask-fleet-question` · `capture-voice-input` · `render-answer-chart` · `register-intent-gap` | RF-033 a RF-037 |
| **Notificações** | `read-notification` · `configure-notification-preferences` | RF-038 |
| **Onboarding** | `configure-integration` · `import-fleet` · `invite-team` · `configure-plan` | RF-039 |
| **Sincronização** | `submit-sync-queue` · `review-sync-conflict` | RNF-010 a RNF-013 |

### `FSD-08` — Regra compartilhada em `packages/domain-*`

O Checklist Digital vive em **dois apps**: o motorista preenche no `driver` (offline, Dexie, alto contraste); operador e manutenção consomem no `web` (pendências, bloqueio, evidências). As regras são as mesmas; a UI é completamente diferente.

```
packages/domain-checklist/
├─ src/
│  ├─ types.ts
│  ├─ rules.ts               item bloqueante ⇒ veículo indisponível (RF-015)
│  ├─ state-machine.ts       Anexo C do PRD
│  ├─ sync-contract.ts       dois timestamps (RN-054), autoridade do servidor (RN-053)
│  └─ index.ts
└─ package.json
```

**Restrição dura `[CI]`:** `packages/domain-*` é **TypeScript puro**. Proibido importar React, Dexie, TanStack Query, Zustand ou qualquer coisa que não seja ele mesmo e `packages/types`.

Isso é o que permite: (a) rodar a máquina de estado em teste de contrato fora do navegador; (b) o PWA decidir **offline** se um item bloqueante torna o veículo indisponível, sem inventar regra própria; (c) na Fase 2, um app nativo reaproveitar a regra sem reescrever nada.

Mesmo padrão para `domain-fuel` (baseline de 90 dias, detecção de anomalia — RF-021) e `domain-maintenance` (gatilhos de km/tempo/horímetro, ciclo de OS — RF-023, RF-024).

### `FSD-10` — Assistente "Pergunte à Sua Frota"

É o diferencial comercial do produto. Não tem página, é invocável de qualquer tela, tem entrada por voz, saída por voz e tela, renderiza gráficos dinâmicos e é bloqueado por entitlement.

```
widgets/assistant-spotlight/          montado UMA vez no AuthenticatedLayout
   ├─ compõe features/ask-fleet-question
   ├─ compõe features/capture-voice-input
   └─ compõe features/render-answer-chart

entities/assistant-session/           histórico + estado (escutando/pensando/falando)
```

O Spotlight é **stateless**: pode ser desmontado sem perder contexto, porque o estado vive na entity. A captura de voz fica isolada e substituível — no MVP free tier é Web Speech API (`FREE-08`), na stack definitiva é Google STT (`IA-03`), e a troca não toca o assistente.

Gráficos gerados dinamicamente usam **Recharts** (`FE-09`), nunca visx — visx é exclusivo dos widgets fixos e desenhados do Painel do Dono.

### `FSD-11` — Tempo real

Uma **única** conexão STOMP por sessão, gerenciada em `shared/lib/realtime`. Cada entity assina seu tópico no próprio `model`, através de um registry que impede assinatura duplicada.

| Tópico | Assinante |
|---|---|
| `/topic/tenant.{id}.notifications` | `entities/notification` |
| `/topic/tenant.{id}.safety.critical` | `entities/safety-event` |
| `/topic/tenant.{id}.fleet.status` | `entities/vehicle` |
| `/user/queue/personal` | `entities/session` |

**Dois pontos não-negociáveis:**

1. `widgets/safety-alert-toaster` é montado no layout raiz e **sempre vivo**. Assinar dentro do componente que exibe significaria perder o evento quando ele está desmontado — inaceitável para RN-087.
2. A ressincronização pós-reconexão dispara `invalidateQueries` por escopo de tópico. O TanStack Query é o mecanismo de recuperação; **não existe estado paralelo** guardando o que chegou pelo socket.

### `FSD-12` — Entitlement e RBAC em três camadas

RF-002 exige duas camadas independentes de autorização: **entitlement de plano** × **permissão de papel**. Uma ação só é permitida quando **ambas** autorizam. RN-018/RN-019 acrescentam a flag `operator_sees_financials`, que vale em **todas** as superfícies.

```tsx
// 1. Rota
applyGuards(route, { role: ['OWNER','MANAGER'], module: 'safety' })

// 2. Bloco ou botão
<Gated module="safety" permission="safety.event.contest">
  <ContestButton />
</Gated>

<Gated financial>
  <CostPerKmCard />
</Gated>

// 3. Camada de dados — entities/*/api recusa antes de emitir o request
```

**Declaração obrigatória no documento e no onboarding do time:**

> **O frontend nunca é autoridade.** O gate client-side existe para UX e para evitar request inútil. A segurança real é RLS + RBAC no backend. Nenhuma decisão de produto pode depender exclusivamente do gate do front.

**Gate de CI `[CI]`:** o build falha se qualquer componente marcado como financeiro for renderizado fora de um `<Gated financial>`. Mesmo espírito de RN-002 e `FE-07`.

**Módulo não contratado** (RN-004): aparece na navegação em estado bloqueado com CTA "Conhecer". Dados de amostra (teaser) são permitidos **apenas** em `pages/plans` — nunca em contexto operacional.

---

## 7. Regras de Importação e Public API

### `FSD-20` — Public API por export nomeado explícito

```ts
// entities/vehicle/index.ts

export { VehicleCard } from './ui/VehicleCard';
export { VehicleStatusBadge } from './ui/VehicleStatusBadge';

export { useVehicle, useVehicleList, vehicleKeys } from './model/queries';
export { selectBlockedVehicles } from './model/selectors';

export type { Vehicle, VehicleKind, VehicleStatus } from './model/types';
```

Proibido `export *`. O `index.ts` é o **contrato legível** do slice, revisável em PR, e garante tree-shaking previsível — o que importa especialmente no `driver`, que roda em 3G de rodovia com bundle mínimo (`FE-05`).

> **O que não está no `index.ts` é privado.** Privado significa que outro slice não acessa nem por caminho profundo **`[CI]`**. Se o import profundo fosse possível, o cross-import controlado do `FSD-14` seria decorativo.

### `FSD-22` — Aliases por camada

```jsonc
{
  "compilerOptions": {
    "paths": {
      "@app/*":      ["./src/app/*"],
      "@pages/*":    ["./src/pages/*"],
      "@widgets/*":  ["./src/widgets/*"],
      "@features/*": ["./src/features/*"],
      "@entities/*": ["./src/entities/*"],
      "@shared/*":   ["./src/shared/*"]
    }
  }
}
```

A camada é a primeira coisa que se lê; violação de direção fica visível a olho nu no diff, inclusive em revisão pelo celular.

**Regra complementar `[CI]`:** import relativo é permitido **apenas dentro do próprio slice** (`./ui/Card`). Qualquer travessia de slice usa alias. Isso torna a regra verificável por padrão simples: *cruzou slice? tem que ter alias.*

### `FSD-23` — Regras custom além do FSD padrão

| # | Regra | Justificativa |
|---|---|---|
| **R1** | `packages/domain-*` não importa nada além de si mesmo e `packages/types` | Sustenta `FSD-08` e `FSD-19` |
| **R2** | `packages/api-client` só é importado por `entities/*/api` | Sustenta `FSD-16`; trocar o gerador tem impacto contido |
| **R3** | Ciclo de dependência quebra o build | FSD previne ciclo entre camadas, não entre slices via `@x` mal usado |

### `FSD-21` — Ferramental de enforcement

| Ferramenta | Cobre |
|---|---|
| **Steiger** | Camadas, slices, public API, `@x` — regras nativas do FSD |
| **eslint-plugin-boundaries** | Regras custom R1, R2, aliases, `widgets` proibida no `driver` |
| **dependency-cruiser** | Ciclos (R3) e geração do grafo de dependências para documentação |

**Severidade: tudo `error` desde o dia 1.** Não há período de carência.

Justificativa cultural: os documentos do RookHub já estabelecem o precedente — RN-002 falha o build por RLS ausente, `FE-07` falha por contraste. Uma regra de arquitetura com severidade menor comunica ao time que ela é opcional. E é ordens de magnitude mais barato começar rígido com o repositório vazio do que apertar depois com 600 arquivos.

```js
// packages/config-eslint/fsd-full.js — trecho
{
  settings: {
    'boundaries/elements': [
      { type: 'app',      pattern: 'src/app/*' },
      { type: 'pages',    pattern: 'src/pages/*' },
      { type: 'widgets',  pattern: 'src/widgets/*' },
      { type: 'features', pattern: 'src/features/*' },
      { type: 'entities', pattern: 'src/entities/*' },
      { type: 'shared',   pattern: 'src/shared/*' },
    ],
  },
  rules: {
    'boundaries/element-types': ['error', {
      default: 'disallow',
      rules: [
        { from: 'app',      allow: ['pages','widgets','features','entities','shared'] },
        { from: 'pages',    allow: ['widgets','features','entities','shared'] },
        { from: 'widgets',  allow: ['features','entities','shared'] },
        { from: 'features', allow: ['entities','shared'] },
        { from: 'entities', allow: ['shared'] },   // cross-import só via @x
        { from: 'shared',   allow: ['shared'] },
      ],
    }],
    // R2 — api-client só via entities/*/api
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['@rookhub/api-client', '@rookhub/api-client/*'],
        message: 'Importe apenas em entities/*/api. Ver FSD-16 e FSD-23/R2.',
      }],
    }],
  },
}
```

### `FSD-25` — Presets por app

```
packages/config-eslint/
├─ fsd-full.js      apps/web
├─ fsd-lite.js      apps/driver — widgets PROIBIDA
└─ next-site.js     apps/site
```

Cada app declara seu regime no próprio `package.json`. Adicionar um quarto app no futuro é trivial e explícito.

### `FSD-24` — Testes e documentação

Testes e stories **colocalizados**:

```
entities/vehicle/ui/
├─ VehicleCard.tsx
├─ VehicleCard.test.tsx
└─ VehicleCard.stories.tsx
```

Excluir o slice exclui os testes junto. Teste distante do código é teste que não é atualizado.

`README.md` **obrigatório** em `entities` e `widgets`, opcional em `features`:

```md
# entities/vehicle

Agregado de veículo: cavalo mecânico, implemento, truck, toco e VUC.
Absorve composição vigente e histórico de transição de estado.

RFs: RF-008, RF-015, RF-019
RNs: RN-035, RN-049, RN-050

## Public API
- `VehicleCard`, `VehicleStatusBadge`
- `useVehicle`, `useVehicleList`, `vehicleKeys`
- tipos: `Vehicle`, `VehicleKind`, `VehicleStatus`

## Cross-imports (@x)
- `trip`, `work-order`, `safety-event` — apenas `VehicleRef`
```

O campo **`RFs:`** é o que permite ir do PRD ao código com um `grep`. Com 148 RNs, essa rastreabilidade vale mais que qualquer wiki.

---

## 8. Fronteira FSD ↔ Spring Modulith

O RookHub tem uma característica rara: **as duas pontas são modulares por decisão explícita**. Se os modelos não conversarem, haverá duas taxonomias concorrentes descrevendo o mesmo negócio, e toda conversa de squad começará com tradução.

### `FSD-26` — Matriz de Módulos

Paridade de nomenclatura **nas raízes de agregado**; liberdade nas bordas técnicas.

| Módulo Modulith | Entity FSD | Features principais | RFs |
|---|---|---|---|
| `tenant` | `tenant` | `configure-financial-visibility` | RF-001, RF-002, RF-007 |
| `iam` | `session`, `user` | `sign-in-*`, `invite-user`, `configure-mfa` | RF-003 a RF-006 |
| `fleet` | `vehicle`, `driver` | `create-vehicle`, `link-vehicle-composition` | RF-008 a RF-010 |
| `trip` | `trip` | `create-trip`, `close-trip` | RF-011 |
| `checklist` | `checklist`, `pendency` | `fill-checklist`, `block-vehicle`, `resolve-pendency` | RF-012 a RF-017 |
| `cost` | `fueling`, `odometer`, `cost-entry` | `register-fueling`, `review-consumption-anomaly` | RF-018 a RF-022 |
| `maintenance` | `maintenance-plan`, `work-order` | `create-work-order`, `advance-work-order` | RF-023, RF-024 |
| `safety` | `safety-event`, `driver-score` | `review-safety-event`, `contest-safety-event` | RF-025 a RF-031 |
| `analytics` | — (consumida por widgets) | — | RF-018, RF-032 |
| `assistant` | `assistant-session` | `ask-fleet-question` | RF-033 a RF-037 |
| `notification` | `notification` | `read-notification` | RF-038 |
| `onboarding` | — | `configure-integration`, `import-fleet` | RF-039, RF-040 |
| `integration` | `integration` | `configure-integration` | RF-041, RF-042 |
| `ingestion` | — (sem par no front) | — | telemetria, `raw_event` |
| `audit` | — (sem par no front) | — | RN-003, RNF-020 |

Módulos puramente técnicos — ingestão de telemetria, anticorrupção de fornecedor, batch — **não têm par no frontend**, e isso é correto. Forçar simetria artificial criaria slices vazios.

### `FSD-28` — Organização do backend

```
com.rookhub.<module>/
├─ api/          público — DTOs, portas, eventos publicados
├─ internal/     privado por convenção Modulith
└─ domain/       entidades, regras, máquinas de estado
```

O argumento que sustenta essa escolha: **as duas pontas passam a ter a mesma regra mental** — *só existe o que a API pública expõe*. Um desenvolvedor fullstack não troca de modelo mental ao trocar de arquivo. O `ModularityTests` do Spring Modulith é o equivalente exato do Steiger no frontend.

### `FSD-27` — Contrato spec-first

O OpenAPI 3.1 em `openapi/` é **artefato versionado escrito à mão**, não gerado por anotação. Backend e frontend geram a partir dele.

| Etapa | Responsável |
|---|---|
| Negociar e escrever o spec | Back + front, no PR do ticket |
| Gerar `packages/api-client` | CI |
| Validar implementação contra o spec | Teste de contrato no backend **`[CI]`** |

**Motivo específico do RookHub:** o front tem **três apps** consumindo um cliente compartilhado. O custo de esperar o backend se multiplica por três. Spec-first permite ao front trabalhar com mock server já no Sprint 0, enquanto o backend ainda monta RLS e migrations. A divergência entre spec e implementação, risco natural do spec-first, é neutralizada pelo teste de contrato bloqueante.

### `FSD-29` — Catálogo único de eventos de domínio

Um fato do negócio tem **um** nome — do evento Modulith ao tópico STOMP ao barramento do front.

```ts
// packages/types/events.ts
export const DOMAIN_EVENTS = {
  CHECKLIST_SUBMITTED:   'checklist.submitted',
  PENDENCY_CREATED:      'pendency.created',
  PENDENCY_RESOLVED:     'pendency.resolved',
  VEHICLE_BLOCKED:       'vehicle.blocked',
  VEHICLE_UNBLOCKED:     'vehicle.unblocked',
  FUELING_REGISTERED:    'fueling.registered',
  CONSUMPTION_ANOMALY:   'consumption.anomaly.detected',
  WORK_ORDER_OPENED:     'work-order.opened',
  WORK_ORDER_CLOSED:     'work-order.closed',
  SAFETY_EVENT_CRITICAL: 'safety.event.critical',
  SAFETY_EVENT_DISPUTED: 'safety.event.disputed',
  SYNC_COMPLETED:        'sync.completed',
} as const;
```

O mesmo identificador aparece no `@DomainEvent` Java, no payload STOMP e no `onDomainEvent` do front.

**`correlationId` obrigatório**, propagado do evento Modulith até o breadcrumb do Sentry. Com Datadog + Sentry já na stack (`INF-04`), isso transforma *"o veículo não bloqueou"* de uma investigação em uma busca.

### `FSD-30` — Fixtures de contrato das máquinas de estado

```
packages/contracts/state-machines/
├─ vehicle.json           Anexo C.1
├─ work-order.json        Anexo C.2
├─ safety-dispute.json    Anexo C.3
└─ trip.json              Anexo C.4
```

Artefato **neutro**, na raiz do monorepo. Java e TypeScript rodam a **mesma suíte** contra ele. Alterar uma máquina de estado exige um PR que toca os dois lados — o que é uma feature, não um inconveniente: a divergência se torna impossível de mergear.

É isso que dá dente ao `FSD-19`. Sem artefato único, "teste de contrato" é combinado, não garantia.

### `FSD-31` — Versionamento de API

**Sem versão no path.** Contrato aditivo, com gate de breaking change no CI **`[CI]`**: diff de OpenAPI falha o build em mudança quebradora; remoção de campo exige deprecação anunciada por uma sprint.

Adequado ao estágio: MVP, dois tenants, deploy coordenado dentro do monorepo.

**Gatilho de versionamento, escrito para não ser esquecido:** versionar no dia em que existir o **primeiro consumidor fora do monorepo** — API para embarcador (Fase 2) ou integração com ERP.

**Exceção permanente e não-negociável:** o PWA do motorista pode estar **até 7 dias desatualizado** (RNF-010, cache offline com expurgo do Safari no limite). Endpoints consumidos por `apps/driver` seguem compatibilidade retroativa estrita por **30 dias**, mesmo sem versionamento formal. Marcados no spec com `x-driver-consumed: true` e fiscalizados pelo gate.

---

## 9. Implantação — Sprint 0

Duas semanas, executadas antes da primeira feature de negócio.

### Semana 1 — Esqueleto e fiscalização

1. Turborepo + pnpm workspaces com os três apps e os packages vazios
2. `packages/config-tsconfig` e `packages/config-eslint` com os três presets
3. Aliases por camada configurados em Vite, TypeScript, Vitest e ESLint
4. Steiger + eslint-plugin-boundaries + dependency-cruiser, **todos em `error`**
5. Pipeline de CI executando os três linters em todo PR
6. `packages/tokens` gerado do `DESIGN.md` (paleta OKLCH de `FE-12`)

### Semana 2 — Contrato e fatia vertical

7. `openapi/` com o spec inicial de `iam` e `fleet`; geração de `packages/api-client` no CI
8. Mock server a partir do spec, para o front destravar
9. `packages/contracts/state-machines/vehicle.json` + suíte rodando em Java e TS
10. `packages/types/events.ts` com o catálogo inicial
11. **Fatia vertical de referência**: `entities/vehicle` + `features/create-vehicle` + `pages/vehicles`, completa — mapper, key factory, `README.md`, testes colocalizados, `<Gated>`, guard de rota
12. Gate de `<Gated financial>` e gate de contraste (`FE-07`) ativos

> A fatia vertical do item 11 é o **template canônico** do repositório. Toda dúvida futura de estrutura se resolve lendo `entities/vehicle` — não relendo este documento.

---

## 10. Checklist de Revisão de PR

Itens marcados **`[CI]`** já são verificados automaticamente; constam aqui para conhecimento, não para conferência manual.

- [ ] A camada do código novo está correta pelo critério widget × feature?
- [ ] A feature tem prefixo verbal? **`[CI]`**
- [ ] O `index.ts` expõe apenas o necessário, com export nomeado? **`[CI]`**
- [ ] Nenhum import profundo entre slices? **`[CI]`**
- [ ] Cross-import entre entities usa `@x` e expõe só tipos/seletores?
- [ ] Chamada nova de API passa por mapper em `entities/*/api`? **`[CI]`**
- [ ] Query nova tem entrada na key factory da entity?
- [ ] Invalidação cross-entity foi feita por evento de domínio, não por import direto de key alheia?
- [ ] Componente com valor financeiro está dentro de `<Gated financial>`? **`[CI]`**
- [ ] Rota nova passou por `applyGuards`? **`[CI]`**
- [ ] Regra de negócio nova está em `packages/domain-*` se for consumida por dois apps?
- [ ] `README.md` da entity/widget foi atualizado com os RFs correspondentes?
- [ ] Texto de UI está em PT-BR via i18n, e termo novo entrou no glossário?
- [ ] Endpoint marcado `x-driver-consumed` manteve compatibilidade retroativa? **`[CI]`**

---

## 11. Riscos Assumidos

| Risco | Mitigação |
|---|---|
| Curva de aprendizado do FSD com time novo | Fatia vertical de referência (Sprint 0, item 11) + este documento no onboarding |
| ~70 slices de feature tornam a navegação difícil | Prefixo verbal obrigatório + grafo gerado pelo dependency-cruiser publicado no CI |
| Mapper DTO→domínio percebido como boilerplate | Justificativa jOOQ documentada em `FSD-16`; gerador de scaffold de entity no Sprint 0 |
| Barramento de eventos dificulta rastrear invalidações | Log em dev + breadcrumb Sentry em prod, obrigatórios |
| Spec-first divergir da implementação | Teste de contrato bloqueante no backend |
| Regime rígido de lint atrasar sprints iniciais | Custo concentrado no Sprint 0, com repositório vazio — o oposto seria apertar com 600 arquivos |

---

## 12. Rastreabilidade — Decisão FSD × Requisito

| Decisão | Requisitos atendidos |
|---|---|
| `FSD-01`, `FSD-25` | `FE-03`, `FE-04`, `FE-05`, RNF-029 |
| `FSD-02`, `FSD-08` | `FE-06`, RN-052, preparo de app nativo (Fase 2) |
| `FSD-05`, `FSD-12` | RF-001, RF-002, RN-004, RN-018, RN-019, Anexo A |
| `FSD-09` | RNF-010, RNF-011, RNF-012, RNF-013, RN-053, RN-054 |
| `FSD-10` | RF-033 a RF-037, `IA-03`, `FREE-08`, `FE-09` |
| `FSD-11` | `FE-11`, RF-038, RN-087 |
| `FSD-13`, `FSD-14` | Anexo D, RF-008 a RF-031 |
| `FSD-15` | RF-003 a RF-007, RN-003, RNF-020 |
| `FSD-16` | `BE-10`, `INT-01`, RNF-001 |
| `FSD-19`, `FSD-30` | Anexo C, RF-015, RN-052 |
| `FSD-21`, `FSD-23` | Precedente cultural de RN-002 e `FE-07` |
| `FSD-27`, `FSD-31` | `BE-04`, RNF-010 |
| `FSD-29` | `FE-11`, `INF-04` |

---

## 13. Próximos Passos

**Antes da Sprint 1 (bloqueantes):**

1. Executar o Sprint 0 completo, incluindo a fatia vertical de referência
2. Fechar o spec OpenAPI dos módulos `iam` e `fleet`
3. Promover o Anexo B do PRD para `packages/types/glossary.md`
4. Confirmar a distribuição de sistemas operacionais da frota-âncora (`RT-01`) — impacta o escopo do `driver`

**Recomendado nas primeiras quatro sprints:**

5. Publicar o grafo de dependências gerado pelo dependency-cruiser como artefato de CI
6. Criar scaffold (`pnpm gen:entity`, `pnpm gen:feature`) para reduzir o atrito das convenções
7. Revisar este documento ao final da quarta sprint, com dados reais de atrito — arquitetura que nunca é revisada é arquitetura que ninguém está usando
