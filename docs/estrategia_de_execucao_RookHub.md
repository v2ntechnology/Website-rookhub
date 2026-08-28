# Estratégia de Execução — RookHub

**Registro formal da decisão de executar o projeto em duas fases sequenciais, iniciando pelo frontend com dados mocados**

---

## 0. Controle do Documento

| Campo | Valor |
|---|---|
| Produto | RookHub |
| Documento | Estratégia de Execução |
| Versão | 1.0 |
| Status | Aprovado |
| Data | 3 de agosto de 2026 |
| Autor | Arquiteto de Software Sênior |
| Prefixo de decisão | `EXE-xx` |
| Prefixo de risco | `EXR-xx` |
| Documentos relacionados | `prd_RookHub.md` v1.0 · `DESIGN.md` · `arquitetura_e_decisoes_tecnicas_RookHub.md` v1.0 · `arquitetura_free_tier_MVP_RookHub.md` v1.0 · `arquitetura_fsd_RookHub.md` |

### 0.1 Escopo deste documento

Este documento registra **como o projeto será executado no tempo**. Ele não altera nenhuma decisão de stack, arquitetura ou design já registrada nos documentos anteriores.

Onde este documento toca uma decisão existente, ele o faz **por referência ao identificador original** (`FE-xx`, `BE-xx`, `DAT-xx`, `IA-xx`, `INF-xx`, `INT-xx`), nunca por sobrescrita. Conflitos reais identificados na redação estão isolados na Seção 8 e **não foram resolvidos unilateralmente**.

### 0.2 Formato

Toda decisão segue estrutura ADR: **Contexto · Decisão · Alternativas consideradas · Consequências positivas · Consequências negativas e dívidas assumidas · Critério de saída.**

---

## 1. Resumo da Estratégia

O projeto é executado em duas fases sequenciais.

| | Fase 1 | Fase 2 |
|---|---|---|
| **Objeto** | `apps/web` (painel) e `apps/site` (institucional) | Backend, banco de dados e infraestrutura |
| **Dados** | Integralmente fictícios (mocados) | Reais |
| **Objetivo primário** | **Descoberta de requisitos** | Implementação do contrato descoberto |
| **Objetivo secundário** | Produzir o contrato OpenAPI validado | Sustentar o contrato sem alterá-lo |
| **Fora do escopo** | Qualquer backend, banco, fila ou infraestrutura | — |
| **Encerramento** | Todas as telas definidas, validadas e com contrato versionado | — |

**O objetivo declarado da Fase 1 não é velocidade.** É descoberta. A premissa é que desenhar a tela real revela campos, estados, relacionamentos e regras que uma especificação escrita em reunião não revela — e que descobrir isso antes de existir schema, migration e endpoint custa uma fração do que descobrir depois.

---

## 2. Decisões

---

### `EXE-01` — Execução frontend-first com dados mocados

#### Contexto

O RookHub possui uma biblioteca de especificação madura: 148 regras de negócio, 57 histórias de usuário, matriz RBAC completa, máquinas de estado e modelo conceitual de dados. Ainda assim, toda essa especificação foi produzida **fora da tela**.

Especificação escrita e interface desenhada revelam classes diferentes de problema. Um documento consegue afirmar que "o operador registra o abastecimento"; apenas a tela revela quantos campos isso exige, quais são obrigatórios, o que acontece quando o hodômetro informado é menor que o anterior, onde o operador precisa de valor pré-preenchido, e que existe um estado intermediário que ninguém havia nomeado.

O `RNF-006` — esforço do operador, declarado princípio inegociável do produto — é, por natureza, um requisito **de interface**. Ele não pode ser validado em documento algum. Só a tela cronometrada responde.

#### Decisão

**Construir integralmente as aplicações `apps/web` e `apps/site` com dados fictícios, sem construir backend, banco de dados ou infraestrutura, e só iniciar a Fase 2 após o encerramento formal da Fase 1.**

A stack da Fase 1 é exatamente a já decidida — nenhuma tecnologia nova é introduzida:

| Componente | Decisão de origem |
|---|---|
| Vite + React 19 + React Router v7 | `FE-03` |
| Next.js 15 (institucional) | `FE-04` |
| Tailwind v4 + shadcn/ui + `packages/ui` | `FE-06` |
| Fallback de blur + gate `axe-core` | `FE-07` |
| TanStack Query v5 + Zustand | `FE-08` |
| visx (Painel do Dono) + Recharts (demais) | `FE-09` |
| Mapbox GL JS | `FE-10` |
| WebSocket | `FE-11` — mocado por emissor local, ver `EXE-06` |
| Rampa tonal e Spectrum Gradient | `FE-12` |
| Feature-Sliced Design v2.1 | `arquitetura_fsd_RookHub.md` |

#### Alternativas consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| **Backend-first** (schema, migrations e API antes da tela) | Congela o modelo de dados na especificação imaginada. Toda descoberta feita na tela depois vira migration em base já povoada — a operação mais cara desta arquitetura, conforme já advertido na Seção 14 do documento de arquitetura. |
| **Desenvolvimento paralelo** (frontend e backend simultâneos, contrato negociado) | É o modelo padrão e teria sido defensável, mas exige que o contrato seja acordado **antes** de qualquer lado saber o que precisa. Produz retrabalho bilateral a cada descoberta e consome coordenação constante — cara para 3 desenvolvedores backend e uma equipe pequena de frontend. |
| **Vertical slices** (uma funcionalidade completa ponta a ponta por vez) | Excelente para entrega incremental, mas fragmenta a descoberta. O valor de desenhar todas as telas antes está em enxergar **relacionamentos entre módulos** — que custo por km depende de abastecimento, que abastecimento depende de hodômetro, que hodômetro vem de checklist e de telemetria. Uma fatia por vez esconde essas ligações até tarde. |
| **Protótipo em ferramenta de design** (Figma) antes do código | Não valida comportamento, estado, carregamento, erro, tabela longa nem performance de `backdrop-filter` (`FE-07`, `RT-07`). Um protótipo estático não responde ao `RNF-006`. Além disso, produziria artefato descartável em vez do código de produção. |
| **Frontend-first sem produzir contrato** | Seria a versão irresponsável desta estratégia: descobriria requisitos e perderia a descoberta na tradução para o backend. Rejeitada — é justamente o que `EXE-03` existe para impedir. |

#### Consequências positivas

- Descoberta de requisitos ocorre no artefato mais barato de alterar. Mudar um campo em componente React custa ordens de magnitude menos que alterar tabela, migration, DTO, mapper, endpoint e teste.
- O modelo de dados chega à Fase 2 **derivado da necessidade real**, não da abstração antecipada.
- O `RNF-006` torna-se mensurável desde a primeira semana, com o teste cronometrado do gate de CI rodando sobre telas reais.
- Riscos visuais já registrados (`RT-07`, performance do glassmorphism; `RNF-028`, contraste sobre vidro) são atacados sem depender de backend.
- A demonstração comercial fica disponível cedo — com a ressalva de `EXR-05`.
- Frontend e backend deixam de disputar prioridade de agenda com uma equipe pequena.

#### Consequências negativas e dívidas assumidas

- **Nenhum valor de produção é entregue durante toda a Fase 1.** A primeira entrega utilizável ao cliente ocorre apenas ao fim da Fase 2.
- Os 3 desenvolvedores backend ficam sem frente principal durante a Fase 1. Ver `EXE-07` para a alocação proposta.
- Premissas de performance permanecem não validadas até a Fase 2 — ver Seção 5 integralmente.
- O custo do mock é real: escrever fixture, mapper e cenário adverso é trabalho de engenharia, não sobra de tempo.
- Cria-se um artefato (a camada de mock) cuja remoção precisa ser explicitamente planejada — ver `EXR-01`.

#### Critério de saída

A Fase 1 encerra quando **todos** os critérios de `EXE-05` estiverem satisfeitos e formalmente aceitos conforme `EXE-09`.

---

### `EXE-02` — Escopo da Fase 1: `apps/web` e `apps/site`; `apps/driver` postergado

#### Contexto

O monorepo definido em `FE-03`, `FE-04` e `FE-05` contém três aplicações. Elas têm naturezas distintas o suficiente para que a decisão de escopo não seja trivial.

| App | Natureza | Consome API de negócio? |
|---|---|---|
| `apps/web` | Painel autenticado, 5 papéis, alta densidade | Sim, integralmente |
| `apps/site` | Vitrine estática, SEO, página de planos | Praticamente não |
| `apps/driver` | PWA offline-first, um papel, baixa densidade | Sim — e é o principal **produtor** de dados |

#### Decisão

**A Fase 1 contempla `apps/web` e `apps/site`. `apps/driver` é postergado para a Fase 2.**

O critério de conclusão baseado em contrato OpenAPI (`EXE-05`) aplica-se a `apps/web`. O `apps/site` possui critério próprio, por não consumir a API de negócio.

#### Alternativas consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| **Somente `apps/web`** | Deixaria a vitrine para depois, sem ganho. O site é de baixo acoplamento e alto valor comercial precoce; construí-lo em paralelo não compete por conhecimento de domínio. |
| **Os três apps** | O `apps/driver` é a aplicação onde o mock **menos** valida. Seu valor está em comportamento offline (RN-052), fila de sincronização, dois timestamps (RN-054), autoridade do servidor em conflito (RN-053) e captura de foto em campo — nada disso é exercitável sem servidor. Mocar o PWA produziria uma casca visual com validação próxima de zero. |
| **`apps/web` + `apps/driver`, adiando o site** | Mesmo problema acima, sem compensação. |

#### Consequências positivas

- Concentra o esforço de descoberta onde ele rende: as telas do painel, que carregam a maior parte das 148 regras de negócio.
- Libera o site institucional cedo, permitindo prospecção comercial durante a Fase 1.
- Evita produzir um PWA que precisaria ser substancialmente reescrito ao encontrar servidor real.

#### Consequências negativas e dívidas assumidas

- **Esta é a dívida mais séria desta estratégia.** O `apps/driver` é o principal produtor de dados do sistema: o checklist preenchido em campo alimenta pendências, bloqueio de veículo, ordem de serviço e hodômetro — que por sua vez alimenta custo por km. O contrato de sincronização do motorista **não será descoberto pelo desenho do painel**, e a Fase 2 precisa dele.
- Consequentemente, a Fase 2 inicia com um contrato **parcial**: completo para consumo (painel), incompleto para produção (motorista).
- Ver `EXR-06` para a mitigação proposta e a Seção 8 para o registro do conflito.

#### Critério de saída

Não se aplica isoladamente — é decisão de escopo, verificada dentro de `EXE-05`.

---

### `EXE-03` — Inversão da autoria do contrato OpenAPI

#### Contexto

A decisão `BE-04` do documento de arquitetura estabelece **REST + OpenAPI 3.1 com contrato gerado a partir do código Java**, servindo de fonte para a geração automática do cliente TypeScript em `packages/api-client`. O documento de FSD reforça a abordagem **spec-first**.

À primeira leitura, frontend-first parece contradizer spec-first: como construir contra um contrato que ainda não existe?

**Não há contradição. Há inversão de autoria.**

O princípio de `BE-04` é que **existe um contrato formal, único e versionado, do qual os tipos são derivados** — nunca tipos escritos à mão em cada lado. Esse princípio permanece intacto. O que muda é **quem escreve a especificação primeiro**.

| | Modelo original (`BE-04`) | Modelo desta estratégia |
|---|---|---|
| Quem escreve a spec | Backend, via springdoc a partir do código | **Frontend, ao desenhar cada tela** |
| Quem deriva tipos dela | Frontend (`packages/api-client`) | **Ambos** — frontend gera o client, backend implementa contra ela |
| Fonte de verdade | Arquivo OpenAPI versionado | **Arquivo OpenAPI versionado** — inalterado |
| Tipos escritos à mão | Proibido | **Proibido** — inalterado |

#### Decisão

**O contrato OpenAPI é escrito durante a Fase 1, tela a tela. Nenhuma tela é considerada concluída sem o trecho de especificação que ela exige, versionado no repositório. Os tipos dos mocks são gerados a partir desse contrato, jamais escritos manualmente.**

Fluxo operacional por tela:

```
1. Desenhar a tela                      → descobre-se o dado necessário
2. Escrever o trecho de OpenAPI         → openapi/paths/{recurso}.yaml
3. Gerar tipos                          → packages/api-client (mesmo gerador da Fase 2)
4. Escrever fixture tipada pelo gerado  → não compila se divergir do contrato
5. Implementar mapper DTO → domínio     → o mesmo que a Fase 2 usará (EXE-04)
6. Tela consome o domínio               → sem saber a origem do dado
```

O passo 3 é o que torna a estratégia auditável: **a fixture não compila se divergir do contrato**. O TypeScript passa a ser o fiscal da coerência entre spec e mock.

Na Fase 2, o backend Java implementa contra essa especificação. A geração do OpenAPI pelo springdoc permanece — mas passa a exercer papel de **verificação**, não de autoria: o contrato gerado pelo código deve ser comparado ao contrato escrito na Fase 1, e divergência falha o build.

#### Alternativas consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| **Mocks com tipos escritos à mão, contrato depois** | Viola o princípio central de `BE-04`. Produz duas fontes de verdade e transfere para a Fase 2 a tarefa de adivinhar o que as telas realmente esperavam — exatamente o desperdício que esta estratégia existe para evitar. |
| **Gerar o OpenAPI a partir dos tipos TypeScript do mock** | Inverte a dependência na direção errada. O contrato passaria a ser subproduto de detalhe de implementação do frontend, e nomes, opcionalidade e formatos ficariam à mercê de conveniência local. |
| **Manter springdoc como autoridade desde já** | Impossível na Fase 1 — não há código Java. |
| **Contrato informal (README, planilha) formalizado na Fase 2** | Perde a fiscalização por compilador. Toda a garantia desta decisão vem de o tipo do mock ser gerado do contrato. |

#### Consequências positivas

- O backend inicia a Fase 2 com uma especificação **já exercitada por telas reais** — validada pela realidade, não pela imaginação.
- Divergência entre o que a tela precisa e o que o contrato oferece torna-se erro de compilação, não defeito descoberto em integração.
- `packages/api-client` é o mesmo artefato nas duas fases; na virada, muda a implementação do transporte, não os tipos.
- O contrato ganha histórico em Git desde a primeira tela, com rastreabilidade de quando e por que cada campo surgiu.

#### Consequências negativas e dívidas assumidas

- Exige disciplina de OpenAPI em uma equipe de frontend — competência que talvez precise ser desenvolvida.
- Frontend pode especificar contratos ingênuos do ponto de vista de banco: solicitar agregação cara, paginação inadequada ou campo que exigiria consulta proibitiva. Ver `EXR-03` e a mitigação em `EXE-07`.
- O contrato escrito na Fase 1 **será alterado** na Fase 2 por razões legítimas de persistência e performance. Isso é esperado; o valor está em a alteração ser **exceção justificada**, não ponto de partida.

#### Critério de saída

- Arquivo OpenAPI 3.1 completo, versionado, validando em linter de spec (Spectral) no CI
- `packages/api-client` gerado exclusivamente a partir dele
- Zero tipos de DTO escritos à mão no repositório, verificado por regra de lint

---

### `EXE-04` — Regra de fronteira do mock

#### Contexto

O modo mais comum de fracasso desta estratégia é o mock vazar para dentro da aplicação. Quando componentes de UI passam a conhecer a forma do dado falso, a troca por HTTP real deixa de ser substituição de implementação e vira refatoração de toda a camada de apresentação — e o ganho da Fase 1 se perde na virada.

#### Decisão

**O mock entrega DTO e atravessa o mesmo mapper `DTO → domínio` que o dado real usará. Nenhum componente de UI conhece a origem do dado. Trocar mock por HTTP real altera exclusivamente a implementação do client.**

```
┌─────────────────────────────────────────────────────────┐
│  UI (widgets, features, entities)                       │
│  Conhece apenas o modelo de domínio.                    │
│  Não importa nada de mock. Verificado por lint.         │
└───────────────────────────┬─────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│  mapper: DTO → domínio                                  │
│  IDÊNTICO NAS DUAS FASES. Não é descartado na virada.   │
│  Datas, moeda (NUMERIC 18,4), enums, nulos, timezone.   │
└───────────────────────────┬─────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│  ApiClient  (interface tipada pelo OpenAPI gerado)      │
│                                                          │
│  Fase 1: MockApiClient    Fase 2: HttpApiClient          │
│  fixture + latência       fetch real                     │
│  + cenário adverso                                       │
│                                                          │
│  ← ÚNICO ponto que muda na virada →                      │
└─────────────────────────────────────────────────────────┘
```

#### Regras de fiscalização

| Regra | Mecanismo |
|---|---|
| Nenhuma camada de UI importa de `shared/api/mock` | `eslint-plugin-boundaries` + `dependency-cruiser`, severidade `error` — conforme já estabelecido no documento de FSD |
| Mocks residem em local único e explícito | Definido em conjunto com o documento de FSD — ver Seção 9 |
| Fixtures tipadas pelo OpenAPI gerado | Compilador — `EXE-03` |
| Mapper coberto por teste unitário | Vitest — o mapper sobrevive à Fase 2 e merece o mesmo rigor do código de produção |
| Seleção de implementação por variável de ambiente | `VITE_API_MODE=mock \| http`, nunca por condicional espalhada no código |
| Toda resposta de mock atravessa latência artificial | Ver `EXE-06` |

#### Alternativas consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| **MSW (Mock Service Worker)** interceptando HTTP | Tecnicamente elegante e mantém o client real. Foi a alternativa mais forte. Rejeitada como mecanismo **principal** porque a Fase 1 não tem servidor algum, e adicionar uma camada de interceptação de rede para dados que nunca existiram acrescenta indireção sem ganho de fidelidade. **Recomendado, porém, na virada**: MSW é excelente para testes de integração da Fase 2 e para simular falha de rede. |
| **Mock direto nos hooks do TanStack Query** | Vaza a origem do dado para dentro da feature e viola a fronteira do FSD. |
| **JSON estático importado no componente** | Elimina qualquer possibilidade de simular latência, erro, paginação e estado de carregamento — degradaria a Fase 1 a protótipo visual. |
| **Backend mock separado** (json-server, Prism) | Reintroduz um servidor a operar, contrariando o escopo de `EXE-01`, e perde a fiscalização por compilador que `EXE-03` estabelece. |

#### Consequências positivas

- A virada de fase é uma troca de implementação de interface, não uma refatoração.
- O mapper — que concentra a lógica sutil de datas em UTC (`RNF-017`), moeda (`RN-132`) e enums — é escrito e testado uma única vez.
- Estados de carregamento, erro e vazio são exercitados de verdade desde a Fase 1.

#### Consequências negativas e dívidas assumidas

- Mais cerimônia por tela do que simplesmente importar um JSON.
- Exige que a equipe respeite a fronteira sob pressão de prazo — mitigado por lint em `error`, não por acordo verbal.

#### Critério de saída

- Zero importações de mock fora de `shared/api`, verificado por `dependency-cruiser` no CI
- Todo mapper com teste unitário
- Chave única de configuração alterna as duas implementações

---

### `EXE-05` — Critérios objetivos de conclusão da Fase 1

#### Contexto

"As telas estão prontas" não é critério verificável. Sem definição objetiva, a Fase 1 termina por cansaço ou por pressão de prazo — e a Fase 2 herda a incerteza que a Fase 1 deveria ter eliminado.

#### Decisão

**Nenhuma tela é considerada concluída sem satisfazer integralmente a lista abaixo. A Fase 1 encerra quando todas as telas do escopo de `EXE-02` estiverem concluídas.**

##### Definition of Done por tela — `apps/web`

- [ ] **Trecho de OpenAPI correspondente escrito e versionado**, validando em Spectral
- [ ] Tipos gerados a partir do contrato; fixture tipada pelo gerado (zero DTO manual)
- [ ] Mapper `DTO → domínio` implementado e coberto por teste unitário
- [ ] Nenhuma importação de mock fora de `shared/api` (lint aprovado)
- [ ] **Cinco estados implementados**: carregando · vazio · erro · sucesso · sem permissão
- [ ] **Cenários adversos de `EXE-06` exercitados** — não apenas o caso feliz
- [ ] RBAC e entitlement aplicados na UI para os 5 papéis, com o estado bloqueado de `RN-004` quando aplicável
- [ ] `axe-core` sem violações — gate `RNF-028` já obrigatório em `FE-07`
- [ ] Responsivo nos três breakpoints do `DESIGN.md` (12 / 8 / 4 colunas)
- [ ] Fallback de blur funcional em modo de baixa performance (`FE-07`)
- [ ] Telas de operação com **teste cronometrado de esforço aprovado** (`RNF-006`)
- [ ] **Regras de negócio descobertas registradas** e encaminhadas ao PRD (`EXE-08`)
- [ ] Validada e aceita conforme `EXE-09`

##### Definition of Done — `apps/site`

Por não consumir a API de negócio, aplica-se critério próprio:

- [ ] Build estático (`output: 'export'`) sem erro
- [ ] Lighthouse: Performance, Acessibilidade, SEO e Best Practices ≥ 90
- [ ] Metadados, Open Graph e `sitemap.xml` completos
- [ ] Conteúdo de planos e preços revisado e aprovado comercialmente
- [ ] `axe-core` sem violações
- [ ] Formulários de contato/lead com contrato próprio especificado, se houver

##### Critérios de encerramento da fase

- [ ] Todas as histórias de usuário do PRD com interface no painel possuem tela concluída, ou exclusão formalmente justificada
- [ ] Arquivo OpenAPI consolidado, íntegro e validado
- [ ] Todas as máquinas de estado do PRD navegáveis pela interface
- [ ] Matriz RBAC exercitada nos 5 papéis do painel
- [ ] Registro de descobertas consolidado e incorporado ao PRD (`EXE-08`)
- [ ] Revisão de exequibilidade do contrato pela equipe backend concluída (`EXE-07`)
- [ ] Decisão de arquitetura da Fase 2 tomada (`EXE-07`)

#### Alternativas consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| **Critério por prazo** ("8 semanas de frontend") | Prazo não mede completude. Encerraria a fase com descoberta pela metade. |
| **Critério por cobertura de histórias apenas** | Uma tela pode existir e não ter contrato, não ter estado de erro e não ter sido validada. |
| **Aceitação informal por demonstração** | Não deixa rastro verificável e não sobrevive a divergência posterior de memória. |

#### Consequências positivas

- O encerramento da fase deixa de ser negociação e vira verificação.
- O checklist é auditável em revisão de código; boa parte já é executada por CI.

#### Consequências negativas e dívidas assumidas

- Aumenta o custo por tela — deliberadamente. Uma tela sem contrato, sem estado de erro e sem cenário adverso não cumpre o objetivo desta fase.
- Risco de a barra ser flexibilizada sob pressão; mitigado por automação da maior parte dos itens.

#### Critério de saída

O próprio checklist, integralmente satisfeito.

---

### `EXE-06` — Cenários adversos obrigatórios de mock

#### Contexto

Mock feliz é o modo silencioso de fracasso desta estratégia. Uma fixture com 5 veículos, todos os campos preenchidos, tudo dentro do esperado, valida quase nada — e produz confiança injustificada, que é pior que nenhuma confiança.

#### Decisão

**Todo mock oferece, além do caso feliz, o conjunto de cenários adversos abaixo, alternáveis em tempo de execução por um painel de controle de desenvolvimento.**

##### Cenários obrigatórios

| Cenário | O que expõe |
|---|---|
| **Frota grande** — 80 veículos, 24 meses de histórico, 5.000 lançamentos | Densidade real de tabela, necessidade de paginação, virtualização de lista, legibilidade do mapa com 80 marcadores, custo de `backdrop-filter` sob carga (`RT-07`) |
| **Frota mínima** — 1 veículo, sem histórico | Estados vazios reais; onde o produto parece quebrado no primeiro dia de uso |
| **Dado faltando** — sem hodômetro, sem foto, motorista sem vínculo, campo opcional nulo | Comportamento com nulo — a maior fonte de defeito na virada de fase |
| **Erro de integração** — `last_successful_sync_at` antigo (`RN-140`) | Banner de dado desatualizado (`RN-141`) e o comportamento das telas que dependem de telemetria parada |
| **Permissão negada** — cada uma das 5 combinações de papel, `operator_sees_financials` desligada | RBAC efetivo na UI, `RN-004` (módulo bloqueado com CTA "Conhecer") |
| **Módulo não contratado** — entitlement ausente | Estado bloqueado, separação entre "não pode" e "não contratou" |
| **Latência** — resposta em 3s e em 15s | Estados de carregamento reais, skeletons, timeout, cancelamento |
| **Falha de rede** — 500, 503, timeout | Retry do TanStack Query, mensagem de erro, recuperação |
| **Conflito de dados** — divergência GPS × hodômetro (`RN-060`), anomalia de consumo | Flags de auditoria e alertas na interface |
| **Evento crítico em tempo real** — emissor local disparando eventos | Toast de `RN-087`, ações embutidas de `RN-091`, agregação em janela de `RN-089` |

##### Simulação do tempo real (`FE-11`)

Não havendo servidor, o WebSocket é substituído por um **emissor local** que implementa a mesma interface consumida pela aplicação. Ele dispara eventos em intervalo configurável, permitindo exercitar toast, agregação e Central de Notificações.

Isso valida **a reação da interface ao evento**. Não valida entrega, reconexão, ordenação nem latência ponta a ponta — ver Seção 5.

##### Latência artificial obrigatória

Toda resposta de mock atravessa atraso aleatório entre 150 ms e 600 ms, com opção de simular degradação. Mock instantâneo esconde a necessidade de estado de carregamento e produz interface que parece boa e some quando encontra rede real.

#### Alternativas consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| **Apenas caso feliz, adversos na Fase 2** | Elimina a maior parte do valor de descoberta. Estado vazio, erro e permissão negada são justamente onde a regra de negócio aparece. |
| **Cenários adversos apenas em teste automatizado** | Necessário, mas insuficiente: a validação de `EXE-09` acontece com humano olhando a tela, e ele precisa conseguir alternar cenários. |
| **Gerar dados aleatórios a cada carga** | Impede reprodutibilidade e comparação entre validações. Fixtures devem ser determinísticas, com semente fixa. |

#### Consequências positivas

- A tela é validada em condições que o produto realmente encontrará.
- Regras de negócio ausentes do PRD aparecem justamente nos cenários adversos.
- Os mesmos cenários viram base de teste de integração na Fase 2.

#### Consequências negativas e dívidas assumidas

- Custo real de construção do conjunto de fixtures — parte do trabalho, não sobra dele.
- O painel de controle de cenários é código descartável na virada, e precisa ser removido explicitamente (`EXR-01`).

#### Critério de saída

- Todos os cenários da tabela implementados e alternáveis
- Toda tela concluída exercitada em, no mínimo: frota grande, dado faltando, permissão negada e erro

---

### `EXE-07` — Alocação da equipe backend na Fase 1 e decisão postergada de arquitetura da Fase 2

#### Contexto

A Fase 1 não constrói backend, mas existem 3 desenvolvedores backend. Deixá-los ociosos é desperdício; colocá-los a construir o backend em paralelo anula a estratégia.

Além disso, existem **duas arquiteturas aprovadas e mutuamente exclusivas** para a Fase 2: a definitiva (`arquitetura_e_decisoes_tecnicas_RookHub.md`, US$475–970/mês) e a free tier (`arquitetura_free_tier_MVP_RookHub.md`, US$1–6/mês). A escolha entre elas foi deliberadamente postergada.

#### Decisão

**A equipe backend atua na Fase 1 como revisora de exequibilidade do contrato e construtora de fundação técnica não-dependente de domínio. A decisão entre a arquitetura definitiva e a free tier é tomada ao final da Fase 1, por critérios objetivos.**

##### Atuação da equipe backend durante a Fase 1

| Atividade | Justificativa |
|---|---|
| **Revisão de exequibilidade de cada trecho de OpenAPI** | Mitiga `EXR-03`. O frontend descobre *o que* precisa; o backend avalia se é sustentável em SQL, se a paginação é adequada, se a agregação exige pré-cálculo (`DAT-06`). Revisão obrigatória, com poder de solicitar alteração — não de vetar a necessidade. |
| **Esqueleto multi-tenant com RLS e os quatro gates de `BE-14`** | Já era a recomendação mais enfática do documento de arquitetura: o isolamento deve estar blindado **antes da primeira regra de negócio**. É independente de domínio e pode ser construído agora. |
| **Estrutura de módulos do Spring Modulith e testes de fronteira** | Os 13 módulos derivam do PRD, não das telas. |
| **Autenticação completa (`BE-11`)** | Os três fluxos são conhecidos e estáveis; não dependem de descoberta. |
| **Prova de conceito das 4 integrações (`INT-01`)** | Depende de documentação de fornecedor, não de tela. Reduz `RT-09`. |
| **Infraestrutura como código e pipelines** | Independente da decisão entre as duas arquiteturas, se escrita em OpenTofu com módulos parametrizados. |

##### Critérios para a decisão de arquitetura da Fase 2

A decisão é tomada ao final da Fase 1, com base em:

| Critério | Favorece free tier | Favorece definitiva |
|---|---|---|
| Orçamento aprovado | Não aprovado | Aprovado |
| Compromisso com cliente pagante | Piloto sem contrato | Contrato assinado |
| Exigência contratual de disponibilidade | Ausente | Presente (`RNF-008`) |
| Ligação automática ao gestor (`RN-085`) | Aceito substituto por Telegram | Inegociável |
| Volume de veículos previsto | Até ~100 | Acima |
| Tolerância a operação própria | Alta | Baixa |

O documento free tier já registra que a migração entre as duas é incremental e não toca código de aplicação (Seção 7 daquele documento), o que torna a postergação segura.

#### Alternativas consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| **Backend construindo funcionalidades em paralelo** | Anula `EXE-01`: construiria contra especificação imaginada, exatamente o que se busca evitar. |
| **Equipe backend realocada para o frontend** | Possível para parte do time, mas desperdiça competência específica e perde a revisão de exequibilidade, que é a mitigação principal de `EXR-03`. |
| **Decidir a arquitetura da Fase 2 agora** | Decidir antes de existir informação é o oposto do que esta estratégia propõe. A Fase 1 produz dados — carga real, volume, aceitação do cliente — que tornam a decisão melhor. |

#### Consequências positivas

- Elimina ociosidade sem contaminar a descoberta.
- O contrato nasce revisado por quem terá de implementá-lo.
- A fundação mais crítica da arquitetura (isolamento multi-tenant) fica pronta antes da primeira regra de negócio, conforme já recomendado.
- A decisão de infraestrutura passa a ser informada por dados.

#### Consequências negativas e dívidas assumidas

- A revisão de exequibilidade introduz um ponto de coordenação por tela; se lenta, vira gargalo. Recomenda-se prazo máximo de 2 dias úteis por revisão.
- Fundação construída sem funcionalidade pode ser parcialmente refeita se a descoberta alterar premissas estruturais — risco baixo, pois os itens escolhidos são os menos dependentes de domínio.

#### Critério de saída

- Todos os trechos de OpenAPI revisados e aprovados quanto à exequibilidade
- Esqueleto multi-tenant com os quatro gates de `BE-14` operando em CI
- Decisão de arquitetura da Fase 2 registrada com justificativa

---

### `EXE-08` — Governança da descoberta: retorno das regras ao PRD

#### Contexto

Se as regras descobertas ao desenhar as telas ficarem apenas no código, o PRD — que é a fonte de verdade funcional, com 148 regras numeradas — torna-se obsoleto durante a própria Fase 1. A descoberta perde rastreabilidade e a Fase 2 volta a depender de leitura de código.

#### Decisão

**Toda regra de negócio, campo, estado ou relacionamento descoberto durante a Fase 1 é registrado em um log de descobertas e incorporado ao PRD ao final de cada marco, com numeração na sequência existente (`RN-149` em diante).**

##### Formato do registro

| Campo | Conteúdo |
|---|---|
| ID provisório | `DESC-xx` |
| Tela de origem | Onde apareceu |
| Descrição | A regra, no padrão de redação do PRD |
| Tipo | Regra nova · contradiz regra existente · detalha regra existente · lacuna de especificação |
| Impacto | Contrato · modelo de dados · RBAC · máquina de estado |
| Destino | Número definitivo `RN-xxx` após incorporação |

##### Tratamento por tipo

- **Regra nova** → numeração na sequência, incorporada ao PRD
- **Contradiz regra existente** → **não é resolvida pela equipe de frontend**. Escalada para decisão de produto e registrada com a resolução
- **Detalha regra existente** → incorporada como refinamento da RN original, preservando o número
- **Lacuna** → registrada mesmo sem resolução imediata; lacuna conhecida é melhor que lacuna esquecida

#### Alternativas consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| **Atualizar o PRD continuamente, a cada descoberta** | Gera ruído de versionamento e conflito constante em documento de 1.500 linhas. Consolidação por marco é mais estável. |
| **Registrar apenas em comentário de código** | Perde rastreabilidade e não sobrevive a refatoração. |
| **Deixar a incorporação para o fim da Fase 1** | Concentra em um único evento tardio a reconciliação de dezenas de descobertas, com alto risco de perda por memória. |

#### Consequências positivas

- O PRD permanece fonte de verdade ao longo de toda a fase.
- A Fase 2 recebe especificação atualizada, não código a ser interpretado.
- Contradições emergem cedo e são decididas por quem tem autoridade de produto.

#### Consequências negativas e dívidas assumidas

- Custo de manutenção documental durante a Fase 1.
- Exige disciplina de registro no momento da descoberta — se adiado, perde-se.

#### Critério de saída

- Log de descobertas sem item pendente de classificação
- PRD atualizado, com as novas regras numeradas e as contradições resolvidas e registradas

---

### `EXE-09` — Validação e aceite de telas

#### Contexto

O objetivo declarado da Fase 1 é descoberta de requisitos. Descoberta exige alguém capaz de reconhecer que a tela está errada — o que depende de conhecimento da operação real de uma transportadora.

#### Decisão

**A validação e o aceite formal de cada tela cabem ao responsável pelo produto em conjunto com a equipe interna. O cliente-âncora não possui poder de aceite, mas participa de sessões de observação em marcos definidos.**

##### Ritual de validação

| Momento | Participantes | Objeto |
|---|---|---|
| Revisão por tela | Equipe interna + responsável pelo produto | Checklist de `EXE-05`, cenários adversos exercitados |
| Marco por módulo | Equipe interna + responsável pelo produto | Fluxo completo do módulo ponta a ponta |
| **Sessão de observação** | **+ cliente-âncora** | Ao fim de cada módulo de alto contato operacional: Checklist, Custos, Segurança e Manutenção |

##### Justificativa da sessão de observação

Esta é a recomendação mais importante desta decisão. A Fase 1 existe para revelar o que a especificação escrita em reunião não revelou — e quem conhece a operação diária de uma frota é o transportador, não a equipe de produto. Validar exclusivamente internamente reduz o poder de descoberta da estratégia justamente onde ela mais rende.

A sessão de observação preserva a agilidade do aceite interno enquanto captura o conhecimento externo. Formato recomendado: o cliente executa a tarefa na tela sem instrução, e a equipe observa **onde ele hesita**. Hesitação é descoberta de requisito.

#### Alternativas consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| **Aceite pelo cliente-âncora** | Introduz dependência externa no caminho crítico, com risco de bloqueio por indisponibilidade e de escopo dirigido por um único cliente. |
| **Aceite exclusivamente do responsável pelo produto** | Perde a revisão técnica de exequibilidade e o olhar de quem implementará. |
| **Sem sessão com o cliente** | Reduz materialmente o valor de descoberta da fase. Rejeitada. |

#### Consequências positivas

- Aceite ágil, sem dependência externa no caminho crítico.
- Conhecimento operacional real capturado em marcos, onde tem maior densidade de valor.

#### Consequências negativas e dívidas assumidas

- Risco de a equipe interna validar a tela que **ela** entende, não a que o motorista ou o operador entende. Mitigado pelas sessões de observação, mas não eliminado — ver `EXR-04`.
- Sessões de observação exigem agenda do cliente; devem ser marcadas com antecedência.

#### Critério de saída

- Toda tela com aceite registrado
- Sessão de observação realizada para os quatro módulos de alto contato operacional
- Descobertas das sessões incorporadas conforme `EXE-08`

---

## 3. Fluxo de Trabalho por Tela

```
┌──────────────────────────────────────────────────────────────┐
│ 1. DESENHAR                                                  │
│    Tela real, dados reais em forma, cinco estados            │
│    → Descobre-se: campos, estados, relacionamentos, regras   │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. ESPECIFICAR                        EXE-03                 │
│    openapi/paths/{recurso}.yaml — schema, parâmetros, erros  │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. REVISAR EXEQUIBILIDADE             EXE-07                 │
│    Backend avalia: sustentável em SQL? paginação? agregação? │
│    Prazo: até 2 dias úteis                                   │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. GERAR TIPOS                        EXE-03                 │
│    packages/api-client — mesmo gerador da Fase 2             │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. FIXTURES + CENÁRIOS ADVERSOS       EXE-06                 │
│    Feliz · frota grande · dado faltando · erro · sem         │
│    permissão · latência                                      │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│ 6. MAPPER DTO → DOMÍNIO               EXE-04                 │
│    Sobrevive à Fase 2. Teste unitário obrigatório.           │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│ 7. REGISTRAR DESCOBERTAS              EXE-08                 │
│    DESC-xx → PRD                                             │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│ 8. VALIDAR E ACEITAR                  EXE-09 / EXE-05        │
│    Checklist completo · aceite registrado                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. A Virada de Fase

O momento de maior risco técnico da estratégia. O que muda e o que não muda:

| Elemento | Fase 1 | Fase 2 | Muda? |
|---|---|---|---|
| Componentes de UI | Consomem domínio | Consomem domínio | **Não** |
| Mapper DTO → domínio | Implementado e testado | O mesmo | **Não** |
| Tipos de `packages/api-client` | Gerados do OpenAPI | Gerados do mesmo OpenAPI | **Não** |
| Contrato OpenAPI | Escrito pelo frontend | Implementado pelo backend | **Não** — verificado |
| Hooks do TanStack Query | Consomem `ApiClient` | Idem | **Não** |
| Estados de carregamento e erro | Exercitados com mock | Exercitados de verdade | **Não** |
| **Implementação do `ApiClient`** | `MockApiClient` | `HttpApiClient` | **Sim — único ponto** |
| Autenticação | Sessão simulada | Spring Security real (`BE-11`) | **Sim** |
| WebSocket | Emissor local | STOMP real (`FE-11`) | **Sim** |
| Fixtures e painel de cenários | Presentes | **Removidos** | **Sim** — `EXR-01` |

##### Verificação obrigatória na virada

Gate de CI comparando o OpenAPI gerado pelo springdoc a partir do código Java com o OpenAPI escrito na Fase 1. **Divergência não justificada falha o build.** É esse gate que impede que o backend, ao implementar, altere silenciosamente o contrato que as telas já validaram.

---

## 5. Limitações — O Que o Mock Não Valida

Esta seção existe para impedir que o encerramento da Fase 1 seja confundido com validação técnica do produto. **A Fase 1 valida requisitos e interface. Não valida arquitetura sob carga.**

| Dimensão | O que o mock **não** valida | Consequência | Onde se resolve |
|---|---|---|---|
| **Volume de telemetria** | 7–14M pontos/mês por tenant (`DAT-02`). Uma fixture com 80 veículos e 24 meses aproxima densidade visual, mas não exercita hypertable, compressão nem continuous aggregate | O `RNF-001` (<2s p95) permanece **premissa não verificada** | Fase 2, com carga sintética em volume real |
| **Latência real** | A latência artificial de `EXE-06` é arbitrária. Não reflete tempo de consulta, contenção de pool, RLS ou rede | `RNF-001`, `RNF-002`, `RNF-004` não verificados | Fase 2, teste de carga |
| **Paginação sob carga** | Mock pagina um array em memória. Não expõe custo de `COUNT`, deriva de cursor, nem consulta cara em página profunda | A estratégia de paginação do contrato pode ser inadequada | Revisão de `EXE-07` mitiga parcialmente; confirmação na Fase 2 |
| **Tempo real** | O emissor local valida a **reação da UI**. Não valida entrega, reconexão, ordenação, duplicação, encerramento de conexão ociosa (`FRT-07`) nem Redis pub/sub | `RNF-007` (<10s) não verificado | Fase 2 |
| **RBAC e entitlement efetivos** | A UI aplica papel e entitlement **cosmeticamente**. A garantia real é do backend (`BE-14`, `RN-118`, `RN-119`) | **A Fase 1 não produz nenhuma garantia de segurança.** Interface bem comportada com mock não implica acesso negado no servidor | Fase 2 — gates de `BE-14` são inegociáveis |
| **Isolamento multi-tenant** | Não há banco. RLS, `withTenant()` e vazamento cross-tenant são inverificáveis | Risco central da arquitetura permanece integralmente aberto | Fase 2 — construído já na Fase 1 por `EXE-07` |
| **Governança da IA** | Tokenização (`RN-122`), gate de autorização (`RN-119`) e escopo temático (`RN-120`) não existem sem backend. A tela do assistente pode ser desenhada; a garantia, não | `RN-118` — o requisito mais perigoso do PRD — segue aberto | Fase 2 |
| **Integrações** | ACLs (`INT-01`) e formato real de fornecedor não são exercitados. O contrato do painel pode assumir dado que o fornecedor não entrega | `RT-09` não mitigado pela Fase 1 | Prova de conceito de integração em `EXE-07` |
| **Offline do motorista** | `apps/driver` fora do escopo (`EXE-02`). RN-052 a RN-054 e `RNF-009` a `RNF-013` intocados | Contrato de produção de dados não descoberto | Ver `EXR-06` e Seção 8 |
| **Consistência transacional** | Mock não tem transação. Operações que envolvem múltiplos agregados parecem atômicas e podem não ser | Descoberto tarde | Fase 2 |
| **Custo de operação** | Consumo real de LLM, storage e telemetria não medido | Estimativas seguem projeção | Fase 2 |

##### O risco do caso feliz

A ameaça mais concreta a esta estratégia **não** é o mock ser falso — é o mock ser **fácil**. Uma fixture bem comportada produz interface que parece validada e não é.

Por isso `EXE-06` é obrigatório, não recomendado. Uma tela exercitada apenas no caso feliz **não cumpre** o critério de `EXE-05` e não pode ser aceita.

---

## 6. Riscos

| ID | Risco | Severidade | Mitigação |
|---|---|---|---|
| `EXR-01` | **Mock torna-se permanente.** A camada de mock sobrevive à Fase 2 e vira caminho paralelo de dados, com fixtures desatualizadas mascarando defeito real | **Alta** | Remoção da camada é item obrigatório da Definition of Done da Fase 2. Após a virada, `dependency-cruiser` proíbe qualquer importação de `shared/api/mock` em código de produção. Fixtures úteis migram para teste, sob MSW. Prazo máximo de coexistência: 30 dias após a virada |
| `EXR-02` | **Retrabalho de telas.** A descoberta na Fase 2 (limitação de dados, custo de consulta, formato de fornecedor) força redesenho de telas dadas como concluídas | **Alta** | Revisão de exequibilidade obrigatória (`EXE-07`); prova de conceito das integrações durante a Fase 1; aceitação explícita de que retrabalho residual é o **custo esperado** da estratégia — e ainda assim menor que o de descobrir com backend construído |
| `EXR-03` | **Contrato ingênuo.** Frontend especifica endpoint inexequível ou caro: agregação sem pré-cálculo, paginação inadequada, campo que exigiria consulta proibitiva | **Alta** | Revisão de exequibilidade com prazo de 2 dias úteis (`EXE-07`); backend pode exigir alteração de forma, não negar a necessidade; `DAT-06` já determina que agregação nunca é calculada em tempo de requisição |
| `EXR-04` | **Validação endógena.** A equipe interna valida a tela que ela entende, não a que o operador entende — anulando o objetivo de descoberta | **Alta** | Sessões de observação com o cliente-âncora nos quatro módulos de alto contato (`EXE-09`), com o cliente executando a tarefa sem instrução |
| `EXR-05` | **Demonstração de produto inexistente.** A Fase 1 produz interface convincente sem nada por trás; risco de compromisso comercial assumido sobre software que não existe | **Alta** | Toda demonstração externa declara explicitamente tratar-se de protótipo funcional com dados fictícios. Nenhum prazo de entrega comprometido antes de a Fase 2 estar dimensionada |
| `EXR-06` | **Contrato de produção do motorista não descoberto.** `apps/driver` fora do escopo (`EXE-02`); o backend da Fase 2 precisa do contrato de sincronização de checklist, que o painel não revela | **Alta** | Especificar o contrato do PWA na Fase 2 **antes** de implementá-lo, aplicando o mesmo método de `EXE-03`; alternativamente, incluir sessão dedicada de desenho do fluxo do motorista ao fim da Fase 1. Ver Seção 8 |
| `EXR-07` | **Fase 1 não termina.** Sem entrega de valor e sem pressão externa, a fase se estende por refinamento visual indefinido | Média | Critérios de saída objetivos e majoritariamente automatizados (`EXE-05`); revisão de progresso por marco de módulo; polimento visual não é critério de conclusão |
| `EXR-08` | **PRD desatualizado.** Regras descobertas permanecem apenas no código; a Fase 2 lê código em vez de especificação | Média | `EXE-08` com consolidação por marco; item obrigatório do critério de encerramento |
| `EXR-09` | **Equipe backend desengajada.** Trabalhando em fundação sem funcionalidade, perde contexto de domínio e chega à Fase 2 sem conhecer o produto | Média | Revisão de exequibilidade de todo contrato garante exposição contínua ao domínio; participação nos marcos de validação |
| `EXR-10` | **Deriva do contrato na Fase 2.** O backend altera silenciosamente contratos já validados por telas | Média | Gate de CI comparando o OpenAPI do springdoc com o da Fase 1; divergência não justificada falha o build (Seção 4) |
| `EXR-11` | **Premissas de performance só verificadas ao fim.** Todo o risco de `RNF-001`, `RNF-002`, `RNF-004` e `RNF-007` concentra-se na Fase 2 | Média | `DAT-06` (continuous aggregates + cache) já desenhado para isso; teste de carga com volume sintético logo no início da Fase 2, não ao fim |

---

## 7. Rastreabilidade

### 7.1 Decisão × Requisitos do PRD

| Decisão | Requisitos afetados |
|---|---|
| `EXE-01` | `RNF-006` (esforço do operador — validado antecipadamente) · `RNF-026` a `RNF-029` (design) · todas as histórias com interface no painel |
| `EXE-02` | `RF-032` (Painel do Dono) e demais telas do painel **incluídos**; `RN-052` a `RN-054`, `RNF-009` a `RNF-014` (PWA) **postergados** |
| `EXE-03` | `RF-042` (API documentada) · `RN-138` (modelo canônico influencia a forma do DTO) |
| `EXE-04` | `RNF-017` (UTC/timezone) · `RN-132` (moeda) — concentrados no mapper |
| `EXE-05` | `RNF-028` (WCAG AA) · `RNF-006` · `RN-004` (módulo bloqueado) · matriz RBAC completa |
| `EXE-06` | `RN-004` · `RN-060` (divergência GPS × hodômetro) · `RN-087`, `RN-089`, `RN-091` (eventos e toasts) · `RN-140`, `RN-141` (dado desatualizado) · `RF-007` (`operator_sees_financials`) |
| `EXE-07` | `RN-001` a `RN-005` (isolamento) · `RF-003` a `RF-007` (autenticação) · `RF-041`, `RF-042` (integrações) |
| `EXE-08` | Seção de regras de negócio do PRD — expansão a partir de `RN-149` |
| `EXE-09` | Anexo G (Definition of Done) — complementado |

### 7.2 Decisão × Decisões de arquitetura afetadas

| Decisão | Decisões afetadas | Natureza do efeito |
|---|---|---|
| `EXE-01` | `FE-03`, `FE-04`, `FE-06` a `FE-12` | **Antecipa** a execução; não altera nenhuma |
| `EXE-02` | `FE-05` (PWA) | **Posterga** para a Fase 2 |
| `EXE-03` | **`BE-04`** (REST + OpenAPI 3.1) | **Inverte a autoria da especificação, preserva o princípio.** O contrato segue único, formal e versionado, com tipos derivados dele |
| `EXE-04` | `FE-08` (TanStack Query + Zustand) · FSD | Estabelece fronteira adicional, fiscalizada pelo mesmo ferramental de lint já adotado |
| `EXE-06` | `FE-07` (fallback de blur) · `FE-11` (WebSocket) · `RT-07` | Cenário de frota grande exercita `RT-07` antecipadamente; emissor local substitui `FE-11` temporariamente |
| `EXE-07` | **`BE-14`** (isolamento multi-tenant) · `BE-11` · `INT-01` · `INF-03` | Antecipa a fundação já recomendada como prioritária |
| `EXE-07` | `arquitetura_free_tier_MVP_RookHub.md` × `arquitetura_e_decisoes_tecnicas_RookHub.md` | Posterga a escolha entre as duas, com critérios objetivos |
| `EXE-09` | Anexo G do PRD | Acrescenta ritual de aceite |

---

## 8. Conflitos Identificados e Não Resolvidos

Conforme instrução, os conflitos reais encontrados na redação estão registrados aqui em vez de resolvidos unilateralmente.

### `CONF-01` — `apps/driver` fora da Fase 1 versus completude do contrato para a Fase 2

**O conflito.** `EXE-02` exclui o PWA do motorista da Fase 1, com justificativa técnica sólida: o mock valida pouco em aplicação offline-first. Porém, o `apps/driver` é o **principal produtor de dados** do sistema. O checklist preenchido em campo alimenta pendências, bloqueio de veículo (`RN-035`), abertura de ordem de serviço e leitura de hodômetro — que por sua vez alimenta o custo por km.

O contrato descoberto pelo painel é, portanto, **majoritariamente de consumo**. A Fase 2 iniciará sem o contrato de produção descoberto, contrariando parcialmente a premissa de `EXE-03` de que o backend recebe uma especificação já validada pela realidade.

**Opções, não decididas:**

| Opção | Efeito |
|---|---|
| **A.** Manter como está; especificar o contrato do PWA no início da Fase 2, aplicando o mesmo método de `EXE-03` | Menor esforço agora; a Fase 2 inicia com uma frente de especificação |
| **B.** Incluir na Fase 1 uma sessão dedicada de desenho dos fluxos do motorista — sem construir o PWA completo, apenas o suficiente para descobrir o contrato de sincronização | Custo moderado; fecha a lacuna principal sem construir aplicação de baixo retorno |
| **C.** Incluir `apps/driver` integralmente na Fase 1 | Contradiz a justificativa de `EXE-02` |

**Recomendação da consultoria: opção B.** Fecha a lacuna mais custosa a um custo pequeno, sem construir a aplicação onde o mock menos rende.

### `CONF-02` — Duas arquiteturas aprovadas e mutuamente exclusivas

**O conflito.** Existem dois documentos de arquitetura aprovados descrevendo infraestruturas incompatíveis para a mesma Fase 2. `EXE-07` posterga a escolha e propõe critérios, mas **a decisão em si não foi tomada** e permanece aberta.

Consequência prática: o trabalho de infraestrutura como código durante a Fase 1 deve ser escrito de forma parametrizada, servindo às duas hipóteses — o que impõe restrição real ao que pode ser construído nessa frente.

### `CONF-03` — `RNF-006` verificável apenas parcialmente na Fase 1

**O conflito.** O gate de CI de `RNF-006` (teste cronometrado de esforço do operador) torna-se executável na Fase 1, o que é ganho. Porém, o esforço real do operador inclui **espera por resposta do servidor**, inexistente com mock. Um lançamento que parece rápido com latência artificial de 200 ms pode não parecer com consulta real.

O gate deve, portanto, ser **reexecutado e recalibrado** na Fase 2. A aprovação na Fase 1 é necessária, não suficiente.

---

## 9. Impacto nos Demais Documentos

### 9.1 `arquitetura_fsd_RookHub.md` — impacto maior

O documento de FSD precisa ser estendido para acomodar a camada de mock. Pontos que exigem definição explícita:

| Item | O que precisa ser definido |
|---|---|
| **Localização dos mocks** | Camada e caminho canônicos. Recomendação: `shared/api/mock/`, isolando fixtures, cenários e a implementação `MockApiClient` — mantendo a camada `shared` como a única que conhece a origem do dado |
| **Localização do contrato** | Diretório `openapi/` na raiz do monorepo, fora das camadas do FSD, por ser artefato compartilhado entre frontend e backend |
| **Fiscalização de fronteira** | Regra explícita em `eslint-plugin-boundaries` e `dependency-cruiser`, severidade `error`: nenhuma camada acima de `shared` importa de `shared/api/mock`. Alinha-se ao rigor já adotado desde o dia 1 |
| **Localização do mapper** | Onde reside o mapper `DTO → domínio` — provavelmente por entidade, em `entities/{aggregate}/api/`, preservando a paridade de nomes com os módulos do Spring Modulith |
| **Regra de proibição de DTO manual** | Regra de lint impedindo declaração de tipo de DTO fora do gerado |
| **Estratégia pós-virada** | Como e quando `shared/api/mock` é removido, e a regra que passa a proibi-lo permanentemente (`EXR-01`) |
| **Painel de cenários** | Onde reside o controle de cenários adversos de `EXE-06` e como é excluído do build de produção |

> Recomenda-se que essas definições sejam registradas como decisões próprias **no documento de FSD**, não neste, por serem decisões de organização de código.

### 9.2 `prd_RookHub.md` — impacto contínuo

| Item | Ação |
|---|---|
| Regras de negócio | Incorporação das descobertas a partir de `RN-149`, por marco (`EXE-08`) |
| Regras contraditas | Resolução registrada, com a decisão e sua justificativa |
| Histórias de usuário | Refinamento de critérios de aceite conforme as telas revelam estados não previstos |
| Máquinas de estado | Estados intermediários descobertos no desenho incorporados aos diagramas |
| Modelo conceitual de dados | Campos e relacionamentos descobertos incorporados |
| Anexo G (Definition of Done) | Complementado pelo checklist de `EXE-05` |
| Matriz RBAC | Refinada conforme telas revelam ações não mapeadas |

**Expectativa realista:** se a premissa de `EXE-01` estiver correta, o volume de descobertas será **significativo**. Um PRD que sai da Fase 1 inalterado é evidência de que a fase não cumpriu seu objetivo.

### 9.3 `arquitetura_e_decisoes_tecnicas_RookHub.md`

| Item | Ação |
|---|---|
| `BE-04` | Acrescentar nota de que a autoria inicial da especificação é do frontend, por `EXE-03`, com o princípio preservado |
| Seção 14 (próximos passos) | Substituir a sequência de Sprint 0 pela sequência desta estratégia |
| Seção 13 (Definition of Done técnico) | Referenciar o checklist de `EXE-05` para a Fase 1 |
| Riscos | Referenciar `EXR-xx` como riscos de execução, complementares aos `RT-xx` de arquitetura |

Nenhuma decisão técnica é alterada.

### 9.4 `arquitetura_free_tier_MVP_RookHub.md`

| Item | Ação |
|---|---|
| Seção 9 (execução) | Ajustar: a Sprint 0 descrita naquele documento pertence à Fase 2, não ao início do projeto |
| Aplicabilidade | Registrar que a escolha entre as duas arquiteturas é decidida ao fim da Fase 1, por `EXE-07` |
| Coleta de dados durante o MVP | As seis métricas propostas naquele documento permanecem válidas, mas passam a ser coletadas na Fase 2 |

### 9.5 `visao_e_escopo_negocio_RookHub.md`

| Item | Ação |
|---|---|
| Cronograma e marcos | Refletir as duas fases, se o documento contiver linha do tempo |
| Definição de sucesso | O compromisso de resultado operacional mensurável em 30 dias de onboarding conta a partir da entrega da Fase 2, não do início do projeto |

### 9.6 `DESIGN.md`

Sem impacto estrutural. A Fase 1 é, na prática, a **primeira validação em escala real** do design system — espera-se que produza refinamentos de tokens, componentes e padrões, especialmente nos cenários de alta densidade de `EXE-06`.

---

## 10. Observação Final

Esta estratégia troca **entrega precoce de valor** por **redução de incerteza de requisitos**. É uma troca deliberada e não é gratuita: durante toda a Fase 1, nada utilizável chega ao cliente.

A troca se justifica pela assimetria de custo. Alterar um campo em componente React custa minutos; alterá-lo depois de existir tabela, migration, policy RLS, DTO, mapper, endpoint, teste e dado real custa ordens de magnitude mais — e é exatamente o cenário que o documento de arquitetura já apontou como a operação mais cara desta arquitetura.

Duas condições determinam se a troca compensa:

1. **`EXE-06` ser cumprido com rigor.** Mock apenas feliz produz confiança injustificada, que é pior do que nenhuma confiança. É a diferença entre descoberta de requisitos e protótipo bonito.
2. **`EXE-03` ser cumprido sem exceção.** Uma tela concluída sem contrato versionado é descoberta perdida. Todo o valor transferido da Fase 1 para a Fase 2 viaja dentro do arquivo OpenAPI — se ele não for escrito no momento da descoberta, a estratégia entrega interface e não entrega especificação.

> E uma regra que não se flexibiliza por nenhuma decisão deste documento: **a Fase 1 não produz garantia de segurança alguma.** RBAC e entitlement na interface são cosméticos. A garantia real vive em `BE-14`, `RN-118` e `RN-119`, e permanece integralmente pendente até a Fase 2.

---

*Documento de estratégia de execução. Não altera decisões de stack, arquitetura ou design registradas nos documentos anteriores. Revisão obrigatória ao final da Fase 1, com registro das descobertas e da decisão de arquitetura da Fase 2.*
