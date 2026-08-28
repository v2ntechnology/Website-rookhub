# PRD — RookHub

**Plataforma inteligente de gestão de frotas para o transporte rodoviário de cargas**

Documento de Requisitos do Produto (Product Requirement Document)

---

## 0. Controle do Documento

| Campo | Valor |
|---|---|
| Produto | RookHub |
| Versão do documento | 1.0 |
| Status | Aprovado para desenvolvimento do MVP |
| Data | 28 de julho de 2026 |
| Autor | Lead Product Manager |
| Público-alvo | Frontend, Backend, Dados, Mobile, QA, Design, Comercial |
| Documentos de origem | `visao_e_escopo_negocio_RookHub.md`, `DESIGN.md` |

### 0.1 Como ler este documento

- **RF-xxx** — Requisito Funcional
- **RNF-xxx** — Requisito Não-Funcional
- **RN-xxx** — Regra de Negócio
- **US-xxx** — User Story
- **CA-xxx** — Critério de Aceite
- **RSC-xxx** — Risco
- **PRM-xxx** — Premissa a validar

Cada decisão registrada nos anexos possui um identificador rastreável (ex.: `CHK-06`) referenciado ao longo do texto.

### 0.2 Convenções

Os termos **DEVE**, **NÃO DEVE**, **PODE** e **DEVERIA** têm significado normativo. Requisitos marcados **[Fase 2]** estão fora do escopo do MVP e constam apenas para orientar decisões de arquitetura que evitem retrabalho.

---

## 1. Visão do Produto

### 1.1 Problema

A operação de uma transportadora está espalhada entre telemetria, rastreamento, abastecimento, multas e planilhas. Como ninguém consegue reunir a informação, o prejuízo é invisível e só aparece no fechamento do mês, quando não há mais o que fazer.

### 1.2 Inimigo

**A incerteza.** O RookHub não compete com planilhas, rastreadores ou sistemas legados. Compete com o escuro.

### 1.3 Promessa

> **Descubra o prejuízo antes que ele aconteça.**
> Sem consultoria, sem implantação de seis meses, sem precisar de especialista.

### 1.4 Princípio inegociável de produto

> **O operador de escritório é o herói do RookHub.**

Lançar qualquer informação na plataforma DEVE ser mais rápido do que na planilha usada hoje. Nenhuma decisão de escopo pode aumentar o trabalho dessa pessoa. Este princípio está formalizado como requisito mensurável em **RNF-006**.

A razão é comercial: se o operador estiver sobrecarregado, o sistema fica vazio, o dono para de encontrar valor e o contrato é cancelado. O maior risco do produto não é o concorrente — é o cliente que para de abrir o sistema.

### 1.5 Indicadores de vitrine

1. Custo por quilômetro rodado
2. Consumo médio (km/l) por veículo e por motorista
3. Percentual de manutenções preventivas em dia

### 1.6 Compromisso de tempo

Primeiro resultado concreto em até **30 dias**, com descobertas entregues já na primeira semana — viabilizado pela importação em lote (`GER-04`) e pelas integrações com sistemas já em uso.

---

## 2. Escopo

### 2.1 Dentro do MVP

| Área | Escopo |
|---|---|
| Autenticação e RBAC | 6 papéis fixos, multi-tenant com RLS, SSO Google, PIN para motorista |
| Cadastros base | Veículos, implementos, motoristas, oficinas, fornecedores |
| Viagens | Entidade mínima (origem, destino, motorista, veículo, datas, km) |
| Checklist Digital | Saída e devolução, offline, fotos, bloqueio de veículo, pendências |
| Controle de Custos | Custo por km em camadas, abastecimento, detecção de anomalia de consumo |
| Manutenção Preventiva | Planos por km/tempo/horímetro, catálogo pré-cadastrado, Ordens de Serviço |
| Segurança na Estrada | Copiloto do operador, catálogo de eventos, contestação, score de motorista |
| Painel do Dono | Hierarquia fixa de 4 níveis |
| Pergunte à Sua Frota | 10 intenções, voz de entrada e saída, `Ctrl+K` |
| Central de Notificações | Global, multi-módulo |
| Onboarding | Wizard de implantação guiada |
| Integrações | Powerfleet Unity, Eagletrack, Hik-Connect, TruckPag |
| Importação | Planilha em lote |

### 2.2 Fora do MVP — Fase 2

- Lucratividade por rota e por cliente
- Acompanhamento de viagens (prazos e ocorrências)
- Gestão de multas e infrações (integração Smartec)
- Relatórios para o embarcador
- Gestão individual de pneus (número de fogo, posição, rodízio, recapagem)
- OCR de cupom fiscal de abastecimento
- Modelo próprio de visão computacional para detecção automática
- Notificações por WhatsApp
- App nativo (iOS/Android)
- Integração com ERP
- Controle de estoque de combustível (posto próprio)
- Portal automatizado de direitos do titular (LGPD)
- Multi-moeda

### 2.3 Explicitamente fora de escopo

- Roteirização e otimização de rotas
- Emissão de documentos fiscais (CT-e, MDF-e)
- Folha de pagamento e gestão de jornada regulatória
- Marketplace de fretes

---

## 3. Personas

| Persona | Papel no sistema | Frequência | Dispositivo | Objetivo |
|---|---|---|---|---|
| Dono / sócio | `OWNER` | Diária, curta | Web + celular | Saber onde está vazando o dinheiro |
| Gerente de frota | `MANAGER` | Diária, longa | Web | Manter a operação rodando sem surpresas |
| Operador de escritório | `OPERATOR` | Contínua | Web | Lançar, conferir e organizar rápido |
| Motorista | `DRIVER` | 2× por viagem | PWA mobile | Cumprir o checklist sem perder tempo |
| Equipe de manutenção | `MAINTENANCE` | Diária | Web | Tratar pendências e executar OS |
| Suporte RookHub | `SUPER_ADMIN` | Sob demanda | Web | Implantar e dar suporte |

---

## 4. Arquitetura Multi-tenant

### RF-001 — Isolamento por tenant

O sistema DEVE operar em base de dados compartilhada com coluna `tenant_id` em toda tabela de domínio e **Row-Level Security (RLS)** ativa no PostgreSQL. *(Decisão `RBAC-01`)*

**RN-001** — Nenhuma consulta pode ser executada sem contexto de tenant estabelecido na sessão de banco.

**RN-002** — A esteira de CI DEVE falhar o build se qualquer tabela de domínio for criada sem `tenant_id NOT NULL` e sem política RLS correspondente. Este teste é bloqueante e não pode ser desativado por decisão de squad.

**RN-003** — O papel `SUPER_ADMIN` é o único autorizado a cruzar tenants. Todo acesso cross-tenant DEVE ser registrado em log de auditoria imutável contendo usuário, tenant acessado, timestamp e motivo informado.

### RF-002 — Entitlements de plano

O sistema DEVE distinguir duas camadas independentes de autorização:

1. **Entitlement** — o plano contratado inclui o módulo? (tabela `tenant_modules`)
2. **Permissão** — o papel do usuário pode executar a ação? (matriz RBAC)

Uma ação só é permitida quando **ambas** as camadas autorizam.

**RN-004** — Módulos não contratados DEVEM aparecer na navegação em estado bloqueado, com CTA "Conhecer". Dados de amostra (teaser) são permitidos **apenas** na tela de Planos, nunca no contexto operacional. *(Decisão `PLAN-01`)*

**RN-005** — No MVP, o entitlement é concedido ao **tenant inteiro**. A modelagem DEVE, ainda assim, prever chave estrangeira opcional para veículo, de modo que a granularidade por veículo na Fase 2 não exija migration destrutiva. *(Decisão `PLAN-04`)*

**RN-006** — Módulos comercializados como planos superiores no MVP: **Segurança na Estrada** e **Pergunte à Sua Frota**.

---

## 5. Autenticação e Controle de Acesso

### RF-003 — Métodos de autenticação

| Perfil | Método |
|---|---|
| `OWNER`, `MANAGER`, `OPERATOR`, `MAINTENANCE`, `SUPER_ADMIN` | E-mail + senha, ou Google SSO |
| `DRIVER` | **CPF + PIN de 6 dígitos** |

**RN-007** — O CPF é chave única **por tenant**, não globalmente. Um mesmo motorista pode ter vínculo com duas transportadoras distintas.

**RN-008** — O primeiro acesso do motorista é provisionado por **QR code** gerado pelo `OPERATOR` ou `MANAGER` no painel. O QR code expira em 48 horas e é de uso único.

**RN-009** — O PIN DEVE ser armazenado com hash forte (Argon2id). Um hash derivado DEVE ser mantido em cache local no dispositivo para permitir validação offline.

**RN-010** — Após 5 tentativas incorretas de PIN, a conta é bloqueada por 15 minutos. O bloqueio é local e sincronizado ao servidor quando houver rede.

### RF-004 — MFA

**RN-011** — MFA (TOTP) é **obrigatório** para `SUPER_ADMIN` e **opcional** para `OWNER`. *(Decisão `PLAN-02`)*

### RF-005 — Sessão

| Perfil | Duração | Comportamento |
|---|---|---|
| Web (todos os papéis administrativos) | 12h | Refresh token rotativo, renovação silenciosa |
| `DRIVER` (PWA) | 90 dias | PIN solicitado a cada abertura do app |

**RN-012** — A sessão longa do motorista é requisito funcional, não conveniência: o checklist ocorre em pátio, de madrugada, sem sinal. Sessão curta inviabiliza o pilar de Manutenção Preventiva.

### RF-006 — Ciclo de vida do usuário

**RN-013** — Usuários administrativos são criados por **convite por e-mail** com papel pré-definido. O token de convite expira em 7 dias. *(Decisão `AUTH-04`)*

**RN-014** — Motoristas são exceção: criados diretamente pelo `OPERATOR` ou `MANAGER`, sem necessidade de e-mail.

**RN-015** — Recuperação de acesso: link por e-mail para papéis administrativos **e** reset de PIN pelo painel para motoristas. Todo reset é auditado (quem executou, quando, para qual usuário). *(Decisão `AUTH-03`)*

**RN-016** — Usuários são **ilimitados** em todos os planos. A receita é integralmente atrelada a caminhão ativo. *(Decisão `PLAN-03`)*

**RN-017** — Ao desligar um motorista, o usuário é marcado como inativo e o histórico é preservado integralmente. Após **12 meses**, nome e CPF são anonimizados, preservando todas as métricas agregadas. *(Decisão `LGPD-04`)*

### RF-007 — Visibilidade financeira configurável

**RN-018** — O tenant possui a flag `operator_sees_financials`, com **default desativado**, controlada exclusivamente pelo `OWNER` em Configurações. Quando desativada, o papel `OPERATOR` não acessa custo por km, ranking de custo, margem ou qualquer consolidado financeiro. *(Decisão `RBAC-03`)*

**RN-019** — Esta flag DEVE ser respeitada por **todas** as superfícies do produto, incluindo API, exportações, relatórios, notificações e o assistente de IA (ver `RN-054`).

---

## 6. Cadastros Base

### RF-008 — Veículo

Campos obrigatórios: placa, tipo (cavalo / truck / toco / VUC / implemento), marca, modelo, ano de fabricação, ano do modelo, chassi, status.

Campos opcionais: renavam, cor, capacidade de carga, número de eixos, data de aquisição, valor de aquisição, tanque (litros).

**RN-020** — O veículo possui máquina de estados própria (ver Anexo C):
`Disponível` · `Em viagem` · `Em manutenção` · `Indisponível` · `Inativo`

**RN-021** — Implementos e carretas são cadastrados como **veículos independentes** e vinculados ao cavalo mecânico por meio de uma **composição** com vigência (data início / data fim). Sem cadastro próprio, o custo por km de operações com dois implementos torna-se incalculável.

**RN-022** — Custos lançados em um implemento DEVEM ser rateados para a composição vigente no período, e não atribuídos exclusivamente ao cavalo.

### RF-009 — Motorista

Campos obrigatórios: nome completo, CPF, número da CNH, categoria da CNH, validade da CNH, data de admissão, status.

**RN-023** — O sistema DEVE gerar alerta automático de **vencimento de CNH** com antecedência configurável por tenant (default: 60, 30 e 7 dias antes, mais alerta diário após vencida).

**RN-024** — Motorista com CNH vencida NÃO DEVE poder ser vinculado a nova viagem. A tentativa exibe bloqueio explícito com o motivo.

**RN-025** — Exames toxicológico e ASO **[Fase 2]**, com a mesma mecânica de alerta de vencimento. A modelagem de "documento com validade" DEVE ser genérica desde o MVP para absorvê-los sem refatoração.

### RF-010 — Oficina e Fornecedor

Cadastro simples: nome, CNPJ, tipo (interna / externa), contato, endereço, especialidades.

---

## 7. Viagens

### RF-011 — Entidade Viagem

A viagem é entidade de primeira classe no MVP. Sem ela, consumo e eventos de segurança não podem ser atribuídos a um motorista, o que inviabiliza o pilar Gestão de Motoristas.

Campos: origem, destino, motorista, veículo (e composição), data/hora de início, data/hora de término, km inicial, km final, status.

**RN-026** — Estados da viagem: `Planejada` → `Em andamento` → `Concluída` | `Cancelada`.

**RN-027** — Uma viagem só pode ser iniciada se o veículo estiver `Disponível` e o motorista possuir CNH válida.

**RN-028** — Todo abastecimento, evento de segurança e ocorrência registrado durante a janela temporal de uma viagem DEVE ser automaticamente vinculado a ela.

**RN-029** — Acompanhamento de prazos, ocorrências de entrega e relatórios para embarcador ficam **[Fase 2]**.

---

## 8. Checklist Digital

Módulo crítico. O documento de visão é explícito: *checklist que não é preenchido derruba o pilar de manutenção inteiro*.

### RF-012 — Estrutura do formulário

**RN-030** — O checklist é composto por um **template mestre RookHub**, cujos itens são obrigatórios e não removíveis pelo cliente, acrescido de **blocos opcionais por categoria de veículo/carga** habilitados na implantação. *(Decisão `CHK-01`)*

**RN-031** — Itens são organizados em seções (Pneus, Freios, Elétrica, Documentação, Cabine, Fluidos, Estrutura).

**RN-032** — Tipos de resposta suportados:
- **Conforme / Não conforme / Não aplicável** (obrigatório em todo item)
- **Severidade** — `Atenção` ou `Crítico` — obrigatória sempre que a resposta for "Não conforme"
- **Numérico** — em itens específicos (ex.: sulco de pneu em mm, nível de fluido)

**RN-033** — O template DEVE ser **versionado**. Um checklist preenchido no passado DEVE sempre renderizar com a versão do template vigente no momento do preenchimento.

**RN-034** — Cada item do template possui a propriedade booleana `bloqueante`. Itens de segurança crítica (freio, pneu, direção, iluminação) são marcados como bloqueantes por padrão no template mestre.

### RF-013 — Momentos do checklist

**RN-035** — Existem dois formulários distintos: **Saída** (preventivo, enxuto, rápido) e **Devolução** (diagnóstico, completo). Checklist intermediário fica fora do MVP. *(Decisão `CHK-03`)*

**RN-036** — O checklist de saída **não bloqueia a partida** por si só. É registrado e, se contiver item bloqueante crítico, aciona a regra `RN-041`. *(Decisão `CHK-04`)*

**RN-037** — O checklist de saída **expira em 4 horas**. Viagem iniciada com checklist expirado é permitida, mas recebe a flag *"viagem iniciada sem checklist válido"* e notifica o operador. *(Decisão `CHK-13`)*

### RF-014 — Evidência fotográfica

**RN-038** — Foto é **obrigatória** em itens com severidade `Crítico` e **opcional** em `Atenção`. *(Decisão `CHK-05`)*

**RN-039** — Limite de **3 fotos por item**.

**RN-040** — O app DEVE redimensionar para no máximo 1600px no maior lado e comprimir para aproximadamente 300KB antes do envio. Requisito essencial para conexões 3G em rodovia.

**RN-041** — A captura DEVE usar exclusivamente a **câmera nativa**. Seleção da galeria é bloqueada, para impedir reaproveitamento de fotos de outros dias.

**RN-042** — Geolocalização não é embutida nas fotos no MVP, por decisão deliberada de minimizar exposição LGPD.

### RF-015 — Bloqueio de veículo

**RN-043** — Item marcado como `bloqueante` respondido como "Não conforme" com severidade `Crítico` coloca o veículo em `Indisponível` imediatamente. *(Decisão `CHK-06`)*

**RN-044** — No checklist de **saída**, ao ocorrer `RN-043`, o app DEVE exibir alerta bloqueante ao motorista ("veículo indisponível — procure o gestor"), notificar o `MANAGER` em tempo real, e a viagem só pode ser iniciada após liberação. *(Decisão `CHK-12`)*

**RN-045** — A liberação é privativa de `MANAGER` ou `OWNER` e exige **justificativa textual obrigatória**, registrada no histórico do veículo com autor, timestamp e texto.

**RN-046** — Itens bloqueantes com severidade `Atenção` sinalizam o veículo sem bloqueá-lo.

### RF-016 — Pendências e notificações

**RN-047** — Toda resposta "Não conforme" gera uma **Pendência** vinculada ao veículo e ao item.

**RN-048** — Notificação: `MAINTENANCE` é notificado **sempre**; `MANAGER` e `OWNER` apenas em severidade `Crítico`. Canais no MVP: **in-app, e-mail e push**. WhatsApp fica **[Fase 2]**. *(Decisão `CHK-07`)*

**RN-049** — A pendência **não** se converte automaticamente em Ordem de Serviço. A conversão é ato explícito de `MAINTENANCE`, para evitar inflar o backlog com falso positivo. *(Decisão `CHK-08`)*

**RN-050** — Pendência repetida (mesmo item + mesmo veículo, com pendência anterior ainda aberta) **agrupa** no registro existente e incrementa um contador de recorrência. O contador alimenta a detecção de problema crônico no Painel do Dono. *(Decisão `CHK-09`)*

**RN-051** — O veículo exibe suas pendências abertas para o próximo motorista e para o gestor.

### RF-017 — Operação offline

**RN-052** — O checklist DEVE funcionar **integralmente offline**, incluindo captura de fotos, com fila de sincronização automática. *(Decisão `CHK-10`)*

**RN-053** — Em conflito de sincronização, **o servidor é a autoridade**. O app exibe aviso ao motorista após a sincronização quando seu registro divergir do estado do servidor.

**RN-054** — O sistema DEVE gravar **dois timestamps**: `filled_at` (relógio do dispositivo) e `received_at` (servidor). Divergência superior a 6 horas gera flag de auditoria — indicador clássico de manipulação de relógio.

---

## 9. Controle de Custos e Abastecimento

### RF-018 — Custo por quilômetro

**RN-055** — O custo por km é calculado em **camadas**, com a camada A como padrão e rótulo explícito na interface. *(Decisão `CUS-01`)*

| Camada | Componentes | Rótulo na UI |
|---|---|---|
| **A** (default) | Combustível + ARLA + pneu + manutenção | "Custo variável por km" |
| **B** (opcional) | A + pedágio + motorista (rateado) + seguro | "Custo operacional por km" |
| **C** (opcional) | B + depreciação + financiamento | "Custo total por km (TCO)" |

**RN-056** — A interface NUNCA DEVE exibir duas camadas sem rótulo distinto. Ambiguidade neste número destrói a confiança no produto inteiro.

**RN-057** — Fórmula da camada A:

```
custo_variavel_km(veículo, período) =
    ( Σ custo_combustível
    + Σ custo_arla
    + Σ custo_pneu
    + Σ custo_manutenção )
    ÷ km_rodados(veículo, período)
```

**RN-058** — Custos de implemento são rateados conforme `RN-022`.

### RF-019 — Quilometragem

**RN-059** — Fonte da quilometragem: **telemetria/GPS**, com fallback para lançamento manual de odômetro. *(Decisão `CUS-02`)*

**RN-060** — Divergência superior a **5%** entre distância GPS e variação do odômetro no mesmo período gera **flag de auditoria** visível ao gestor. É sinal clássico de adulteração de odômetro ou desvio de rota.

### RF-020 — Abastecimento

**RN-061** — Fontes de registro: **integração TruckPag** (primária), **lançamento pelo operador** (complementar) e **foto do cupom pelo motorista** (comprovação). OCR do cupom fica **[Fase 2]** — no MVP a foto é anexo de evidência, não fonte de dado estruturado. *(Decisão `CUS-03`)*

**RN-062** — Todo lançamento de abastecimento DEVE conter o campo booleano obrigatório **"Completou o tanque?"**. *(Decisão `CUS-04`)*

**RN-063** — O consumo (km/l) DEVE ser calculado **exclusivamente entre dois abastecimentos com tanque completo**. Abastecimentos parciais entram no custo, mas são ignorados no cálculo de consumo.

**RN-064** — Sem `RN-063`, o indicador de vitrine nº 2 fica incorreto. Este requisito é bloqueante para o lançamento do produto.

**RN-065** — Controle de estoque de combustível em posto próprio está **fora de escopo**. *(Decisão `CUS-06`)*

### RF-021 — Detecção de anomalia de consumo

**RN-066** — Baseline principal: **histórico do próprio veículo** (média móvel dos últimos 90 dias com tanque completo). Baseline comparativo: média dos veículos de mesmo modelo na frota. *(Decisão `CUS-05`)*

**RN-067** — Limiar de alerta: **10%** acima do baseline principal.

**RN-068** — O alerta DEVE ser formulado em linguagem de negócio, no formato da descoberta prometida no documento de visão: *"Este caminhão está consumindo 18% acima dos outros."*

**RN-069** — A detecção exige mínimo de 3 abastecimentos completos no período para evitar falso positivo em veículo recém-cadastrado.

### RF-022 — Pneus

**RN-070** — No MVP, pneu é tratado como **categoria de custo** (compra, troca, custo por veículo). Gestão individual — número de fogo, posição, rodízio, recapagem, sulco por posição — fica **[Fase 2]**. *(Decisão `PNE-01`)*

---

## 10. Manutenção Preventiva e Ordens de Serviço

### RF-023 — Planos de manutenção

**RN-071** — O gatilho de um plano é **o que vencer primeiro** entre quilometragem, tempo (dias) e horímetro. *(Decisão `MAN-01`)*

**RN-072** — A antecedência do aviso é **configurável por plano**, em km e em dias, separadamente. Troca de óleo e revisão de motor não têm a mesma antecedência. *(Decisão `MAN-02`)*

**RN-073** — O RookHub DEVE fornecer um **catálogo de planos pré-cadastrados** por marca e modelo (Scania, Volvo, Mercedes-Benz, Volkswagen, DAF, Iveco), aplicável no wizard de implantação. *(Decisão `MAN-03`)*

**RN-074** — O catálogo é entregue como **sugestão editável**. Ao adotar um plano do catálogo, o sistema DEVE exibir aviso: *"Confirme os intervalos com o manual do fabricante."* O cliente pode ajustar qualquer parâmetro por veículo. Esta mitigação é obrigatória: plano incorreto gera manutenção fora de hora e potencial responsabilidade da RookHub.

**RN-075** — O catálogo é versionado e mantido pela RookHub. Atualizações não alteram planos já customizados pelo cliente.

### RF-024 — Ordem de Serviço

Campos obrigatórios: veículo, tipo (preventiva / corretiva), origem (plano / checklist / avulsa), oficina, itens executados, peças, mão de obra, custo total, km do veículo, data de entrada, data de saída, responsável.

Campos opcionais: anexos, observações, número da nota fiscal.

**RN-076** — Estados da OS: `Aberta` → `Aprovada` → `Em execução` → `Concluída` | `Cancelada`.

**RN-077** — OS cujo custo estimado ultrapasse o **valor-limite de aprovação** definido pelo `OWNER` DEVE permanecer em `Aberta` até aprovação explícita de `OWNER` ou `MANAGER`. *(Decisão `MAN-04`)*

**RN-078** — Enquanto a OS estiver `Em execução`, o veículo assume automaticamente o status `Em manutenção` e não pode ser vinculado a nova viagem. *(Decisão `MAN-05`)*

**RN-079** — Ao concluir a OS, o veículo retorna a `Disponível` **apenas se** não houver outra pendência bloqueante crítica aberta.

---

## 11. Segurança na Estrada

> **Contexto crítico.** A transportadora-âncora possui câmeras instaladas, porém **sem qualquer análise automática**. Hoje a detecção é feita por **3 a 4 pessoas monitorando vídeo 24 horas por dia**, que ligam para o motorista quando percebem algo. Não existe dispositivo de alerta na cabine.
>
> **Consequência de posicionamento:** o RookHub não compete com um DMS. Ele **substitui um plantão humano de monitoramento**. Esta é a proposta de valor mais forte do produto e DEVE ser o eixo do material comercial do módulo.

### RF-025 — Arquitetura de detecção

**RN-080** — No MVP, o RookHub opera como **copiloto do operador**: em vez de exibir 80 câmeras, prioriza e destaca as N câmeras com maior probabilidade de evento, reduzindo drasticamente a carga cognitiva do monitoramento. A decisão permanece humana. *(Decisão `SEG-12`)*

**RN-081** — **[Fase 2]** Modelo próprio de visão computacional para detecção automática, treinado com o dataset rotulado gerado como subproduto do uso do MVP. Cada confirmação ou descarte do operador é um rótulo.

**RN-082** — O sistema DEVE, desde o MVP, persistir todo par (frame analisado, decisão do operador) em formato adequado a treinamento supervisionado. Este é o ativo estratégico do módulo.

### RF-026 — Catálogo de eventos

| Evento | Severidade | Alerta em cabine | Notificação ao gestor |
|---|---|---|---|
| Sonolência / olhos fechados | Crítico | Sim, imediato | Tempo real |
| Colisão iminente / frenagem brusca | Crítico | Sim, imediato | Tempo real |
| Distração prolongada (>3s fora da via) | Alto | Sim | Agregado |
| Uso de celular ao volante | Alto | Sim | Tempo real |
| **Ausência de cinto de segurança** | **Alto** | Sim | **Tempo real** |
| Fumar na cabine | Baixo | Opcional | Agregado |
| Bocejo / sinais precoces de fadiga | Informativo | Não | Agregado |

**RN-083** — A severidade é **fixa pela RookHub**, não configurável pelo cliente. Severidade configurável destruiria a comparabilidade entre transportadoras, que é ativo estratégico do produto. *(Decisão `SEG-11`)*

### RF-027 — Alerta em cabine

**RN-084** — O alerta ao motorista utiliza **bipe com escalonamento para voz** caso o evento persista. *(Decisão `SEG-03`)*

**RN-085** — **Escalonamento:** 3 eventos críticos do mesmo motorista em 1 hora disparam **ligação automática para o gestor**. *(Decisão `SEG-04`)*

**RN-086 — DECISÃO CONDICIONADA.** O meio físico do alerta em cabine (`SEG-13`) está **suspenso** aguardando validação comercial. Nenhuma sprint de hardware DEVE ser iniciada antes da conclusão de `PRM-001`. Alternativas em avaliação:

| Caminho | Descrição |
|---|---|
| Upgrade do plano Powerfleet Unity | O fornecedor já comercializa vídeo com IA e alerta ao motorista em tempo real; consumir os eventos via API elimina o desenvolvimento de hardware |
| Chamada de voz automatizada | O RookHub liga automaticamente para o motorista, replicando o processo atual sem hardware novo |
| Buzzer/speaker próprio RookHub | Somente se as opções acima se mostrarem inviáveis |

> **Justificativa da suspensão:** construir hardware antes de 10 clientes transforma a RookHub em fabricante, contradiz a promessa de "implantação em poucos dias" e adiciona homologação, estoque, logística e RMA a um produto de software. A validação custa uma semana; a decisão errada custa seis meses.

### RF-028 — Notificação ao gestor

**RN-087** — Apenas eventos de severidade `Crítico` geram **toast em tempo real**. Os demais entram no digest diário. *(Decisão `SEG-05`)*

**RN-088** — **Agregação inteligente:** múltiplos eventos do mesmo motorista dentro da janela de agregação consolidam-se em um único toast (ex.: *"Motorista X: 4 eventos de distração na última hora"*).

**RN-089** — A janela de agregação é **configurável por tenant**, com default de **15 minutos**.

**RN-090** — Prevenção de fadiga de alerta é requisito de produto, não refinamento. Em uma frota de 80 caminhões, notificação por evento individual levaria o gestor a desativar o módulo — e módulo desativado é churn.

**RN-091** — Todo toast DEVE conter **ações embutidas**: "Ligar para o motorista" e "Abrir histórico da viagem".

### RF-029 — Evidência e retenção

**RN-092** — O RookHub armazena **metadados do evento e URL assinada** apontando para a mídia no fornecedor. Não armazena a mídia. *(Decisão `SEG-07`)*

**RN-093** — Retenção de eventos de segurança: **90 dias**.

**RN-094** — Visualização da imagem do motorista: restrita a `OWNER` e `MANAGER`. O **próprio motorista** tem acesso aos seus próprios eventos e às suas próprias imagens. *(Decisão `SEG-08`)*

### RF-030 — Contestação de evento

**RN-095** — O motorista PODE contestar qualquer evento atribuído a ele, informando justificativa. *(Decisão `SEG-09`)*

**RN-096** — Estados da contestação: `Aberta` → `Mantida` | `Descartada`, com decisão privativa de `MANAGER` ou `OWNER`, justificativa obrigatória e registro auditado.

**RN-097** — Evento `Descartado` é excluído do cálculo do score de segurança e marcado como falso positivo no dataset de treinamento.

**RN-098** — O canal de contestação é requisito de adoção: sem ele, falso positivo destrói a confiança do motorista e o dado perde credibilidade perante o gestor.

### RF-031 — Score de segurança do motorista

**RN-099** — O sistema DEVE calcular um score de **0 a 100** por motorista, com fórmula **fixa pela RookHub**, transparente e auditável. *(Decisão `SEG-10`)*

**RN-100** — O motorista DEVE poder visualizar **o próprio score e a composição detalhada do cálculo**. Não visualiza o score de colegas nem o ranking.

**RN-101** — `OWNER` e `MANAGER` visualizam o ranking completo.

**RN-102** — A fórmula não é configurável pelo cliente, pelo mesmo argumento de comparabilidade de `RN-083`.

---

## 12. Painel do Dono

### RF-032 — Hierarquia fixa

**RN-103** — O Painel do Dono segue hierarquia fixa e não reordenável, correspondente ao raciocínio natural de quem é dono:

| Ordem | Bloco | Pergunta que responde |
|---|---|---|
| 1º | Dinheiro | Estou ganhando ou perdendo? |
| 2º | Alertas do dia | O que está fora do padrão agora? |
| 3º | Estado da frota | Como está minha operação hoje? |
| 4º | Ranking de custo | Onde exatamente está vazando? |

**RN-104** — O painel é **enxuto por decisão de projeto**. Traz apenas insights que ajudam a gerir melhor e a lucrar mais. Toda proposta de novo widget DEVE justificar qual decisão do dono ela habilita; caso contrário, é rejeitada.

**RN-105** — O painel DEVE carregar em menos de 2 segundos no percentil 95 (`RNF-001`). Painel lento no celular entre reuniões não é aberto — e cliente que não abre é o maior risco do produto.

**RN-106** — Quando `operator_sees_financials` estiver desativada, o `OPERATOR` acessa uma variante do painel sem os blocos 1 e 4.

---

## 13. Pergunte à Sua Frota (Assistente de IA)

### RF-033 — Arquitetura

**RN-107** — O assistente utiliza **classificação de intenção + function calling** sobre funções auditadas do backend. **Text-to-SQL está proibido no MVP.** *(Decisão `IA-01`)*

**RN-108** — Justificativa: em uma demonstração comercial, *"ainda não sei responder isso"* é infinitamente preferível a um número errado. A precisão numérica é o ativo do produto.

**RN-109** — O provedor de LLM DEVE ser abstraído por uma interface (`LLM_PROVIDER` configurável). Provedor inicial: Google Gemini. Nenhuma regra de negócio pode depender de particularidade de um modelo específico.

**RN-110** — **Compliance obrigatório:** o RookHub DEVE operar exclusivamente na camada paga do provedor, em todos os ambientes que tratem dado real de cliente, inclusive desenvolvimento. Na camada gratuita, o conteúdo enviado é utilizado pelo fornecedor para melhoria de seus produtos, o que é incompatível com o tratamento de dado de terceiros. *(Decisão `IA-10`)*

### RF-034 — Catálogo de intenções (MVP)

| # | Intenção | Tipo |
|---|---|---|
| 1 | Maior/menor consumo por veículo no período | Determinística |
| 2 | Ranking de custo por km | Determinística |
| 3 | Custo total por veículo/período | Determinística |
| 4 | Manutenções vencidas ou a vencer | Determinística |
| 5 | Veículos indisponíveis e motivo | Determinística |
| 6 | Comparativo de motoristas por consumo | Determinística |
| 7 | Gasto com combustível no período | Determinística |
| 8 | Pendências abertas de checklist | Determinística |
| 9 | Eventos de segurança por motorista | Determinística |
| 10 | Recomendação de ação para reduzir consumo | **Generativa** |

**RN-111** — A intenção 10 é a única generativa. Suas recomendações DEVEM ser fundamentadas exclusivamente em dados retornados pelas funções determinísticas e apresentadas como sugestão, nunca como afirmação de fato.

### RF-035 — Voz

**RN-112** — Pipeline em três etapas: **STT → LLM com function calling → TTS**. A alternativa de áudio nativo em tempo real fica para reavaliação pós-MVP, por custo aproximadamente 10× superior e maturidade de preview. *(Decisão `IA-09`)*

**RN-113** — A funcionalidade de voz é **exclusiva** dos papéis `OWNER` e `MANAGER`. *(Decisão `IA-03`)*

**RN-114** — A resposta DEVE aparecer sempre na tela, mesmo quando falada, para consulta, comparação e para situações em que ouvir não é conveniente.

### RF-036 — Interface

**RN-115** — Superfície principal: **`Ctrl+K`** como command palette global, unificando busca e IA em um único campo, mais botão de microfone flutuante. *(Decisão `IA-04`)*

**RN-116** — A resposta DEVE conter texto + gráfico ou tabela quando pertinente + **botão de ação contextual** (ex.: "agendar manutenção", "abrir ficha do veículo"). Isso transforma o assistente de vitrine em ferramenta operacional. *(Decisão `IA-05`)*

**RN-117** — Memória de curto prazo de **5 turnos** dentro da sessão (permitindo "e no mês passado?"), com histórico persistido por **30 dias**. *(Decisão `IA-06`)*

### RF-037 — Governança da IA

**RN-118 — REQUISITO DE SEGURANÇA BLOQUEANTE.** O assistente DEVE respeitar rigorosamente o RBAC do usuário ativo. Se o perfil tem um módulo ou a visualização financeira ocultada na interface, o assistente **não pode, sob nenhuma hipótese, calcular, revelar, resumir, inferir ou responder parcialmente** com esse dado — inclusive de forma agregada, comparativa ou indireta. *(Decisão `IA-07`)*

**RN-119** — A verificação de permissão DEVE ocorrer **no backend, antes da execução da função**, jamais por instrução no prompt. Filtro por prompt não é controle de acesso.

**RN-120** — Escopo temático **fechado**: o assistente responde apenas sobre a frota do tenant e recusa educadamente qualquer outro assunto.

**RN-121** — Toda resposta DEVE exibir **fonte e período considerados** (ex.: "com base em 342 abastecimentos, jan–mar/2026"). É o que permite auditoria imediata durante a demonstração comercial.

**RN-122** — O payload enviado ao provedor DEVE ser **anonimizado**: identificadores internos no lugar de nomes de motoristas, placas e CPFs. A resposta é re-hidratada no backend antes de chegar ao usuário.

**RN-123** — Perguntas são **ilimitadas** para o `OWNER`. O sistema DEVE, ainda assim, registrar consumo por tenant para monitoramento interno de margem.

**RN-124** — Quando não souber responder, o assistente DEVE (a) sugerir as perguntas mais próximas do catálogo e (b) registrar a lacuna como insumo de roadmap orientado por uso real.

---

## 14. Central de Notificações

### RF-038

**RN-125** — A Central de Notificações é **global e multi-módulo**, agregando checklist, manutenção, segurança, integrações e vencimentos de documento. *(Decisão `NOT-01`)*

**RN-126** — Funcionalidades mínimas: estado lido/não lido, filtro por tipo e por severidade, arquivamento, ação embutida quando aplicável.

**RN-127** — Notificações persistem por 90 dias e respeitam integralmente o RBAC e os entitlements do usuário.

---

## 15. Onboarding e Implantação Guiada

### RF-039 — Wizard de implantação

**RN-128** — O produto DEVE conter um **wizard de implantação visível no próprio sistema**, executável por `SUPER_ADMIN` em conjunto com o cliente. *(Decisão `ONB-01`)*

Etapas:

1. Dados da transportadora e definição do `OWNER`
2. Conexão das integrações (Powerfleet Unity, Eagletrack, Hik-Connect, TruckPag)
3. Importação da frota (planilha ou integração)
4. Cadastro de motoristas e geração dos QR codes de acesso
5. Adoção e ajuste dos planos de manutenção a partir do catálogo
6. Configuração de limiares (anomalia de consumo, antecedências, janela de agregação, valor-limite de aprovação de OS)
7. Definição da flag `operator_sees_financials`
8. Importação do histórico em lote

**RN-129** — O wizard exibe progresso percentual e permite retomada. Um wizard visível reduz a dependência de acompanhamento humano e é demonstrável na venda.

### RF-040 — Importação em lote

**RN-130** — O sistema DEVE aceitar importação por planilha de veículos, motoristas, abastecimentos e histórico de manutenções, com template disponível para download, validação prévia, relatório de erros linha a linha e confirmação antes da gravação. *(Decisão `GER-04`)*

**RN-131** — A importação de histórico é o que viabiliza a promessa de descoberta na primeira semana.

---

## 16. Regras Transversais de Lançamento

**RN-132** — Moeda: **BRL apenas** no MVP. O campo `currency` DEVE existir na modelagem desde o dia 1 para evitar migration dolorosa na internacionalização. *(Decisão `GER-01`)*

**RN-133** — Todo lançamento PODE ser editado, com **histórico de versões** preservado e auditado (autor, timestamp, valor anterior, valor novo).

**RN-134** — Exclusão é **apenas lógica** (soft delete), nunca física. Dado financeiro que desaparece sem rastro destrói a confiança no indicador — e o indicador é o produto. *(Decisão `GER-02`)*

**RN-135** — O `OWNER` PODE executar **fechamento de período**, congelando os dados do ciclo. Após o fechamento, alterações exigem reabertura explícita e auditada. *(Decisão `GER-03`)*

**RN-136** — Sem congelamento, o número visto ontem pode mudar hoje, e o dono perde a confiança no painel.

---

## 17. Integrações

### RF-041 — Fornecedores do MVP

| Fornecedor | Categoria | Escopo | Fase |
|---|---|---|---|
| **Powerfleet Unity** | Telemetria / IoT | Odômetro, posição, consumo, eventos | MVP |
| **Eagletrack** | Rastreamento | Posição, viagens | MVP |
| **Hik-Connect** | Câmeras | Stream/snapshot para o copiloto do operador | MVP |
| **TruckPag** | Cartão de combustível | Abastecimentos | MVP |
| **Smartec** | Multas | Infrações | **[Fase 2]** |
| ERP / financeiro | — | — | Fora de escopo |

### RF-042 — Padrão de integração

**RN-137** — Padrão **híbrido**: webhook quando o fornecedor suportar, polling agendado como complemento, com fila e **retry exponencial**. *(Decisão `INT-02`)*

**RN-138** — **Camada de anticorrupção obrigatória.** Cada fornecedor possui um adaptador dedicado que traduz seu formato para o **modelo canônico do RookHub**. Nenhuma regra de negócio pode conhecer o formato de um fornecedor específico. *(Decisão `INT-03`)*

**RN-139** — Sem `RN-138`, o segundo cliente com outro rastreador implica reescrita do núcleo. Este requisito é arquiteturalmente bloqueante.

**RN-140** — Toda integração DEVE registrar `last_successful_sync_at` por fornecedor e por tenant.

**RN-141** — Em caso de indisponibilidade do fornecedor, o painel DEVE exibir **banner de dado desatualizado** com o horário da última sincronização bem-sucedida. O dono precisa saber que está olhando um número velho **antes** de decidir com base nele. *(Decisão `INT-04`)*

**RN-142** — Idempotência obrigatória: reprocessamento de um mesmo evento não pode duplicar lançamentos.

---

## 18. Requisitos Não-Funcionais

### 18.1 Desempenho

| ID | Métrica | Alvo |
|---|---|---|
| **RNF-001** | Carga do Painel do Dono (p95) | < 2s |
| **RNF-002** | Resposta do assistente de IA, texto (p95) | < 4s |
| **RNF-003** | Início da fala do TTS (p95) | < 6s |
| **RNF-004** | Salvamento de lançamento pelo operador (p95) | < 500ms |
| **RNF-005** | Sincronização de checklist offline (10 fotos, 4G) | < 60s |
| **RNF-006** | **Esforço do operador** — lançamento de abastecimento | **≤ 5 campos e ≤ 20 segundos** |
| **RNF-007** | Detecção de evento crítico até toast no gestor | < 10s |
| **RNF-008** | Disponibilidade mensal | 99,5% |

**RNF-006 é a tradução mensurável do princípio inegociável.** DEVE ser verificado em teste de usabilidade cronometrado a cada release. Regressão neste indicador bloqueia o deploy.

### 18.2 Operação offline (PWA do motorista)

| ID | Requisito |
|---|---|
| **RNF-009** | Cobertura offline: checklist de saída e devolução, fotos, ocorrências de viagem, consulta a pendências do veículo |
| **RNF-010** | Capacidade da fila: 7 dias / 20 checklists / 100 fotos |
| **RNF-011** | Sincronização prioriza dados estruturados; fotos sobem em background |
| **RNF-012** | **Um motorista por aparelho** — sem múltiplos perfis em cache |
| **RNF-013** | Indicador visual permanente de estado (online / offline / N itens pendentes de envio) |

### 18.3 Plataforma

| ID | Requisito |
|---|---|
| **RNF-014** | Motorista: **PWA instalável** (service worker + IndexedDB). App nativo **[Fase 2]** |
| **RNF-015** | Web: navegadores modernos, responsivo, com o Painel do Dono plenamente usável em celular |
| **RNF-016** | Idioma: pt-BR |
| **RNF-017** | Fuso: America/Sao_Paulo, com armazenamento em UTC |

### 18.4 Segurança

| ID | Requisito |
|---|---|
| **RNF-018** | TLS 1.2+ em todo tráfego; criptografia em repouso |
| **RNF-019** | Senhas e PINs com Argon2id |
| **RNF-020** | Log de auditoria imutável para: acesso cross-tenant, liberação de veículo, reset de PIN, edição e exclusão de lançamento, decisão de contestação, reabertura de período |
| **RNF-021** | Rate limiting por tenant e por usuário em todos os endpoints públicos |
| **RNF-022** | URLs assinadas de mídia com expiração máxima de 15 minutos |

### 18.5 Continuidade

| ID | Requisito |
|---|---|
| **RNF-023** | **RPO 24h** |
| **RNF-024** | **RTO 4h** |
| **RNF-025** | Teste de restauração de backup executado trimestralmente |

### 18.6 Design

| ID | Requisito |
|---|---|
| **RNF-026** | Conformidade integral com `DESIGN.md`: glassmorphism total, base escura, Sora (títulos) e Inter (corpo), Phosphor Duotone |
| **RNF-027** | Dados numéricos em tabelas usam Inter com algarismos tabulares |
| **RNF-028** | Contraste mínimo WCAG AA em todo texto sobre superfície translúcida — verificação obrigatória, dado o risco inerente ao glassmorphism |
| **RNF-029** | PWA do motorista prioriza legibilidade sob luz solar direta e alvos de toque grandes, mesmo que isso implique afastamento do glassmorphism |

> **Nota de design:** `RNF-029` é uma exceção deliberada. O motorista opera em pátio, sob sol, muitas vezes com luvas. Estética não pode custar preenchimento de checklist.

---

## 19. LGPD e Privacidade

**RN-143** — Base legal para o tratamento de dados de monitoramento: **legítimo interesse documentado** (segurança viária), com aviso transparente ao titular. Consentimento de empregado é juridicamente frágil no Brasil em razão da relação de subordinação. *(Decisão `LGPD-01`)*

> ⚠️ **Este documento não constitui aconselhamento jurídico.** O Relatório de Impacto (RIPD), a política de privacidade e o termo de ciência DEVEM ser validados por advogado especializado em proteção de dados **antes do go-live**.

**RN-144** — No primeiro acesso ao PWA, o motorista DEVE receber termo de ciência informando o que é monitorado, por quanto tempo, quem tem acesso e quais são seus direitos. O aceite é registrado com data, versão do termo e IP. *(Decisão `LGPD-02`)*

**RN-145** — Tabela de retenção:

| Categoria | Prazo | Justificativa |
|---|---|---|
| Dados operacionais (viagens, custos, manutenção) | 5 anos | Prescrição trabalhista |
| Eventos de segurança e mídia associada | 90 dias | Janela de contestação |
| Conversas com o assistente de IA | 30 dias | Utilidade operacional |
| Logs de auditoria | 5 anos | Compliance |
| Notificações | 90 dias | Utilidade operacional |

**RN-146** — Motorista desligado tem nome e CPF **anonimizados após 12 meses**, preservando integralmente as métricas agregadas. Os indicadores da frota não podem se degradar quando alguém sai da empresa. *(Decisão `LGPD-04`)*

**RN-147** — Direitos do titular (acesso, correção, exclusão, portabilidade) são atendidos por **processo manual via suporte** no MVP. Portal automatizado fica **[Fase 2]**. *(Decisão `LGPD-05`)*

**RN-148** — O acesso do motorista aos próprios eventos e imagens (`RN-094`) é simultaneamente boa prática de LGPD e requisito de adoção: reduz a percepção de vigilância oculta.

---

## 20. User Stories e Critérios de Aceite

**Formato adotado:** clássico *"Como [papel], quero [ação], para [benefício]"*, com critérios em **Given/When/Then**.
**Priorização:** MoSCoW dentro do MVP, com marcação de fase.
**Estimativa:** deliberadamente ausente — atribuição do time de engenharia.

Os cinco fluxos críticos estão detalhados com Gherkin completo. Os demais constam no backlog resumido da seção 20.6.

---

### 20.1 Épico: Checklist Digital

#### US-001 — Preencher checklist de saída offline
**Must have · MVP**

> Como **motorista**, quero preencher o checklist de saída sem depender de internet, para não atrasar minha partida quando o pátio estiver sem sinal.

```gherkin
Cenário: Preenchimento completo sem conexão
  Dado que estou autenticado no PWA com meu PIN
    E o dispositivo está sem conexão de rede
    E existe um veículo atribuído a mim
  Quando eu abrir o checklist de saída
    E responder todos os itens obrigatórios
    E confirmar o envio
  Então o checklist deve ser salvo localmente com status "Pendente de envio"
    E devo ver a confirmação "Checklist salvo. Será enviado quando houver sinal."
    E o indicador de itens pendentes deve exibir 1

Cenário: Sincronização automática ao recuperar a rede
  Dado que existe 1 checklist com status "Pendente de envio"
  Quando o dispositivo recuperar a conexão
  Então os dados estruturados devem ser enviados antes das fotos
    E o status deve mudar para "Enviado"
    E o servidor deve registrar filled_at e received_at

Cenário: Divergência de relógio
  Dado que um checklist foi preenchido com filled_at divergente em mais de 6 horas de received_at
  Quando o servidor processar o registro
  Então uma flag de auditoria deve ser criada
    E o gestor deve visualizá-la no detalhe do checklist

Cenário: Limite da fila offline atingido
  Dado que existem 20 checklists pendentes de envio
  Quando eu tentar iniciar um novo checklist
  Então devo ver um aviso solicitando sincronização antes de prosseguir
```

#### US-002 — Bloquear veículo com irregularidade crítica
**Must have · MVP**

> Como **gestor**, quero que o veículo seja automaticamente bloqueado quando o motorista apontar um item crítico de segurança, para que ninguém viaje com um caminhão que não pode rodar.

```gherkin
Cenário: Item bloqueante crítico no checklist de saída
  Dado que estou preenchendo o checklist de saída
  Quando eu marcar o item "Freio de serviço" como "Não conforme"
    E selecionar a severidade "Crítico"
  Então o sistema deve exigir ao menos 1 foto para concluir
    E o veículo deve assumir o status "Indisponível"
    E devo ver o alerta bloqueante "Veículo indisponível — procure o gestor"
    E não devo conseguir iniciar a viagem
    E o MANAGER deve receber notificação em tempo real

Cenário: Foto obrigatória ausente
  Dado que marquei um item como "Não conforme" com severidade "Crítico"
  Quando eu tentar concluir o checklist sem anexar foto
  Então o envio deve ser bloqueado
    E devo ver a mensagem indicando qual item exige evidência fotográfica

Cenário: Severidade Atenção não bloqueia
  Dado que marquei o item "Freio de serviço" como "Não conforme"
    E selecionei a severidade "Atenção"
  Então a foto deve ser opcional
    E o veículo deve permanecer "Disponível"
    E o veículo deve exibir sinalização de pendência aberta

Cenário: Liberação pelo gestor
  Dado que um veículo está "Indisponível" por item bloqueante crítico
    E estou autenticado como MANAGER
  Quando eu solicitar a liberação
  Então o sistema deve exigir justificativa textual obrigatória
    E ao confirmar, o veículo deve retornar a "Disponível"
    E o registro deve constar no histórico com meu nome, timestamp e a justificativa

Cenário: Operador não pode liberar
  Dado que estou autenticado como OPERATOR
  Quando eu acessar um veículo "Indisponível"
  Então a ação de liberação não deve estar disponível
```

#### US-003 — Receber pendências de manutenção
**Must have · MVP**

> Como **equipe de manutenção**, quero ser notificada imediatamente das irregularidades apontadas, para tratar o problema antes que ele vire quebra em estrada.

```gherkin
Cenário: Notificação de pendência
  Dado que um checklist foi sincronizado com 2 itens "Não conforme"
  Quando o servidor processar o registro
  Então 2 pendências devem ser criadas e vinculadas ao veículo
    E o perfil MAINTENANCE deve receber notificação in-app, e-mail e push
    E MANAGER e OWNER devem ser notificados apenas dos itens com severidade "Crítico"

Cenário: Agrupamento de pendência recorrente
  Dado que existe uma pendência aberta do item "Pneu dianteiro esquerdo" no veículo ABC-1234
  Quando um novo checklist apontar o mesmo item no mesmo veículo
  Então nenhuma pendência nova deve ser criada
    E o contador de recorrência da pendência existente deve ser incrementado
    E as novas fotos devem ser anexadas ao registro existente

Cenário: Conversão em Ordem de Serviço
  Dado que existe uma pendência aberta
    E estou autenticado como MAINTENANCE
  Quando eu acionar "Converter em OS"
  Então uma OS deve ser criada com origem "Checklist"
    E a pendência deve ser vinculada à OS
    E a pendência não deve ser convertida automaticamente em nenhuma outra situação
```

---

### 20.2 Épico: Pergunte à Sua Frota

#### US-004 — Perguntar por voz sobre a frota
**Must have · MVP**

> Como **dono da transportadora**, quero perguntar por voz e ouvir a resposta, para descobrir o que preciso saber sem aprender a usar o sistema.

```gherkin
Cenário: Pergunta dentro do catálogo de intenções
  Dado que estou autenticado como OWNER
    E o módulo "Pergunte à Sua Frota" está incluído no plano do tenant
  Quando eu acionar o microfone e perguntar "qual caminhão gastou mais este mês?"
  Então a pergunta deve ser transcrita e exibida na tela
    E a intenção deve ser classificada como "custo total por veículo/período"
    E a resposta deve ser calculada por função determinística do backend
    E a resposta deve ser exibida em texto e tabela
    E a resposta deve ser falada
    E a fonte e o período considerados devem estar visíveis
    E deve haver um botão de ação contextual "Abrir ficha do veículo"

Cenário: Memória de contexto na sessão
  Dado que perguntei "qual caminhão gastou mais este mês?"
  Quando eu perguntar em seguida "e no mês passado?"
  Então o sistema deve manter a intenção anterior
    E alterar apenas o período consultado

Cenário: Pergunta fora do catálogo
  Quando eu perguntar algo que não corresponde a nenhuma intenção do catálogo
  Então o sistema deve informar que ainda não sabe responder
    E deve sugerir as perguntas mais próximas disponíveis
    E deve registrar a lacuna como insumo de roadmap
    E não deve, em hipótese alguma, gerar um número estimado

Cenário: Pergunta fora do escopo temático
  Quando eu perguntar "qual a capital da França?"
  Então o sistema deve recusar educadamente
    E informar que responde apenas sobre a frota
```

#### US-005 — Impedir vazamento de dado financeiro pela IA
**Must have · MVP · Requisito de segurança bloqueante**

> Como **dono da transportadora**, quero que o assistente respeite exatamente as mesmas restrições da interface, para que nenhum funcionário obtenha por voz o que não pode ver na tela.

```gherkin
Cenário: Operador com visibilidade financeira desativada
  Dado que a flag operator_sees_financials do tenant está desativada
    E estou autenticado como OPERATOR
  Quando eu perguntar "qual o custo por km do caminhão ABC-1234?"
  Então o backend deve bloquear a execução da função antes de chamá-la
    E a resposta deve informar que não tenho permissão para essa informação
    E nenhum valor financeiro, total, parcial, agregado ou aproximado deve ser retornado

Cenário: Tentativa de obtenção indireta
  Dado o mesmo contexto do cenário anterior
  Quando eu perguntar "some o gasto de combustível de todos os veículos e divida pela quilometragem"
  Então a solicitação deve ser igualmente bloqueada
    E o motivo do bloqueio deve ser a permissão, não a formulação da pergunta

Cenário: Módulo fora do plano
  Dado que o módulo "Segurança na Estrada" não está incluído no plano do tenant
  Quando eu perguntar sobre eventos de fadiga
  Então o sistema deve informar que o módulo não está contratado
    E deve oferecer o CTA "Conhecer"
    E nenhum dado do módulo deve ser retornado

Cenário: Anonimização do payload
  Quando qualquer pergunta for enviada ao provedor de LLM
  Então o payload não deve conter nomes de motoristas, CPFs ou placas
    E deve conter identificadores internos
    E a re-hidratação deve ocorrer no backend antes da exibição
```

---

### 20.3 Épico: Segurança na Estrada

#### US-006 — Priorizar câmeras suspeitas para o operador
**Must have · MVP**

> Como **operador de monitoramento**, quero que o sistema me mostre as câmeras com maior chance de problema, para não precisar assistir 80 telas ao mesmo tempo.

```gherkin
Cenário: Priorização do painel de câmeras
  Dado que o tenant possui 60 veículos com câmera conectada
    E o módulo "Segurança na Estrada" está incluído no plano
  Quando eu abrir o painel de monitoramento
  Então devo visualizar as câmeras ordenadas por probabilidade de evento
    E as N câmeras de maior prioridade devem estar em destaque
    E a ordenação deve ser atualizada continuamente

Cenário: Confirmação gera rótulo de treinamento
  Dado que uma câmera está destacada por suspeita de sonolência
  Quando eu confirmar o evento
  Então um evento de severidade "Crítico" deve ser registrado
    E o par (frame, decisão) deve ser persistido para treinamento supervisionado
    E o alerta ao motorista deve ser disparado

Cenário: Descarte pelo operador
  Quando eu descartar uma suspeita
  Então nenhum evento deve ser registrado no histórico do motorista
    E o par (frame, decisão) deve ser persistido como negativo
```

#### US-007 — Ser notificado sem ser soterrado
**Must have · MVP**

> Como **gestor**, quero receber apenas o que exige minha ação agora, para não desligar as notificações e perder o que importa.

```gherkin
Cenário: Evento crítico gera toast imediato
  Dado que estou autenticado como MANAGER com o painel aberto
  Quando um evento de severidade "Crítico" for confirmado
  Então devo receber um toast em até 10 segundos
    E o toast deve conter as ações "Ligar para o motorista" e "Abrir histórico da viagem"
    E o toast deve ser persistido na Central de Notificações

Cenário: Agregação de eventos não críticos
  Dado que a janela de agregação do tenant é de 15 minutos
  Quando o mesmo motorista gerar 4 eventos de "Distração prolongada" dentro da janela
  Então deve ser exibido 1 único toast consolidado
    E o toast deve indicar a quantidade e o motorista

Cenário: Escalonamento por recorrência crítica
  Quando o mesmo motorista acumular 3 eventos críticos em 1 hora
  Então uma ligação automática para o gestor deve ser disparada
    E o escalonamento deve ser registrado no histórico da viagem

Cenário: Evento não crítico não gera toast
  Quando um evento de severidade "Informativo" for registrado
  Então nenhum toast deve ser exibido
    E o evento deve constar no digest diário
```

#### US-008 — Contestar um evento
**Should have · MVP**

> Como **motorista**, quero contestar um evento que considero incorreto, para que minha avaliação não seja prejudicada por um erro do sistema.

```gherkin
Cenário: Abertura de contestação
  Dado que existe um evento atribuído a mim há menos de 90 dias
  Quando eu acionar "Contestar" e informar a justificativa
  Então a contestação deve ser criada com status "Aberta"
    E MANAGER e OWNER devem ser notificados

Cenário: Contestação aceita
  Dado que existe uma contestação "Aberta"
    E estou autenticado como MANAGER
  Quando eu decidir por "Descartada" com justificativa
  Então o evento deve ser excluído do cálculo do meu score de segurança
    E o evento deve ser marcado como falso positivo no dataset de treinamento
    E a decisão deve ser auditada

Cenário: Motorista não acessa evento de terceiro
  Dado que estou autenticado como DRIVER
  Quando eu tentar acessar um evento atribuído a outro motorista
  Então o acesso deve ser negado
```

---

### 20.4 Épico: Abastecimento e Custos

#### US-009 — Lançar abastecimento em menos de 20 segundos
**Must have · MVP**

> Como **operador de escritório**, quero lançar um abastecimento mais rápido do que na minha planilha, para que o sistema não me atrase.

```gherkin
Cenário: Lançamento manual dentro do alvo de esforço
  Dado que estou autenticado como OPERATOR
  Quando eu abrir o formulário de abastecimento
  Então devem ser exibidos no máximo 5 campos obrigatórios
    E o veículo deve ser pré-selecionado quando houver contexto
    E a data deve ser pré-preenchida com a data atual
    E o campo "Completou o tanque?" deve estar presente e ser obrigatório
    E o salvamento deve concluir em menos de 500ms no percentil 95

Cenário: Cálculo de consumo apenas entre tanques completos
  Dado que existe um abastecimento anterior com "Completou o tanque?" igual a Sim
  Quando eu lançar um novo abastecimento com "Completou o tanque?" igual a Sim
  Então o km/l deve ser calculado entre os dois lançamentos
    E o resultado deve compor o consumo médio do veículo

Cenário: Abastecimento parcial
  Quando eu lançar um abastecimento com "Completou o tanque?" igual a Não
  Então o valor deve compor o custo do veículo
    E o lançamento não deve ser utilizado no cálculo de km/l

Cenário: Divergência entre GPS e odômetro
  Dado que a distância registrada por GPS diverge em mais de 5% da variação do odômetro
  Quando o cálculo do período for executado
  Então uma flag de auditoria deve ser criada
    E o gestor deve visualizá-la no detalhe do veículo

Cenário: Operador sem visibilidade financeira
  Dado que a flag operator_sees_financials está desativada
  Quando eu concluir o lançamento
  Então devo conseguir registrar o abastecimento normalmente
    E não devo visualizar o custo por km resultante nem o ranking de custo
```

#### US-010 — Descobrir consumo fora do padrão
**Must have · MVP**

> Como **dono da transportadora**, quero ser avisado quando um caminhão começar a consumir mais do que deveria, para agir antes que vire prejuízo do mês.

```gherkin
Cenário: Anomalia acima do limiar
  Dado que o veículo ABC-1234 possui ao menos 3 abastecimentos completos no período
    E o consumo do período está 12% acima da média dos últimos 90 dias do próprio veículo
  Quando o processamento diário for executado
  Então um alerta deve ser gerado no bloco "Alertas do dia" do Painel do Dono
    E a mensagem deve estar em linguagem de negócio, indicando o percentual
    E deve ser exibido o comparativo com a média dos veículos do mesmo modelo

Cenário: Dado insuficiente
  Dado que o veículo possui menos de 3 abastecimentos completos no período
  Então nenhum alerta de anomalia deve ser gerado

Cenário: Variação abaixo do limiar
  Dado que o consumo está 8% acima do baseline
  Então nenhum alerta deve ser gerado
```

---

### 20.5 Épico: Painel do Dono

#### US-011 — Abrir o painel e entender a operação em segundos
**Must have · MVP**

> Como **dono da transportadora**, quero abrir o painel pela manhã e entender minha operação sem interpretar gráfico, para decidir o que fazer hoje.

```gherkin
Cenário: Hierarquia fixa de leitura
  Dado que estou autenticado como OWNER
  Quando eu abrir o Painel do Dono
  Então os blocos devem aparecer nesta ordem exata:
    | 1 | Dinheiro          |
    | 2 | Alertas do dia    |
    | 3 | Estado da frota   |
    | 4 | Ranking de custo  |
    E a ordem não deve ser reconfigurável
    E o carregamento deve concluir em menos de 2 segundos no percentil 95

Cenário: Acesso pelo celular
  Quando eu abrir o painel em um dispositivo móvel
  Então todos os quatro blocos devem estar plenamente utilizáveis
    E o desempenho deve respeitar RNF-001

Cenário: Integração indisponível
  Dado que a última sincronização com a telemetria ocorreu há 6 horas
  Quando eu abrir o painel
  Então deve ser exibido um banner de dado desatualizado
    E o horário da última sincronização bem-sucedida deve estar visível

Cenário: Operador com visibilidade financeira desativada
  Dado que a flag operator_sees_financials está desativada
    E estou autenticado como OPERATOR
  Quando eu abrir o painel
  Então os blocos "Dinheiro" e "Ranking de custo" não devem ser exibidos
    E não devem existir por meio de URL direta, API ou exportação
```

---

### 20.6 Backlog resumido — demais stories

| ID | Story | Épico | Prioridade | Fase |
|---|---|---|---|---|
| US-012 | Autenticar com CPF e PIN | Auth | Must | MVP |
| US-013 | Provisionar acesso de motorista por QR code | Auth | Must | MVP |
| US-014 | Resetar PIN de motorista pelo painel | Auth | Must | MVP |
| US-015 | Convidar usuário administrativo por e-mail | Auth | Must | MVP |
| US-016 | Configurar visibilidade financeira do operador | Auth | Must | MVP |
| US-017 | Ativar MFA como SUPER_ADMIN | Auth | Must | MVP |
| US-018 | Cadastrar veículo | Cadastros | Must | MVP |
| US-019 | Cadastrar implemento e vincular ao cavalo | Cadastros | Must | MVP |
| US-020 | Cadastrar motorista com dados de CNH | Cadastros | Must | MVP |
| US-021 | Receber alerta de vencimento de CNH | Cadastros | Must | MVP |
| US-022 | Bloquear vinculação de motorista com CNH vencida | Cadastros | Must | MVP |
| US-023 | Cadastrar oficina e fornecedor | Cadastros | Should | MVP |
| US-024 | Criar e iniciar viagem | Viagens | Must | MVP |
| US-025 | Encerrar viagem com km final | Viagens | Must | MVP |
| US-026 | Preencher checklist de devolução | Checklist | Must | MVP |
| US-027 | Configurar blocos opcionais por categoria de veículo | Checklist | Should | MVP |
| US-028 | Visualizar pendências abertas do veículo | Checklist | Must | MVP |
| US-029 | Adotar plano de manutenção do catálogo | Manutenção | Must | MVP |
| US-030 | Configurar antecedência de aviso por plano | Manutenção | Must | MVP |
| US-031 | Receber alerta de manutenção a vencer | Manutenção | Must | MVP |
| US-032 | Abrir Ordem de Serviço | Manutenção | Must | MVP |
| US-033 | Aprovar OS acima do valor-limite | Manutenção | Must | MVP |
| US-034 | Concluir OS e liberar veículo | Manutenção | Must | MVP |
| US-035 | Visualizar percentual de manutenções preventivas em dia | Manutenção | Must | MVP |
| US-036 | Consultar custo por km em camadas | Custos | Must | MVP |
| US-037 | Comparar motoristas por consumo | Custos | Must | MVP |
| US-038 | Enviar foto do cupom de abastecimento | Custos | Should | MVP |
| US-039 | Visualizar o próprio score de segurança | Segurança | Should | MVP |
| US-040 | Visualizar ranking de score da frota | Segurança | Should | MVP |
| US-041 | Aceitar termo de ciência no primeiro acesso | LGPD | Must | MVP |
| US-042 | Consultar Central de Notificações | Notificações | Must | MVP |
| US-043 | Filtrar e arquivar notificações | Notificações | Should | MVP |
| US-044 | Executar wizard de implantação | Onboarding | Must | MVP |
| US-045 | Conectar integração de telemetria | Integrações | Must | MVP |
| US-046 | Importar frota por planilha | Onboarding | Must | MVP |
| US-047 | Importar histórico em lote | Onboarding | Must | MVP |
| US-048 | Editar lançamento com histórico de versões | Transversal | Must | MVP |
| US-049 | Executar fechamento de período | Transversal | Should | MVP |
| US-050 | Visualizar módulo bloqueado com CTA de upgrade | Planos | Should | MVP |
| US-051 | Consultar lucratividade por rota | Custos | — | Fase 2 |
| US-052 | Gerir multas e infrações | Multas | — | Fase 2 |
| US-053 | Gerir pneus individualmente | Pneus | — | Fase 2 |
| US-054 | Detectar eventos automaticamente por visão computacional | Segurança | — | Fase 2 |
| US-055 | Receber notificação por WhatsApp | Notificações | — | Fase 2 |
| US-056 | Ler cupom fiscal por OCR | Custos | — | Fase 2 |
| US-057 | Gerar relatório para embarcador | Relatórios | — | Fase 2 |

---

## Anexo A — Matriz RBAC

**Legenda:** ✅ total · 🔸 apenas próprios registros · ⚙️ condicionado à flag `operator_sees_financials` · ❌ sem acesso

| Recurso / Ação | SUPER_ADMIN | OWNER | MANAGER | OPERATOR | DRIVER | MAINTENANCE |
|---|---|---|---|---|---|---|
| **Tenant e faturamento** | | | | | | |
| Gerenciar plano e módulos | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Configurações do tenant | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Flag de visibilidade financeira | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Usuários** | | | | | | |
| Convidar usuário administrativo | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Criar motorista / gerar QR code | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Resetar PIN de motorista | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Inativar usuário | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Cadastros** | | | | | | |
| Veículos e implementos (CRUD) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Motoristas (CRUD) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Oficinas e fornecedores | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Viagens** | | | | | | |
| Criar e planejar viagem | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Visualizar viagem | ✅ | ✅ | ✅ | ✅ | 🔸 | ❌ |
| **Checklist** | | | | | | |
| Preencher checklist | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Visualizar checklist | ✅ | ✅ | ✅ | ✅ | 🔸 | ✅ |
| Configurar template | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Bloqueio de veículo** | | | | | | |
| Liberar veículo bloqueado | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Manutenção** | | | | | | |
| Gerir planos de manutenção | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Criar / editar OS | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Aprovar OS acima do limite | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Definir valor-limite de aprovação | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Tratar pendências | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Custos** | | | | | | |
| Lançar abastecimento | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Enviar foto de cupom | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Visualizar custo por km | ✅ | ✅ | ✅ | ⚙️ | ❌ | ❌ |
| Visualizar ranking de custo | ✅ | ✅ | ✅ | ⚙️ | ❌ | ❌ |
| Executar fechamento de período | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Segurança na Estrada** | | | | | | |
| Painel de monitoramento | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Confirmar / descartar suspeita | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Visualizar imagem do motorista | ✅ | ✅ | ✅ | ❌ | 🔸 | ❌ |
| Abrir contestação | ❌ | ❌ | ❌ | ❌ | 🔸 | ❌ |
| Decidir contestação | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Visualizar score de segurança | ✅ | ✅ | ✅ | ❌ | 🔸 | ❌ |
| **Painel do Dono** | | | | | | |
| Bloco Dinheiro | ✅ | ✅ | ✅ | ⚙️ | ❌ | ❌ |
| Bloco Alertas do dia | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Bloco Estado da frota | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Bloco Ranking de custo | ✅ | ✅ | ✅ | ⚙️ | ❌ | ❌ |
| **Assistente de IA** | | | | | | |
| Perguntar por texto | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Perguntar por voz | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Sistema** | | | | | | |
| Acesso cross-tenant | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Wizard de implantação | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Importação em lote | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Log de auditoria | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Anexo B — Glossário de Domínio

| Termo | Definição |
|---|---|
| **Tenant** | Transportadora cliente. Unidade de isolamento de dados |
| **Entitlement** | Direito de uso de um módulo, concedido pelo plano contratado |
| **Cavalo mecânico** | Veículo trator, responsável pela tração |
| **Implemento / carreta** | Unidade rebocada. Cadastrada como veículo independente |
| **Composição** | Vínculo vigente entre cavalo e um ou mais implementos |
| **Checklist de saída** | Verificação preventiva antes da partida |
| **Checklist de devolução** | Verificação diagnóstica na entrega do veículo |
| **Item bloqueante** | Item do template cuja não conformidade crítica torna o veículo indisponível |
| **Pendência** | Registro de não conformidade apontada em checklist |
| **OS** | Ordem de Serviço de manutenção |
| **Custo variável por km** | Camada A: combustível, ARLA, pneu e manutenção sobre km rodados |
| **Tanque completo** | Abastecimento que enche o tanque, base para o cálculo de km/l |
| **Baseline de consumo** | Média móvel de 90 dias do próprio veículo entre tanques completos |
| **DMS** | Driver Monitoring System — sistema de monitoramento do condutor |
| **Copiloto do operador** | Modo de operação do MVP em que o sistema prioriza câmeras e o humano decide |
| **Score de segurança** | Nota de 0 a 100 por motorista, de fórmula fixa e auditável |
| **Digest diário** | Consolidação diária de eventos não críticos |
| **Camada de anticorrupção** | Adaptador que traduz o formato de um fornecedor para o modelo canônico |
| **Modelo canônico** | Representação interna do RookHub, independente de fornecedor |

---

## Anexo C — Máquinas de Estado

### C.1 Veículo

```
                    ┌──────────────┐
          ┌────────►│  Disponível  │◄────────┐
          │         └──────┬───────┘         │
          │                │                 │
          │        início de viagem          │ conclusão da OS
          │                ▼                 │ (sem pendência bloqueante)
          │         ┌──────────────┐         │
          │         │  Em viagem   │         │
          │         └──────┬───────┘         │
          │                │                 │
          │        término de viagem         │
          │                │                 │
          │                ▼                 │
          │         ┌──────────────┐    ┌────┴─────────────┐
          │         │  Disponível  │───►│ Em manutenção    │
          │         └──────────────┘    └──────────────────┘
          │                                   ▲
          │                          OS em execução
          │
   liberação com                ┌──────────────────┐
   justificativa ───────────────│   Indisponível   │◄─── item bloqueante
   (MANAGER/OWNER)              └──────────────────┘     crítico no checklist

   Qualquer estado ──── inativação ────► ┌──────────┐
                                          │ Inativo  │
                                          └──────────┘
```

**Transições restritas:**
- `Indisponível` → `Disponível` exige justificativa obrigatória de `MANAGER` ou `OWNER`
- `Em manutenção` → `Disponível` só ocorre se não houver pendência bloqueante crítica aberta
- `Inativo` é terminal para fins operacionais; o histórico é preservado

### C.2 Ordem de Serviço

```
┌────────┐   custo ≤ limite    ┌───────────┐   ┌──────────────┐   ┌────────────┐
│ Aberta │────────────────────►│ Aprovada  │──►│ Em execução  │──►│ Concluída  │
└───┬────┘                     └───────────┘   └──────────────┘   └────────────┘
    │                                ▲
    │  custo > limite                │
    └───── aguarda aprovação ────────┘
           (MANAGER/OWNER)

  Qualquer estado não concluído ──────► ┌────────────┐
                                        │ Cancelada  │
                                        └────────────┘
```

### C.3 Contestação de Evento

```
┌────────┐   decisão do gestor   ┌───────────┐
│ Aberta │──────────────────────►│  Mantida  │  → evento permanece no score
└───┬────┘                       └───────────┘
    │
    │  decisão do gestor          ┌─────────────┐
    └────────────────────────────►│ Descartada  │  → evento sai do score
                                  └─────────────┘     e vira rótulo negativo
```

### C.4 Viagem

```
┌───────────┐    ┌───────────────┐    ┌────────────┐
│ Planejada │───►│ Em andamento  │───►│ Concluída  │
└─────┬─────┘    └───────┬───────┘    └────────────┘
      │                  │
      └──────────────────┴──────────► ┌────────────┐
                                      │ Cancelada  │
                                      └────────────┘
```

---

## Anexo D — Modelo de Dados Conceitual

> Todas as entidades de domínio carregam `tenant_id NOT NULL` com política RLS. Todas carregam `created_at`, `updated_at`, `deleted_at` (soft delete) e `created_by`.

**Núcleo**
- `tenant` — transportadora
- `tenant_settings` — flags (`operator_sees_financials`, janela de agregação, limiares)
- `tenant_modules` — entitlements, com FK opcional para `vehicle` (preparo Fase 2)
- `user` — usuário, com `role` e provedor de identidade
- `audit_log` — registro imutável

**Frota**
- `vehicle` — veículo (cavalo, implemento, truck, toco, VUC)
- `vehicle_composition` — vínculo cavalo ↔ implemento com vigência
- `vehicle_status_history` — transições de estado com autor e justificativa
- `driver` — motorista
- `driver_document` — documento genérico com validade (CNH, e futuros toxicológico/ASO)
- `workshop`, `supplier`

**Operação**
- `trip` — viagem
- `trip_event` — ocorrência de viagem

**Checklist**
- `checklist_template` — versionado, com tipo (saída/devolução)
- `checklist_template_section`
- `checklist_template_item` — com `blocking`, tipo de resposta, categoria de veículo
- `checklist_submission` — com `filled_at`, `received_at`, flags de auditoria
- `checklist_answer`
- `checklist_photo` — referência à mídia
- `pendency` — com `recurrence_count`

**Custos**
- `fueling` — abastecimento, com `full_tank` booleano e `currency`
- `cost_entry` — lançamento genérico de custo com categoria
- `odometer_reading` — leitura com origem (telemetria / GPS / manual)
- `consumption_baseline` — baseline calculado por veículo

**Manutenção**
- `maintenance_plan` — com gatilhos de km, dias e horímetro
- `maintenance_plan_catalog` — catálogo RookHub versionado por marca/modelo
- `work_order` — OS
- `work_order_item` — peças e mão de obra

**Segurança**
- `safety_event` — evento com tipo, severidade, `media_url`, decisão do operador
- `safety_event_label` — par (frame, decisão) para treinamento
- `safety_dispute` — contestação
- `driver_safety_score` — score calculado por período

**IA**
- `ai_conversation` — sessão, retenção de 30 dias
- `ai_message` — turno, com intenção classificada e função executada
- `ai_intent_gap` — lacunas registradas para roadmap

**Integrações**
- `integration_connection` — credenciais por tenant e fornecedor
- `integration_sync_log` — com `last_successful_sync_at`
- `raw_event` — payload bruto do fornecedor, antes da tradução canônica

**Notificações**
- `notification` — global, multi-módulo, com estado e ação embutida

---

## Anexo E — Riscos e Premissas a Validar

### E.1 Premissas a validar

| ID | Premissa | Impacto se falsa | Prazo |
|---|---|---|---|
| **PRM-001** | O plano Powerfleet Unity da âncora inclui, ou pode incluir mediante upgrade, o produto de vídeo com IA com alerta ao motorista em tempo real, e expõe esses eventos por API a parceiros | **Crítico.** Determina se a RookHub precisa desenvolver hardware próprio. Bloqueia `SEG-13` | 1 semana |
| **PRM-002** | O Hik-Connect permite acesso programático a stream ou snapshot das câmeras instaladas, por API ou ISAPI | **Crítico.** Sem isso, o copiloto do operador (`RN-080`) é inviável no MVP | 2 semanas |
| **PRM-003** | Eagletrack possui API pública documentada | Alto. Exigiria integração alternativa ou scraping | 2 semanas |
| **PRM-004** | TruckPag possui API de extrato de abastecimentos | Alto. Recairia sobre lançamento manual, ameaçando `RNF-006` | 2 semanas |
| **PRM-005** | A frota da âncora possui volume suficiente de eventos rotulados em 6 meses para viabilizar o modelo próprio da Fase 2 | Médio. Adiaria `RN-081` | 6 meses |
| **PRM-006** | O perfil de 20 a 80 caminhões aceita monitoramento por copiloto humano no MVP, sem exigir detecção automática | Alto. Alteraria a proposta comercial do módulo | Durante a validação de vendas |

### E.2 Riscos

| ID | Risco | Prob. | Impacto | Mitigação |
|---|---|---|---|---|
| **RSC-001** | RookHub se transformar em fabricante de hardware antes de ter escala de software | Média | Crítico | `RN-086` suspende a decisão até `PRM-001` |
| **RSC-002** | Operador abandonar o sistema por excesso de trabalho de lançamento | Média | **Crítico** — é o maior risco do produto | `RNF-006` como métrica bloqueante de release; teste cronometrado a cada versão |
| **RSC-003** | Fadiga de alerta levar o gestor a desativar Segurança na Estrada | Alta | Alto | `RN-087` a `RN-090`: toast só para crítico + agregação |
| **RSC-004** | Assistente de IA vazar dado financeiro por brecha de permissão | Baixa | **Crítico** | `RN-118` e `RN-119`: verificação no backend, nunca por prompt. Teste de segurança dedicado |
| **RSC-005** | IA responder com número incorreto durante demonstração comercial | Média | Crítico | `RN-107`: function calling exclusivo, text-to-SQL proibido |
| **RSC-006** | Motorista não preencher o checklist, derrubando o pilar de manutenção | Média | Crítico | Offline integral, foto só quando crítica, câmera nativa, sessão de 90 dias |
| **RSC-007** | Falso positivo de detecção destruir a confiança do motorista | Alta | Alto | `RN-095` a `RN-098`: canal de contestação desde o MVP |
| **RSC-008** | Plano de manutenção incorreto no catálogo gerar responsabilidade | Baixa | Alto | `RN-074`: catálogo como sugestão editável, com aviso de confirmação no manual |
| **RSC-009** | Reescrita do núcleo ao integrar o segundo cliente com outro rastreador | Média | Alto | `RN-138`: camada de anticorrupção obrigatória |
| **RSC-010** | Ação trabalhista relativa ao monitoramento por imagem | Média | Alto | `RN-143` a `RN-148` + validação jurídica obrigatória antes do go-live |
| **RSC-011** | Contraste insuficiente no glassmorphism prejudicar leitura de dados densos | Alta | Médio | `RNF-028` e `RNF-029` |
| **RSC-012** | Custo de LLM crescer além do previsto | Baixa | Médio | Voz restrita a `OWNER`/`MANAGER`; monitoramento de consumo por tenant (`RN-123`) |
| **RSC-013** | Dependência de fornecedor único de telemetria em cliente futuro | Média | Médio | Modelo canônico permite novo adaptador sem alterar o núcleo |

---

## Anexo F — Rastreabilidade de Decisões

| ID | Decisão | Seção |
|---|---|---|
| RBAC-01 | Shared DB + `tenant_id` com RLS | 4 |
| RBAC-02 | 6 papéis fixos | 3, Anexo A |
| RBAC-03 | Visibilidade financeira configurável, default oculto | 5 |
| AUTH-01 | E-mail/SSO para web, CPF+PIN para motorista | 5 |
| AUTH-02 | Sessão 12h web, 90 dias motorista | 5 |
| AUTH-03 | Recuperação por e-mail e reset de PIN pelo painel | 5 |
| AUTH-04 | Convite por e-mail com papel pré-definido | 5 |
| AUTH-05 | Anonimização do motorista desligado | 5, 19 |
| PLAN-01 | Módulo bloqueado visível com CTA | 4 |
| PLAN-02 | MFA obrigatório apenas para SUPER_ADMIN | 5 |
| PLAN-03 | Usuários ilimitados | 5 |
| PLAN-04 | Entitlement por tenant inteiro no MVP | 4 |
| CHK-01 a CHK-13 | Checklist Digital | 8 |
| CUS-01 a CUS-06 | Custos e abastecimento | 9 |
| MAN-01 a MAN-05 | Manutenção | 10 |
| PNE-01 | Pneu como categoria de custo | 9 |
| SEG-01 a SEG-14 | Segurança na Estrada | 11 |
| IA-01 a IA-10 | Assistente de IA | 13 |
| INT-01 a INT-04 | Integrações | 17 |
| GER-01 a GER-04 | Regras transversais | 16 |
| OFF-01 | Fila offline | 18.2 |
| LGPD-01 a LGPD-06 | Privacidade e continuidade | 19, 18.5 |
| NOT-01 | Central de Notificações global | 14 |
| ONB-01 | Wizard de implantação | 15 |

---

## Anexo G — Definição de Pronto (Definition of Done)

Uma story só é considerada concluída quando:

1. Critérios de aceite em Gherkin implementados e automatizados
2. Cobertura de teste da regra de negócio associada
3. Verificação de RBAC e entitlement testada, incluindo tentativa de acesso indevido
4. Teste de RLS confirmando isolamento entre tenants
5. Conformidade com `DESIGN.md` validada pelo time de design
6. Alvos de desempenho aplicáveis medidos e atendidos
7. Comportamento offline verificado, quando aplicável
8. Log de auditoria emitido, quando a ação for auditável
9. Documentação de API atualizada
10. Nenhuma regressão em `RNF-006` (esforço do operador)

---

*Fim do documento.*
