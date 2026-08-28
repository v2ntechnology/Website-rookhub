# App do Motorista — Contratos de API e Payloads JSON

**Produto:** RookHub
**Identificador:** `DRV-API` · **Versão:** 1.0 · **Status:** Proposto
**Documento-pai:** `app_motorista_backend_spec.md` (`DRV-SPEC`)
**Base URL:** `https://api.rookhub.com.br/api/v1/driver`

> Este documento é o contrato de implementação. Todo schema de requisição e resposta está completo o bastante para a equipe de backend começar a programar sem consulta adicional. Os cabeçalhos obrigatórios, o formato de erro RFC 9457, as regras de idempotência e o comportamento de fila estão definidos em `DRV-SPEC` §3 a §6 e **não** são repetidos aqui.

---

## Índice

1. [Autenticação e dispositivo](#1-autenticação-e-dispositivo)
2. [Termo de ciência LGPD](#2-termo-de-ciência-lgpd)
3. [Bootstrap](#3-bootstrap)
4. [Home](#4-home)
5. [Checklist digital](#5-checklist-digital)
6. [Mídia](#6-mídia)
7. [Viagem](#7-viagem)
8. [Telemetria e mapa](#8-telemetria-e-mapa)
9. [Abastecimento](#9-abastecimento)
10. [Perfil e desempenho](#10-perfil-e-desempenho)
11. [Segurança na estrada](#11-segurança-na-estrada)
12. [Notificações](#12-notificações)
13. [Sincronização em lote](#13-sincronização-em-lote)
14. [Enumerações](#14-enumerações)

---

## 1. Autenticação e dispositivo

### 1.1 `POST /auth/device/activate`

Primeiro acesso. Consome o token do QR code gerado no painel (RN-008) e vincula o aparelho ao motorista (RNF-012).

**Sem `Authorization`.**

```json
{
  "activationToken": "AT-9f2c7d1e-4b8a-4c3e-9f10-2b7a5c8d1e33",
  "pin": "482913",
  "pinConfirmation": "482913",
  "device": {
    "deviceId": "0191e0cc-7f21-7c3a-9b44-1d2e3f4a5b6c",
    "platform": "ANDROID",
    "osVersion": "14",
    "model": "Moto G84",
    "appVersion": "driver/1.0.0",
    "pushToken": "fcm:dQw4w9WgXcQ..."
  }
}
```

**`201 Created`**

```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "expiresIn": 900,
  "deviceToken": "dt_01J9F2C4...",
  "deviceTokenExpiresAt": "2026-11-14T09:00:00-03:00",
  "pinHashParams": {
    "algorithm": "ARGON2ID",
    "salt": "base64:8fJ2k...",
    "memoryKiB": 19456,
    "iterations": 2,
    "parallelism": 1
  },
  "driver": {
    "driverId": "0191e0bb-...",
    "name": "José Carlos da Silva",
    "tenantName": "Transportes Andrade"
  },
  "consent": {
    "required": true,
    "version": "2026-05-01"
  }
}
```

> `pinHashParams` permite ao app derivar e armazenar localmente o hash do PIN para validação offline (RN-009). O PIN em claro **nunca** é persistido no aparelho.

**Erros:** `410 activation-token-expired` · `409 device-already-bound` · `422 weak-pin` (sequência, repetição ou data de nascimento).

---

### 1.2 `POST /auth/login`

**Sem `Authorization`.**

```json
{
  "cpf": "12345678909",
  "pin": "482913",
  "deviceId": "0191e0cc-...",
  "tenantId": null
}
```

**`200 OK`**

```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "expiresIn": 900,
  "deviceToken": "dt_01J9F2C4...",
  "deviceTokenExpiresAt": "2026-11-14T09:00:00-03:00",
  "consent": { "required": false, "version": "2026-05-01" },
  "serverTime": "2026-08-16T09:14:02-03:00"
}
```

**`300 Multiple Choices`** — CPF vinculado a mais de um tenant, sem aparelho resolvido (RN-007):

```json
{
  "type": "https://api.rookhub.com.br/problems/tenant-selection-required",
  "title": "Selecione a transportadora",
  "status": 300,
  "tenants": [
    { "tenantId": "0191d900-...", "name": "Transportes Andrade" },
    { "tenantId": "0191d911-...", "name": "Rodoviário Bom Jesus" }
  ]
}
```

**`423 account-locked`** — após 5 tentativas (RN-010):

```json
{
  "type": "https://api.rookhub.com.br/problems/account-locked",
  "title": "Acesso bloqueado temporariamente",
  "status": 423,
  "detail": "Muitas tentativas incorretas. Tente novamente em 15 minutos.",
  "lockedUntil": "2026-08-16T09:29:02-03:00",
  "remainingAttempts": 0
}
```

> O contador de tentativas é mantido **no aparelho e no servidor**. Offline, o bloqueio é local e sincronizado quando houver rede (RN-010). O servidor sempre vence em caso de divergência.

---

### 1.3 `POST /auth/refresh`

```json
{ "deviceToken": "dt_01J9F2C4...", "deviceId": "0191e0cc-..." }
```

**`200 OK`** — devolve `accessToken`, `expiresIn` e **novo** `deviceToken` (rotação). O token anterior é revogado imediatamente. Reuso de token revogado invalida toda a cadeia do aparelho e exige novo login por PIN.

---

### 1.4 `POST /auth/logout`

```json
{ "deviceToken": "dt_01J9F2C4...", "wipeLocalData": false }
```

**`204 No Content`.** Quando `wipeLocalData` for `true`, o app limpa a base local — **bloqueado se houver itens pendentes na fila**, com aviso explícito ao motorista. Perder um checklist de freio por logout é inaceitável.

---

## 2. Termo de ciência LGPD

### 2.1 `GET /consent-term`

**`200 OK`**

```json
{
  "version": "2026-05-01",
  "publishedAt": "2026-05-01T00:00:00-03:00",
  "acceptedAt": null,
  "contentMarkdown": "## O que é monitorado\n...",
  "summary": {
    "whatIsMonitored": ["Posição do veículo durante a viagem", "Eventos de segurança captados por câmera", "Checklists e ocorrências registradas"],
    "retention": [
      { "category": "Dados operacionais", "period": "5 anos" },
      { "category": "Eventos de segurança e mídia", "period": "90 dias" }
    ],
    "whoHasAccess": ["Dono da transportadora", "Gerente de frota", "Você"],
    "yourRights": ["Acesso", "Correção", "Exclusão", "Portabilidade"],
    "contactChannel": "privacidade@rookhub.com.br"
  }
}
```

### 2.2 `POST /consent-term/accept`

```json
{ "version": "2026-05-01", "acceptedAt": "2026-08-16T09:15:00-03:00" }
```

**`200 OK`** — o servidor registra data, versão e IP (RN-144). `acceptedAt` do cliente é preservado como declaração; o timestamp legal é o do servidor.

---

## 3. Bootstrap

### 3.1 `GET /bootstrap`

Uma requisição, tudo que o app precisa para operar dias sem rede. Suporta `If-None-Match`.

**`200 OK`**

```json
{
  "syncedAt": "2026-08-16T09:15:04-03:00",
  "driver": {
    "driverId": "0191e0bb-...",
    "name": "José Carlos da Silva",
    "licenseNumber": "01234567890",
    "licenseCategory": "E",
    "licenseExpiresAt": "2027-03-22",
    "licenseStatus": "VALID",
    "admittedAt": "2021-06-01",
    "photoUrl": null
  },
  "tenant": {
    "tenantId": "0191d900-...",
    "name": "Transportes Andrade",
    "entitlements": ["MAINTENANCE", "COST", "SAFETY"]
  },
  "assignedVehicle": {
    "vehicleId": "0191e100-...",
    "plate": "ABC1D23",
    "type": "CAVALO",
    "brand": "Scania",
    "model": "R450",
    "status": "DISPONIVEL",
    "currentOdometerKm": 487320,
    "odometerSource": "TELEMETRY",
    "odometerReadAt": "2026-08-16T08:52:00-03:00",
    "composition": [
      { "vehicleId": "0191e101-...", "plate": "XYZ4E56", "type": "IMPLEMENTO" }
    ],
    "openPendencies": [
      {
        "pendencyId": "0191e200-...",
        "itemLabel": "Pneu dianteiro esquerdo",
        "severity": "ATENCAO",
        "openedAt": "2026-08-12T07:31:00-03:00",
        "recurrenceCount": 3,
        "status": "ABERTA"
      }
    ]
  },
  "checklistTemplates": [
    { "templateId": "0191c000-...", "type": "SAIDA", "version": 7, "etag": "W/\"tpl-saida-v7\"" },
    { "templateId": "0191c001-...", "type": "DEVOLUCAO", "version": 4, "etag": "W/\"tpl-devol-v4\"" }
  ],
  "settings": {
    "checklistOutValidityHours": 4,
    "offlineQueueMaxChecklists": 20,
    "offlineQueueMaxPhotos": 100,
    "offlineQueueMaxDays": 7,
    "photoMaxPerItem": 3,
    "photoMaxLongEdgePx": 1600,
    "photoTargetBytes": 307200,
    "telemetryIntervalMovingSeconds": 30,
    "telemetryIntervalIdleSeconds": 300
  },
  "activeTrip": null
}
```

> `settings` vem do servidor por decisão deliberada: limiares de fila e de foto mudam por aprendizado operacional, e não podem exigir novo deploy do PWA para cada ajuste.

---

## 4. Home

### 4.1 `GET /home`

Tela principal. Responde à pergunta única do motorista: *o que eu faço agora?*

**`200 OK`**

```json
{
  "serverTime": "2026-08-16T09:20:11-03:00",
  "driver": { "driverId": "0191e0bb-...", "firstName": "José" },
  "assignedVehicle": {
    "vehicleId": "0191e100-...",
    "plate": "ABC1D23",
    "status": "DISPONIVEL",
    "statusReason": null,
    "openPendencyCount": 1,
    "criticalPendencyCount": 0
  },
  "activeTrip": {
    "tripId": "0191e300-...",
    "status": "EM_ANDAMENTO",
    "origin": "Curitiba/PR",
    "destination": "Ribeirão Preto/SP",
    "startedAt": "2026-08-16T05:12:00-03:00",
    "startOdometerKm": 487100,
    "elapsedMinutes": 248,
    "distanceTraveledKm": 213.4,
    "currentPause": null,
    "eventCount": 1
  },
  "checklistStatus": {
    "lastOutChecklistId": "0191e400-...",
    "lastOutFilledAt": "2026-08-16T04:58:00-03:00",
    "outValidUntil": "2026-08-16T08:58:00-03:00",
    "outExpired": true,
    "returnRequired": false
  },
  "nextActions": [
    { "action": "FINISH_TRIP", "label": "Finalizar viagem", "enabled": true, "priority": 1 },
    { "action": "REGISTER_FUELING", "label": "Registrar abastecimento", "enabled": true, "priority": 2 },
    { "action": "REPORT_EVENT", "label": "Registrar ocorrência", "enabled": true, "priority": 3 }
  ],
  "blockingAlert": null,
  "unreadNotifications": 2,
  "dataFreshness": {
    "telemetryLastSyncAt": "2026-08-16T09:18:00-03:00",
    "stale": false
  }
}
```

**Exemplo de `blockingAlert`** — veículo bloqueado por item crítico (RN-044):

```json
{
  "blockingAlert": {
    "code": "VEHICLE_UNAVAILABLE",
    "title": "Veículo indisponível",
    "message": "Procure o gestor. Um item crítico foi apontado no checklist.",
    "severity": "CRITICO",
    "since": "2026-08-16T05:02:00-03:00",
    "relatedChecklistId": "0191e400-...",
    "dismissible": false
  }
}
```

> `nextActions` é calculado no servidor, não no app. A ordem das ações depende de estado de viagem, validade de checklist, status do veículo e pendências — regra de negócio, não de interface. Duplicá-la no cliente garantiria divergência.

---

### 4.2 `GET /vehicles/{vehicleId}/pendencies`

Escopo: apenas veículos atribuídos ao motorista autenticado (RN-051).

**`200 OK`**

```json
{
  "vehicleId": "0191e100-...",
  "plate": "ABC1D23",
  "vehicleStatus": "DISPONIVEL",
  "items": [
    {
      "pendencyId": "0191e200-...",
      "itemId": "0191c010-...",
      "itemLabel": "Pneu dianteiro esquerdo",
      "section": "PNEUS",
      "severity": "ATENCAO",
      "status": "ABERTA",
      "openedAt": "2026-08-12T07:31:00-03:00",
      "recurrenceCount": 3,
      "reportedByYou": true,
      "workOrderId": null,
      "blocking": false
    }
  ]
}
```

---

## 5. Checklist digital

### 5.1 `GET /checklists/template?type=SAIDA&vehicleId=0191e100-...`

Retorna a versão vigente para a categoria do veículo (RN-030, RN-033). Suporta `If-None-Match` — `304` quando inalterado.

**`200 OK`**

```json
{
  "templateId": "0191c000-...",
  "type": "SAIDA",
  "version": 7,
  "publishedAt": "2026-06-10T00:00:00-03:00",
  "vehicleCategory": "CAVALO",
  "estimatedDurationSeconds": 180,
  "sections": [
    {
      "sectionId": "0191c005-...",
      "code": "FREIOS",
      "label": "Freios",
      "order": 2,
      "items": [
        {
          "itemId": "0191c010-...",
          "label": "Freio de serviço",
          "helpText": "Verifique curso do pedal e ausência de vazamentos.",
          "order": 1,
          "blocking": true,
          "responseType": "CONFORMITY",
          "required": true,
          "allowsNotApplicable": false,
          "photoRequiredWhen": "CRITICO",
          "maxPhotos": 3,
          "origin": "MASTER"
        },
        {
          "itemId": "0191c011-...",
          "label": "Sulco do pneu dianteiro esquerdo",
          "order": 2,
          "blocking": true,
          "responseType": "CONFORMITY_NUMERIC",
          "numeric": { "unit": "mm", "min": 0, "max": 20, "decimals": 1, "criticalBelow": 1.6 },
          "required": true,
          "allowsNotApplicable": false,
          "photoRequiredWhen": "CRITICO",
          "maxPhotos": 3,
          "origin": "MASTER"
        }
      ]
    }
  ]
}
```

| Campo | Significado |
|---|---|
| `blocking` | RN-034 — não conformidade crítica torna o veículo `Indisponível` |
| `origin` | `MASTER` (não removível pelo cliente) ou `OPTIONAL_BLOCK` (habilitado na implantação) — RN-030 |
| `photoRequiredWhen` | `CRITICO` (RN-038), `ALWAYS` ou `NEVER` |
| `criticalBelow` | Sugere severidade `Crítico` na UI; **não** substitui a escolha do motorista |

---

### 5.2 `POST /checklists`

Endpoint central do produto. `Idempotency-Key` obrigatório, igual a `clientUuid`.

```json
{
  "clientUuid": "0191f000-7a1b-7c2d-8e3f-4a5b6c7d8e9f",
  "templateId": "0191c000-...",
  "templateVersion": 7,
  "type": "SAIDA",
  "vehicleId": "0191e100-...",
  "compositionVehicleIds": ["0191e101-..."],
  "tripId": null,
  "odometerKm": 487320,
  "startedAt": "2026-08-16T04:52:10-03:00",
  "filledAt": "2026-08-16T04:58:02-03:00",
  "device": {
    "deviceId": "0191e0cc-...",
    "appVersion": "driver/1.0.0",
    "wasOffline": true,
    "timezoneOffsetMinutes": -180
  },
  "answers": [
    {
      "itemId": "0191c010-...",
      "response": "NAO_CONFORME",
      "severity": "CRITICO",
      "note": "Pedal com curso longo e cheiro de queimado.",
      "photos": [
        { "clientUuid": "0191f001-...", "objectKey": "0191d900-.../checklists/2026/08/0191f000-.../0191c010-.../0191f001-.webp" }
      ]
    },
    {
      "itemId": "0191c011-...",
      "response": "NAO_CONFORME",
      "severity": "ATENCAO",
      "numericValue": 2.4,
      "photos": []
    },
    { "itemId": "0191c012-...", "response": "CONFORME" },
    { "itemId": "0191c013-...", "response": "NAO_APLICAVEL", "note": "Veículo sem terceiro eixo." }
  ]
}
```

**`201 Created`**

```json
{
  "checklistId": "0191f000-...",
  "clientUuid": "0191f000-...",
  "status": "RECEBIDO",
  "filledAt": "2026-08-16T04:58:02-03:00",
  "receivedAt": "2026-08-16T09:22:41-03:00",
  "deviceClockSkewSeconds": 12,
  "auditFlags": [],
  "photoUploadStatus": "PENDING",
  "photosExpected": 1,
  "photosReceived": 0,
  "serverState": {
    "vehicleId": "0191e100-...",
    "vehicleStatus": "INDISPONIVEL",
    "vehicleStatusReason": "BLOCKING_ITEM_CRITICAL",
    "canStartTrip": false,
    "blockingItems": [
      { "itemId": "0191c010-...", "itemLabel": "Freio de serviço", "severity": "CRITICO" }
    ]
  },
  "pendencies": [
    { "pendencyId": "0191e210-...", "itemId": "0191c010-...", "action": "CREATED", "recurrenceCount": 1 },
    { "pendencyId": "0191e200-...", "itemId": "0191c011-...", "action": "GROUPED", "recurrenceCount": 4 }
  ],
  "driverMessage": {
    "code": "VEHICLE_BLOCKED",
    "title": "Veículo indisponível",
    "body": "Procure o gestor antes de sair. O gerente já foi avisado.",
    "blocking": true
  }
}
```

**Comportamentos garantidos:**

| Regra | Efeito no servidor |
|---|---|
| RN-043 | Item `blocking` + `NAO_CONFORME` + `CRITICO` ⇒ veículo `Indisponível` **imediatamente** |
| RN-044 | `MANAGER` notificado em tempo real; `canStartTrip: false` |
| RN-047 | Toda resposta `NAO_CONFORME` gera pendência |
| RN-048 | `MAINTENANCE` sempre; `MANAGER` e `OWNER` só em `CRITICO` |
| RN-049 | Pendência **não** vira OS automaticamente |
| RN-050 | Mesmo item + mesmo veículo com pendência aberta ⇒ `GROUPED` + incremento |
| RN-054 | `filledAt` e `receivedAt` gravados separadamente |
| RN-033 | Renderização futura usa `templateVersion` do preenchimento |

**Erros:**

`422 checklist-photo-required` — item crítico sem foto (RN-038), com `errors[]` apontando o item.
`422 checklist-incomplete` — item obrigatório sem resposta.
`422 checklist-invalid-severity` — `NAO_CONFORME` sem severidade (RN-032).
`409 checklist-template-outdated` — versão inexistente; a resposta traz `currentVersion` e o app baixa a nova para o próximo preenchimento. **Uma submissão offline em versão antiga vigente à época é aceita**, nunca rejeitada.

---

### 5.3 `GET /checklists?limit=20&cursor=...`

Histórico — escopo `🔸 próprios registros`.

```json
{
  "items": [
    {
      "checklistId": "0191f000-...",
      "type": "SAIDA",
      "vehiclePlate": "ABC1D23",
      "filledAt": "2026-08-16T04:58:02-03:00",
      "status": "RECEBIDO",
      "nonConformityCount": 2,
      "criticalCount": 1,
      "causedVehicleBlock": true
    }
  ],
  "nextCursor": null,
  "hasMore": false
}
```

### 5.4 `GET /checklists/{checklistId}`

Retorna a submissão **renderizada com a versão do template vigente no preenchimento** (RN-033), incluindo respostas, notas, URLs assinadas das fotos (expiração ≤ 15 min, RNF-022), `auditFlags` e as pendências geradas.

---

## 6. Mídia

### 6.1 `POST /media/upload-intents`

Lote de até 10 intenções.

```json
{
  "context": "CHECKLIST_PHOTO",
  "checklistClientUuid": "0191f000-...",
  "items": [
    {
      "clientUuid": "0191f001-...",
      "itemId": "0191c010-...",
      "contentType": "image/webp",
      "sizeBytes": 289431,
      "capturedAt": "2026-08-16T04:56:31-03:00",
      "sha256": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
    }
  ]
}
```

`context`: `CHECKLIST_PHOTO` · `FUELING_RECEIPT` · `TRIP_EVENT_PHOTO`.

**`200 OK`**

```json
{
  "intents": [
    {
      "clientUuid": "0191f001-...",
      "objectKey": "0191d900-.../checklists/2026/08/0191f000-.../0191c010-.../0191f001-.webp",
      "uploadUrl": "https://rookhub-media.r2.cloudflarestorage.com/...&X-Amz-Expires=900",
      "method": "PUT",
      "headers": { "Content-Type": "image/webp" },
      "expiresAt": "2026-08-16T09:37:41-03:00",
      "maxBytes": 1572864
    }
  ]
}
```

**Erros:** `422 media-too-large` (> 1,5 MB) · `422 media-unsupported-type` · `422 media-limit-exceeded` (mais de 3 fotos no item, RN-039).

### 6.2 `POST /media/confirm`

```json
{ "objectKeys": ["0191d900-.../checklists/2026/08/.../0191f001-.webp"] }
```

**`200 OK`**

```json
{
  "results": [
    { "objectKey": "0191d900-.../checklists/.../0191f001-.webp", "status": "CONFIRMED", "sizeBytes": 289431 }
  ]
}
```

O backend faz `HEAD` no objeto e valida tamanho, tipo e hash. Divergência retorna `status: "REJECTED"` com `reason` — o app reenvia. Objeto não confirmado em 48h é expurgado (`RN-D-022`).

---

## 7. Viagem

Máquina de estados: `Planejada` → `Em andamento` → `Concluída` | `Cancelada` (RN-026). A viagem é **criada no painel** pelo `OPERATOR`; o motorista executa transições.

### 7.1 `POST /trips/{tripId}/start`

```json
{
  "clientUuid": "0191f100-...",
  "startOdometerKm": 487320,
  "startedAt": "2026-08-16T05:12:00-03:00",
  "checklistClientUuid": "0191f000-...",
  "location": { "latitude": -25.428954, "longitude": -49.267137, "accuracyM": 8.4 }
}
```

**`200 OK`**

```json
{
  "tripId": "0191e300-...",
  "status": "EM_ANDAMENTO",
  "startedAt": "2026-08-16T05:12:00-03:00",
  "receivedAt": "2026-08-16T09:24:03-03:00",
  "flags": ["STARTED_WITHOUT_VALID_CHECKLIST"],
  "serverState": { "vehicleStatus": "EM_VIAGEM", "driverLicenseStatus": "VALID" },
  "driverMessage": {
    "code": "CHECKLIST_EXPIRED",
    "title": "Checklist vencido",
    "body": "Seu checklist de saída passou de 4 horas. A viagem foi iniciada e o escritório foi avisado.",
    "blocking": false
  }
}
```

**Bloqueios:**

| Erro | Regra |
|---|---|
| `409 vehicle-unavailable` | RN-027 — veículo precisa estar `Disponível` |
| `409 driver-license-expired` | RN-024 — CNH vencida impede vínculo a nova viagem |
| `409 trip-invalid-transition` | Viagem já iniciada, concluída ou cancelada |
| `422 odometer-inconsistent` | Odômetro menor que a última leitura conhecida |

**RN-037 — checklist expirado não bloqueia.** A viagem é iniciada com a flag `STARTED_WITHOUT_VALID_CHECKLIST` e o operador é notificado. Bloquear a partida por vencimento de 4 horas transformaria uma regra de qualidade em impedimento operacional — e o motorista aprenderia a burlar o checklist.

### 7.2 `POST /trips/{tripId}/pause`

```json
{
  "clientUuid": "0191f101-...",
  "reason": "DESCANSO",
  "startedAt": "2026-08-16T09:30:00-03:00",
  "note": null,
  "location": { "latitude": -24.911, "longitude": -49.002, "accuracyM": 12.0 }
}
```

`reason`: `DESCANSO` · `REFEICAO` · `ESPERA_CARGA` · `ESPERA_DESCARGA` · `ABASTECIMENTO` · `MANUTENCAO` · `FILA_BALANCA` · `OUTRO` (exige `note`).

**`200 OK`** — `{ "tripId", "status": "EM_ANDAMENTO", "currentPause": { "pauseId", "reason", "startedAt" } }`

> A pausa **não** altera o status da viagem. `Em andamento` com pausa aberta é estado da jornada, não da viagem — a máquina de estados de RN-026 não é ampliada.

### 7.3 `POST /trips/{tripId}/resume`

```json
{ "clientUuid": "0191f102-...", "pauseId": "0191f101-...", "endedAt": "2026-08-16T10:12:00-03:00" }
```

**`200 OK`** — retorna `pauseDurationMinutes` e `currentPause: null`.

### 7.4 `POST /trips/{tripId}/finish`

```json
{
  "clientUuid": "0191f103-...",
  "endOdometerKm": 487683,
  "finishedAt": "2026-08-16T18:40:00-03:00",
  "returnChecklistClientUuid": "0191f004-...",
  "location": { "latitude": -21.170, "longitude": -47.810, "accuracyM": 9.1 }
}
```

**`200 OK`**

```json
{
  "tripId": "0191e300-...",
  "status": "CONCLUIDA",
  "finishedAt": "2026-08-16T18:40:00-03:00",
  "distanceOdometerKm": 363,
  "distanceGpsKm": 358.2,
  "auditFlags": [],
  "serverState": { "vehicleStatus": "DISPONIVEL" },
  "pendingActions": [
    { "action": "RETURN_CHECKLIST", "label": "Checklist de devolução pendente", "required": true }
  ]
}
```

Divergência acima de 5% entre `distanceOdometerKm` e `distanceGpsKm` acrescenta `ODOMETER_GPS_DIVERGENCE` a `auditFlags` (RN-060). O motorista **não é acusado** — a flag é do gestor, e a resposta ao app não a menciona.

### 7.5 `POST /trips/{tripId}/events`

Ocorrência em rota. Funciona offline.

```json
{
  "clientUuid": "0191f110-...",
  "type": "PANE_MECANICA",
  "severity": "ALTO",
  "occurredAt": "2026-08-16T13:22:00-03:00",
  "description": "Perda de pressão de ar no sistema de freio do implemento.",
  "location": { "latitude": -23.104, "longitude": -48.322, "accuracyM": 15.0 },
  "photos": [{ "clientUuid": "0191f111-...", "objectKey": "0191d900-.../events/..." }]
}
```

`type`: `PANE_MECANICA` · `PNEU` · `ACIDENTE` · `CONGESTIONAMENTO` · `FISCALIZACAO` · `CARGA` · `CLIMA` · `SEGURANCA_PUBLICA` · `OUTRO`.

**`201 Created`** — `{ "eventId", "clientUuid", "occurredAt", "receivedAt", "notifiedRoles": ["MANAGER","OPERATOR"] }`.

`PANE_MECANICA` e `PNEU` geram pendência vinculada ao veículo, pela mesma mecânica de RN-047. `ACIDENTE` notifica `MANAGER` e `OWNER` em tempo real, independentemente de severidade.

### 7.6 `GET /trips?status=CONCLUIDA&limit=20`

Histórico próprio (`🔸`). Itens contêm `tripId`, `origin`, `destination`, `startedAt`, `finishedAt`, `distanceKm`, `vehiclePlate`, `eventCount`. **Nenhum campo de custo.**

---

## 8. Telemetria e mapa

### 8.1 `POST /telemetry/location`

> **Desativado por padrão** (decisão `CF-03`). Habilitado por flag do tenant, por veículo, apenas quando o veículo não possuir telemetria instalada. Fonte nunca autoritativa (`RN-D-040`). Quando desabilitado, retorna `403 telemetry-not-enabled` e o app suspende a coleta.

Lote de até 60 pontos.

```json
{
  "tripId": "0191e300-...",
  "vehicleId": "0191e100-...",
  "points": [
    {
      "recordedAt": "2026-08-16T09:20:00-03:00",
      "latitude": -25.428954,
      "longitude": -49.267137,
      "accuracyM": 8.4,
      "speedKmh": 78.2,
      "headingDeg": 213.5,
      "altitudeM": 934.0,
      "batteryLevel": 0.72,
      "mock": false
    }
  ]
}
```

**`202 Accepted`** — sem corpo.

Regras: descarte silencioso de pontos com `accuracyM > 100`; `mock: true` (localização simulada) é persistido com flag e **nunca** usado em cálculo; pontos fora da janela da viagem são recusados no lote com `207` e detalhe por ponto.

### 8.2 `GET /trips/{tripId}/track?from=...&to=...`

Trajeto para a tela de Mapa.

A fonte é a **telemetria do fornecedor**, traduzida pelo adaptador anticorrupção para o modelo canônico (RN-138). O endpoint é indiferente à origem.

```json
{
  "tripId": "0191e300-...",
  "polyline": "}_p~iF~ps|U_ulLnnqC_mqNvxq`@",
  "encoding": "GOOGLE_POLYLINE_5",
  "pointCount": 412,
  "sources": ["POWERFLEET", "DRIVER_APP"],
  "primarySource": "POWERFLEET",
  "lastPositionAt": "2026-08-16T09:18:00-03:00",
  "stale": false,
  "currentPosition": { "latitude": -24.100, "longitude": -48.900, "speedKmh": 0, "recordedAt": "2026-08-16T09:18:00-03:00" }
}
```

`stale: true` quando a última posição tem mais de 15 minutos — o app exibe banner de dado desatualizado, mesma mecânica de RN-141.

> **Fora de escopo no MVP:** roteirização, ETA, prazo de entrega e ocorrência de embarcador (RN-029). O Mapa mostra onde o veículo esteve e onde está.

---

## 9. Abastecimento

Decisão `CF-02`: o motorista envia **apenas a foto do cupom**. Não há endpoint de lançamento estruturado (`RN-D-030`).

### 9.1 `POST /fuel/receipts`

```json
{
  "clientUuid": "0191f200-...",
  "vehicleId": "0191e100-...",
  "tripId": "0191e300-...",
  "capturedAt": "2026-08-16T11:47:00-03:00",
  "objectKey": "0191d900-.../receipts/2026/08/0191f200-.../0191f201-.webp",
  "note": null
}
```

**`201 Created`**

```json
{
  "receiptId": "0191f200-...",
  "clientUuid": "0191f200-...",
  "status": "NAO_VINCULADO",
  "capturedAt": "2026-08-16T11:47:00-03:00",
  "receivedAt": "2026-08-16T11:52:14-03:00",
  "linkedFuelingId": null,
  "driverMessage": {
    "code": "RECEIPT_RECEIVED",
    "title": "Comprovante enviado",
    "body": "Pronto. O escritório cuida do resto.",
    "blocking": false
  }
}
```

**Regras:**

| Regra | Efeito |
|---|---|
| RN-061 | A foto é evidência. **Sem OCR no MVP** |
| `RN-D-030` | O comprovante **não** compõe custo, consumo nem custo por km |
| `RN-D-031` | Nenhum campo monetário, de litros ou de odômetro — nem na entrada, nem na saída |
| Anexo A | Alinhado à permissão real do `DRIVER`: enviar foto ✅, lançar ❌ |
| RN-041 | Captura exclusivamente pela câmera nativa |

**Vinculação (processo do servidor):** job diário casa o comprovante ao `fueling` do mesmo veículo dentro de uma janela de ±24h da captura. Sem correspondência, permanece em `NAO_VINCULADO` e entra na fila do operador. A vinculação manual é ato do `OPERATOR`.

**Estados:** `NAO_VINCULADO` → `VINCULADO` | `DESCARTADO`.

**Erros:** `422 media-not-confirmed` — `objectKey` sem confirmação prévia em `/media/confirm` · `404 vehicle-not-assigned` · `409 period-closed`.

### 9.2 `GET /fuel/receipts?limit=20`

Histórico próprio: `receiptId`, `capturedAt`, `vehiclePlate`, `status`, `thumbnailUrl` (assinada, ≤ 15 min). **Sem litros, sem valores.**

> **A tela "Abastecer" é refeita neste ciclo.** O fluxo passa a ser: confirmar veículo → abrir câmera → confirmar envio. Três toques. O motorista não digita nenhum número, o que elimina de uma vez a validação de odômetro, o limite de litros e a disputa posterior sobre o que foi digitado.

---

## 10. Perfil e desempenho

### 10.1 `GET /profile`

```json
{
  "driverId": "0191e0bb-...",
  "name": "José Carlos da Silva",
  "cpfMasked": "123.***.***-09",
  "admittedAt": "2021-06-01",
  "phone": "+5541999998888",
  "license": {
    "number": "01234567890",
    "category": "E",
    "expiresAt": "2027-03-22",
    "status": "VALID",
    "daysToExpire": 218
  },
  "assignedVehicle": { "vehicleId": "0191e100-...", "plate": "ABC1D23" },
  "device": {
    "deviceId": "0191e0cc-...",
    "boundAt": "2026-08-01T14:22:00-03:00",
    "lastSyncAt": "2026-08-16T09:20:11-03:00"
  },
  "consent": { "version": "2026-05-01", "acceptedAt": "2026-08-01T14:23:10-03:00" },
  "privacy": { "requestChannel": "privacidade@rookhub.com.br", "rightsUrl": "https://rookhub.com.br/privacidade" }
}
```

CPF é sempre mascarado na resposta. Alerta de vencimento de CNH segue RN-023 (60, 30, 7 dias e diário após vencida) e chega por notificação.

### 10.2 `GET /performance?period=CURRENT_MONTH`

Escopo `🔸` estrito. Zero conteúdo financeiro.

```json
{
  "period": { "code": "CURRENT_MONTH", "from": "2026-08-01", "to": "2026-08-16" },
  "trips": { "completed": 11, "distanceKm": 4820 },
  "consumption": {
    "avgKmPerLiter": 2.41,
    "fleetModelAvgKmPerLiter": 2.35,
    "comparisonLabel": "Acima da média dos caminhões iguais ao seu",
    "sampleSufficient": true,
    "basis": "Calculado apenas entre tanques completos"
  },
  "checklists": { "submitted": 22, "onTimeRate": 0.95, "nonConformitiesReported": 7 },
  "safety": {
    "available": true,
    "score": 87,
    "scoreRange": { "min": 0, "max": 100 },
    "trend": "UP",
    "composition": [
      { "factor": "Eventos críticos", "weight": 0.40, "yourValue": 1, "impact": -8 },
      { "factor": "Eventos de alta severidade", "weight": 0.30, "yourValue": 3, "impact": -4 },
      { "factor": "Uso de cinto", "weight": 0.20, "yourValue": 0.99, "impact": -1 },
      { "factor": "Conclusão de checklist", "weight": 0.10, "yourValue": 0.95, "impact": 0 }
    ],
    "formulaVersion": "1.0",
    "disputedEventsExcluded": 1
  },
  "generatedAt": "2026-08-16T09:20:11-03:00"
}
```

**Regras aplicadas:**

- **RN-100** — o motorista vê o próprio score **e a composição detalhada do cálculo**. Score opaco vira suspeita, e suspeita vira rejeição do módulo.
- **RN-101** — ranking e score de colegas: `403`, sempre.
- **RN-097** — evento descartado em contestação sai do cálculo.
- **RN-069** — `sampleSufficient: false` quando houver menos de 3 abastecimentos completos; o app oculta o número em vez de exibir dado frágil.
- **Anexo A** — nenhum campo de custo por km, ranking ou consolidado financeiro.

Quando o módulo de Segurança não estiver contratado, `safety.available` é `false` e os demais campos são omitidos — **sem teaser** no contexto operacional (RN-004).

---

## 11. Segurança na estrada

> **Bloqueado para implementação.** Depende de `P-06` — confirmação de que Powerfleet Unity expõe eventos por API. O contrato está especificado; a sprint não está autorizada. Todas as rotas exigem `@RequiresEntitlement(Module.SAFETY)`.

### 11.1 `GET /safety/events?limit=20`

```json
{
  "items": [
    {
      "eventId": "0191e500-...",
      "type": "CINTO_AUSENTE",
      "severity": "ALTO",
      "occurredAt": "2026-08-14T15:02:11-03:00",
      "tripId": "0191e2f0-...",
      "vehiclePlate": "ABC1D23",
      "mediaUrl": "https://media.rookhub.com.br/signed/...?exp=900",
      "mediaExpiresAt": "2026-08-16T09:35:00-03:00",
      "affectsScore": true,
      "dispute": { "status": null, "canDispute": true, "disputeDeadline": "2026-11-12T15:02:11-03:00" }
    }
  ],
  "nextCursor": null,
  "hasMore": false
}
```

RN-094 — o motorista acessa **os próprios eventos e as próprias imagens**. URL assinada com expiração ≤ 15 min (RNF-022). Retenção de 90 dias (RN-093), que define também o prazo de contestação.

### 11.2 `POST /safety/events/{eventId}/dispute`

```json
{
  "clientUuid": "0191f300-...",
  "justification": "O cinto estava afivelado; a alça ficou por baixo do casaco e a câmera não enxergou."
}
```

**`201 Created`**

```json
{
  "disputeId": "0191f300-...",
  "eventId": "0191e500-...",
  "status": "ABERTA",
  "openedAt": "2026-08-16T09:31:00-03:00",
  "decidedBy": null,
  "driverMessage": { "code": "DISPUTE_OPENED", "title": "Contestação enviada", "body": "O gestor vai analisar e você será avisado da decisão.", "blocking": false }
}
```

Estados: `Aberta` → `Mantida` | `Descartada` (RN-096), com decisão privativa de `MANAGER` ou `OWNER` e justificativa obrigatória. `Descartada` exclui o evento do score (RN-097). Justificativa mínima de 10 caracteres; uma contestação em aberto por evento.

> **RN-098 torna este endpoint requisito de adoção, não recurso.** Sem canal de contestação, o primeiro falso positivo destrói a confiança do motorista — e o dado perde credibilidade perante o gestor que paga pelo módulo.

---

## 12. Notificações

### 12.1 `GET /notifications?unreadOnly=true&limit=20`

```json
{
  "items": [
    {
      "notificationId": "0191e600-...",
      "type": "VEHICLE_RELEASED",
      "severity": "INFO",
      "title": "Veículo liberado",
      "body": "O gerente liberou o ABC1D23. Você já pode iniciar a viagem.",
      "createdAt": "2026-08-16T06:02:00-03:00",
      "readAt": null,
      "action": { "type": "OPEN_TRIP", "targetId": "0191e300-..." }
    }
  ],
  "unreadCount": 2,
  "nextCursor": null
}
```

Tipos relevantes ao motorista: `VEHICLE_BLOCKED` · `VEHICLE_RELEASED` · `CHECKLIST_REQUIRED` · `CHECKLIST_EXPIRING` · `LICENSE_EXPIRING` · `TRIP_ASSIGNED` · `TRIP_CANCELLED` · `DISPUTE_DECIDED` · `SYNC_FAILED` · `PENDENCY_RESOLVED`.

Retenção de 90 dias (RN-127). O RBAC e os entitlements são respeitados integralmente: nenhuma notificação de custo, ranking ou anomalia de consumo chega ao `DRIVER`.

### 12.2 `POST /notifications/{notificationId}/read` · `POST /notifications/read-all`

**`204 No Content`.**

---

## 13. Sincronização em lote

### 13.1 `POST /sync/batch`

Até 20 operações. Cada uma carrega seu próprio `clientUuid` e é processada de forma independente.

```json
{
  "deviceId": "0191e0cc-...",
  "sentAt": "2026-08-16T09:40:00-03:00",
  "operations": [
    { "clientUuid": "0191f000-...", "type": "CHECKLIST_CREATE", "priority": 0, "payload": { } },
    { "clientUuid": "0191f100-...", "type": "TRIP_START",       "priority": 1, "payload": { } },
    { "clientUuid": "0191f200-...", "type": "FUEL_RECEIPT",     "priority": 2, "payload": { } }
  ]
}
```

`type`: `CHECKLIST_CREATE` · `TRIP_START` · `TRIP_PAUSE` · `TRIP_RESUME` · `TRIP_FINISH` · `TRIP_EVENT_CREATE` · `FUEL_RECEIPT` · `SAFETY_DISPUTE_CREATE`.

**`207 Multi-Status`**

```json
{
  "receivedAt": "2026-08-16T09:40:02-03:00",
  "serverTime": "2026-08-16T09:40:02-03:00",
  "results": [
    {
      "clientUuid": "0191f000-...",
      "type": "CHECKLIST_CREATE",
      "status": 201,
      "outcome": "CREATED",
      "resource": { "checklistId": "0191f000-...", "serverState": { "vehicleStatus": "INDISPONIVEL" } }
    },
    {
      "clientUuid": "0191f100-...",
      "type": "TRIP_START",
      "status": 409,
      "outcome": "PERMANENT_FAILURE",
      "problem": {
        "type": "https://api.rookhub.com.br/problems/trip-invalid-transition",
        "title": "Viagem já encerrada",
        "status": 409,
        "detail": "Esta viagem foi cancelada pelo escritório em 16/08 às 06:10."
      },
      "driverMessage": { "code": "TRIP_CANCELLED_BY_OFFICE", "title": "Viagem cancelada", "body": "O escritório cancelou esta viagem. Fale com o operador.", "blocking": false }
    },
    {
      "clientUuid": "0191f200-...",
      "type": "FUEL_RECEIPT",
      "status": 503,
      "outcome": "TRANSIENT_FAILURE",
      "retryAfterSeconds": 60
    }
  ],
  "summary": { "total": 3, "succeeded": 1, "permanentFailures": 1, "transientFailures": 1 }
}
```

**Contrato de tratamento no app:**

| `outcome` | Ação |
|---|---|
| `CREATED` · `IDEMPOTENT_REPLAY` | Remove da fila; aplica `serverState` |
| `PERMANENT_FAILURE` | Move para "Requer atenção" e exibe `driverMessage`. **Nunca** reenvia |
| `TRANSIENT_FAILURE` | Mantém na fila com backoff (`RN-D-003`) |

**Ordem de processamento:** o servidor processa por `priority` crescente e, dentro da mesma prioridade, por `filledAt`. Operações da mesma viagem são serializadas — um `TRIP_FINISH` nunca é processado antes do `TRIP_START` correspondente no mesmo lote.

---

## 14. Enumerações

| Enum | Valores |
|---|---|
| `ChecklistType` | `SAIDA` · `DEVOLUCAO` |
| `ChecklistResponse` | `CONFORME` · `NAO_CONFORME` · `NAO_APLICAVEL` |
| `Severity` | `ATENCAO` · `CRITICO` |
| `EventSeverity` | `INFORMATIVO` · `BAIXO` · `ALTO` · `CRITICO` |
| `ResponseType` | `CONFORMITY` · `CONFORMITY_NUMERIC` |
| `VehicleStatus` | `DISPONIVEL` · `EM_VIAGEM` · `EM_MANUTENCAO` · `INDISPONIVEL` · `INATIVO` |
| `TripStatus` | `PLANEJADA` · `EM_ANDAMENTO` · `CONCLUIDA` · `CANCELADA` |
| `PendencyStatus` | `ABERTA` · `EM_TRATAMENTO` · `RESOLVIDA` · `CANCELADA` |
| `FuelReceiptStatus` | `NAO_VINCULADO` · `VINCULADO` · `DESCARTADO` |
| `DisputeStatus` | `ABERTA` · `MANTIDA` · `DESCARTADA` |
| `SafetyEventType` | `SONOLENCIA` · `COLISAO_IMINENTE` · `DISTRACAO` · `CELULAR` · `CINTO_AUSENTE` · `FUMO_CABINE` · `BOCEJO` |
| `OdometerSource` | `TELEMETRY` · `GPS` · `MANUAL` · `DRIVER_APP` |
| `AuditFlag` | `CLOCK_DIVERGENCE` · `ODOMETER_GPS_DIVERGENCE` · `MOCK_LOCATION` · `PHOTO_CAPTURE_DATE_MISMATCH` · `STARTED_WITHOUT_VALID_CHECKLIST` |
| `LicenseStatus` | `VALID` · `EXPIRING` · `EXPIRED` |

**Regra de evolução:** enumerações são aditivas. O app **deve** tratar valor desconhecido de forma degradada — exibir o código bruto — em vez de quebrar. Um PWA em campo pode estar semanas atrás da versão do servidor, e o motorista não pode ficar sem checklist porque um enum novo apareceu.
