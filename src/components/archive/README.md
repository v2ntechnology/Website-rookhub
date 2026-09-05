# components/archive

Componentes **fora de uso, mas preservados de propósito**. Nada aqui é importado pelo site.

## Por que existe

Uma varredura de importações acusa todo arquivo desta pasta como órfão, porque de fato ninguém os
importa. Sem um lugar próprio, eles ficavam misturados aos componentes vivos e a única coisa que os
distinguia de código morto era um comentário no topo. Quem chegava no projeto não tinha como saber
que `pillars-bento.tsx` era uma decisão e não uma sobra.

A pasta é essa distinção, feita no lugar onde ela se vê: **se está aqui, é guardado; se está fora,
é usado.**

## Regras

- **Não apague nada daqui sem decisão registrada.** Órfão nesta pasta é o estado esperado.
- Cada arquivo abre com um cabeçalho dizendo o que é, o que o substituiu e como voltar a ele.
- Arquivo arquivado é autocontido: leva os próprios tipos e dados, para que o que está vivo não
  fique acoplado ao que está guardado.
- Ele continua compilando. `lint`, `typecheck` e `build` passam por esta pasta como por qualquer
  outra, e é isso que garante que a variante guardada ainda funciona.
- Componente novo **nunca** nasce aqui. Só chega o que já esteve em produção.

## O que está guardado hoje

| Arquivo | O que é | Substituído por |
| --- | --- | --- |
| `pillars-bento.tsx` | Painéis “bento” empilhados em baralho | `marketing/pillars.tsx` |
| `problem-solution-vs.tsx` | Comparativo “VS” com rolagem controlada | `marketing/problem-solution.tsx` |
| `vs-scroller.tsx` | Mecânica de rolagem do “VS” acima | nada, sai junto com ele |
| `brand-logo.tsx` | Wordmark textual da fase de wireframe | os SVGs em `public/images/` |

Os dois primeiros dependem das classes `.bento*` e `.vs-*` do `globals.css`. Elas continuam lá, e
é por isso que restaurar qualquer um dos layouts é trocar uma linha de import.
