---
name: Modern Technical Editorial
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#00505f'
  on-tertiary: '#ffffff'
  tertiary-container: '#006a7c'
  on-tertiary-container: '#93e8ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  sidebar-expanded: 16rem
  sidebar-collapsed: 4.5rem
  editor-max-width: 54rem
  preview-min-width: 30rem
  gutter: 1.5rem
---

## Brand & Style

The design system is engineered for developers, engineering managers, and technical specialists who view their career documentation as structured code rather than decorative prose. The aesthetic blends the crisp utility of developer tooling with the understated polish of modern editorial design.

The core visual signature balances strict structural layout, clean whitespace, and precise typographic hierarchy. It avoids gratuitous decoration in favor of high visual legibility, rigorous visual rhythm, and confident affordances. The experience must evoke competence, technical clarity, and efficiency—allowing dense professional resumes, skills taxonomies, and career chronologies to feel structured, editable, and effortless to parse.

## Colors

The system relies on a restrained palette anchored by cool slate neutrals and a high-focus indigo/violet core.

- **Primary (`#4f46e5`)**: Used selectively for primary calls to action, committed actions, active navigation states, and key interactive highlights.
- **Secondary (`#6366f1`)**: Acts as a lighter interactive companion for hover states, focus rings, and secondary emphasis tags.
- **Tertiary (`#06b6d4`)**: Reserved for code indicators, sync indicators, verification tags, and preview metadata callouts.
- **Neutral (`#64748b` - Slate)**: Dictates the chrome and structure. Surfaces are mapped along a slate spectrum ranging from `#f8fafc` (app background canvas) through `#ffffff` (card surface elevation) to `#0f172a` (high-contrast primary ink).
- **Feedback Accents**:
  - Semantic Error: `#ef4444` (validation failures, destructive entry removals, required indicators)
  - Semantic Success: `#10b981` (saved changes, compiled resume status, valid JSON schema checks)
  - Semantic Warning: `#f59e0b` (incomplete sections, unverified credentials)

## Typography

Typography prioritizes high information density, structural hierarchy, and effortless scanning.

- **Headlines & Body**: `Inter` is deployed universally for structural headings, descriptions, and user inputs. Precise letter spacing (-0.025em to -0.01em on headings) produces a clean, high-density layout.
- **Labels & Schema Indicators**: `JetBrains Mono` handles field labels, tags, date ranges, JSON schema properties, and version pills. It directly reinforces the developer-first ethos and provides crisp contrast next to running resume prose.

## Layout & Spacing

The application implements an asymmetric two-pane layout alongside a collapsible navigation rail:

- **Sidebar Navigation**: Fixed rail that switches smoothly between `sidebar-expanded` (256px) and `sidebar-collapsed` (72px).
- **Editor Canvas**: Centers on a focused document column (`editor-max-width` / 864px) or splits into an equal 50/50 split-pane workspace on displays wider than `1440px`, displaying editable form blocks on the left and live resume compilation on the right.
- **Form Rhythm**: Input stacks adhere strictly to `space-base` (16px) margins. Grouped metadata badges and compact inline tools utilize `space-sm` (8px) and `space-xs` (4px).
- **Responsive Adaptations**:
  - Below `1024px`, the live preview detaches into a tabbed toggle mode, and the sidebar collapses into a floating slide-over drawer triggered by a header hamburger action.
  - Form field rows collapse from inline side-by-side grids (e.g., Start Date / End Date) into a single vertical stack.

## Elevation & Depth

Visual hierarchy uses a refined hybrid approach: low-contrast borders (`#e2e8f0`) combined with faint, tinted ambient drop shadows.

- **Level 0 (Canvas)**: `#f8fafc` background; zero shadow.
- **Level 1 (Card & Content Blocks)**: `#ffffff` surface, 1px solid border (`#e2e8f0`), shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Hovered Sections / Popovers)**: 1px solid border (`#cbd5e1`), shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Modals & Dialogs)**: `#ffffff` surface, 1px solid border (`#cbd5e1`), shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.08)`. Backdrops use `rgba(15, 23, 42, 0.45)` with a `backdrop-blur(4px)` wash to keep context while maintaining dialog focus.

## Shapes

The interface embraces a subtle, disciplined softness (`roundedness: 1`). 
- Standard buttons, input controls, chips, and small cards feature a uniform `0.25rem` (4px) to `0.375rem` (6px) radius.
- Larger containers, section cards, and modal dialogs use `0.5rem` (8px) to `0.75rem` (12px).
- Pill shapes are rejected except for compact status indicators, live badge indicators, and verification dots to keep the visual tone utilitarian and crisp.

## Components

### Buttons & Icon Actions
- **Primary**: Solid indigo fill (`#4f46e5`), white text, subtle hover lift to `#4338ca`, 2px primary focus ring with a 2px white offset.
- **Secondary / Ghost**: Slate border (`#cbd5e1`), transparent background, text in slate-700 (`#334155`), active hover in slate-50 (`#f8fafc`).
- **Pencil Edit Buttons**: Compact 32x32px squircle icon buttons (`rounded: 6px`). Slate-400 default stroke, transitioning to `#4f46e5` on hover with a `#eef2ff` subtle background fill.

### Input Fields & Validation States
- **Default Field**: `#ffffff` background with a crisp 1px `#cbd5e1` boundary.
- **Focus State**: 1px `#6366f1` ring + 3px soft tint ring (`rgba(99, 102, 241, 0.15)`).
- **Required Badges**: Monospace label tag `[REQ]` or a subtle crimson asterisk (`#ef4444`) appended rightward of the label.
- **Validation Alerts**: Subtle tinted container (`#fef2f2`) with a left stroke accent of 3px solid `#ef4444`, using 12px mono-spaced text detailing the schema requirement.

### Resume Section Cards (Work, Education, Skills, Basics)
- Framed in Level 1 elevation with a light slate header bar separating item drag-handles, category titles, item count badges, and action icon groups (e.g., Pencil Edit, Duplicate, Reorder, Delete).
- Drag-and-drop hover state outlines card perimeters with a dashed `#6366f1` edge.

### Chips & Badges
- **Technical Skills**: Pill-shaped or soft-rect chips with `#f1f5f9` backgrounds, `#334155` text, and an optional monospace version or proficiency tag (e.g., `TypeScript • Advanced`).
- **Status Badges**: Dot indicator (emerald, amber, or slate) accompanied by upper-case mono labels (`PUBLISHED`, `DRAFT`, `SCHEMA ERROR`).

### Modal Dialogs (Entry Forms)
- Fixed maximum width of `640px` with a sticky structured header (section title + close icon) and sticky action footer (`Cancel` ghost button + `Save Entry` primary button).
- Field arrangement uses structured responsive grid rows (e.g., Institution / Role, followed by Dates, followed by Markdown/prose bullet items).