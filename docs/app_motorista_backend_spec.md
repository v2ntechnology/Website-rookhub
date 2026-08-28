# App do Motorista — Especificação de Backend e Arquitetura de APIs

**Produto:** RookHub — Plataforma inteligente de gestão de frotas
**Escopo deste documento:** superfície de API que sustenta o PWA do motorista (`apps/driver`)
**Público-alvo:** equipe de backend (Java 21 · Spring Boot 3.x · Spring Modulith) e equipe de frontend mobile
**Idioma do produto:** pt-BR · **Fuso:** America/Sao_Paulo · **Armazenamento:** UTC (RNF-017)

---

## 0. Controle do Documento

| Campo | Valor |
|---|---|
| Identificador | `DRV-SPEC` |
| Versão | 1.0 |
| Status | Proposto — aguardando aprovação |
| Documentos-fonte | `prd_RookHub.md`, `arquitetura_e_decisoes_tecnicas_RookHub.md`, `arquitetura_fsd_RookHub.md`, `visao_e_escopo_negocio_RookHub.md` |
| Documentos irmãos | `app_motorista_contratos_api.md` (`DRV-API`), `app_motorista_regras_negocio_uc.md` (`DRV-RN`) |

### 0.1 Convenções

- **DEVE / NÃO DEVE / PODE** seguem RFC 2119.
- Requisitos herdados do PRD são citados pelo código original (`RN-xxx`, `RF-xxx`, `RNF-xxx`).
- Requisitos **novos**, específicos do app do motorista, recebem o prefixo `RN-D-xxx` e `RNF-D-xxx` e são detalhados em `DRV-RN`.
- Decisões de API recebem o prefixo `API-Dxx`.

### 0.2 Conflitos — todos resolvidos

| # | Conflito | Decisão | Status |
|---|---|---|---|
| **CF-01** | `apps/driver` excluído da Fase 1 pelo frontend-first | **`EXE-02`** — o App do Motorista sai do frontend-first e passa a backend-first/contrato-first. `apps/web` e `apps/site` permanecem em `EXE-01`. As 7 telas já estão prototipadas, então a premissa de `EXE-01` não se aplica a este app | ✅ Resolvido |
| **CF-02** | O `DRIVER` não pode lançar abastecimento (Anexo A) | **Apenas foto de cupom.** O endpoint estruturado foi removido; resta `POST /fuel/receipts`, evidência pura (ver §7) | ✅ Resolvido |
| **CF-03** | GPS do aparelho × telemetria do fornecedor (RN-059) | Telemetria do fornecedor é a fonte do Mapa. GPS do aparelho fica **desativado por padrão**, com ativação por veículo sem telemetria instalada (ver §8) | ✅ Resolvido |
| **CF-04** | Tela de "register" no app | Confirmado que é **ativação por QR + definição de PIN** — `POST /auth/device/activate`. Não existe autocadastro de motorista (RN-008, RN-014) | ✅ Sem conflito |
| **CF-05** | Crescimento do checklist após o go-live | Confirmado que o front **renderiza a partir de `GET /checklists/template`**. Item novo é versão de template (RN-033), não deploy do PWA | ✅ Sem conflito |

---

## 1. Princípios que governam esta API

O PWA do motorista não é uma versão reduzida do painel. Ele opera sob restrições antagônicas às do escritório (`FE-05`), e a API precisa refletir isso.

1. **O motorista nunca espera pela rede.** Toda escrita relevante é local primeiro e sincronizada depois. A API é o destino da fila, não o caminho crítico da interação.
2. **O servidor é a autoridade** (RN-053). O app propõe; o servidor decide e responde com o estado real.
3. **Idempotência não é otimização, é correção.** Toda escrita carrega `client_uuid` (UUID v7) gerado no aparelho. Reenvio jamais duplica.
4. **Dois relógios, dois campos** (RN-054). `filled_at` (aparelho) e `received_at` (servidor) são persistidos separadamente e nunca sobrescritos.
5. **Payload magro.** O alvo é 3G em rodovia. Nenhum endpoint do motorista retorna dado que a tela não usa.
6. **O motorista vê apenas o que é dele.** O escopo `🔸 apenas próprios registros` do Anexo A é aplicado no backend, não na interface.
7. **Nada de dado financeiro.** O `DRIVER` não acessa custo por km, ranking, margem ou consolidado — nem direta, nem agregada, nem indiretamente.

---

## 2. Superfície de API — inventário

Prefixo comum: `/api/v1/driver` — versionamento por caminho conforme `BE-04`.

| # | Método e caminho | Tela | Offline |
|---|---|---|---|
| 1 | `POST /auth/device/activate` | Login (1º acesso, QR) | Não |
| 2 | `POST /auth/login` | Login | Sim (validação local de PIN) |
| 3 | `POST /auth/refresh` | — | Não |
| 4 | `POST /auth/logout` | Perfil | Não |
| 5 | `GET /consent-term` · `POST /consent-term/accept` | Login (1º acesso) | Não |
| 6 | `GET /home` | Home | Leitura de cache |
| 7 | `GET /vehicles/{vehicleId}/pendencies` | Home · Checklist | Leitura de cache |
| 8 | `GET /checklists/template` | Checklist | Leitura de cache (ETag) |
| 9 | `POST /checklists` | Checklist | **Sim — fila** |
| 10 | `GET /checklists` · `GET /checklists/{id}` | Perfil · Home | Leitura de cache |
| 11 | `POST /media/upload-intents` | Checklist · Abastecer · Viagem | Não (fotos aguardam rede) |
| 12 | `POST /media/confirm` | idem | Não |
| 13 | `POST /trips/{tripId}/start` | Viagem | **Sim — fila** |
| 14 | `POST /trips/{tripId}/pause` · `/resume` | Viagem | **Sim — fila** |
| 15 | `POST /trips/{tripId}/finish` | Viagem | **Sim — fila** |
| 16 | `POST /trips/{tripId}/events` | Viagem · Mapa | **Sim — fila** |
| 17 | `POST /telemetry/location` | Mapa | Sim — buffer circular |
| 18 | `POST /fuel/receipts` | Abastecer | **Sim — fila** |
| 19 | `GET /profile` | Perfil | Leitura de cache |
| 20 | `GET /performance` | Perfil | Leitura de cache |
| 21 | `GET /safety/events` · `POST /safety/events/{id}/dispute` | Perfil | Não |
| 22 | `GET /notifications` · `POST /notifications/{id}/read` | Home | Leitura de cache |
| 23 | `POST /sync/batch` | Transversal | — |
| 24 | `GET /bootstrap` | Pós-login | Não |

Contratos completos de requisição e resposta em `app_motorista_contratos_api.md`.

---

## 3. Padrões de comunicação

### `API-D01` — Transporte e formato

| Item | Definição |
|---|---|
| Protocolo | HTTPS, TLS 1.2+ (RNF-018) |
| Formato | `application/json; charset=utf-8` |
| Compressão | `Accept-Encoding: gzip, br` obrigatório no cliente |
| Datas | ISO-8601 com offset explícito — `2026-08-16T04:12:33-03:00` |
| Identificadores | UUID v7 em todas as entidades |
| Valores monetários | Inteiro em centavos + campo `currency` (RN-132), sempre `"BRL"` no MVP |
| Coordenadas | `decimal` com 6 casas |
| Enumerações | `SCREAMING_SNAKE_CASE`, estáveis, nunca traduzidas no payload |

> **Regra dura:** rótulos em português vivem no app, nunca no contrato. `CONFORME`, `NAO_CONFORME` e `NAO_APLICAVEL` são chaves; a tradução é responsabilidade da camada de apresentação.

### `API-D02` — Cabeçalhos

**Requisição:**

| Cabeçalho | Obrigatoriedade | Descrição |
|---|---|---|
| `Authorization: Bearer <access_token>` | Sempre, exceto ativação e login | JWT de acesso |
| `Idempotency-Key` | **Obrigatório em todo POST de criação** (`BE-04`) | Igual ao `client_uuid` do registro |
| `X-Device-Id` | Sempre | Identificador do aparelho, emitido na ativação |
| `X-Client-Version` | Sempre | Versão do PWA, ex.: `driver/1.4.2` |
| `X-Request-Id` | Recomendado | Correlação em log e trace |
| `If-None-Match` | Em `GET /checklists/template` | Cache condicional |

**Resposta:**

| Cabeçalho | Descrição |
|---|---|
| `X-Request-Id` | Ecoado ou gerado |
| `ETag` | Recursos cacheáveis |
| `Retry-After` | Em `429` e `503` |
| `X-Server-Time` | Timestamp do servidor — usado pelo app para calcular a deriva do relógio local |

> `X-Server-Time` é o que permite ao app **avisar o motorista** antes de o desvio de relógio virar flag de auditoria (RN-054). Prevenir é melhor que sinalizar.

### `API-D03` — Erros no padrão RFC 9457

Todo erro retorna `application/problem+json`.

```json
{
  "type": "https://api.rookhub.com.br/problems/checklist-photo-required",
  "title": "Evidência fotográfica obrigatória",
  "status": 422,
  "detail": "O item 'Freio de serviço' foi marcado como Crítico e exige ao menos 1 foto.",
  "instance": "/api/v1/driver/checklists",
  "requestId": "0191f2c4-...",
  "errors": [
    {
      "field": "answers[7].photos",
      "code": "PHOTO_REQUIRED_FOR_CRITICAL",
      "itemId": "0191e0aa-...",
      "itemLabel": "Freio de serviço"
    }
  ]
}
```

**Catálogo mínimo de `type`:**

| Código | HTTP | Situação |
|---|---|---|
| `invalid-credentials` | 401 | CPF ou PIN incorretos |
| `account-locked` | 423 | 5 tentativas incorretas (RN-010) |
| `device-not-bound` | 403 | Aparelho não vinculado ao motorista (RNF-012) |
| `activation-token-expired` | 410 | QR code expirado ou já usado (RN-008) |
| `consent-term-required` | 428 | Termo de ciência pendente (RN-144) |
| `driver-license-expired` | 409 | CNH vencida (RN-024) |
| `vehicle-unavailable` | 409 | Veículo `Indisponível` ou `Em manutenção` |
| `checklist-photo-required` | 422 | RN-038 |
| `checklist-template-outdated` | 409 | Versão de template obsoleta |
| `odometer-inconsistent` | 422 | RN-D-014 |
| `trip-invalid-transition` | 409 | Transição fora da máquina de estados (RN-026) |
| `idempotency-conflict` | 409 | Mesma chave, payload divergente |
| `entitlement-missing` | 403 | Módulo não contratado (RF-002) |
| `rate-limited` | 429 | RNF-021 |
| `period-closed` | 409 | Período fechado (RN-135) |

**Contrato de comportamento do app:** `4xx` que não seja `408`, `423`, `429` é **erro permanente** — o item sai da fila e vai para "Requer atenção", nunca reenviado em laço. `408`, `429`, `5xx` e falha de rede são **transitórios** — permanecem na fila com backoff.

### `API-D04` — Idempotência

1. `Idempotency-Key` é obrigatório em todo POST de criação e DEVE ser igual ao `client_uuid` do registro.
2. A chave é armazenada com escopo `(tenant_id, driver_id, endpoint, key)` e TTL de **7 dias** — alinhado à capacidade da fila (RNF-010).
3. Repetição com **payload idêntico** retorna a resposta original com `200` e `Idempotent-Replay: true`.
4. Repetição com **payload divergente** retorna `409 idempotency-conflict`. O servidor é a autoridade (RN-053).
5. Nenhum efeito colateral — notificação, pendência, mudança de status de veículo — pode ser disparado duas vezes pela mesma chave.

### `API-D05` — Paginação e limites

Cursor opaco, conforme `BE-04`:

```
GET /api/v1/driver/checklists?limit=20&cursor=eyJpZCI6...
```

```json
{ "items": [], "nextCursor": "eyJpZCI6...", "hasMore": true }
```

`limit` default 20, máximo 50 — teto deliberadamente baixo para 3G.

### `API-D06` — Rate limiting (RNF-021)

| Grupo | Limite por motorista |
|---|---|
| `POST /auth/login` | 10 / 15 min |
| `POST /telemetry/location` | 120 / hora (lote de até 60 pontos) |
| `POST /media/upload-intents` | 200 / hora |
| Escritas de domínio (checklist, viagem, abastecimento) | 60 / hora |
| Leituras | 600 / hora |

Excedido: `429` com `Retry-After`. O app trata como transitório. Limite adicional por tenant é aplicado na borda.

---

## 4. Autenticação, tenant e autorização

### `API-D07` — Fluxo de acesso do motorista

O motorista **não tem e-mail e não tem senha** (RF-003). O acesso é CPF + PIN de 6 dígitos, provisionado por QR code.

```
┌────────────────────────────────────────────────────────────────┐
│ 1. OPERATOR/MANAGER gera QR code no painel (RN-008)            │
│    → activation_token · uso único · expira em 48h              │
├────────────────────────────────────────────────────────────────┤
│ 2. Motorista escaneia → POST /auth/device/activate             │
│    → define PIN de 6 dígitos                                   │
│    → recebe device_token (90 dias) + access_token (15 min)     │
│    → vínculo device↔driver é ÚNICO (RNF-012)                   │
├────────────────────────────────────────────────────────────────┤
│ 3. Termo de ciência LGPD (RN-144) — bloqueante                 │
│    → POST /consent-term/accept                                 │
├────────────────────────────────────────────────────────────────┤
│ 4. Aberturas seguintes → POST /auth/login (CPF + PIN)          │
│    → offline: validação contra hash Argon2id em cache (RN-009) │
├────────────────────────────────────────────────────────────────┤
│ 5. Renovação silenciosa → POST /auth/refresh (device_token)    │
└────────────────────────────────────────────────────────────────┘
```

**Camadas de token:**

| Token | Duração | Armazenamento | Rotação |
|---|---|---|---|
| `access_token` (JWT) | 15 min | Memória — nunca em IndexedDB | A cada refresh |
| `device_token` | **90 dias** (RF-005) | IndexedDB, cifrado | Rotativo, revogável |
| Hash local do PIN | Vida do vínculo | IndexedDB (Argon2id, RN-009) | Invalidado em reset de PIN |

> **RN-012 é requisito funcional, não conveniência.** O checklist ocorre em pátio, de madrugada, sem sinal. Sessão curta inviabiliza o pilar de Manutenção Preventiva. Os 90 dias não são negociáveis por política genérica de segurança.

**Claims do `access_token`:**

```json
{
  "sub": "0191e0aa-...",
  "tenant_id": "0191d900-...",
  "role": "DRIVER",
  "driver_id": "0191e0bb-...",
  "device_id": "0191e0cc-...",
  "entitlements": ["MAINTENANCE", "COST", "SAFETY"],
  "consent_version": "2026-05-01",
  "jti": "0191f2c4-...",
  "iat": 1755300000,
  "exp": 1755300900
}
```

### `API-D08` — Tenant nunca vem do cliente

**Regra inegociável.** O `tenant_id` é lido **exclusivamente** do claim do JWT. Nenhum endpoint aceita tenant por cabeçalho, query ou corpo. Um cabeçalho `X-Tenant-Id` presente na requisição é ignorado e registrado como anomalia de segurança.

Toda requisição autenticada abre transação por `TenantContext.withTenant()` (`BE-14`) — ponto único de acesso ao banco, com `set_config(..., true)` de escopo transacional. RLS ativa e `FORCE ROW LEVEL SECURITY` em toda tabela tocada por esta API.

**RN-007** — CPF é único **por tenant**, não globalmente. O login exige, portanto, resolução de tenant:

- **Caminho normal:** o aparelho já está vinculado; `X-Device-Id` resolve o tenant antes da validação do PIN.
- **CPF em dois tenants sem aparelho vinculado:** o endpoint retorna `300` com a lista de transportadoras (`tenantId` + nome fantasia) e o app pede a escolha. Nenhum dado além do nome é exposto antes da autenticação.

### `API-D09` — Autorização em duas camadas

Toda rota executa, no backend, **antes** de qualquer acesso a dado (`BE-14`):

```java
@RequiresEntitlement(Module.MAINTENANCE)   // o plano contratado inclui?
@PreAuthorize("hasRole('DRIVER')")         // o papel pode executar?
```

**Escopo `🔸 apenas próprios registros`** — o filtro por `driver_id` do token é aplicado no repositório, não no controller. Um motorista que altere o `driverId` da query recebe `404`, nunca `403`: a existência do recurso alheio não é confirmada.

**Mapa de permissões do `DRIVER`** (extraído do Anexo A):

| Recurso | Permissão |
|---|---|
| Preencher checklist | ✅ |
| Visualizar checklist | 🔸 próprios |
| Visualizar viagem | 🔸 próprias |
| Enviar foto de cupom | ✅ |
| Lançar abastecimento | ❌ → ver §7 |
| Visualizar custo por km / ranking | ❌ |
| Liberar veículo bloqueado | ❌ |
| Visualizar imagem do motorista | 🔸 próprias |
| Abrir contestação | 🔸 próprios eventos |
| Visualizar score de segurança | 🔸 próprio |
| Tratar pendências / criar OS | ❌ |

### `API-D10` — Termo de ciência LGPD como gate

Enquanto `consent_accepted_at` estiver nulo **ou** a versão aceita for anterior à vigente, toda rota que não seja de autenticação ou do próprio termo retorna:

```
428 Precondition Required · type: consent-term-required
```

O aceite registra data, versão do termo e IP (RN-144). O motorista **pode** recusar — e nesse caso o app exibe orientação para procurar o gestor, sem acesso funcional. Recusa não gera bloqueio de conta.

---

## 5. Mecanismo offline-first

Requisito central. Sem ele, o pilar de Manutenção Preventiva não existe (RN-052, RNF-009 a RNF-013).

### 5.1 Cobertura obrigatória (RNF-009)

| Funcionalidade | Offline |
|---|---|
| Checklist de saída e devolução, integral | **Sim** |
| Captura de fotos | **Sim** |
| Ocorrências de viagem | **Sim** |
| Consulta a pendências abertas do veículo | **Sim** |
| Início / pausa / término de viagem | **Sim**, com reconciliação |
| Declaração de abastecimento | **Sim** |
| Autenticação por PIN | **Sim** (RN-009) |
| Contestação de evento de segurança | Não — exige o evento do servidor |
| Desempenho e score | Não — leitura de cache com marcação de data |

### 5.2 Fila local

Persistida em IndexedDB via Dexie (`FE-08`), com o esquema já definido na arquitetura.

**Regras da fila:**

| Regra | Definição |
|---|---|
| `RNF-010` | Capacidade: 7 dias · 20 checklists · 100 fotos |
| `RNF-011` | **Dados estruturados sobem antes das fotos**, sempre |
| `RNF-013` | Indicador visual permanente: online / offline / N itens pendentes |
| `RN-D-002` | Ao atingir 20 checklists pendentes, novo checklist é bloqueado com aviso de sincronização |
| `RN-D-003` | Backoff exponencial com jitter: 5s · 15s · 60s · 5min · 15min · 1h, teto de 6h |
| `RN-D-004` | Após 7 dias sem sucesso, o item vai para "Requer atenção" e o motorista é orientado a procurar o escritório — **nunca descartado silenciosamente** |
| `RN-D-005` | Ordem de envio dentro do mesmo tipo é FIFO por `filled_at` |

**Prioridades:**

```
P0  Checklist com item bloqueante crítico   → veículo será bloqueado (RN-043)
P1  Demais checklists · transições de viagem
P2  Ocorrências de viagem · declarações de abastecimento
P3  Fotos (Background Sync do Workbox)
P4  Telemetria em buffer
```

> A prioridade P0 tem razão de negócio: enquanto o checklist não chega, existe um caminhão com freio comprometido que o sistema considera disponível. Esse é o pior estado possível do produto.

### 5.3 Sincronização em lote

`POST /api/v1/driver/sync/batch` envia até 20 operações e responde **`207 Multi-Status`**, com resultado individual por operação. Uma falha não derruba o lote.

```
Aparelho                              Servidor
   │  POST /sync/batch (20 ops)          │
   │ ───────────────────────────────────►│
   │                                     │ para cada op:
   │                                     │  ├ valida idempotência
   │                                     │  ├ withTenant() → RLS
   │                                     │  ├ aplica regra de negócio
   │                                     │  └ registra received_at
   │  ◄─────────────────── 207 ──────────│
   │  { results: [ {clientUuid, status, resource | problem} ] }
   │
   │  aplica resultados:
   │   ├ 2xx → remove da fila
   │   ├ 4xx permanente → "Requer atenção"
   │   └ transitório → mantém com backoff
```

### 5.4 Conflito: o servidor é a autoridade (RN-053)

Toda resposta de escrita retorna `serverState`. Quando ele divergir do que o app assumiu, o app **substitui** seu estado local e exibe aviso ao motorista após a sincronização.

Casos previstos:

| Situação | Resolução |
|---|---|
| Viagem já finalizada pelo escritório | Transição do app é descartada; app exibe "Sua viagem foi encerrada pelo escritório" |
| Veículo reatribuído a outro motorista | Checklist é aceito e vinculado ao veículo; app avisa a troca |
| Pendência já resolvida | Agrupamento por RN-050 não ocorre; nova pendência é criada |
| Template versionado atualizado | Submissão é aceita na versão preenchida (RN-033); app baixa a nova versão para o próximo |
| Período fechado (RN-135) | `409 period-closed`; item vai para "Requer atenção" |

### 5.5 Os dois relógios (RN-054)

| Campo | Origem | Imutável |
|---|---|---|
| `filledAt` | Relógio do aparelho, enviado pelo app | Sim |
| `receivedAt` | Relógio do servidor no aceite | Sim |
| `deviceClockSkewSeconds` | Calculado no aceite | Sim |

Divergência **superior a 6 horas** gera `audit_flag` do tipo `CLOCK_DIVERGENCE`, visível ao gestor no detalhe do checklist. O registro **não é rejeitado** — indicador de auditoria não é validação de entrada.

### 5.6 Bootstrap e cache de leitura

`GET /api/v1/driver/bootstrap` entrega, em uma requisição, tudo que o app precisa para operar dias sem rede: perfil, veículo atribuído, pendências abertas, templates de saída e devolução com versão, catálogos e configurações do tenant. Resposta com `ETag`; revalidação por `If-None-Match` custa alguns bytes quando nada mudou.

---

## 6. Upload de imagens

Duas superfícies: fotos de irregularidade no checklist e comprovante de abastecimento. A ocorrência de viagem usa o mesmo mecanismo.

### `API-D11` — Presigned URL direto ao R2

O binário **nunca** trafega pela aplicação (`DAT-03`). O backend valida tenant, papel e entitlement, assina a URL e devolve a chave do objeto.

```
1. App comprime a foto        → WebP, máx. 1600px no maior lado, ~300KB (RN-040)
2. POST /media/upload-intents → backend valida e assina (lote de até 10)
3. PUT direto ao Cloudflare R2 com a presigned URL
4. POST /media/confirm        → backend faz HEAD, valida tamanho e tipo
5. objectKey é referenciado na submissão do checklist
```

**Estrutura de chave** (herdada de `DAT-03`):

```
rookhub-media/{tenant_id}/checklists/{ano}/{mes}/{checklist_id}/{item_id}/{uuid}.webp
rookhub-media/{tenant_id}/receipts/{ano}/{mes}/{fueling_id}/{uuid}.webp
```

### `API-D12` — Regras de mídia

| Regra | Definição |
|---|---|
| RN-038 | Foto **obrigatória** em severidade `Crítico`; **opcional** em `Atenção` |
| RN-039 | Máximo de **3 fotos por item** — validado no backend, não só na UI |
| RN-040 | Redimensionamento e compressão no aparelho, antes do envio |
| RN-041 | **Câmera nativa exclusiva** — `<input capture="environment">`; galeria bloqueada |
| RN-042 | Geolocalização **não** é embutida na foto |
| RNF-022 | URL assinada com expiração máxima de **15 minutos** |
| `RN-D-020` | EXIF é **removido** pelo app antes do upload, exceto data de captura, usada na validação server-side prevista em `RT-01` |
| `RN-D-021` | Tipo aceito: `image/webp` e `image/jpeg`. Tamanho máximo: 1,5 MB por objeto |
| `RN-D-022` | Objeto órfão — intent criado e nunca confirmado — é expurgado em 48h por lifecycle rule |

> **RN-041 tem razão antifraude, não técnica:** a galeria permitiria reaproveitar a foto de um pneu de outro dia. Como `capture` é inconsistente em Safari antigo (`RT-01`), a validação de data de captura no servidor é a segunda linha de defesa — e por isso o EXIF de data sobrevive à limpeza.

### `API-D13` — Ordem de envio e sinalização

Fotos são **P3**: sobem por Background Sync do Workbox, após os dados estruturados (RNF-011). O checklist é aceito com fotos pendentes e recebe `photoUploadStatus: "PENDING"`.

Consequência de negócio: a pendência de manutenção é criada e a equipe é notificada **imediatamente**, mesmo antes de a foto chegar. A notificação indica que a evidência está a caminho. Segurar a pendência até a última foto subir atrasaria o tratamento de um freio comprometido por causa de banda — troca inaceitável.

O alvo de sincronização é **RNF-005: checklist com 10 fotos em 4G em menos de 60s**.

---

## 7. Abastecimento pelo motorista — decisão CF-02

**Decisão.** O motorista **envia apenas a foto do cupom**. Não existe endpoint de lançamento estruturado no app.

Isso alinha o produto exatamente ao Anexo A do PRD (`DRIVER`: enviar foto de cupom ✅, lançar abastecimento ❌) e a RN-061 — a foto é evidência, não fonte de dado estruturado no MVP.

### `RN-D-030` — Comprovante de abastecimento

`POST /fuel/receipts` cria um objeto de evidência, não um lançamento:

```
vehicleId · tripId? · capturedAt · objectKey · note?
```

| Aspecto | Definição |
|---|---|
| Efeito no custo | **Nenhum.** O comprovante não compõe custo, consumo nem custo por km |
| Vinculação | Anexado ao `fueling` correspondente por veículo + janela de data, vindo do TruckPag ou do `OPERATOR` |
| Sem correspondência | Fica em `NAO_VINCULADO` e aparece na fila do operador para tratamento manual |
| Campos removidos | Litros, odômetro, `fullTank`, posto, forma de pagamento, qualquer valor monetário |

### Consequências assumidas

| Efeito | Avaliação |
|---|---|
| O km/l passa a depender integralmente do TruckPag e do lançamento do operador | Alinhado a RN-063 — o indicador de vitrine nº 2 fica protegido de dado não conferido |
| Desaparece a leitura de odômetro declarada pelo motorista | O cruzamento de RN-060 passa a ser telemetria × operador. Aceitável, já que RN-059 nunca considerou o motorista fonte autoritativa |
| `RN-D-031`, `RN-D-034` e `RN-D-035` deixam de existir | Removidos deste ciclo |
| A tela "Abastecer" é refeita | De ~6 campos para: confirmar veículo → câmera → confirmar. Ganho direto sobre `RN-D-001` |

> A troca é boa em duas frentes ao mesmo tempo: menos toques para o motorista e menos superfície de disputa entre motorista e escritório. O motorista deixa de digitar qualquer número que possa ser contestado depois.

---

## 8. Telemetria e Mapa — decisão CF-03

**Decisão.** A fonte do Mapa é a **telemetria do fornecedor** (Powerfleet Unity, Eagletrack), conforme RN-059. O GPS do aparelho fica **desativado por padrão**.

### `RN-D-040` — Hierarquia de posição

```
1. Powerfleet Unity / Eagletrack   → autoritativo, fonte do Mapa (RN-059)
2. Odômetro manual                  → fallback declarado, quilometragem
3. GPS do aparelho (DRIVER_APP)     → DESLIGADO por padrão
```

### `RN-D-041` — Ativação condicional do GPS do aparelho

A coleta pelo celular é habilitada **por veículo**, por flag do tenant, **exclusivamente** quando o veículo não possuir telemetria instalada. Quando ativa:

| Item | Definição |
|---|---|
| Janela | Somente com viagem `Em andamento` — minimização de dado (RN-143) |
| Intervalo | 30s em movimento · 5min parado |
| Persistência | `provider = "DRIVER_APP"`, **nunca** autoritativo para odômetro ou km |
| Bateria | Suspensa abaixo de 15%, com aviso |
| Precisão | Pontos com `accuracyM > 100` descartados na origem |
| Localização simulada | Persistida com flag `MOCK_LOCATION` e excluída de qualquer cálculo |

Um veículo cuja única fonte de posição seja o celular exibe, no painel, o mesmo banner de dado não confiável de RN-141.

### Consequências

- `POST /telemetry/location` continua especificado, mas **não entra na sprint 4** — só quando aparecer veículo sem telemetria na frota-âncora.
- O trabalho real do Mapa é o **adaptador anticorrupção** de cada fornecedor (RN-138): traduzir o formato do Powerfleet e do Eagletrack para o modelo canônico. Nenhuma regra de negócio conhece o formato de um fornecedor.
- `GET /trips/{tripId}/track` passa a ler exclusivamente do modelo canônico, indiferente à origem.

> Ligar GPS no celular de todo motorista quando o caminhão já tem rastreador é coletar dado pessoal sem necessidade — exatamente o que a base legal de legítimo interesse (RN-143) não sustenta. E gasta bateria do aparelho que precisa durar até o checklist de devolução.

---

## 9. Tempo real

`FE-11` define WebSocket para o painel. Para o motorista, a economia é diferente: WebSocket persistente em 3G consome bateria e não é confiável em rodovia.

**`API-D14`:**

| Canal | Uso |
|---|---|
| **Web Push** | Bloqueio de veículo, liberação pelo gestor, decisão de contestação, pendência crítica |
| **Polling leve** em `GET /home` | A cada 60s com o app em primeiro plano, com `ETag` |
| **WebSocket** | **Fora de escopo** no PWA do motorista |

**Risco `RT-01`:** Web Push em iOS exige 16.4+ **e** instalação na tela de início. O fallback é SMS via Zenvia para eventos críticos. A distribuição de sistemas operacionais na frota-âncora precisa ser levantada antes da sprint 1 — ação já registrada na arquitetura e ainda pendente.

---

## 10. Mapeamento para os módulos do backend

Paridade de nome entre fatias do frontend e módulos Spring Modulith é princípio arquitetural do projeto.

| Módulo Spring Modulith | Endpoints do motorista |
|---|---|
| `identity` | `/auth/*`, `/consent-term/*` |
| `fleet` | `/vehicles/{id}/pendencies` |
| `trip` | `/trips/*`, `/telemetry/location` |
| `checklist` | `/checklists/*` |
| `maintenance` | Consome eventos de pendência — sem rota do motorista |
| `cost` | `/fuel/receipts` |
| `safety` | `/safety/*` |
| `notification` | `/notifications/*` |
| `media` | `/media/*` |
| `driver-bff` | `/home`, `/bootstrap`, `/profile`, `/performance`, `/sync/batch` |

**`API-D15` — `driver-bff` é agregador, não domínio.** Ele compõe respostas de múltiplos módulos por eventos e portas publicadas, e **não contém regra de negócio nem acesso direto a tabela de outro módulo**. Sem essa fronteira, `GET /home` vira o ponto onde toda regra do produto se acumula.

---

## 11. Observabilidade

| Métrica | Alvo |
|---|---|
| `driver.sync.batch.duration` p95 | < 3s (20 operações) |
| `driver.checklist.sync.duration` p95 | **< 60s** com 10 fotos em 4G (RNF-005) |
| `driver.home.duration` p95 | < 800ms |
| `driver.queue.age` p95 | < 30 min |
| `driver.queue.stuck` | Alerta em item com mais de 24h na fila |
| `driver.clock_divergence.rate` | Alerta acima de 2% das submissões |
| `driver.photo.upload.failure_rate` | Alerta acima de 5% |
| `driver.auth.offline_ratio` | Indicador de cobertura real de rede na operação |

**`RNF-D-030`** — Todo log correlaciona `X-Request-Id`, `tenant_id`, `driver_id` e `client_uuid`. Investigar "o checklist não chegou" sem `client_uuid` é impossível — o registro existe no aparelho e em lugar nenhum do servidor.

---

## 12. Trilha de auditoria

Além do escopo de RNF-020, esta API grava em log imutável (`DAT-07`, hash encadeado):

| Evento | Motivo |
|---|---|
| Ativação e revinculação de aparelho | RNF-012 — um motorista por aparelho |
| Bloqueio de conta por PIN incorreto | RN-010 |
| Aceite e recusa do termo de ciência | RN-144 |
| Bloqueio automático de veículo por checklist | RN-043 — muda o estado de um ativo |
| Contestação aberta pelo motorista | RN-095 |
| Flag de divergência de relógio | RN-054 |
| Flag de divergência GPS × odômetro | RN-060 |

---

## 13. Definição de Pronto — complemento do motorista

Além do DoD geral do PRD, nenhuma entrega desta superfície é considerada pronta sem:

- [ ] Teste de integração com o aparelho **em modo avião** durante todo o preenchimento, sincronizando ao recuperar rede
- [ ] Teste de rede degradada (3G, 300ms RTT, 2% de perda) — checklist com 10 fotos dentro de RNF-005
- [ ] Teste de reenvio duplicado do mesmo `client_uuid` sem efeito colateral duplicado
- [ ] Teste de concorrência multi-tenant sobre o mesmo pool, sem vazamento (`BE-14`)
- [ ] Teste de relógio adulterado em 8 horas gerando exatamente uma flag, sem rejeição
- [ ] Verificação de que nenhuma resposta do motorista contém campo financeiro — asserção automatizada no contrato OpenAPI
- [ ] Leitura da tela sob luz solar direta e operação com luvas (RNF-029)
- [ ] Contrato OpenAPI 3.1 publicado e cliente TypeScript gerado em `packages/api-client`

---

## 14. Pendências

### Resolvidas neste ciclo

| # | Pendência | Decisão |
|---|---|---|
| **P-01** | `CF-01` — estratégia de execução | `EXE-02` — backend-first para o App do Motorista |
| **P-02** | `CF-02` — abastecimento | Apenas foto de cupom (`RN-D-030`) |
| **P-03** | `CF-03` — GPS do aparelho | Desativado por padrão; telemetria do fornecedor é a fonte |

### Abertas

| # | Pendência | Responsável | Bloqueia |
|---|---|---|---|
| **P-04** | Distribuição Android/iOS na frota-âncora (`RT-01`) | Comercial | Estratégia de push e fallback SMS — **não bloqueia sprints 0 a 3** |
| **P-05** | Revisão jurídica LGPD do termo de ciência (RN-143, RN-144) | Advogado externo | Go-live, não o desenvolvimento |
| **P-06** | Confirmação de que Powerfleet Unity expõe eventos de vídeo por API | Comercial | Módulo Segurança — endpoints `/safety/*` |
| **P-07** | Fórmula do score de segurança (RN-099) | Vinicius | Campo `composition` de `GET /performance` |
| **P-08** | Credenciais e documentação de API do Powerfleet Unity e do Eagletrack para **telemetria de posição** | Comercial | **Sprint do Mapa.** Distinto de P-06: aqui é posição e odômetro, não evento de vídeo |

> **P-06 e P-08 são coisas diferentes e não devem ser tratadas juntas.** P-08 é telemetria de posição, escopo MVP já aprovado, e destrava o Mapa. P-06 é evento de vídeo com IA, ainda não validado — nenhuma sprint de Segurança começa sem resposta.

### Ordem de sprints aprovada

| Sprint | Entrega | Bloqueio |
|---|---|---|
| **0** | RLS + `withTenant()` + os 4 gates do `BE-14` + esteira de CI | Nenhum |
| **1** | `identity` — QR, PIN Argon2id, device token 90d, gate LGPD | Nenhum |
| **2** | `media` + `checklist` completo, com bloqueio de veículo | Nenhum |
| **3** | `trip` + `POST /sync/batch` com idempotência | Nenhum |
| **4** | `cost` — `POST /fuel/receipts` e vinculação ao `fueling` | Nenhum |
| **5** | Mapa — adaptadores anticorrupção + `GET /trips/{id}/track` | **P-08** |
| **6** | `/profile` e `/performance` sem `composition` | P-07 (parcial) |
| **—** | `/safety/*` | **P-06** — não abrir |
