# 02 — Commits, Branches e PRs

## Conventional Commits (obrigatório)

Formato: `<tipo>(<escopo opcional>): <descrição no imperativo, minúscula, sem ponto final>`

| Tipo | Uso |
| --- | --- |
| `feat` | nova funcionalidade para o usuário |
| `fix` | correção de bug |
| `refactor` | mudança de código sem alterar comportamento |
| `style` | formatação, espaçamento, CSS sem efeito funcional |
| `perf` | melhoria de performance |
| `docs` | documentação (inclui `.claude/`) |
| `test` | testes |
| `build` | build, dependências, bundler |
| `ci` | pipelines |
| `chore` | manutenção geral |
| `revert` | reversão de commit |

Escopos usuais: `landing`, `pricing`, `checkout`, `stripe`, `ui`, `theme`, `seo`, `config`.

Breaking change: sufixo `!` (`feat(stripe)!: ...`) e rodapé `BREAKING CHANGE: <impacto>`.

Exemplos válidos:

```
feat(pricing): adiciona alternância entre cobrança mensal e anual
fix(stripe): valida assinatura do webhook com o corpo bruto
docs: documenta o fluxo de assinatura em .claude/rules/05-stripe.md
```

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
- Merge via PR. Preferir *squash merge* com título no padrão Conventional Commits.

## PRs

Todo PR descreve: **o que** mudou, **por quê**, **como testar** e o que ficou de fora.
Só abre para review depois que `lint`, `typecheck` e `build` passam localmente.
