# Design System

## Overview
A focused, minimal dark interface for a developer productivity tool.
The visual language should feel modern SaaS: clean, confident, and efficient for long working sessions.

### Design Principles
- Clarity first: prioritize readability and hierarchy over decoration.
- Purposeful emphasis: use accent color only when users need to act.
- Dense but calm: fit more information without visual noise.
- Consistent rhythm: spacing, radius, and typography should feel predictable.

## Colors

### Core Palette
- **Primary** (`#2665fd`): CTAs, active states, key interactive elements
- **Secondary** (`#475569`): Supporting UI, chips, secondary actions
- **Surface** (`#0b1326`): Page backgrounds
- **On-surface** (`#dae2fd`): Primary text on dark backgrounds
- **Error** (`#ffb4ab`): Validation errors, destructive actions

### Extended Neutrals
- **Surface-2** (`#111a32`): Cards and elevated sections
- **Surface-3** (`#1a2542`): Input and control backgrounds
- **Border** (`#2a375d`): Dividers, outlines, table separators
- **Muted text** (`#9fb0d9`): Supporting copy and hints
- **Success** (`#66d9a3`): Positive states, successful actions
- **Warning** (`#f6c177`): Caution states and non-blocking alerts

### Usage Rules
- Keep page background on `Surface` and reserve `Surface-2`/`Surface-3` for layering.
- Limit `Primary` to one dominant action per region (page header, card, modal).
- Do not combine multiple semantic colors in one compact component unless required by status data.

## Typography

### Font Family
- **Headlines**: Inter, semi-bold
- **Body**: Inter, regular, 14-16px
- **Labels**: Inter, medium, 12px, uppercase for section headers

### Type Scale
- **Display**: 32px / 40px, 600
- **H1**: 24px / 32px, 600
- **H2**: 20px / 28px, 600
- **H3**: 18px / 24px, 600
- **Body L**: 16px / 24px, 400
- **Body M**: 14px / 20px, 400
- **Body S**: 13px / 18px, 400
- **Label**: 12px / 16px, 500, uppercase optional

### Typography Guidelines
- Keep line lengths around 60-90 characters in content views.
- Use `Body M` for dense UI (tables, settings), `Body L` for reading-heavy areas.
- Avoid more than three text weights in one screen.

## Spacing and Layout

### Spacing Scale
Use an 8px base grid:
- `4px` (micro spacing)
- `8px` (tight)
- `12px` (compact)
- `16px` (default)
- `24px` (section spacing)
- `32px` (major grouping)

### Layout
- Desktop-first app shell with left navigation and content workspace.
- Max content width for reading surfaces: `1200px` where applicable.
- Keep persistent actions in predictable positions (top-right in headers, bottom-right in dialogs).

## Radius, Borders, and Depth

### Radius
- Base radius: `8px` (buttons, inputs, chips, cards)
- Larger radius: `12px` for modals and large containers only

### Borders and Elevation
- Prefer 1px borders and tonal contrast over heavy shadows.
- Use subtle shadows only for overlays (`modal`, `popover`, `dropdown`) to preserve depth cues.

## Components

### Buttons
- Rounded (`8px`), primary uses brand blue fill.
- Sizes: `sm` (32px), `md` (40px), `lg` (44px) heights.
- Primary for one key action; secondary/ghost for alternatives.
- Disabled states must reduce contrast and remove elevation cues.

### Inputs
- 1px border, subtle `Surface-3` background.
- Clear focus state using `Primary` outline/ring.
- Validation states must include both color and message text.

### Cards
- No heavy elevation; rely on border and background contrast.
- Standard card padding: `16px` or `24px` based on density.
- Header, content, and footer spacing should follow the 8px grid.

### Tables and Data Views
- Compact rows: 40-44px default row height.
- Sticky header where scanning large datasets is expected.
- Row hover uses tonal shift, not bright accent fills.

### Navigation
- Left sidebar with grouped sections and clear active indicator.
- Active item uses `Primary` accent bar or background tint, not full saturated fill.

### Feedback
- Toasts for transient outcomes; banners for persistent context.
- Error surfaces should pair `Error` tone with actionable recovery text.

## Interaction and Motion

### States
All interactive components should define:
- Default
- Hover
- Focus-visible
- Active
- Disabled
- Loading (for async actions)

### Motion
- Keep transitions short (`120-180ms`) and subtle.
- Prefer opacity and transform transitions over layout-shifting animations.
- Disable non-essential motion for users who prefer reduced motion.

## Accessibility
- Maintain at least 4:1 contrast ratio for all text.
- Maintain visible keyboard focus indicators on all controls.
- Ensure hit targets are at least 40x40px where possible.
- Never rely on color alone to communicate status.

## Do's and Don'ts
- Do use the primary color sparingly, only for the most important action.
- Do keep spacing consistent with the 8px grid.
- Do maintain 4:1 contrast ratio for all text.
- Don't mix rounded and sharp corners in the same view.
- Don't stack multiple strong accent colors in one component cluster.
- Don't hide critical information behind hover-only interactions.

## Application Strategy (Approved)

### Chosen Approach
Use **Approach A: Global-First Theme Refactor** with a **Taiga-first** implementation.
This sequence is mandatory for consistency and long-term maintainability:
1. Build/normalize tokens globally.
2. Apply component-level standards.
3. Migrate layouts and screens in defined order.

### Theming Architecture
- Keep this file as the product-facing spec and source of design intent.
- Implement theme tokens in:
  - `src/styles/vendor/taiga-ui/variables.less`
  - `src/styles/vendor/taiga-ui/palette.less`
- Expose matching CSS custom properties in global styles (`src/styles.scss` and/or `src/styles/index.scss`) for non-Taiga surfaces.

### Token Layers
- **Core tokens**: color, typography, spacing, radius, border, focus, motion.
- **Semantic tokens**: text levels, surface levels, state roles (`success`, `warning`, `error`).
- **Component aliases**: button/input/card/table/nav aliases mapped to core + semantic tokens.

### Override Policy
- Prefer Taiga variables and theming APIs before writing app-level overrides.
- Use app-level overrides only when Taiga cannot express a required style.
- Do not hardcode one-off visual values in page styles unless feature-specific and documented.

## Migration Plan (Full App)

### Layout and Shell First
- Redesign `main-layout` and `grid-layout` into a modern SaaS shell:
  - stable sidebar navigation
  - clear content header
  - consistent content container widths

### Component Standardization
- Normalize shared styles in:
  - `src/styles/components/button.scss`
  - `src/styles/components/input.scss`
  - `src/styles/components/card.scss`
  - `src/styles/components/table.scss`
  - `src/styles/components/badge.scss`
- All interactive primitives must define default/hover/focus-visible/active/disabled/loading states.

### Screen Order
1. `login` (sets form and auth visual language)
2. `dashboard` (sets card and data summary patterns)
3. `portfolio` and nested components (table, filters, form, feedback states)
4. `profile`, `not-found`, and remaining shared components

### Screen Definition of Done
- No hardcoded off-system colors in screen styles.
- Typography uses approved scale.
- Spacing follows 8px rhythm.
- Keyboard focus is visible and consistent.
- Empty/loading/error/success states are clear and reusable.

## Quality and Verification

### Data and Status States
- Major views must explicitly support loading, empty, error, and success states.
- Destructive actions must provide confirmation and recovery messaging.

### Accessibility
- Keep 4:1 or better text contrast on dark surfaces.
- Preserve predictable keyboard order in nav, forms, tables, and dialogs.
- Never rely on color-only status communication.

### Review Gates
- **Token lint pass**: remove legacy hardcoded colors/radii.
- **Visual QA pass**: check hierarchy, density, and emphasis vs this spec.
- **Interaction QA pass**: validate focus/disabled/loading states.
- **Regression QA pass**: ensure functional flows still work after restyling.

### Rollout Guidance
- Ship in small, reviewable increments by feature area.
- Keep each increment mergeable and visually coherent to reduce regression risk.
