# Arquitetura Free Tier — MVP de Validação — RookHub

**Variante de custo zero da arquitetura definitiva, para validação pré-aprovação**

---

## 0. Controle do Documento

| Campo | Valor |
|---|---|
| Produto | RookHub |
| Documento | Arquitetura Free Tier — MVP de Validação |
| Versão | 1.0 |
| Status | Aprovado para MVP de validação |
| Data | 28 de julho de 2026 |
| Autor | Lead Solutions Architect / CTO |
| Documento pai | `arquitetura_e_decisoes_tecnicas_RookHub.md` v1.0 |
| Documentos de origem | `prd_RookHub.md` v1.0, `DESIGN.md` |
| Vigência | Até aprovação do orçamento da stack definitiva |

---

## 1. Princípio Condutor

> **A arquitetura não muda. Apenas os provedores mudam.**

Este documento **não é uma arquitetura alternativa**. É a mesma arquitetura do documento pai, com cada componente pago substituído por um equivalente gratuito de nível técnico comparável.

Isso é possível porque o desenho original já previa abstrações nos pontos exatos onde a troca de fornecedor ocorreria:

| Abstração já existente | O que ela permite trocar |
|---|---|
| `LlmProvider` (RN-109) | Gemini ↔ OpenAI ↔ modelo local |
| Interface de filas (`BE-13`) | Redis ↔ Kafka |
| SDK S3-compatível (`DAT-03`) | R2 ↔ S3 ↔ MinIO |
| ACL por fornecedor (RN-138) | Qualquer telemetria |
| OpenTelemetry (`INF-04`) | Datadog ↔ Grafana ↔ self-hosted |
| Terraform multi-provider (`INF-03`) | Qualquer nuvem |

**Consequência prática:** a migração da stack gratuita para a definitiva é uma mudança de **configuração e infraestrutura**, não de código de aplicação. Nenhuma regra de negócio, nenhum módulo do Spring Modulith, nenhum componente de frontend precisa ser reescrito.

### 1.1 O que permanece rigorosamente idêntico

- Java 21 + Spring Boot 3.x + Spring Modulith, mesmos 13 módulos
- Monólito modular + worker dedicado (`BE-08`)
- PostgreSQL + TimescaleDB com RLS e as **quatro camadas de garantia** (`BE-14`)
- REST + OpenAPI 3.1, cliente TypeScript gerado
- Spring Data JPA + jOOQ (`BE-10`)
- Monorepo com três aplicações frontend (`FE-03`, `FE-04`, `FE-05`)
- Tailwind v4 + shadcn/ui + rampa tonal `FE-12` + Spectrum Gradient magenta
- Redisson + Spring Batch (`BE-12`)
- Todos os gates bloqueantes de CI (RN-002, cross-tenant, WCAG AA, RNF-006)
- Log de auditoria com hash encadeado (`DAT-07`)
- Camada de anticorrupção de integrações (`INT-01`)

### 1.2 O que muda

**Somente onde havia fatura.** Quatorze substituições, detalhadas na Seção 3.

---

## 2. Quadro Comparativo — Definitiva × Free Tier

| # | Componente | Stack definitiva | Stack free tier | Custo evitado/mês |
|---|---|---|---|---|
| 1 | Computação (api + worker) | AWS ECS Fargate | **Oracle Cloud Always Free** (ARM) | US$ 60–100 |
| 2 | Load balancer / TLS | AWS ALB | **Caddy** no VM + Cloudflare proxy | US$ 20–25 |
| 3 | Banco + telemetria | Timescale Cloud | **PostgreSQL 16 + TimescaleDB Community** self-hosted | US$ 50–150 |
| 4 | Cache / filas / pub-sub | AWS ElastiCache | **Redis** self-hosted no mesmo VM | US$ 15–25 |
| 5 | Object storage | Cloudflare R2 (pago) | **Cloudflare R2 free tier** (10 GB) | US$ 8 |
| 6 | Site institucional | Vercel Pro | **Cloudflare Pages** (Next.js static export) | US$ 20 |
| 7 | LLM | Gemini pago | **Gemini free tier** (só dados sintéticos) ou pago mínimo | US$ 20–80 |
| 8 | STT | Google Speech-to-Text | **Web Speech API** (navegador) | US$ 5–20 |
| 9 | TTS | ElevenLabs | **Piper TTS** self-hosted (ou Web Speech) | US$ 99–150 |
| 10 | Observabilidade | Datadog | **Grafana Cloud Free** (OTel idêntico) | US$ 150–250 |
| 11 | Rastreio de erros | Sentry Team | **Sentry Developer (free)** ou GlitchTip | US$ 26 |
| 12 | E-mail transacional | AWS SES | **Resend free tier** | US$ 1–5 |
| 13 | Mapas | Mapbox GL | **MapLibre GL + OpenFreeMap / PMTiles no R2** | US$ 0–50 |
| 14 | Ligação automática | Zenvia | **Telegram Bot** (substituto funcional) | US$ 10–40 |
| 15 | Secrets | AWS Secrets Manager | **SOPS + age** (criptografia em repositório) | US$ 5 |
| 16 | Registro de imagens | AWS ECR | **GitHub Container Registry** | US$ 3 |
| — | Push (RN-048) | Firebase FCM | **Firebase FCM** — já gratuito | — |
| — | Frontends web/PWA | Cloudflare Pages | **Cloudflare Pages** — já gratuito | — |
| — | CI/CD | GitHub Actions | **GitHub Actions** — já gratuito | — |
| — | IaC | OpenTofu | **OpenTofu** — já gratuito | — |
| — | Migrations | Flyway | **Flyway Community** — já gratuito | — |
| | **TOTAL** | **US$ 475–970** | **≈ US$ 1–6** | **~US$ 470–965** |

> **Nota sobre limites de camada gratuita.** As cotas citadas neste documento refletem os planos vigentes no momento da redação. Camadas gratuitas mudam com frequência e sem aviso — **verifique os limites atuais de cada fornecedor no momento da implantação**, especialmente Oracle Cloud, Grafana Cloud e Resend.

---

## 3. Substituições Detalhadas

### `FREE-01` — Computação: Oracle Cloud Always Free

**A peça central de toda esta arquitetura.**

| Recurso | Cota permanente |
|---|---|
| CPU | 4 núcleos ARM Ampere A1 |
| Memória | 24 GB |
| Disco em bloco | 200 GB |
| Tráfego de saída | 10 TB/mês |
| IP público | 1 reservado |
| Região | `sa-saopaulo-1` (São Paulo) |

**Por que é adequado.** 4 núcleos e 24 GB de RAM comportam com folga PostgreSQL+TimescaleDB, Redis, a API Java e o worker simultaneamente. É mais capacidade computacional do que o Fargate de 2 tasks × 1 vCPU da stack definitiva.

**Java 21 em ARM:** totalmente suportado (Eclipse Temurin `linux/aarch64`). A imagem Docker precisa ser construída para `linux/arm64` — configurar `docker buildx` no GitHub Actions.

#### Topologia no VM

```
┌──────────────────────────────────────────────────────┐
│  Oracle Cloud Always Free — ARM A1 (4 OCPU / 24 GB)  │
│  Ubuntu 24.04 LTS · Docker Compose                   │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ caddy          :443  TLS automático (Let's     │  │
│  │                      Encrypt) + WebSocket      │  │
│  └───────────────┬────────────────────────────────┘  │
│                  ▼                                   │
│  ┌──────────────────────┐  ┌───────────────────────┐ │
│  │ rookhub-api          │  │ rookhub-worker        │ │
│  │ Spring Boot          │  │ Spring Boot           │ │
│  │ profile=api          │  │ profile=worker        │ │
│  │ 4 GB heap            │  │ 3 GB heap             │ │
│  └──────────┬───────────┘  └──────────┬────────────┘ │
│             └──────────┬───────────────┘             │
│                        ▼                             │
│  ┌────────────────┐  ┌──────────┐  ┌───────────────┐ │
│  │ postgres:16    │  │ redis:7  │  │ piper-tts     │ │
│  │ + timescaledb  │  │ 1 GB     │  │ (opcional)    │ │
│  │ 8 GB shared    │  │          │  │               │ │
│  └────────────────┘  └──────────┘  └───────────────┘ │
│  ┌────────────────┐  ┌──────────────────────────────┐│
│  │ otel-collector │  │ pgbackrest / cron → R2       ││
│  └────────────────┘  └──────────────────────────────┘│
└──────────────────────────────────────────────────────┘
                        ▲
                        │ Cloudflare proxy (WAF, DDoS,
                        │ TLS de borda) — gratuito
```

#### `FRT-01` — Riscos reais do Oracle Always Free

| Risco | Impacto | Mitigação |
|---|---|---|
| **Capacidade ARM indisponível** na região desejada | Não consegue provisionar | Script de retentativa automatizada; alternativa em `sa-vinhedo-1`; plano B: Hetzner CX22 a €4/mês (não gratuito, mas trivial) |
| **Recuperação de instância ociosa** | VM deletada | Contas Always Free podem ter instâncias ociosas recuperadas. Manter carga real e monitoramento ativo. **Considerar upgrade para conta Pay As You Go sem consumo** — mantém a cota gratuita e remove a política de recuperação |
| **Sem SLA** | Indisponibilidade sem recurso | Aceito conscientemente — ver `FRT-02` |
| **Ponto único de falha** | Queda total | Backup automatizado + IaC permitem recriação em ~1h |

---

### `FREE-02` — TLS e roteamento: Caddy + Cloudflare

Substitui o AWS ALB.

- **Caddy** — proxy reverso com TLS automático via Let's Encrypt, suporte nativo a WebSocket, configuração de poucas linhas
- **Cloudflare (plano gratuito)** — DNS, proxy, WAF básico, mitigação de DDoS, cache de estáticos

```caddyfile
api.rookhub.com.br {
    encode zstd gzip
    reverse_proxy rookhub-api:8080 {
        header_up X-Forwarded-Proto {scheme}
    }
}
```

**Atenção ao WebSocket (`FE-11`):** o Cloudflare gratuito suporta WebSocket, mas encerra conexões ociosas por volta de 100 segundos. **Configurar heartbeat STOMP em 30 segundos** — isso já era boa prática e passa a ser obrigatório.

**Sticky sessions deixam de ser necessárias** nesta stack: com instância única de API, toda conexão WebSocket aterrissa no mesmo processo. O Redis pub/sub permanece implementado (o código não muda) e volta a ser essencial quando a stack definitiva escalar horizontalmente.

---

### `FREE-03` — PostgreSQL 16 + TimescaleDB Community self-hosted

**A substituição mais importante do ponto de vista funcional**, e a que menos perde.

**Fato decisivo:** *hypertables*, **compressão nativa** e **continuous aggregates** estão todos disponíveis na **TimescaleDB Community Edition**, que é gratuita. As decisões `DAT-02` e `DAT-06` do documento pai — que sustentam o RNF-001 — permanecem **integralmente implementáveis**.

```yaml
# docker-compose.yml (trecho)
postgres:
  image: timescale/timescaledb:latest-pg16
  environment:
    POSTGRES_DB: rookhub
    TIMESCALEDB_TELEMETRY: 'off'
  volumes:
    - /data/postgres:/var/lib/postgresql/data
  shm_size: 1gb
  command: >
    postgres
    -c shared_buffers=6GB
    -c effective_cache_size=16GB
    -c max_connections=100
    -c work_mem=32MB
    -c wal_level=replica
    -c archive_mode=on
```

**Tudo do documento pai permanece válido sem uma linha de diferença:** policies RLS, `FORCE ROW LEVEL SECURITY`, `TenantContext.withTenant()`, hypertables, políticas de compressão e retenção, continuous aggregates, migrations Flyway.

**Pooler:** PgBouncer em *transaction mode* no mesmo Compose, ou o pool nativo do HikariCP. Com instância única, o HikariCP é suficiente — **desde que o `set_config(..., true)` continue sendo usado**, exatamente como especificado em `BE-14`. A regra de isolamento **não relaxa** por ser ambiente gratuito.

#### `FRT-02` — Continuidade degradada (RNF-023 / RNF-024)

A stack definitiva atendia RPO 24h e RTO 4h com PITR gerenciado. Aqui, isso passa a ser responsabilidade própria.

**Plano de backup obrigatório — não opcional:**

| Item | Implementação |
|---|---|
| Dump lógico | `pg_dump` comprimido, diário às 03:00, enviado ao Cloudflare R2 |
| WAL archiving | `pgBackRest` com repositório no R2 (S3-compatível), permitindo PITR |
| Retenção | 7 diários + 4 semanais + 3 mensais |
| Verificação | Job semanal que restaura o backup em container efêmero e valida contagens |
| Volumes | Snapshot do block volume do Oracle (a cota gratuita permite) |
| Restauração documentada | Runbook com tempo de execução medido, revisado mensalmente |

> **RPO real:** ~24h com dump lógico; ~5 min com WAL archiving configurado. **RTO real:** 1–3h com IaC e runbook prontos. Ambos atendem os requisitos **desde que o plano acima seja efetivamente implementado na Sprint 0** — sem ele, RPO e RTO são indefinidos.

---

### `FREE-04` — Redis self-hosted

```yaml
redis:
  image: redis:7-alpine
  command: >
    redis-server
    --appendonly yes
    --appendfsync everysec
    --maxmemory 1gb
    --maxmemory-policy noeviction
```

`noeviction` é obrigatório: as filas do Redisson não podem perder mensagens por pressão de memória. AOF com `everysec` dá durabilidade adequada.

Redisson, Spring Batch e ShedLock funcionam sem qualquer alteração.

**Alternativas gerenciadas gratuitas avaliadas e descartadas:** Upstash (cota diária de comandos insuficiente para pub/sub contínuo) e Redis Cloud free (30 MB, apertado para filas). O self-hosted no VM que já existe é superior e não consome cota externa.

---

### `FREE-05` — Cloudflare R2 free tier

**Praticamente nenhuma mudança** — o R2 já era a escolha e possui camada gratuita generosa:

| Recurso | Cota gratuita |
|---|---|
| Armazenamento | 10 GB/mês |
| Operações de escrita | 1 milhão/mês |
| Operações de leitura | 10 milhões/mês |
| **Egress** | **Ilimitado e gratuito** |

**Cabimento para o MVP.** Fotos de checklist a ~300 KB (RN-040):
`10 GB ÷ 300 KB ≈ 33.000 fotos`. Com 2 tenants e ~20 checklists/dia com 3 fotos por item não conforme, a cota comporta vários meses de operação.

**Disciplina obrigatória para permanecer na cota:**
- Compressão para WebP no cliente antes do envio (já previsto em RN-040)
- Retenção de 90 dias em eventos de segurança aplicada rigorosamente (RN-093)
- Bucket de importações com expurgo em 30 dias
- Alerta ao atingir 8 GB
- Export Parquet do dataset (`DAT-05`) em cadência mensal, não diária

---

### `FREE-06` — Site institucional em Cloudflare Pages

**Vercel Hobby não é opção.** Os termos do plano gratuito da Vercel **proíbem uso comercial** — e um site de vitrine com página de planos é inequivocamente comercial. Usar Hobby aqui seria violação de contrato.

**Solução:** Next.js 15 com `output: 'export'` (exportação estática) hospedado em **Cloudflare Pages**, que permite uso comercial na camada gratuita.

**O que se perde:** SSR e ISR. Para uma vitrine com páginas de produto, planos e blog, **SSG é suficiente e frequentemente superior** em performance. Se surgir necessidade de renderização dinâmica, `@cloudflare/next-on-pages` habilita rotas dinâmicas em Workers, ainda dentro da camada gratuita.

`apps/web` e `apps/driver` permanecem em Cloudflare Pages, sem mudança alguma.

---

### `FREE-07` — LLM: a única restrição contratual real

**Este é o ponto de maior atenção do documento.**

A **RN-110** determina: *"o RookHub DEVE operar exclusivamente na camada paga do provedor, em todos os ambientes que tratem dado real de cliente, inclusive desenvolvimento"*. A justificativa é que, na camada gratuita, o conteúdo enviado é utilizado pelo fornecedor para melhoria de seus produtos — incompatível com tratamento de dado de terceiros.

**Nenhuma leitura criativa contorna isso.** Mas a redação do próprio requisito abre um caminho legítimo:

#### Três opções, com análise honesta

| Opção | Descrição | Custo | Conformidade com RN-110 |
|---|---|---|---|
| **A. Camada gratuita com dados exclusivamente sintéticos** | Ambiente de demonstração povoado apenas com frota fictícia. Nenhum dado real de cliente trafega. | **US$ 0** | ✅ **Conforme** — não há "dado real de cliente" |
| **B. Camada paga com modelo econômico** | Gemini 2.5 Flash Lite, uso de validação | **US$ 2–5/mês** | ✅ **Conforme** |
| **C. Modelo aberto self-hosted** | Llama 3.2 3B ou Qwen2.5 7B via llama.cpp no VM ARM | US$ 0 | ✅ Conforme (nada sai do servidor) |

#### Avaliação técnica da opção C

Inferência em CPU ARM (4 núcleos, sem GPU) entrega aproximadamente **5–15 tokens/segundo** em modelos de 3B quantizados. Consequências:

- **RNF-002** (resposta em < 4s no p95): **não é atendido** de forma confiável
- **Function calling** em modelos pequenos é significativamente menos preciso — e a RN-107 escolheu function calling justamente porque *"um número errado é pior que 'ainda não sei responder'"*
- Consome 4–8 GB de RAM, competindo com o PostgreSQL

**Veredito:** a opção C é útil para **desenvolvimento local e testes automatizados**, evitando qualquer chamada externa em CI. **Não é adequada para demonstração comercial.**

#### Recomendação

> **Opção A para o ambiente de demonstração + Opção B para o piloto com dado real.**
>
> O custo combinado fica entre **US$ 0 e US$ 5/mês** — mantendo conformidade integral com a RN-110 e qualidade de resposta adequada à demonstração comercial, que é o objetivo do MVP de validação.

A camada `LlmProvider` permanece inalterada; a troca é uma variável de ambiente.

**Toda a governança da IA continua obrigatória e sem relaxamento:** gate de autorização antes da execução da função (RN-118/RN-119), tokenização do payload (RN-122), escopo temático fechado (RN-120), fonte e período na resposta (RN-121). **Ambiente gratuito não é desculpa para relaxar controle de acesso.**

---

### `FREE-08` — STT: Web Speech API

Reconhecimento de fala executado **no navegador do usuário**, sem custo e sem envio de áudio a servidor externo.

```js
const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
rec.lang = 'pt-BR';
rec.continuous = false;
rec.interimResults = true;
```

| Aspecto | Avaliação |
|---|---|
| Qualidade em pt-BR | Boa no Chrome e Edge (usa a infraestrutura do Google) |
| Latência | Excelente — processamento em streaming |
| Suporte | Chrome, Edge, Safari (parcial). **Firefox não suporta.** |
| Privacidade | **Vantagem** — o áudio não passa pelo backend do RookHub |
| Custo | **US$ 0** |

**Mitigação de suporte:** a funcionalidade de voz é exclusiva de `OWNER` e `MANAGER` (RN-113), perfis que usam navegador desktop moderno. Detecção de capacidade com fallback para entrada por texto, que é o caminho principal de qualquer forma (`Ctrl+K`, RN-115).

Uma alternativa 100% offline seria **whisper.cpp** no VM ARM, mas a latência em CPU comprometeria o RNF-003. Reservado para caso de necessidade de independência total de fornecedor.

---

### `FREE-09` — TTS: Piper (self-hosted) ou Web Speech Synthesis

Substitui o ElevenLabs — a maior economia isolada do documento (US$ 99–150/mês).

| Opção | Qualidade | Latência | Custo |
|---|---|---|---|
| **A. Piper TTS** (self-hosted, container ARM) | **Boa** — vozes neurais pt-BR (`pt_BR-faber-medium`, `pt_BR-edresson-low`) | ~200–500 ms para frases curtas em CPU ARM | US$ 0 |
| **B. Web Speech Synthesis** (navegador) | Variável — depende das vozes do sistema operacional | Instantânea | US$ 0 |

**Recomendação: A (Piper), com B como fallback.**

O Piper é surpreendentemente bom para um modelo local: qualidade claramente superior às vozes nativas de sistema operacional, ainda que abaixo do ElevenLabs. Roda como container no mesmo VM, consumindo ~500 MB de RAM.

```yaml
piper:
  image: rhasspy/piper:latest
  command: --model /models/pt_BR-faber-medium.onnx --output-raw
  volumes: [ /data/piper-models:/models ]
```

**RNF-003 (início da fala em < 6s no p95):** atendido com folga em geração local — o Piper elimina a latência de rede que o ElevenLabs introduz.

A abstração `TtsProvider` permanece; a migração para ElevenLabs na stack definitiva é troca de configuração.

---

### `FREE-10` — Observabilidade: Grafana Cloud Free

Substitui o Datadog — a **maior economia do documento** (US$ 150–250/mês) com a **menor perda funcional**, porque a instrumentação já era **OpenTelemetry** por decisão de `INF-04`.

| Recurso | Cota gratuita típica |
|---|---|
| Métricas | ~10.000 séries ativas |
| Logs | ~50 GB/mês |
| Traces | ~50 GB/mês |
| Retenção | 14 dias (métricas), 30 dias (logs) |
| Usuários | 3 |

**A migração é literalmente trocar o endpoint do OTel Collector.** Nenhuma linha de código de aplicação muda. Foi exatamente por antecipar esse cenário que o documento pai determinou instrumentação via OpenTelemetry em vez do agente proprietário do Datadog.

**Todos os alertas mínimos da Seção 7 do documento pai permanecem configurados**, inclusive os limiares de RNF-001, RNF-002, RNF-004 e RNF-007.

**Alternativa 100% self-hosted:** stack Prometheus + Grafana + Loki + Tempo no mesmo VM. Custo zero e retenção ilimitada, mas consome ~2 GB de RAM e adiciona carga operacional. **Recomendo o Grafana Cloud Free** — preserva RAM para o PostgreSQL e mantém a observabilidade disponível mesmo quando o VM está com problema, que é justamente o momento em que ela mais importa.

---

### `FREE-11` — Rastreio de erros: Sentry Developer (gratuito)

O plano Developer do Sentry é gratuito e cobre 1 usuário com aproximadamente 5.000 erros/mês. Para um MVP com 2 tenants, é adequado.

Cobre backend Java e os três frontends. Session replay não está incluso na camada gratuita — perda aceitável nesta fase.

**Alternativa self-hosted:** GlitchTip (compatível com o SDK do Sentry, ~300 MB de RAM). Trocar apenas se a cota de erros for ultrapassada.

---

### `FREE-12` — E-mail transacional: Resend

Substitui o AWS SES. Camada gratuita típica: ~3.000 e-mails/mês, ~100/dia.

**Cabimento (RN-048).** Notificações por e-mail em severidade `Crítico` para `MANAGER`/`OWNER`, e sempre para `MAINTENANCE`. Com 2 tenants, o volume diário fica em dezenas — bem dentro da cota.

**Requisito de entregabilidade:** configurar SPF, DKIM e DMARC no domínio. Sem isso, notificação crítica cai em spam — falha funcional grave, independentemente do fornecedor.

**Alternativa:** Brevo (~300 e-mails/dia gratuitos), se o limite diário do Resend apertar.

---

### `FREE-13` — Mapas: MapLibre GL + tiles gratuitos

Substitui o Mapbox, eliminando também o risco `RT-02` do documento pai (custo por *map load* escalando de forma não-linear).

**MapLibre GL JS** é o fork open source do Mapbox GL JS v1 — **a API é praticamente idêntica**, tornando a migração de ida e volta trivial.

| Fonte de tiles | Custo | Observação |
|---|---|---|
| **A. OpenFreeMap** | Gratuito, sem chave de API, sem limite declarado | Estilos vetoriais prontos, incluindo dark |
| **B. PMTiles no próprio R2** | Gratuito (dentro da cota R2) | **Solução mais elegante**: um único arquivo PMTiles do Brasil hospedado no R2, servido com egress gratuito. Independência total de terceiros. |
| **C. MapTiler free** | Gratuito até ~100k tiles/mês | Exige chave; risco de estourar cota |

**Recomendação: A no início, migrando para B** se houver necessidade de controle total ou customização de estilo.

**Estilo dark customizado** derivado da rampa `FE-12` — o MapLibre aceita especificação de estilo em JSON, permitindo alinhar o mapa ao glassmorphism com mais controle do que o Mapbox Studio oferecia.

Os indicadores pulsantes de frota (`FleetIndicator`) funcionam identicamente via `symbol layer` com animação em `setData`.

---

### `FREE-14` — Ligação automática (RN-085): substituto funcional

**Registro honesto: não existe telefonia gratuita.** Chamadas de voz têm custo marginal real de operadora, e nenhum fornecedor oferece camada gratuita sustentável.

A **RN-085** exige que 3 eventos críticos do mesmo motorista em 1 hora disparem ligação automática para o gestor.

#### Substituto proposto para o MVP de validação

| Canal | Implementação | Custo |
|---|---|---|
| **Telegram Bot** | Mensagem instantânea ao gestor com botão de ação embutido | **US$ 0** — API totalmente gratuita |
| **Push com prioridade máxima** | FCM com `priority: high`, som e vibração persistentes | US$ 0 |
| **E-mail com marcação de urgência** | Resend | US$ 0 |

O Telegram é o substituto mais próximo funcionalmente: entrega em segundos, notificação sonora no celular, suporta botões (atendendo à RN-091, que exige ações embutidas como "Ligar para o motorista") e é amplamente usado no setor de transporte brasileiro.

#### `FRT-03` — Dívida registrada

A ligação telefônica automatizada é **requisito do PRD** e **não é atendida** nesta stack. Retorna com a Zenvia na stack definitiva, a um custo de US$10–40/mês.

**Ação obrigatória:** validar com o cliente-âncora durante o MVP se a notificação por Telegram é aceitável, ou se a ligação é inegociável. Essa resposta é um dado valioso de produto — e o MVP de validação existe justamente para produzi-lo.

---

### `FREE-15` — Secrets: SOPS + age

Substitui o AWS Secrets Manager.

**SOPS** (Mozilla) com **age** criptografa arquivos de configuração que ficam versionados no repositório. Apenas quem possui a chave privada consegue descriptografar.

```bash
sops --encrypt --age $AGE_PUBLIC_KEY secrets.env > secrets.enc.env
```

- Chave privada armazenada em **GitHub Secrets** (gratuito) para o CI
- No servidor, a chave fica em arquivo com permissão `0600`
- Rotação manual e documentada

**O que se perde:** rotação automática e auditoria de acesso a segredos. Aceitável para 3 desenvolvedores em MVP; retorna com o Secrets Manager na stack definitiva.

**Regra que não relaxa:** nenhum segredo em texto claro no repositório, nem em variável de ambiente de imagem Docker.

---

### `FREE-16` — Registro de imagens: GitHub Container Registry

GHCR é gratuito e ilimitado para repositórios públicos, e generoso para privados. Integração nativa com GitHub Actions via `GITHUB_TOKEN`.

Construção multi-arquitetura obrigatória para o VM ARM:

```yaml
- uses: docker/build-push-action@v6
  with:
    platforms: linux/arm64
    push: true
    tags: ghcr.io/${{ github.repository }}/rookhub:${{ github.sha }}
```

---

### 3.1 Componentes que permanecem inalterados

| Componente | Situação |
|---|---|
| Firebase FCM (push) | Já gratuito na stack definitiva |
| Cloudflare Pages (web + driver) | Já gratuito |
| GitHub Actions | 2.000 min/mês em repositório privado — suficiente |
| OpenTofu | Open source; state remoto no R2 (S3-compatível) |
| Flyway Community | Gratuito |
| jOOQ | Gratuito para PostgreSQL |
| Todas as bibliotecas Java e JavaScript | Open source |

---

## 4. CI/CD Adaptado

```
Pull Request
  ├─ lint + typecheck (frontends)
  ├─ build Java + testes unitários
  ├─ Testcontainers: integração (Postgres+Timescale + Redis)
  ├─ ArchUnit: fronteiras do Modulith + proibição de DataSource fora do TenantContext
  ├─ GATE RN-002: tenant_id NOT NULL + policy RLS em toda tabela de domínio  [BLOQUEANTE]
  ├─ GATE cross-tenant: teste de concorrência                                [BLOQUEANTE]
  ├─ GATE RNF-028: axe-core (contraste WCAG AA)                              [BLOQUEANTE]
  ├─ GATE RNF-006: teste cronometrado de esforço do operador                 [BLOQUEANTE]
  ├─ Trivy: vulnerabilidades
  └─ Lighthouse CI: bundle budget do PWA

Merge em main
  ├─ docker buildx → linux/arm64 → GHCR
  ├─ SSH no VM Oracle (chave em GitHub Secrets)
  ├─ Flyway migrate
  ├─ docker compose pull && up -d (rolling manual)
  └─ smoke tests
```

> **Nenhum gate bloqueante é removido.** Os quatro gates do documento pai permanecem obrigatórios. O isolamento multi-tenant não admite flexibilização por ambiente ser gratuito — um vazamento cross-tenant em MVP de demonstração comercial é tão fatal quanto em produção.

**Ambientes:** apenas **produção** (o MVP de validação **é** o ambiente demonstrado). Desenvolvimento local via Docker Compose idêntico ao de produção, com Testcontainers no CI.

---

## 5. Requisitos Não-Funcionais — Situação Real

| ID | Requisito | Stack definitiva | Stack free tier | Avaliação |
|---|---|---|---|---|
| RNF-001 | Painel < 2s p95 | ✅ | ✅ | Continuous aggregates disponíveis na Community Edition |
| RNF-002 | IA texto < 4s p95 | ✅ | ✅ | Gemini Flash Lite atende |
| RNF-003 | TTS início < 6s p95 | ✅ | ✅ | Piper local é **mais rápido** que ElevenLabs |
| RNF-004 | Salvamento < 500ms p95 | ✅ | ✅ | Recursos do VM superam o Fargate previsto |
| RNF-005 | Sync offline < 60s | ✅ | ✅ | Sem alteração |
| RNF-006 | Esforço do operador | ✅ | ✅ | Requisito de produto, não de infraestrutura |
| RNF-007 | Evento crítico < 10s | ✅ | ✅ | Sem alteração |
| **RNF-008** | **Disponibilidade 99,5%** | ✅ | ⚠️ **Degradado** | Sem SLA; instância única; ver `FRT-02` |
| RNF-009–013 | Offline do PWA | ✅ | ✅ | Sem alteração |
| RNF-014–017 | Plataforma | ✅ | ✅ | Sem alteração |
| RNF-018 | TLS 1.2+ e criptografia | ✅ | ✅ | Caddy + Cloudflare; disco criptografado no Oracle |
| RNF-019 | Argon2id | ✅ | ✅ | Sem alteração |
| RNF-020 | Auditoria imutável | ✅ | ✅ | Sem alteração — hash encadeado no Postgres |
| RNF-021 | Rate limiting | ✅ | ✅ | Redisson, sem alteração |
| RNF-022 | URLs assinadas 15 min | ✅ | ✅ | R2 presigned, sem alteração |
| **RNF-023** | **RPO 24h** | ✅ | ⚠️ **Condicionado** | Atendido **somente se** o plano de backup for implementado |
| **RNF-024** | **RTO 4h** | ✅ | ⚠️ **Condicionado** | 1–3h com IaC + runbook testado |
| RNF-025 | Teste de restauração | ✅ | ✅ | Job semanal automatizado (mais frequente que o trimestral exigido) |
| RNF-026–029 | Design | ✅ | ✅ | Sem alteração |

**Requisitos do PRD não atendidos nesta stack:**

| Requisito | Situação |
|---|---|
| **RN-085** — ligação automática ao gestor | ❌ Substituído por Telegram (`FRT-03`) |
| **RNF-008** — 99,5% de disponibilidade | ⚠️ Sem garantia contratual |

---

## 6. Riscos Específicos da Stack Free Tier

| ID | Risco | Severidade | Mitigação |
|---|---|---|---|
| `FRT-01` | Capacidade ARM indisponível ou instância recuperada no Oracle | **Alta** | Retentativa automatizada; considerar conta PAYG sem consumo; plano B em Hetzner (€4/mês) |
| `FRT-02` | Ausência de SLA e de HA — ponto único de falha | **Alta** | Backup diário + WAL archiving no R2; IaC completo; runbook de restauração testado semanalmente |
| `FRT-03` | RN-085 (ligação) não atendida | Média | Telegram como substituto; **validar aceitação com o cliente-âncora durante o MVP** |
| `FRT-04` | Cotas gratuitas alteradas unilateralmente | Média | Monitorar consumo; manter a stack definitiva pronta para acionamento; IaC permite migração rápida |
| `FRT-05` | Cota de 10 GB do R2 esgotada | Média | Compressão WebP; retenção de 90 dias aplicada; alerta em 8 GB; export Parquet mensal |
| `FRT-06` | Web Speech API sem suporte no Firefox | Baixa | Detecção de capacidade + fallback para texto (caminho principal de qualquer forma) |
| `FRT-07` | Cloudflare encerra WebSocket ocioso (~100s) | Baixa | Heartbeat STOMP em 30s — boa prática que vira obrigatória |
| `FRT-08` | Carga operacional recai sobre o time de 3 devs | Média | Docker Compose declarativo; OpenTofu; observabilidade externa (Grafana Cloud) disponível mesmo com VM em falha |
| `FRT-09` | Sem rotação automática de segredos | Baixa | SOPS com rotação manual documentada e agendada |

---

## 7. Plano de Migração para a Stack Definitiva

A migração foi desenhada para ser **incremental e sem downtime relevante**, componente por componente, sem tocar código de aplicação.

| Ordem | Componente | Ação | Downtime | Complexidade |
|---|---|---|---|---|
| 1 | **LLM** | Alterar `rookhub.llm.provider` e chave | Nenhum | Trivial |
| 2 | **TTS** | Alterar `TtsProvider` para ElevenLabs | Nenhum | Trivial |
| 3 | **STT** | Ativar Google Speech-to-Text | Nenhum | Trivial |
| 4 | **Observabilidade** | Redirecionar endpoint do OTel Collector | Nenhum | Trivial |
| 5 | **E-mail** | Trocar credenciais para AWS SES | Nenhum | Trivial |
| 6 | **Mapas** | MapLibre → Mapbox GL (API compatível) | Nenhum | Baixa |
| 7 | **Ligação** | Ativar integração Zenvia | Nenhum | Baixa |
| 8 | **Secrets** | SOPS → AWS Secrets Manager | Nenhum | Baixa |
| 9 | **Object storage** | Permanece R2 — apenas sai da camada gratuita | Nenhum | Nenhuma |
| 10 | **Site** | Cloudflare Pages → Vercel (reativar SSR) | Nenhum | Baixa |
| 11 | **Redis** | Self-hosted → ElastiCache | ~minutos | Média |
| 12 | **Computação** | Oracle VM → ECS Fargate | Janela planejada | Média |
| 13 | **Banco** | Self-hosted → Timescale Cloud | **Janela de manutenção** | **Alta** |

**Item 13 — o único verdadeiramente sensível.** Migração via `pg_dump`/`pg_restore` ou replicação lógica. Recomendação: replicação lógica do PostgreSQL para migrar com janela de poucos minutos em vez de horas.

> **Ponto crítico:** como o schema, as policies RLS, as hypertables e as migrations Flyway são **idênticos** nas duas stacks, a migração de banco é transferência de dados — **não é conversão de modelo**. Foi essa decisão (manter TimescaleDB nas duas variantes, em vez de usar Postgres puro na gratuita) que tornou a migração viável sem retrabalho.

---

## 8. Custo Real Consolidado

| Item | Custo mensal |
|---|---|
| Toda a infraestrutura (Oracle, Cloudflare, Grafana, Sentry, Resend, GHCR, FCM, Telegram) | **US$ 0** |
| Domínio `.com.br` (~R$ 40/ano) | ~US$ 0,70 |
| LLM — demonstração com dados sintéticos | US$ 0 |
| LLM — piloto com dado real (Gemini Flash Lite, conforme RN-110) | US$ 2 – 5 |
| **Total** | **US$ 1 – 6** |

**Economia mensal: ~US$ 470 – 965.**
**Economia em 6 meses de validação: ~US$ 2.800 – 5.800.**

---

## 9. Recomendações de Execução

### Antes da Sprint 0

1. **Provisionar a conta Oracle Cloud imediatamente** — a disponibilidade de capacidade ARM é o item de maior incerteza (`FRT-01`) e pode levar dias
2. Registrar o domínio e configurar Cloudflare
3. Confirmar as cotas gratuitas vigentes de Oracle, Grafana Cloud, Resend e Sentry — camadas gratuitas mudam sem aviso
4. Levantar a distribuição Android/iOS da frota-âncora (`RT-01` do documento pai — permanece bloqueante)

### Sprint 0 — fundação (2 semanas)

1. OpenTofu provisionando Oracle + Cloudflare + R2
2. Docker Compose completo, idêntico entre local e produção
3. **Plano de backup implementado e testado** — `FRT-02` é o risco mais grave desta stack, e o backup é sua única mitigação real
4. **Esqueleto multi-tenant com RLS e os quatro gates de CI funcionando — antes de qualquer regra de negócio**
5. `packages/tokens` e `packages/ui` com os primitivos de vidro
6. Autenticação completa (Spring Security, três fluxos)

### Durante o MVP — dados a coletar para a decisão de orçamento

O MVP de validação existe para produzir respostas, não apenas software. Instrumentar para responder:

| Pergunta | Como medir |
|---|---|
| A notificação por Telegram substitui a ligação telefônica? | Feedback direto do gestor após eventos críticos reais |
| Qual o consumo real de tokens de LLM por tenant? | Métrica já exigida pela RN-123 |
| Qual o volume real de fotos por dia? | Dimensiona a necessidade de storage na stack definitiva |
| O VM único suporta a carga? | Métricas do Grafana — CPU, memória, latência p95 |
| A qualidade do Piper TTS é aceitável em demonstração? | Reação de clientes em demonstrações comerciais |
| O painel cumpre o RNF-001 com dados reais? | Métrica contínua |

Essas respostas transformam a estimativa de custo da stack definitiva de projeção em número medido — e é isso que sustenta a conversa de orçamento.

---

## 10. Observação Final

Esta stack **não é uma versão inferior da arquitetura**. É a mesma arquitetura, com fornecedores diferentes.

O ganho técnico do Oracle Always Free (4 núcleos ARM, 24 GB de RAM) é, em recursos brutos, **superior** ao dimensionamento inicial previsto no Fargate. As perdas reais são concentradas em três pontos, todos registrados: ausência de SLA e de alta disponibilidade (`FRT-02`), ausência da ligação telefônica automatizada (`FRT-03`) e qualidade de TTS abaixo do ElevenLabs.

Tudo o mais — isolamento multi-tenant, continuous aggregates, governança da IA, gates bloqueantes de CI, auditoria imutável, offline-first — permanece **integralmente implementado**, sem concessão.

> **A regra que não se flexibiliza:** o isolamento multi-tenant com RLS e os quatro gates de garantia (`BE-14`) valem exatamente igual nas duas stacks. Ambiente gratuito não reduz o custo de um vazamento de dados entre clientes.

---

*Documento derivado de `arquitetura_e_decisoes_tecnicas_RookHub.md` v1.0. As duas stacks compartilham código de aplicação idêntico; divergem apenas em infraestrutura e fornecedores. Revisar as cotas gratuitas a cada trimestre.*
