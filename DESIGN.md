# Design

Captured from the existing build: `paninipreventa.html` (Panini FIFA World Cup 2026 preventa landing for Diunsa).

## Theme

Light only, locked across every section. One corner-radius system: pills for buttons, 12px for cards/inputs, 20px for the form shell. Icons: Phosphor (regular + bold weights).

## Palette

Source of truth: Diunsa brand manual (blue) + Panini official colors (yellow). Do not alter these hexes.

| Token | Value | Role |
|---|---|---|
| `--blue` | `#0077CD` | Diunsa primary. Structural / trust color: nav accents, secondary actions, stat numbers, links, focus states. |
| `--blue-dark` | `#005EA3` | Blue hover/active state, gradient partner for the form aside. |
| `--blue-tint` | `#E8F2FB` | Blue-tinted surfaces (focus rings, process-step number chips). |
| `--yellow` | `#FFED00` | Panini accent. The one sales color: primary CTAs only, kept meaningful by never using it decoratively. |
| `--yellow-dark` | `#E6D500` | Yellow hover state. |
| `--ink` | `#101921` | Primary text, dark surfaces (form section background). |
| `--ink-soft` | `#55636B` | Secondary / body text. |
| `--paper` | `#FFFFFF` | Base surface. |
| `--surface` | `#F6F6F6` | Muted section background. |
| `--surface-strong` | `#ECECEC` | Stronger muted surface (clarity box). |
| `--line` | `#CECECE` | Panini grey. Borders, dividers, stat-grid hairlines. |
| `--danger` / `--danger-tint` | `#C22B2B` / `#FCEDED` | Form error state only. |

Accent discipline: yellow = buy/reserve actions exclusively. Blue = every other interactive or informational accent (secondary buttons, links, stat numbers, icons, focus rings). Never swap these roles.

## Typography

Single family: Arial/Helvetica (Poppins as its own fallback only, not a second voice). Display and body share the same stack; hierarchy comes from weight and size, not a font pairing. Headline sizes use `clamp()` (e.g. hero `clamp(34px, 5vw, 56px)`).

## Layout

- Section shell: `.wrap` at `max-width: 1240px`, `section { padding: 88px 0 }` (64px under 768px).
- Split patterns: product (`0.92fr / 1.08fr` grid), form shell (`0.9fr / 1.1fr` grid with a blue-gradient aside). Both collapse to a single column under 900px.
- Process/steps: 3-column bordered grid, collapses to stacked rows under 860px.
- Stat row: 3-cell grid with 1px hairline dividers via a grey background peeking through the gap.

## Components

- **Buttons**: pill radius, three intents (`btn-primary` yellow/ink, `btn-secondary` blue/white, `btn-ghost` transparent/bordered). One label per intent, reused verbatim across nav, hero, sections, and footer.
- **Form**: labeled fields, inline hint + error text, digit-only enforcement on ID (13) and phone (8) fields, loading spinner + disabled state on submit, success/error status banners.
- **FAQ**: accordion, single-open, chevron rotates on open.
- **Clarity callout**: left-border-accented box explaining preventa terms (inventory secured, not delivery priority).

## Motion

`.rise` fade/translate-up on hero load, staggered by section (`rise-1/2/3`), `prefers-reduced-motion` respected. FAQ accordion animates `max-height`. No scroll-triggered reveals yet on the sections below the fold, this is the main gap this polish pass addresses.
