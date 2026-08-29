# Matthias Löhden — Portfolio

[![CI/CD](https://github.com/matthiasloehden/portfolio/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/matthiasloehden/portfolio/actions/workflows/ci-cd.yml)

Personal portfolio for Matthias Löhden, built as a polished static Nuxt site and as a reviewable code sample.

Live site: [matthiasloehden.github.io/portfolio](https://matthiasloehden.github.io/portfolio/)

## Code Highlights

| Area | What to inspect |
| --- | --- |
| background orchestration | [`app/components/layout/BackgroundOrchestrator.vue`](app/components/layout/BackgroundOrchestrator.vue) selects the active scene and provides smooth transitions between backgrounds. |
| typed background settings | [`app/config/backgrounds/settingsRegistry.ts`](app/config/backgrounds/settingsRegistry.ts) connects scene definitions to the framework-neutral setting rules in [`app/domain/backgrounds`](app/domain/backgrounds). |
| theme system | [`app/domain/themes/settings.ts`](app/domain/themes/settings.ts) validates theme settings, while [`app/config/themes/selection.ts`](app/config/themes/selection.ts) resolves route-aware color schemes and [`app/utils/themeRuntime.ts`](app/utils/themeRuntime.ts) applies their transitions. |
| Wave Grid | [`app/components/backgrounds/wave/WaveRenderer.ts`](app/components/backgrounds/wave/WaveRenderer.ts) renders an interactive, GPU-accelerated line grid. |
| Triangles | [`app/components/backgrounds/triangles/TriangleRenderer.ts`](app/components/backgrounds/triangles/TriangleRenderer.ts) renders an animated geometric Canvas2D background. |
| Particles | [`app/components/backgrounds/particles/ParticleRenderer.ts`](app/components/backgrounds/particles/ParticleRenderer.ts) renders a GPU-accelerated particle field with cursor, click, and scroll interaction. |
| Living Mesh | [`app/components/backgrounds/mesh/MeshRenderer.ts`](app/components/backgrounds/mesh/MeshRenderer.ts) renders an animated, pointer-reactive Canvas2D mesh. |
| cooling loop diagram | [`app/components/personal/cooling/CoolingLoopPanel.vue`](app/components/personal/cooling/CoolingLoopPanel.vue) composes typed SVG components with procedural animation to visualize a custom liquid cooling system. |

## Project Structure

The project combines feature-oriented frontend code with explicit boundaries for reusable policy, configuration, and
browser integration. The structure is intentionally detailed enough to support the interactive systems in this portfolio
without introducing folders that contain only architectural ceremony.

| Directory | Responsibility |
| --- | --- |
| `app/pages` | Route entry points for the home, professional, academic, and personal portfolio sections. |
| `app/layouts` | The persistent application shell that coordinates navigation, page content, display preferences, and ambient backgrounds. |
| `app/components/{home,work,academic,personal}` | Feature-specific presentation components kept close to the content and interactions they implement. |
| `app/components/backgrounds` | Self-contained Canvas2D and WebGL scenes. Each feature owns its controller, renderer, shaders or geometry, and interaction models; reusable rendering infrastructure lives in `shared`. |
| `app/components/{layout,shared}` | Application-level controls and accessible UI primitives reused across portfolio sections. |
| `app/composables` | Reactive orchestration across Vue state, domain policy, persistence, routing, and browser lifecycle events. |
| `app/config` | Typed product catalogs and selection policy for color schemes and per-scene background settings. |
| `app/domain` | Framework-neutral defaults, validation, migrations, and immutable updates shared across multiple features. |
| `app/data` | Typed portfolio content separated from rendering components so copy and presentation evolve independently. |
| `app/types` | Public TypeScript contracts for content, themes, display preferences, and background renderers. |
| `app/utils` | Focused browser-boundary adapters and generic helpers, including resilient localStorage access and theme initialization. |
| `app/assets` / `app/plugins` | Global styling and fonts, plus client-only integration for viewport reveal behavior. |
| `tests/unit` | Fast Vitest coverage for domain policy, persistence, adaptive performance, geometry, and interaction models. |
| `tests/e2e` | Playwright coverage for responsive page contracts, accessibility, navigation, display settings, and persistence. |

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
