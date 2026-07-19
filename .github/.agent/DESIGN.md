---
name: Deterministic Enterprise
colors:
  surface: '#031427'
  surface-dim: '#031427'
  surface-bright: '#2a3a4f'
  surface-container-lowest: '#000f21'
  surface-container-low: '#0b1c30'
  surface-container: '#102034'
  surface-container-high: '#1b2b3f'
  surface-container-highest: '#26364a'
  on-surface: '#d3e4fe'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#d3e4fe'
  inverse-on-surface: '#213145'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#bcc7de'
  on-tertiary: '#263143'
  tertiary-container: '#8691a7'
  on-tertiary-container: '#1f2a3c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#031427'
  on-background: '#d3e4fe'
  surface-variant: '#26364a'
  status-success: '#10B981'
  status-warning: '#F59E0B'
  status-error: '#EF4444'
  surface-deep: '#020617'
  surface-card: '#0F172A'
  border-subtle: '#1E293B'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
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
    lineHeight: 18px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  max-width: 1440px
---

## Brand & Style

The design system is engineered for **Technical Automation and Production-Grade Systems**. It prioritizes absolute determinism, operational transparency, and high information density. The visual narrative is "The Ghost in the Machine"—a sophisticated, dark-mode environment that feels like a high-performance terminal combined with modern enterprise reliability.

The core aesthetic is **Corporate Modern with a Technical Edge**. It balances the precision of developer tools with the structured hierarchy of enterprise software. The UI should evoke a sense of "Control Total"—calm, authoritative, and ultra-responsive. It avoids decorative elements in favor of functional indicators, subtle borders, and rhythmic spacing that supports rapid data scanning.

**Key Visual Principles:**
- **Information over Ornament:** Every pixel must serve a purpose in monitoring system health or document status.
- **Precision:** Use of hairline strokes and monospaced accents to emphasize the system's "production-grade" nature.
- **Urgency through Color:** A neutral backdrop allows action-oriented blues and status-specific colors to command immediate attention without overwhelming the user.

## Colors

The palette is anchored in **Enterprise Dark**. The background is a layered hierarchy of deep slates, ensuring that long sessions do not cause "context rot" or visual fatigue.

- **Primary Action:** Vibrant Blue (`#3B82F6`) is reserved for primary calls to action, active states, and successful system connections.
- **Surfaces:** Use `surface-deep` for the primary application background and `surface-card` for elevated modules and containers.
- **Status Indicators:** These are non-negotiable and must be used consistently for system health:
    - **Success Emerald:** Document generation complete, resource pool healthy.
    - **Warning Amber:** Memory usage exceeding 70%, transient operational errors.
    - **Error Ruby:** Critical process failure, programming error (crash required), or binary mismatch.
- **Neutrals:** Used for secondary text and structural lines. The `border-subtle` is the primary tool for defining hierarchy without adding visual weight.

## Typography

The typographic system is built for legibility in dense data environments. 

- **Primary Typeface:** **Inter** handles all UI labels, body text, and headlines. It is chosen for its neutral, highly legible character at small sizes.
- **Technical Typeface:** **JetBrains Mono** is utilized for all technical data, logs, memory addresses, and file paths. This reinforces the "production-grade" aesthetic and ensures that technical strings are easily distinguishable from UI labels.
- **Hierarchy:** Use `label-caps` for table headers and section titles to create clear structural breaks. `code-sm` should be the default for log outputs and system metadata.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid Grid**. Content is housed within a 12-column grid system that scales up to a `max-width` of 1440px, after which it centers.

- **Rhythm:** All spacing is based on a **4px base unit**. Component padding and margins must always be multiples of this unit (8px, 12px, 16px, 24px).
- **Density:** This is a high-density system. Use `12px` (3 units) for internal component padding and `16px` (4 units) for gutters between major modules.
- **Mobile Reflow:** On mobile devices, the 12-column grid collapses to a single column. Horizontal margins are reduced to `16px`. Tables must be horizontally scrollable or converted to card-lists to maintain data integrity.

## Elevation & Depth

In an "Enterprise Dark" environment, elevation is conveyed through **Tonal Layering** and **Subtle Outlines** rather than heavy shadows.

- **Surface Tiers:**
    - **L0 (Base):** `#020617` (Deepest layer).
    - **L1 (Cards/Panels):** `#0F172A` with a 1px border of `#1E293B`.
    - **L2 (Modals/Popovers):** `#1E293B` with a slightly more prominent border.
- **Shadows:** Use extremely subtle, low-opacity ambient shadows (`rgba(0,0,0,0.5)`) only for floating elements like dropdowns or tooltips.
- **Interactivity:** On hover, elements should increase their tonal value (become slightly lighter) or shift their border color to the `Primary Blue`.

## Shapes

The shape language is **Soft (0.25rem)**. This provides a professional, "tooled" feel that is more approachable than sharp 0px corners but maintains a technical rigor that pill-shaped UI lacks.

- **Buttons & Inputs:** Use `rounded` (4px).
- **Major Containers:** Use `rounded-lg` (8px) for cards and modals to provide a clear container hierarchy.
- **Status Pills:** Small, high-contrast badges for status (e.g., "Operational") should use the same `rounded` (4px) setting to maintain consistency.

## Components

- **Buttons:** 
    - **Primary:** Solid Blue (`#3B82F6`) with white text.
    - **Secondary:** Transparent background with `border-subtle` and white text.
    - **Destructive:** Solid Ruby (`#EF4444`).
- **Input Fields:** Dark background (`surface-deep`), subtle border, and 1px inset focus ring in Primary Blue. Monospaced font for technical inputs (e.g., Cron expressions, API keys).
- **Status Indicators:** Use "Health Rings"—a small circular dot in the status color next to the monospaced label (e.g., `● RUNNING`).
- **Data Tables:** High density. Zebra striping is not required; use `border-subtle` for row separation. Use `label-caps` for headers.
- **Resource Monitors:** Use "Micro-Sparklines" for CPU/RAM monitoring—thin, un-aliased lines in Primary Blue or Status Amber if throttling.
- **Cards:** Used to house subagent details or document generation stats. Should feature a header with a monospaced ID and a status indicator in the top right.