# Matthias Löhden — Portfolio

[![CI/CD](https://github.com/matthiasloehden/portfolio/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/matthiasloehden/portfolio/actions/workflows/ci-cd.yml)

Personal portfolio for Matthias Löhden, built as a polished static Nuxt site and as a reviewable code sample.

Live site: [matthiasloehden.github.io/portfolio](https://matthiasloehden.github.io/portfolio/)

## Code Highlights

| Area | What to inspect |
| --- | --- |
| background orchestration | [`app/components/layout/BackgroundOrchestrator.vue`](app/components/layout/BackgroundOrchestrator.vue) selects the active scene and provides smooth transitions between backgrounds. |
| typed background settings | [`app/config/backgrounds/settingsRegistry.ts`](app/config/backgrounds/settingsRegistry.ts) connects scene definitions to the framework-neutral setting rules in [`app/domain/backgrounds`](app/domain/backgrounds). |
| theme system | [`app/domain/themes/settings.ts`](app/domain/themes/settings.ts) validates theme settings and resolves the typed palettes, fonts, and semantic color tokens defined in [`app/config/themes/definitions.ts`](app/config/themes/definitions.ts). |
| Wave Grid | [`app/components/backgrounds/wave/WaveRenderer.ts`](app/components/backgrounds/wave/WaveRenderer.ts) renders an interactive, GPU-accelerated line grid. |
| Triangles | [`app/components/backgrounds/triangles/TriangleRenderer.ts`](app/components/backgrounds/triangles/TriangleRenderer.ts) renders an animated geometric Canvas2D background. |
| Particles | [`app/components/backgrounds/particles/ParticleRenderer.ts`](app/components/backgrounds/particles/ParticleRenderer.ts) renders a GPU-accelerated particle field with cursor, click, and scroll interaction. |
| Living Mesh | [`app/components/backgrounds/mesh/MeshRenderer.ts`](app/components/backgrounds/mesh/MeshRenderer.ts) renders an animated, pointer-reactive Canvas2D mesh. |
| cooling loop diagram | [`app/components/personal/cooling/CoolingLoopPanel.vue`](app/components/personal/cooling/CoolingLoopPanel.vue) composes typed SVG components with procedural animation to visualize a custom liquid cooling system. |

## Architecture

The source tree separates product policy from browser and rendering concerns without introducing layers that have only
one occupant:

| Directory | Responsibility |
| --- | --- |
| `app/domain` | Framework-neutral product rules shared across features, including defaults, validation, migrations, and immutable settings updates. |
| `app/config` | Typed product catalogs for themes and per-scene background settings. Definitions contain metadata; domain functions provide the reusable behavior. |
| `app/components/backgrounds` | Feature-oriented background implementations. Each scene keeps its Vue controller, renderer, technical resources, and feature-specific models together; shared rendering infrastructure lives in `shared`. |
| `app/composables` | Reactive application orchestration across domain state, persistence, and browser effects. |
| `app/utils` | Small browser-boundary adapters and generic helpers, including resilient localStorage access and theme application. |
| `tests/unit` / `tests/e2e` | Vitest verifies framework-independent policy; Playwright verifies integrated behavior, accessibility, persistence, and responsive flows. |

The dependency direction is deliberate: components and composables consume the typed configuration and domain APIs;
the domain layer never depends on Vue, Canvas, WebGL, or browser storage. Pure scene models remain unit-testable without
being promoted to application-wide domain concepts.

## Stack

This portfolio is intentionally more engineered than a basic static resume. The goal is to show the architecture habits I
use in larger software systems: explicit boundaries, typed data, reusable components, accessible interaction states,
performance fallbacks, and automated quality gates.

| Component | Purpose |
| --- | --- |
| Nuxt | Application framework for routing, SEO metadata, static generation. |
| Vue | Component model for page sections, reusable panels, and interactive visualizations. |
| TypeScript | Typed content models, component contracts, and safer refactoring. |
| Tailwind CSS | Consistent responsive layout, spacing, typography, and maintainable utility usage. |
| Vite | Fast development server and build pipeline, including Tailwind's Vite integration. |
| `vue-tsc` | Static quality management for Vue and TypeScript correctness. |
| `oxlint`/`oxfmt` | Static quality management for linting and formatting. |
| Vitest | Dynamic quality management for unit tests. |
| Playwright | Dynamic quality management for browser behavior. |
| GitHub Actions | CI/CD pipeline that automates type checking, linting, formatting validation, static generation, browser tests, and automatic deployment to GitHub Pages on successful builds. |

## My Open Source Contributions 
| Work | Status | Link |
| --- | --- | --- |
| Smart-home control for `magic_mapper` | Merged | [Pull request #22](https://github.com/andrewfraley/magic_mapper/pull/22) |
| Lazy server support for Game-server panel | Open | [Pull request #128](https://github.com/discohaus/discopanel/pull/128) |
| Game-server plugin bug fix | Fixed | ⛓️‍💥 |

## Development

```bash
yarn install
yarn dev
```

Run the complete local quality check:

```bash
yarn check
yarn generate
yarn test:e2e
```

`yarn check` runs type checking, linting, formatting validation, and the Vitest unit suite. Use
`yarn test:unit:watch` for focused feedback while developing domain or renderer-support logic.

## Deployment

Every push to `main` runs type checking, linting, formatting checks, static generation, and the Playwright browser suite.
GitHub Pages is automatically deployed only after all checks pass.
