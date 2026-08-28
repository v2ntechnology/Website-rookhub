# App do Motorista — Regras de Negócio, Casos de Uso e Requisitos

**Produto:** RookHub
**Identificador:** `DRV-RN` · **Versão:** 1.0 · **Status:** Proposto
**Documentos irmãos:** `app_motorista_backend_spec.md` (`DRV-SPEC`) · `app_motorista_contratos_api.md` (`DRV-API`)

> **Convenção de códigos.** `RF-D-xx`, `RN-D-xxx`, `UC-D-xx` e `RNF-D-xxx` são novos e específicos do App do Motorista. Códigos sem o sufixo `-D` (`RN-052`, `RNF-009`, `RF-014`) são herdados do PRD e mantêm o significado original. Nenhuma regra herdada é reinterpretada aqui — apenas detalhada no nível de implementação.

---

## Índice

1. [Princípio governante](#1-princípio-governante)
2. [Requisitos funcionais](#2-requisitos-funcionais)
3. [Casos de uso](#3-casos-de-uso)
4. [Requisitos não-funcionais](#4-requisitos-não-funcionais)
5. [Matriz de rastreabilidade](#5-matriz-de-rastreabilidade)
6. [Definição de Pronto](#6-definição-de-pronto)

---

## 1. Princípio governante

O documento de visão é explícito sobre o motorista:

> *"O aplicativo precisa permitir concluir o checklist de trinta itens em menos tempo do que ele levava para encontrar a caneta. Checklist que não é preenchido derruba o pilar de manutenção inteiro."*

Disso decorre o critério de aceitação de qualquer decisão neste documento:

**`RN-D-001` — Nenhuma regra do App do Motorista pode aumentar o tempo ou o número de toques necessários para concluir um checklist.** Validação que impede o envio precisa ter justificativa de segurança física ou de integridade de indicador. Validação de conveniência administrativa é rejeitada por princípio.

Esse é o espelho, no motorista, do princípio inegociável do operador de escritório. A lógica comercial é a mesma: se o preenchimento é penoso, o dado não entra; sem dado, o dono não encontra valor; sem valor, o contrato é cancelado.

---

## 2. Requisitos funcionais

### RF-D-01 — Acesso e vínculo de aparelho

| Código | Regra |
|---|---|
| RN-007 | CPF é único **por tenant**. O mesmo motorista pode ter vínculo com duas transportadoras |
| RN-008 | Primeiro acesso por QR code gerado no painel, de uso único, válido por 48h |
| RN-009 | PIN com Argon2id; hash derivado em cache local para validação offline |
| RN-010 | 5 tentativas incorretas bloqueiam por 15 minutos; bloqueio local, sincronizado ao servidor |
| RNF-012 | **Um motorista por aparelho.** Sem múltiplos perfis em cache |
| `RN-D-010` | PIN recusado quando for sequência (`123456`), repetição (`111111`) ou a data de nascimento do motorista |
| `RN-D-011` | Revincular um aparelho já vinculado exige novo QR code e **apaga integralmente** a base local anterior |
| `RN-D-012` | Reset de PIN pelo painel invalida o hash local; o próximo acesso exige rede |
| `RN-D-013` | Logout com itens na fila é **bloqueado**, com aviso explícito e opção de sincronizar antes |

> `RN-D-011` e `RN-D-013` existem pelo mesmo motivo: nenhum caminho do app pode destruir um checklist de freio ainda não enviado.

### RF-D-02 — Checklist digital

| Código | Regra |
|---|---|
| RN-030 a RN-034 | Estrutura, seções, tipos de resposta, versionamento e propriedade `bloqueante` |
| RN-035 | Dois formulários: **Saída** (enxuto) e **Devolução** (completo) |
| RN-036 · RN-037 | Saída não bloqueia a partida por si só; expira em 4h e a viagem iniciada após isso recebe flag |
| RN-038 a RN-042 | Foto obrigatória em `Crítico`, máximo 3 por item, compressão local, câmera nativa, sem geolocalização embutida |
| RN-043 a RN-046 | Bloqueio de veículo, alerta bloqueante, liberação privativa de `MANAGER`/`OWNER` com justificativa |
| RN-047 a RN-051 | Pendências, notificações, não conversão automática em OS, agrupamento por recorrência, visibilidade ao próximo motorista |
| RN-052 a RN-054 | Operação offline integral, servidor como autoridade, dois timestamps |
| `RN-D-014` | Odômetro informado no checklist **não pode ser menor** que a última leitura conhecida do veículo, nem exceder essa leitura em mais de 2.000 km sem viagem correspondente |
| `RN-D-015` | Item obrigatório sem resposta bloqueia o envio; o app leva o motorista diretamente ao item faltante |
| `RN-D-016` | `NAO_CONFORME` sem severidade bloqueia o envio (RN-032) |
| `RN-D-017` | `NAO_APLICAVEL` só é aceito em item com `allowsNotApplicable: true` |
| `RN-D-018` | Progresso é salvo automaticamente a cada resposta; queda de bateria ou fechamento do app não perde o preenchimento |
| `RN-D-019` | Após o envio, o checklist é **imutável** para o motorista. Correção é ocorrência de viagem ou novo checklist |

> **`RN-D-019` sustenta a credibilidade do registro.** Se o motorista pudesse editar depois, o checklist deixaria de ser evidência de estado do veículo em um instante — e o gestor perderia a base para decidir sobre um freio.

### RF-D-03 — Bloqueio de veículo

| Código | Regra |
|---|---|
| RN-043 | Item `bloqueante` + `NAO_CONFORME` + `CRITICO` ⇒ veículo `Indisponível` **imediatamente** |
| RN-044 | No checklist de **saída**, alerta bloqueante ao motorista, `MANAGER` notificado em tempo real, viagem impedida até liberação |
| RN-045 | Liberação privativa de `MANAGER` ou `OWNER`, com justificativa textual obrigatória e registro auditado |
| RN-046 | Item bloqueante com severidade `Atenção` **sinaliza** sem bloquear |
| `RN-D-023` | O bloqueio é aplicado **no aceite do servidor**, não no aparelho. Offline, o app exibe o alerta e impede a partida localmente; a autoridade continua sendo o servidor |
| `RN-D-024` | Checklist offline com item bloqueante crítico é **prioridade P0** na fila |
| `RN-D-025` | O motorista **nunca** vê a ação de liberação, nem desabilitada. Ação invisível não gera tentativa nem pressão sobre o motorista |

### RF-D-04 — Viagem

| Código | Regra |
|---|---|
| RN-026 | `Planejada` → `Em andamento` → `Concluída` \| `Cancelada` |
| RN-027 | Início exige veículo `Disponível` e CNH válida |
| RN-028 | Abastecimento, evento de segurança e ocorrência na janela da viagem são vinculados automaticamente |
| RN-024 | CNH vencida impede vínculo a nova viagem, com bloqueio explícito e motivo |
| `RN-D-026` | Pausa é estado da **jornada**, não da viagem. A viagem permanece `Em andamento` |
| `RN-D-027` | Uma pausa aberta por vez; nova pausa encerra automaticamente a anterior e registra o fato |
| `RN-D-028` | O motorista pode ter **uma única viagem `Em andamento`** por vez |
| `RN-D-029` | Finalizar exige odômetro final ≥ odômetro inicial |
| `RN-D-032` | Cancelamento de viagem é ato do escritório. O motorista **não** cancela |
| `RN-D-033` | Viagem `Em andamento` há mais de 36h sem transição gera alerta ao operador — indicador de app fechado ou aparelho perdido |

### RF-D-05 — Abastecimento

Decisão `CF-02`: o motorista **envia apenas a foto do cupom**.

| Código | Regra |
|---|---|
| RN-061 | A foto é evidência; sem OCR no MVP |
| Anexo A | `DRIVER` envia foto ✅, lança abastecimento ❌ — o app passa a refletir isso literalmente |
| `RN-D-030` | O comprovante **não** compõe custo, consumo nem custo por km. Vinculação ao `fueling` é processo do servidor ou ato do `OPERATOR` |
| `RN-D-031` | Nenhum campo de litros, odômetro, tanque completo, posto ou valor no contrato do motorista |
| RN-062 · RN-063 | Permanecem íntegros — passam a ser responsabilidade exclusiva do TruckPag e do lançamento do operador |
| RN-041 | Captura exclusivamente por câmera nativa |

**Removidos deste ciclo:** `RN-D-034` (limite de litros) e `RN-D-035` (declaração duplicada) — sem campos numéricos, deixaram de ter objeto.

### RF-D-06 — Telemetria e Mapa

Decisão `CF-03`: a fonte do Mapa é a telemetria do fornecedor. GPS do aparelho **desativado por padrão**.

| Código | Regra |
|---|---|
| RN-059 | Fonte autoritativa é a telemetria do fornecedor; fallback é odômetro manual |
| RN-060 | Divergência acima de 5% entre GPS e odômetro gera flag de auditoria ao gestor |
| RN-138 | **Adaptador anticorrupção obrigatório** por fornecedor. Nenhuma regra de negócio conhece o formato do Powerfleet ou do Eagletrack |
| RN-141 | Sem sincronização recente, o Mapa exibe banner de dado desatualizado com o horário da última sincronização bem-sucedida |
| `RN-D-040` | GPS do aparelho é fonte secundária, `provider = DRIVER_APP`, nunca autoritativa |
| `RN-D-041` | Coleta **desativada por padrão**; habilitada por flag do tenant, por veículo, apenas em veículo sem telemetria instalada |
| `RN-D-042` | Coleta apenas com viagem `Em andamento` — minimização de dado (RN-143) |
| `RN-D-043` | Localização simulada é persistida com flag e excluída de qualquer cálculo |
| `RN-D-044` | Precisão pior que 100m é descartada na origem; coleta suspensa abaixo de 15% de bateria |

> Ligar o GPS do celular quando o caminhão já tem rastreador é coleta de dado pessoal sem necessidade — o que a base legal de legítimo interesse (RN-143) não sustenta.

### RF-D-07 — Perfil, desempenho e segurança

| Código | Regra |
|---|---|
| RN-023 | Alerta de vencimento de CNH em 60, 30 e 7 dias, e diário após vencida |
| RN-094 | O motorista acessa **os próprios eventos e as próprias imagens** |
| RN-095 · RN-096 | Contestação com justificativa; decisão privativa de `MANAGER`/`OWNER` |
| RN-097 | Evento `Descartado` sai do score e vira rótulo negativo no dataset |
| RN-100 · RN-101 | Vê o próprio score e a composição do cálculo; não vê ranking nem score de colegas |
| RN-069 | Menos de 3 abastecimentos completos ⇒ nenhum número de consumo é exibido |
| `RN-D-050` | Nenhuma superfície do app exibe custo, preço, ranking ou consolidado financeiro |
| `RN-D-051` | Uma contestação em aberto por evento; justificativa com no mínimo 10 caracteres |
| `RN-D-052` | Prazo de contestação é de 90 dias, limitado pela retenção da mídia (RN-093) |

### RF-D-08 — LGPD no app

| Código | Regra |
|---|---|
| RN-143 | Base legal: legítimo interesse documentado, com aviso transparente |
| RN-144 | Termo de ciência no primeiro acesso, com registro de data, versão e IP |
| RN-146 | Motorista desligado tem nome e CPF anonimizados após 12 meses |
| RN-147 | Direitos do titular atendidos por processo manual via suporte no MVP |
| `RN-D-060` | O termo é **gate bloqueante**: sem aceite, nenhuma rota funcional responde |
| `RN-D-061` | Nova versão do termo reativa o gate no próximo acesso |
| `RN-D-062` | O motorista pode recusar. A recusa não bloqueia a conta; o app orienta a procurar o gestor |
| `RN-D-063` | O perfil exibe permanentemente o canal de exercício de direitos |

> **`RN-D-062` é decisão de produto, não de complacência jurídica.** Bloquear a conta por recusa transformaria "legítimo interesse" em coação — exatamente o vício que RN-143 evita ao descartar o consentimento do empregado como base legal.

---

## 3. Casos de uso

### UC-D-01 — Primeiro acesso do motorista

**Ator:** Motorista · **Tela:** Login · **Pré-condição:** QR code gerado no painel há menos de 48h

**Caminho feliz**

1. O operador gera o QR code no painel e o exibe ou imprime.
2. O motorista abre o PWA e toca em "Primeiro acesso".
3. O app abre a câmera e lê o QR code.
4. O motorista define e confirma um PIN de 6 dígitos.
5. `POST /auth/device/activate` vincula o aparelho e retorna os tokens.
6. O termo de ciência LGPD é exibido integralmente.
7. Ao aceitar, o app baixa o `bootstrap` e fica pronto para operar offline.

**Exceções**

| Situação | Tratamento |
|---|---|
| QR expirado ou já usado | `410` — "Este código expirou. Peça um novo ao escritório." |
| CPF já vinculado a outro aparelho | `409` — orienta a procurar o gestor; revínculo exige novo QR (`RN-D-011`) |
| PIN fraco | `422` — recusa com a razão específica (`RN-D-010`) |
| Sem rede | Ativação exige rede; o app explica e sugere o wi-fi do escritório |
| Recusa do termo | Acesso funcional não é liberado; conta permanece ativa (`RN-D-062`) |

---

### UC-D-02 — Preencher checklist de saída sem rede

**Ator:** Motorista · **Tela:** Checklist · **Cenário real:** pátio, 4h da manhã, sem sinal

**Caminho feliz**

1. O motorista abre o app; o PIN é validado localmente contra o hash em cache (RN-009).
2. A Home exibe o veículo atribuído, as pendências abertas e a ação "Checklist de saída".
3. O template vem do cache local, na versão baixada no último bootstrap.
4. O motorista responde os itens; cada resposta é salva automaticamente (`RN-D-018`).
5. Em um item não conforme, escolhe a severidade; em `Crítico`, o app **exige** foto (RN-038).
6. A foto é capturada pela câmera nativa (RN-041), comprimida para WebP ≤ 300KB (RN-040) e guardada localmente.
7. Ao confirmar, o checklist entra na fila com `status: "Pendente de envio"`.
8. Mensagem: *"Checklist salvo. Será enviado quando houver sinal."*
9. O indicador de pendências passa a exibir 1 (RNF-013).
10. Ao recuperar rede, os dados estruturados sobem primeiro; as fotos vão em background (RNF-011).

```gherkin
Funcionalidade: Checklist de saída offline

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
  Então uma flag de auditoria CLOCK_DIVERGENCE deve ser criada
    E o checklist NÃO deve ser rejeitado
    E o gestor deve visualizá-la no detalhe do checklist

Cenário: Limite da fila offline atingido
  Dado que existem 20 checklists pendentes de envio
  Quando eu tentar iniciar um novo checklist
  Então devo ver um aviso solicitando sincronização antes de prosseguir

Cenário: Reenvio do mesmo checklist
  Dado que um checklist com client_uuid "0191f000" já foi aceito
  Quando o mesmo client_uuid for enviado novamente com payload idêntico
  Então a resposta deve ser 200 com Idempotent-Replay
    E nenhuma pendência adicional deve ser criada
    E nenhuma notificação adicional deve ser disparada
```

---

### UC-D-03 — Apontar irregularidade crítica e bloquear o veículo

**Ator:** Motorista · **Atores secundários:** `MANAGER`, `MAINTENANCE` · **Tela:** Checklist

**Caminho feliz**

1. O motorista marca "Freio de serviço" como `Não conforme` com severidade `Crítico`.
2. O app exige ao menos uma foto antes de permitir a conclusão (RN-038).
3. Ao enviar, o servidor coloca o veículo em `Indisponível` (RN-043).
4. O app exibe alerta bloqueante: *"Veículo indisponível — procure o gestor."*
5. `MANAGER` recebe notificação em tempo real; `MAINTENANCE` recebe a pendência (RN-048).
6. O início da viagem fica impedido até liberação (RN-044).
7. O `MANAGER` libera com justificativa obrigatória (RN-045); o motorista recebe notificação.

```gherkin
Funcionalidade: Bloqueio por item crítico

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
  Então o envio deve ser bloqueado com erro checklist-photo-required
    E devo ver qual item exige evidência fotográfica
    E devo ser levado diretamente a esse item

Cenário: Severidade Atenção não bloqueia
  Dado que marquei o item "Freio de serviço" como "Não conforme"
    E selecionei a severidade "Atenção"
  Então a foto deve ser opcional
    E o veículo deve permanecer "Disponível"
    E o veículo deve exibir sinalização de pendência aberta

Cenário: Bloqueio ocorrido offline
  Dado que apontei um item bloqueante crítico sem conexão
  Então o app deve exibir o alerta bloqueante localmente
    E deve impedir o início da viagem no aparelho
    E o checklist deve entrar na fila com prioridade P0
  Quando a rede for recuperada
  Então o servidor deve aplicar o bloqueio e notificar o MANAGER

Cenário: Motorista não pode liberar
  Dado que o veículo está "Indisponível"
  Quando eu abrir a tela do veículo no app
  Então a ação de liberação não deve existir na interface
```

---

### UC-D-04 — Iniciar viagem

**Ator:** Motorista · **Tela:** Viagem

**Caminho feliz**

1. A Home exibe a viagem `Planejada` atribuída.
2. O motorista confirma o odômetro inicial, pré-preenchido pela telemetria.
3. `POST /trips/{id}/start` valida veículo `Disponível` e CNH válida (RN-027).
4. A viagem passa a `Em andamento`; o veículo, a `Em viagem`.
5. A coleta de GPS é iniciada (`RN-D-041`).

**Exceções**

| Situação | Tratamento |
|---|---|
| Veículo `Indisponível` | `409` — motivo explícito e orientação para procurar o gestor |
| CNH vencida | `409` — bloqueio com motivo (RN-024). **Sem exceção no app** |
| Checklist de saída vencido | Viagem **inicia** com flag `STARTED_WITHOUT_VALID_CHECKLIST`; operador notificado (RN-037) |
| Sem checklist de saída | Mesma regra: registra a flag e notifica; não impede a partida (RN-036) |
| Viagem já iniciada em outro aparelho | `409 trip-invalid-transition`; o servidor vence (RN-053) |
| Início offline | Enfileirado com P1; a viagem é reconciliada no aceite |

```gherkin
Cenário: Início com checklist vencido
  Dado que meu checklist de saída foi preenchido há mais de 4 horas
  Quando eu iniciar a viagem
  Então a viagem deve ser iniciada normalmente
    E deve receber a flag "STARTED_WITHOUT_VALID_CHECKLIST"
    E o operador deve ser notificado
    E devo ver um aviso não bloqueante explicando o registro

Cenário: CNH vencida
  Dado que minha CNH está vencida
  Quando eu tentar iniciar a viagem
  Então o início deve ser bloqueado
    E devo ver o motivo "CNH vencida — procure o escritório"
    E nenhuma viagem deve ser criada ou alterada
```

---

### UC-D-05 — Registrar pausa e retomar

**Ator:** Motorista · **Tela:** Viagem

1. O motorista toca em "Pausar" e escolhe o motivo.
2. `POST /trips/{id}/pause` registra a pausa; a viagem permanece `Em andamento` (`RN-D-026`).
3. Ao retomar, `POST /trips/{id}/resume` fecha a pausa e devolve a duração.

**Exceções:** motivo `OUTRO` exige nota; pausa aberta ao tentar nova pausa encerra a anterior automaticamente e registra o fato (`RN-D-027`); tentativa de retomar sem pausa aberta retorna `409`, tratado no app como estado já resolvido.

---

### UC-D-06 — Enviar comprovante de abastecimento

**Ator:** Motorista · **Tela:** Abastecer (**refeita neste ciclo**)

**Caminho feliz**

1. O motorista toca em "Abastecer".
2. O veículo atribuído vem pré-selecionado; ele apenas confirma.
3. A câmera nativa abre direto (RN-041).
4. Fotografa o cupom e confirma.
5. `POST /fuel/receipts` registra o comprovante em `NAO_VINCULADO`.
6. Mensagem: *"Pronto. O escritório cuida do resto."*
7. O servidor casa o comprovante com o `fueling` do TruckPag ou do operador dentro de ±24h.

**Três toques, nenhum número digitado.**

**Exceções**

| Situação | Tratamento |
|---|---|
| Offline | Enfileirado; a foto sobe em P3 |
| Sem correspondência de `fueling` | Permanece `NAO_VINCULADO` e entra na fila do operador — sem ação do motorista |
| Foto ilegível | Tratamento do operador, não do app. O motorista não é solicitado a repetir automaticamente |
| Período fechado | `409 period-closed`; item vai para "Requer atenção" |

```gherkin
Cenário: Comprovante não altera indicador
  Dado que enviei a foto de um cupom pelo app
  Quando o comprovante for recebido pelo servidor
  Então o custo por km do veículo NÃO deve ser alterado
    E o consumo médio NÃO deve ser recalculado
    E o status deve ser "NAO_VINCULADO"

Cenário: Vinculação automática
  Dado que existe um abastecimento do mesmo veículo dentro de 24h da captura
  Quando o job de vinculação for executado
  Então o comprovante deve assumir "VINCULADO"
    E deve ficar disponível como evidência no detalhe do abastecimento

Cenário: Motorista não digita nem vê números
  Quando eu abrir a tela de abastecimento
  Então nenhum campo de litros, odômetro, tanque ou valor deve ser exibido
    E nenhuma resposta da API deve conter esses campos
```

---

### UC-D-07 — Registrar ocorrência em rota

**Ator:** Motorista · **Telas:** Viagem e Mapa

1. Toca em "Registrar ocorrência", escolhe o tipo e descreve.
2. Anexa fotos, se houver.
3. A posição atual é capturada automaticamente.
4. `POST /trips/{id}/events` notifica `MANAGER` e `OPERATOR`.
5. Ocorrências mecânicas geram pendência vinculada ao veículo.

**Exceções:** offline entra na fila P2; `ACIDENTE` notifica `MANAGER` e `OWNER` em tempo real independentemente de severidade e é priorizado para P1 na fila; sem sinal de GPS, a ocorrência é registrada sem posição, nunca bloqueada.

---

### UC-D-08 — Finalizar viagem e fazer o checklist de devolução

**Ator:** Motorista · **Telas:** Viagem e Checklist

1. O motorista informa o odômetro final.
2. `POST /trips/{id}/finish` conclui a viagem; o veículo volta a `Disponível`.
3. O servidor compara distância do odômetro com distância do GPS (RN-060).
4. O app apresenta o checklist de devolução como pendência obrigatória.
5. O checklist de devolução segue integralmente UC-D-02 e UC-D-03.

```gherkin
Cenário: Divergência entre GPS e odômetro
  Dado que a distância registrada por GPS diverge em mais de 5% da variação do odômetro
  Quando a viagem for finalizada
  Então uma flag de auditoria ODOMETER_GPS_DIVERGENCE deve ser criada
    E o gestor deve visualizá-la no detalhe do veículo
    E o motorista NÃO deve receber acusação ou bloqueio no app

Cenário: Veículo não retorna a Disponível com pendência bloqueante aberta
  Dado que o veículo possui pendência bloqueante crítica aberta
  Quando a viagem for finalizada
  Então o veículo deve permanecer "Indisponível"
    E a Home deve exibir o motivo
```

---

### UC-D-09 — Consultar desempenho e contestar evento

**Ator:** Motorista · **Tela:** Perfil

1. O motorista abre "Meu desempenho".
2. Vê viagens, km, consumo próprio comparado à média dos veículos do mesmo modelo, e o score de segurança com **a composição do cálculo** (RN-100).
3. Abre a lista dos próprios eventos, com as próprias imagens (RN-094).
4. Contesta um evento com justificativa (RN-095).
5. `MANAGER` ou `OWNER` decide; o motorista é notificado.

```gherkin
Cenário: Motorista vê apenas o próprio score
  Dado que estou autenticado como DRIVER
  Quando eu abrir a tela de desempenho
  Então devo ver meu score e a composição detalhada do cálculo
    E não devo ver o ranking da frota
    E não devo ver o score de nenhum colega

Cenário: Evento descartado sai do score
  Dado que contestei um evento e o gestor o descartou
  Quando meu score for recalculado
  Então o evento não deve compor o cálculo
    E deve ser marcado como falso positivo no dataset de treinamento

Cenário: Amostra insuficiente de consumo
  Dado que o veículo possui menos de 3 abastecimentos completos no período
  Quando eu abrir a tela de desempenho
  Então o número de consumo não deve ser exibido
    E devo ver a explicação de que ainda faltam dados

Cenário: Módulo de Segurança não contratado
  Dado que o tenant não contratou o módulo Segurança na Estrada
  Quando eu abrir a tela de desempenho
  Então a seção de segurança não deve ser exibida
    E nenhum dado de amostra deve ser apresentado
```

---

### UC-D-10 — Sincronizar a fila após dias sem rede

**Ator:** Sistema · **Gatilho:** recuperação de conectividade

1. O service worker detecta a rede e dispara a sincronização.
2. Os itens são ordenados por prioridade e por `filled_at`.
3. Lotes de até 20 operações vão para `POST /sync/batch`.
4. O servidor responde `207` com resultado individual.
5. `2xx` sai da fila; erro permanente vai para "Requer atenção"; transitório fica com backoff.
6. O app aplica `serverState` e informa divergências ao motorista (RN-053).

```gherkin
Cenário: Lote parcialmente aceito
  Dado que existem 3 operações na fila
  Quando o lote for enviado
    E a primeira for aceita, a segunda falhar com 409 e a terceira com 503
  Então a primeira deve sair da fila
    E a segunda deve ir para "Requer atenção" sem novo reenvio
    E a terceira deve permanecer na fila com backoff

Cenário: Item preso por mais de 7 dias
  Dado que uma operação está na fila há mais de 7 dias
  Então ela deve ser movida para "Requer atenção"
    E o motorista deve ser orientado a procurar o escritório
    E o registro NÃO deve ser descartado

Cenário: Ordem entre operações da mesma viagem
  Dado que a fila contém TRIP_START e TRIP_FINISH da mesma viagem
  Quando o lote for processado
  Então TRIP_START deve ser aplicado antes de TRIP_FINISH
```

---

## 4. Requisitos não-funcionais

### 4.1 Desempenho

| ID | Métrica | Alvo |
|---|---|---|
| `RNF-D-001` | Resposta de `GET /home` (p95) | **< 800ms** |
| `RNF-D-002` | Resposta de qualquer escrita do motorista (p95) | **< 300ms** |
| `RNF-D-003` | Abertura do app até checklist utilizável, offline | < 2s |
| RNF-005 | Sincronização de checklist com 10 fotos em 4G | **< 60s** |
| `RNF-D-004` | Lote de sincronização com 20 operações (p95) | < 3s |
| `RNF-D-005` | Salvamento local de resposta de item | < 50ms |
| `RNF-D-006` | Bundle inicial do PWA, comprimido | **< 300KB** |
| `RNF-D-007` | Conclusão do checklist de saída pelo motorista | **≤ 3 minutos**, verificado em teste cronometrado |
| RNF-008 | Disponibilidade mensal | 99,5% |

> `RNF-D-007` é a tradução mensurável de `RN-D-001`, espelhando o papel de RNF-006 para o operador. **Regressão neste indicador bloqueia o deploy.**

### 4.2 Resiliência de rede

| ID | Requisito |
|---|---|
| RNF-009 | Cobertura offline: checklists, fotos, ocorrências, consulta a pendências |
| RNF-010 | Fila: 7 dias · 20 checklists · 100 fotos |
| RNF-011 | Dados estruturados antes das fotos |
| RNF-013 | Indicador visual permanente de estado |
| `RNF-D-011` | Toda escrita é idempotente por `client_uuid` |
| `RNF-D-012` | Backoff exponencial com jitter, teto de 6h |
| `RNF-D-013` | Nenhum registro do motorista é descartado automaticamente pelo app |
| `RNF-D-014` | Funcional em 3G com 300ms de RTT e 2% de perda de pacotes |
| `RNF-D-015` | `navigator.storage.persist()` solicitado na ativação; `estimate()` monitorado a cada abertura |
| `RNF-D-016` | Abaixo de 20% da cota de armazenamento, o app alerta e prioriza a sincronização |

> `RNF-D-015` responde diretamente ao risco `RT-01`: o Safari pode expurgar dados após 7 dias sem uso, e RNF-010 exige exatamente 7 dias de fila. A margem é zero.

### 4.3 Segurança

| ID | Requisito |
|---|---|
| RNF-018 | TLS 1.2+; criptografia em repouso |
| RNF-019 | PIN com Argon2id |
| RNF-021 | Rate limiting por tenant e por usuário |
| RNF-022 | URLs assinadas com expiração ≤ 15 minutos |
| `RNF-D-020` | `access_token` **nunca** persistido em IndexedDB — apenas em memória |
| `RNF-D-021` | `device_token` cifrado em repouso e rotativo a cada refresh |
| `RNF-D-022` | Nenhum dado de outro motorista ou de outro tenant no cache local |
| `RNF-D-023` | Cabeçalho de tenant enviado pelo cliente é ignorado e registrado como anomalia |
| `RNF-D-024` | Recurso de terceiro retorna `404`, nunca `403` — não confirmar existência |
| `RNF-D-025` | Certificate pinning **fora de escopo** no PWA; mitigado por HSTS |

### 4.4 Mídia

| ID | Requisito |
|---|---|
| RN-040 | Máximo 1600px no maior lado; alvo de ~300KB |
| RN-041 | Câmera nativa exclusiva |
| `RNF-D-030` | Compressão em WebP com fallback para JPEG onde não houver suporte |
| `RNF-D-031` | EXIF removido, exceto data de captura, usada em validação server-side |
| `RNF-D-032` | Upload em background, retomável, sem bloquear a interface |
| `RNF-D-033` | Máximo de 1,5 MB por objeto, validado no servidor |

### 4.5 Usabilidade em campo

| ID | Requisito |
|---|---|
| RNF-029 | Legibilidade sob luz solar direta e alvos de toque grandes — **exceção deliberada ao glassmorphism** |
| `RNF-D-040` | Alvo de toque mínimo de 48×48dp; espaçamento mínimo de 8dp |
| `RNF-D-041` | Contraste mínimo 7:1 nas telas de checklist e viagem — acima do WCAG AA exigido no painel |
| `RNF-D-042` | Ações críticas operáveis com uma das mãos, na metade inferior da tela |
| `RNF-D-043` | Nenhum fluxo essencial depende de gesto complexo — sem *long press*, sem *swipe* obrigatório |
| `RNF-D-044` | Todo texto de erro em linguagem de operação: o que aconteceu e o que fazer agora. Nunca código técnico |
| RNF-016 · RNF-017 | pt-BR; America/São_Paulo com armazenamento em UTC |

> **`RNF-D-043` decorre de operação com luvas.** Um *swipe to delete* que falha com luva de raspa é um checklist não preenchido.

### 4.6 Plataforma

| ID | Requisito |
|---|---|
| RNF-014 | PWA instalável, com service worker e IndexedDB. App nativo é Fase 2 |
| `RNF-D-050` | Android 10+ (Chrome 100+) e iOS 16.4+ (Safari) |
| `RNF-D-051` | Push depende de iOS 16.4+ **e** instalação na tela de início; fallback por SMS para eventos críticos |
| `RNF-D-052` | Enum desconhecido é degradado, nunca causa falha da tela |
| `RNF-D-053` | Versão de app abaixo do mínimo suportado recebe `426 Upgrade Required` com orientação |

---

## 5. Matriz de rastreabilidade

| Tela | Casos de uso | Endpoints | Regras principais |
|---|---|---|---|
| **Login** | UC-D-01 | `/auth/*`, `/consent-term/*` | RN-007 a RN-010, RN-012, RN-144 |
| **Home** | UC-D-02, UC-D-04 | `/home`, `/bootstrap`, `/vehicles/{id}/pendencies` | RN-051, RN-037, RN-141 |
| **Checklist** | UC-D-02, UC-D-03, UC-D-08 | `/checklists/*`, `/media/*` | RN-030 a RN-054 |
| **Viagem** | UC-D-04 a UC-D-08 | `/trips/*` | RN-024, RN-026 a RN-028, RN-036, RN-037 |
| **Mapa** | UC-D-07 | `/trips/{id}/track`, `/telemetry/location` (condicional) | RN-059, RN-060, RN-138, RN-141, `RN-D-040` a `RN-D-044` |
| **Abastecer** | UC-D-06 | `/fuel/receipts` | RN-061, Anexo A, `RN-D-030`, `RN-D-031` |
| **Perfil** | UC-D-09 | `/profile`, `/performance`, `/safety/*` | RN-023, RN-069, RN-094 a RN-101 |
| **Transversal** | UC-D-10 | `/sync/batch`, `/notifications/*` | RN-052 a RN-054, RN-125 a RN-127 |

**Cobertura reversa das regras do PRD aplicáveis ao motorista:** RN-007 a RN-012, RN-023, RN-024, RN-026 a RN-028, RN-030 a RN-054, RN-059 a RN-064, RN-069, RN-093 a RN-101, RN-125 a RN-127, RN-132 a RN-135, RN-143 a RN-148.

---

## 6. Definição de Pronto

Nenhuma entrega do App do Motorista é considerada pronta sem:

- [ ] Teste em **modo avião** durante todo o preenchimento, com sincronização ao recuperar rede
- [ ] Teste em rede degradada (3G, 300ms RTT, 2% de perda) dentro de RNF-005
- [ ] Teste de reenvio duplicado sem efeito colateral duplicado
- [ ] Teste de relógio adulterado em 8 horas gerando exatamente uma flag, sem rejeição
- [ ] Teste de concorrência multi-tenant sobre o mesmo pool, sem vazamento
- [ ] Asserção automatizada no contrato OpenAPI de que **nenhuma resposta do motorista contém campo monetário**
- [ ] Asserção de que nenhuma rota do motorista retorna registro de outro motorista
- [ ] Teste cronometrado de checklist de saída dentro de `RNF-D-007`
- [ ] Verificação de contraste ≥ 7:1 nas telas de checklist e viagem
- [ ] Leitura sob luz solar direta e operação com luvas, validadas com motorista real do cliente-âncora
- [ ] Contrato OpenAPI 3.1 publicado e cliente TypeScript gerado
- [ ] Registro de auditoria verificado para os sete eventos de `DRV-SPEC` §12

---

## 7. Decisões

### Fechadas neste ciclo

| # | Decisão |
|---|---|
| **P-01** | `EXE-02` — App do Motorista sai do frontend-first e passa a backend-first. `apps/web` e `apps/site` permanecem em `EXE-01` |
| **P-02** | Abastecimento pelo motorista: **apenas foto de cupom** (`RN-D-030`) |
| **P-03** | GPS do aparelho **desativado por padrão**; telemetria do fornecedor é a fonte do Mapa |
| **CF-04** | A tela de "register" é ativação por QR + PIN. **Não existe autocadastro de motorista** (RN-008, RN-014) |
| **CF-05** | O checklist do front renderiza a partir de `GET /checklists/template`. Item novo é versão de template (RN-033), não deploy do PWA |

### Abertas

| # | Pendência | Bloqueia |
|---|---|---|
| **P-04** | Distribuição Android/iOS na frota-âncora | Push e fallback SMS — não bloqueia sprints 0 a 3 |
| **P-05** | Revisão jurídica do termo de ciência | Go-live |
| **P-06** | Powerfleet Unity expõe **eventos de vídeo** por API | `/safety/*` — não abrir sprint |
| **P-07** | Fórmula do score de segurança (RN-099) | `composition` de `GET /performance` |
| **P-08** | Credenciais e docs de API do Powerfleet e do Eagletrack para **posição e odômetro** | Sprint do Mapa |

> **P-07 continua aberta e é a mais fácil de esquecer.** RN-099 exige fórmula fixa, transparente e auditável; RN-100 exige que o motorista veja a composição do cálculo. A composição do exemplo em `DRV-API` §10.2 é estrutura, não fórmula aprovada. Publicar um score sem fórmula definida é publicar um número que ninguém consegue defender diante do motorista que o recebe.
