# Matthias Löhden — Portfolio

[![CI/CD](https://github.com/matthiasloehden/portfolio/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/matthiasloehden/portfolio/actions/workflows/ci-cd.yml)

Personal portfolio for Matthias Löhden, built as a polished static Nuxt site and as a reviewable code sample.

Live site: [matthiasloehden.github.io/portfolio](https://matthiasloehden.github.io/portfolio/)

## Code Highlights

| Area | What to inspect |
| --- | --- |
| background orchestration | [`app/components/layout/BackgroundOrchestrator.vue`](app/components/layout/BackgroundOrchestrator.vue) selects the active scene and provides smooth transitions between backgrounds. |
| typed background settings | [`app/components/backgrounds/settings/registry.ts`](app/components/backgrounds/settings/registry.ts) connects scene-owned definitions to the editor, versioned persistence, performance presets, and runtime validation. |
| theme system | [`app/config/themes.ts`](app/config/themes.ts) defines typed light/dark palettes, semantic Tailwind tokens, safe color overrides, and independently configurable heading and body fonts.  |
| Wave Grid | [`app/components/backgrounds/waves/WaveRenderer.ts`](app/components/backgrounds/waves/WaveRenderer.ts) renders an interactive, GPU-accelerated line grid. |
| Triangles | [`app/components/backgrounds/triangles/TriangleRenderer.ts`](app/components/backgrounds/triangles/TriangleRenderer.ts) renders an animated geometric Canvas2D background. |
| Particles | [`app/components/backgrounds/particles/ParticleRenderer.ts`](app/components/backgrounds/particles/ParticleRenderer.ts) renders a GPU-accelerated particle field with cursor, click, and scroll interaction. |
| Living Mesh | [`app/components/backgrounds/mesh/MeshRenderer.ts`](app/components/backgrounds/mesh/MeshRenderer.ts) renders an animated, pointer-reactive Canvas2D mesh. |
| cooling loop diagram | [`app/components/personal/cooling/CoolingLoopPanel.vue`](app/components/personal/cooling/CoolingLoopPanel.vue) composes typed SVG components with procedural animation to visualize a custom liquid cooling system. |

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
| Vitest | Fast unit coverage for domain policy, schema migration, runtime bounds, and performance adaptation. |
| Playwright | Browser-level coverage for navigation, persistence, responsive behavior, motion, and accessibility. |
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
