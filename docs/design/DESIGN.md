---
name: RookHub Design System
colors:
  surface: '#13131b'
  surface-dim: '#13131b'
  surface-bright: '#393841'
  surface-container-lowest: '#0d0d15'
  surface-container-low: '#1b1b23'
  surface-container: '#1f1f27'
  surface-container-high: '#292932'
  surface-container-highest: '#34343d'
  on-surface: '#e4e1ed'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e4e1ed'
  inverse-on-surface: '#303038'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#c0c6da'
  on-tertiary: '#2a3040'
  tertiary-container: '#8a90a3'
  on-tertiary-container: '#232a39'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#dce2f6'
  tertiary-fixed-dim: '#c0c6da'
  on-tertiary-fixed: '#151b2a'
  on-tertiary-fixed-variant: '#404757'
  background: '#13131b'
  on-background: '#e4e1ed'
  surface-variant: '#34343d'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  container-margin: 24px
  gutter: 20px
---

## Brand & Style

The design system is engineered for a high-performance SaaS environment focused on logistics and fleet management. It balances the high-density information requirements of transportation hubs with an ultra-modern, immersive aesthetic.

The visual direction is **Total Glassmorphism**. This style utilizes deep spatial layering, where information lives on translucent "glass" panes floating over a dark, atmospheric void. The interface should feel like a futuristic command center—sophisticated, fluid, and highly organized. By utilizing vibrant background blurs and organic glow effects, the system reduces visual fatigue while maintaining a premium, cutting-edge feel that distinguishes it from traditional, flat enterprise software.

## Colors

The palette is built upon a **Dark Base (#0B1220)**, providing a high-contrast foundation for vibrant accents and a new high-clarity neutral tier.

- **Primary (Indigo):** #6366F1. Used for primary actions, active states, and brand-critical touchpoints.
- **Secondary (Cyan):** #06B6D4. Used for data visualization, highlights, and secondary interactive elements.
- **Tertiary (Midnight):** #0B1220. A deep, tonal utility color used for core backgrounds, grounding elements, and integrated structural surfaces.
- **Spectrum Gradient:** This 7-stop linear gradient is the signature brand element. It should be used sparingly for sidebar backgrounds, primary button hover states, or as a subtle "light leak" at the edges of the viewport.
- **Organic Glows:** Implement large, soft radial gradients (`100px` blur) in the corners of the screen using the Indigo and Cyan values at 15% opacity to create depth behind the glass layers.

## Typography

This design system employs a dual-font strategy to balance character with utility.

- **Sora (Headlines):** Its geometric and wide-set nature conveys innovation and technological precision. Use for all page titles, card headings, and large metric displays.
- **Inter (Body & UI):** Chosen for its exceptional legibility in data-heavy environments. Use for all body text, input fields, and small labels.

For data tables and fleet telemetry, use `Inter` with tabular lining figures to ensure numbers align vertically for easy comparison.

## Layout & Spacing

The layout follows a **Fluid Grid** system designed for high-density monitoring.

- **Desktop:** 12-column grid with a `24px` margin and `20px` gutters. Content is housed within glass modules that can span multiple columns.
- **Tablet:** 8-column grid. Sidebars collapse into icons to prioritize the dashboard real estate.
- **Mobile:** 4-column grid. Glass modules stack vertically. Margins reduce to `16px`.

Maintain a generous `24px` (md) vertical rhythm between modules to allow the background glows and glass effects to "breathe," preventing the UI from feeling cluttered despite high information density.

## Elevation & Depth

Depth is not communicated through traditional shadows, but through **translucency and refraction**.

- **Glass Base:** All primary containers use a background of `rgba(255, 255, 255, 0.04)` with a `backdrop-filter: blur(16px)`.
- **Borders:** Every glass element must have a `1px` solid border using a subtle gradient: `linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))`. This creates the "edge" of the glass.
- **Stacking:** Higher-priority elements (like modals) should increase their background opacity to `0.08` and the blur to `24px` to visually lift them above the standard dashboard panels.

## Shapes

The shape language is defined by **large, friendly radii** that soften the technical nature of fleet management data.

- **Main Containers:** All cards and primary dashboard panels use a `20px` corner radius (standard `rounded-lg` in this configuration).
- **Inner Elements:** Buttons, inputs, and nested items inside cards use a `12px` radius to create a nested geometric harmony.
- **Icons:** Use **Phosphor Icons Duotone**. The duotone style mirrors the glassmorphism aesthetic by using two tones of the same color, reinforcing the layering concept.

## Components

- **Buttons:**
  - *Primary:* Spectrum gradient background with white text and a subtle inner glow.
  - *Secondary:* Glass background (`0.08` opacity) with an Indigo border and text.
  - *Tertiary:* Ghost style using the Primary Indigo for text against the Midnight background, used for low-priority utility actions.
- **Input Fields:** Semi-transparent dark fills with `1px` glass borders. On focus, the border transitions to the Cyan accent with a subtle external glow.
- **Cards:** The core of the UI. Must use the `16px` blur and `20px` radius. Titles within cards should be Sora SemiBold.
- **Chips/Badges:** High-saturation Cyan, Indigo, or Tertiary Midnight backgrounds with low opacity (20%) and solid text of the same color to ensure readability against glass.
- **Fleet Indicators:** Small, pulsating glows used on maps or status lists to indicate active vehicles, utilizing the primary Indigo for "Active" and a muted gray for "Idle."
