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

Nenhum commit deste repositório pode conter referência a IA, assistente, Claude, Cursor,
Copilot ou Codex — **em nenhum lugar**: autor, committer, `Co-Authored-By`, `Signed-off-by`,
trailers, corpo ou título. A autoria pertence exclusivamente aos desenvolvedores humanos.

Checagem antes de commitar:

```bash
git log -1 --pretty='%an <%ae>%n%cn <%ce>%n%B' | grep -iE 'claude|cursor|copilot|codex|\bAI\b|anthropic' \
  && echo "BLOQUEADO: metadado de IA no commit" || echo "OK"
```

## Branches

- `main` é protegida: **nunca** receba commit direto, nem `git push --force`.
- Padrão de nome: `<tipo>/<slug-curto>` — `feat/pricing-table`, `fix/webhook-raw-body`.
- Uma branch = uma unidade lógica de trabalho. Rebase na `main` antes de abrir o PR.
- Merge via PR. Preferir *squash merge* com título no padrão Conventional Commits.

## PRs

Todo PR descreve: **o que** mudou, **por quê**, **como testar** e o que ficou de fora.
Só abre para review depois que `lint`, `typecheck` e `build` passam localmente.
