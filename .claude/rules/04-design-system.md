# 04 — Design System: Tokens, Tema e Glassmorphism

## Identidade

RookHub comunica **confiança operacional e inteligência de dados**. A base é escura-neutra
(asfalto/aço) com um azul-ciano de destaque e um âmbar de alerta — vocabulário visual de
telemetria e logística.

## Tokens

Definidos uma única vez em `src/app/globals.css`:

- `:root` → paleta **light** completa.
- `.dark` → redefine **apenas** os mesmos tokens para o modo escuro.
- Nenhuma cor pode ser definida somente dentro de `.dark`: o modo claro é o contrato base.

Tokens principais: `--color-background`, `--color-surface`, `--color-foreground`,
`--color-muted`, `--color-border`, `--color-brand`, `--color-brand-foreground`,
`--color-accent`, além de `--glass-bg`, `--glass-border` e `--glass-shadow`.

## Dark / Light Mode

- `next-themes` com `attribute="class"`, `defaultTheme="system"` e `disableTransitionOnChange`.
- `suppressHydrationWarning` no `<html>` é obrigatório para evitar o mismatch de hidratação.
- O toggle nunca deve renderizar o ícone antes da montagem — evite flash de tema errado.
- **Todo componente precisa ser legível nos dois temas.** Revisar em ambos é parte do DoD.

## Glassmorphism

Efeito reservado a superfícies elevadas (cards de plano, header fixo, painéis de destaque).
Nunca aplique em blocos de texto longo — prejudica contraste e legibilidade.

Receita canônica (utility `.glass`, definida em `globals.css`):

```
background: var(--glass-bg);        /* branco/preto com alpha baixo */
backdrop-filter: blur(16px) saturate(140%);
border: 1px solid var(--glass-border);
box-shadow: var(--glass-shadow);
```

Regras:
- Sempre sobre um fundo com variação (gradiente ou textura) — vidro sobre cor chapada não lê.
- Contraste mínimo AA (4.5:1) para texto sobre vidro, verificado nos dois temas.
- `backdrop-filter` é caro: no máximo um punhado de superfícies de vidro por viewport.
- Prever fallback: se `backdrop-filter` não for suportado, a superfície fica opaca.

## Acessibilidade

- Foco visível em todo elemento interativo (`focus-visible:ring-2`).
- Alvos de toque ≥ 44px; hierarquia de headings sem pular níveis.
- Respeitar `prefers-reduced-motion` em qualquer animação.
