# 04 — Design System RookHub

A especificação de origem está versionada em [`../design/DESIGN.md`](../design/DESIGN.md)
e é a **fonte normativa** de marca, cor, tipografia, forma e componentes. Esta regra traduz
aquele documento em decisões implementáveis e registra os conflitos já resolvidos.

Mudou o `DESIGN.md`? Atualize esta regra na mesma branch. Os dois não podem divergir.

## Estado atual: fase de wireframe (grayscale)

> **Esta regra está SUSPENSA no código.** Em 27/08/2026 o site institucional foi reduzido a um
> protótipo de baixa fidelidade em escala de cinza, por decisão de produto: o objetivo da fase é
> validar estrutura de seções, hierarquia e copy sem que a estética interfira na leitura.
>
> O que vale hoje em `src/`:
>
> - Paleta: apenas preto, branco e cinzas — `#F8FAFC`, `#FFFFFF`, `#E5E7EB`, `#D1D5DB`,
>   `#6B7280`, `#374151`, `#111827` (mais o espelho escuro em `.dark`).
> - **Nenhuma cor cromática pode entrar** enquanto o protótipo estiver em validação:
>   sem Indigo, sem Cyan, sem Spectrum Gradient, sem glassmorphism, sem organic glow.
>   Exceção única e registrada: o `--color-brand` (`#6366F1`) que colore o "hub" da
>   assinatura de rodapé. Qualquer outro uso de cor precisa de nova decisão aqui.
> - Raio único de `6px`; superfícies são caixas delimitadoras com borda de `1px`.
> - Preservados do design system: a estratégia de duas famílias (Sora/Inter), a escala
>   tipográfica, `tabular-nums`, o alvo de toque de 44px e o respeito a `prefers-reduced-motion`.
>
> O design system descrito no restante deste documento continua **normativo para a reaplicação
> da marca**, que acontece depois da validação de conteúdo. A implementação anterior — tokens,
> `glass-card`, `glow`, `spectrum-edge` — está recuperável no commit `4105812`.
>
> Os assets de logotipo seguem em `public/imgs/`; o wireframe usa wordmark textual.

## Identidade

**Total Glassmorphism.** A informação vive em painéis translúcidos flutuando sobre um vazio
escuro e atmosférico — a sensação alvo é a de um centro de comando, não a de um ERP plano.
Profundidade se comunica por **translucidez e refração**, nunca por sombra tradicional.

## Decisões sobre conflitos do DESIGN.md

O documento de origem se contradiz — ou omite valores — em quatro pontos. As resoluções abaixo são normativas —
não reabra sem decisão explícita registrada aqui.

### 1. Paleta: vale a prosa, não o frontmatter

O bloco `colors:` do frontmatter descreve outra paleta (periwinkle `#c0c1ff` sobre `#13131b`).
**Ignore o frontmatter para cor.** A seção `## Colors` é a normativa:

| Papel | Valor | Uso |
| --- | --- | --- |
| Primary (Indigo) | `#6366F1` | ações primárias, estados ativos, marca |
| Secondary (Cyan) | `#06B6D4` | visualização de dados, destaques, interativos secundários |
| Tertiary (Midnight) | `#0B1220` | fundo base, superfícies estruturais |

O frontmatter continua valendo para **tipografia, raios e espaçamento**.

### 2. Pares de contraste são derivados

A prosa não define nenhum par `on-*`. Os valores abaixo foram derivados para atingir
contraste AA e **são parte do contrato** — não improvise substitutos no componente.

Atenção ao ponto que mais gera erro: **`#6366F1` puro não serve como cor de texto sobre o
fundo escuro** (4.19:1, abaixo de 4.5:1). Para texto de marca use `--color-brand-text`.
E ele também não serve como preenchimento de controle com texto — veja a decisão 4.

| Token | Dark | Light | Nota |
| --- | --- | --- | --- |
| `--color-background` | `#0B1220` | `#F5F7FB` | |
| `--color-surface` | `#101828` | `#FFFFFF` | |
| `--color-surface-container` | `#151E30` | `#EEF2F8` | |
| `--color-foreground` | `#E8ECF5` | `#0B1220` | |
| `--color-muted` | `#A8B2C6` | `#4A5568` | |
| `--color-border` | `#2A3448` | `#D9E0EC` | |
| `--color-brand` | `#5457EE` | `#5457EE` | preenchimento de controle (ver decisão 4) |
| `--color-brand-bright` | `#6366F1` | `#6366F1` | glows, indicadores; nunca sob texto |
| `--color-brand-text` | `#A5B4FC` | `#4338CA` | texto e ícones de marca |
| `--color-brand-foreground` | `#FFFFFF` | `#FFFFFF` | texto sobre preenchimento indigo |
| `--color-accent` | `#06B6D4` | `#0E7490` | cyan puro falha em fundo claro (2.4:1) |
| `--color-accent-foreground` | `#052F38` | `#FFFFFF` | |

### 3. Preenchimento indigo de controle é `#5457EE`, não `#6366F1`

Texto branco sobre o `#6366F1` da especificação dá **4.47:1** — reprova AA (4.5:1) por
margem mínima. Como o botão primário é justamente onde o indigo carrega texto em tamanho
de corpo, o valor da spec não é utilizável ali.

Medições (branco sobre o preenchimento / preenchimento contra o fundo escuro):

| Valor | Texto branco | Borda vs fundo dark | Veredito |
| --- | --- | --- | --- |
| `#6366F1` (spec) | 4.47:1 ✗ | 4.19:1 ✓ | reprova para texto |
| `#5457EE` | **5.28:1 ✓** | **3.54:1 ✓** | **adotado** |
| `#4F46E5` (indigo-600) | 6.29:1 ✓ | 2.98:1 ✗ | perde o limite do controle |

`#5457EE` é visualmente indistinguível do indigo da spec e é o único que passa nos dois
critérios. O `#6366F1` original é preservado em `--color-brand-bright` para glows, pulsos
de *fleet indicator* e superfícies decorativas — onde nunca há texto por cima.

**Confirmar com o designer.** É um desvio deliberado do valor especificado, motivado por
acessibilidade.

### 4. Raio: `20px` não é `rounded-lg`

A prosa diz "`20px` (standard `rounded-lg` in this configuration)", mas o frontmatter define
`lg: 1rem` = **16px**. O parêntese está errado. Valem os números, não o nome da classe:

- `--radius-card: 20px` — cards e painéis principais.
- `--radius-control: 12px` — botões, inputs e itens aninhados.

Os demais raios seguem o frontmatter (`sm .25rem`, `DEFAULT .5rem`, `md .75rem`,
`xl 1.5rem`, `full`).

## Dark / Light Mode

O `DESIGN.md` é um sistema **dark-only** — não traz uma única cor de tema claro.

- O tema escuro é o **canônico**: é o que o design system especifica e o que a estética de
  vidro sobre vazio pressupõe.
- O tema claro é **derivado** (coluna "Light" da tabela acima) e mantido porque o produto
  exige os dois modos. Ele não tem respaldo no documento de origem: **toda mudança de cor
  clara é decisão de engenharia e deve ser confirmada com o designer** antes de virar padrão.
- Mecânica inalterada: `next-themes` com `attribute="class"`, `defaultTheme="system"`,
  `disableTransitionOnChange` e `suppressHydrationWarning` no `<html>`.
- Nenhuma cor pode existir apenas em um dos blocos: todo token é definido nos dois.
- **Revisar nos dois temas é parte do Definition of Done.**

## Tipografia

Estratégia de duas famílias, carregadas por `next/font/google` (auto-hospedadas):

- **Sora** — títulos de página, headings de card e métricas grandes.
- **Inter** — corpo, campos de formulário e labels.

Escala normativa (frontmatter): `display-lg` 48/56 peso 700 tracking -0.02em ·
`headline-lg` 32/40 peso 600 (mobile: 28/36) · `headline-md` 24/32 peso 600 ·
`body-lg` 18/28 · `body-md` 16/24 · `label-md` 14/20 peso 500 tracking 0.05em.

Em tabelas e telemetria, use `font-variant-numeric: tabular-nums` para os números alinharem
verticalmente.

## Layout e Espaçamento

Grid fluido: **12 colunas** no desktop (margem `24px`, gutter `20px`), **8** no tablet,
**4** no mobile (margem `16px`). Ritmo vertical entre módulos: `24px`.

Escala de espaçamento: `base 4 · xs 8 · sm 16 · md 24 · lg 32 · xl 48`.

## Glassmorphism

Receita canônica do tema escuro:

```
background: rgb(255 255 255 / 0.04);
backdrop-filter: blur(16px);
border: 1px solid;                 /* borda em gradiente 135deg, 0.15 -> 0.05 */
```

- **Elevação por opacidade, não por sombra.** Modais e elementos de alta prioridade sobem
  para `0.08` de fundo e `blur(24px)`.
- **A receita é dark-only.** `rgb(255 255 255 / 0.04)` desaparece sobre fundo claro; o tema
  claro usa vidro branco de alta opacidade (`~0.72`) com a mesma estrutura de borda.
- **Fallback obrigatório:** sem suporte a `backdrop-filter`, a superfície vira opaca
  (`--color-surface`). Vidro sem blur é ilegível.
- Vidro precisa de fundo com variação para refratar — daí os *organic glows*: radiais suaves
  de Indigo e Cyan a **15% de opacidade**, `blur(100px)`, nos cantos do viewport.

## Componentes

- **Botão primário:** preenchimento Spectrum Gradient, texto branco, glow interno sutil.
- **Botão secundário:** vidro a `0.08`, borda e texto em Indigo (use `--color-brand-text`).
- **Botão terciário:** ghost, texto Indigo sobre Midnight.
- **Card:** `blur(16px)`, raio `20px`, título em Sora SemiBold.
- **Input:** preenchimento escuro semitransparente, borda de vidro `1px`; no foco a borda
  passa a Cyan com glow externo.
- **Chip/Badge:** fundo da cor a 20% de opacidade com texto sólido da mesma cor.
- **Fleet indicator:** glow pulsante — Indigo para "Ativo", cinza fosco para "Ocioso";
  respeite `prefers-reduced-motion`.

## Limites de acessibilidade e performance

Estes limites **prevalecem sobre a estética** quando houver conflito. O design system pede
"Total Glassmorphism"; a regra 06 pede INP < 200ms. As duas coisas não escalam juntas sem teto.

- **Teto de vidro:** no máximo ~6 superfícies com `backdrop-filter` simultâneas no viewport.
  `backdrop-filter` é o efeito mais caro da UI e compõe em cada frame.
- **Chips a 20% de opacidade com texto da mesma cor tendem a falhar contraste.** Meça cada
  combinação; se ficar abaixo de 4.5:1, escureça o fundo ou clareie o texto até passar.
- Cyan puro sobre fundo claro dá **2.43:1** — nunca use `#06B6D4` como texto no tema claro;
  é para isso que existe o `#0E7490` na coluna Light.
- Texto sobre vidro exige AA (4.5:1) medido contra o fundo **efetivo**, nos dois temas.
- Nenhum glow ou pulsação anima com `prefers-reduced-motion: reduce`.
- Foco visível em todo elemento interativo; alvos de toque ≥ 44px.

## Pendências que bloqueiam implementação fiel

- **Spectrum Gradient: 6 stops no asset, 7 no texto.** O `DESIGN.md` chama o gradiente de
  "signature brand element" mas não lista os stops. Eles foram extraídos do logotipo real
  (`public/imgs/logoCompletaColorida.svg`) e vivem em `--gradient-spectrum`:

  | Offset | Cor |
  | --- | --- |
  | 24.3% | `#358EE3` |
  | 38.8% | `#5176EB` |
  | 44.8% | `#6366F1` |
  | 69.7% | `#4145A0` |
  | 80.4% | `#2E3474` |
  | 96.7% | `#0B1220` |

  São **6**, não os 7 que o documento anuncia — confirme com o designer se falta um stop
  (o cyan `#06B6D4` aparece no SVG, mas fora deste gradiente).

  **Uso decorativo apenas.** A ponta clara dá 3.43:1 com texto branco, então o gradiente
  não preenche controle que carregue texto: o botão primário continua sólido em
  `--color-brand`. Vale para *light leak* (`.spectrum-edge`), fundos de sidebar e detalhes
  sem texto por cima.

- **Ícones Phosphor Duotone** são exigidos pelo documento e implicam a dependência
  `@phosphor-icons/react`. A regra 01 exige justificativa para nova dependência — esta é
  mandatada pelo design system, e esta linha é o registro dela.
