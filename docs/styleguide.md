# Portfolio style guide

This project uses a small semantic design system on top of Tailwind CSS 4. `app/assets/style/main.css` is the global
stylesheet entry point, while theme tokens live in `app/assets/style/theme.css`; components consume semantic utilities
instead of raw color values.

## Color tokens

| Tailwind utility suffix | Purpose |
| --- | --- |
| `background` | Page canvas |
| `raised` | Elevated navigation, controls, and panels |
| `surface` / `surface-hover` | Translucent content surfaces and hover states |
| `line` / `line-strong` | Default and emphasized borders |
| `foreground` | Primary text |
| `muted` | Supporting text and inactive navigation |
| `quiet` | Low-emphasis metadata |
| `primary` / `primary-bright` | Brand color and emphasized interaction state |
| `primary-foreground` | Text placed on the primary color |

Use semantic classes such as `bg-background`, `text-foreground`, `text-muted`, `border-line`, and `bg-primary`.
Dark and light values are CSS custom properties. Dark mode is the default; the header theme control stores an explicit
visitor choice when it differs from that default.

## Typography and layout

- `font-sans`: configurable body copy and general interface text
- `font-display`: configurable narrow display headings
- `font-mono`: navigation, labels, metadata, and technical details
- `site-container`: shared maximum page width and horizontal gutters
- `xs` (420px), `sm` (620px), and `md` (820px): project breakpoints

Keep headings short. Use uppercase display type for page and section statements, mono type for structural labels, and
sentence case for body copy. The available display families must remain narrow enough for the established heading sizes;
broader reading faces belong in the body-font registry instead.

## Implementation rules

- Use Tailwind utilities in templates for layout, spacing, color, typography, responsive behavior, and simple states.
- Use scoped CSS for pseudo-elements, keyframes, complex diagrams, `nth-child` relationships, and fluid values that are
  clearer as a named component rule.
- Do not use `@apply`. Repeated interface patterns belong in a focused Vue component.
- Do not introduce raw brand colors in component templates. Add or adjust a semantic token instead.
- Prefer `transition-colors` or short transform/opacity transitions. Respect `prefers-reduced-motion`.

## Shared interface components

- The default Nuxt layout owns the skip link, header, footer, and `BackgroundOrchestrator`; pages render only their main
  content and metadata.
- `LayoutSiteHeader`: one central page list with active-page state, responsive menu, and theme control
- `LayoutSiteFooter`: shared site navigation and contact action
- `SharedActionLink`: primary and text call-to-action variants
- `SharedSectionKicker`: numbered or categorized section label
- `SharedPanelFrame`: common frame and caption for technical visualizations
- `SharedCaseStudyList`: common linked overview for work and university case studies

## Accessibility

Interactive elements need visible focus states and descriptive labels. Navigation uses semantic lists and
`aria-current`; the mobile menu exposes its expanded state. Decorative prefixes are hidden from assistive technology
when they add no meaning. Maintain sufficient contrast in both themes and test keyboard navigation at every breakpoint.
