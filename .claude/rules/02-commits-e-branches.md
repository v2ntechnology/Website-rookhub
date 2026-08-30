# 02 — Commits, Branches e PRs

## Mensagem de commit

⚠️ **Sem prefixo de Conventional Commits** (decisão do usuário em 29/08/2026). Nada de `feat:`,
`fix(escopo):`, `docs:`, `chore:`, `build:` e afins. O assunto é a frase, e só.

Formato: uma frase em **pt-BR** explicando o que a mudança faz. O corpo, quando existir, explica o
porquê e o que não é óbvio no diff.

Exemplos válidos:

```
Adiciona alternancia entre cobranca mensal e anual
Valida a assinatura do webhook com o corpo bruto
Separa o conteudo editorial dos componentes
```

**Por que sem prefixo:** o time tem 3 desenvolvedores e o histórico precisa ser legível por todos.
`docs:` e `chore:` classificam a mudança para uma ferramenta, não explicam nada para uma pessoa. A
mesma regra vale nos quatro projetos do RookHub, e este era o único fora do padrão.

⚠️ **O histórico anterior a 29/08/2026 usa o formato antigo.** Não é para imitar, e não é para
reescrever: commit publicado fica como está.

Commits pequenos, um por ideia.

## Proibição de assinatura de IA (regra dura)

Nenhum commit pode **atribuir autoria** a IA, assistente, Claude, Cursor, Copilot ou
Codex. A proibição vale para: autor, committer, `Co-Authored-By`, `Signed-off-by`,
qualquer outro trailer e qualquer assinatura no fim da mensagem. A autoria pertence
exclusivamente aos desenvolvedores humanos.

O que **não** é violação: citar `.claude/`, `.cursor` ou `.codex` no corpo quando se está
descrevendo pastas do projeto ou a própria regra. A pasta de diretrizes deste repositório
se chama `.claude/` — mencioná-la é inevitável e não é atribuição de autoria.

Checagem antes de commitar (inspeciona campos de autoria e trailers, não o texto livre):

```bash
git log -1 --pretty='%an <%ae>%n%cn <%ce>%n%(trailers)' \
  | grep -iE 'claude|cursor|copilot|codex|anthropic|generated with|\bAI\b' \
  && echo "BLOQUEADO: autoria de IA no commit" || echo "OK"
```

Para auditar o histórico inteiro, troque `log -1` por `log`.

## Branches

- `main` é protegida: **nunca** receba commit direto, nem `git push --force`.
- Padrão de nome: `<tipo>/<slug-curto>` — `feat/pricing-table`, `fix/webhook-raw-body`.
- Uma branch = uma unidade lógica de trabalho. Rebase na `main` antes de abrir o PR.
- Ao juntar por *squash merge*, o título segue a mesma regra de mensagem acima: frase em pt-BR,
  sem prefixo.

## PRs

Todo PR descreve: **o que** mudou, **por quê**, **como testar** e o que ficou de fora.
Só abre para review depois que `lint`, `typecheck` e `build` passam localmente.
