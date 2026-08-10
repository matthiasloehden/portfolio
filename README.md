# Matthias Löhden — Portfolio

[![CI](https://github.com/matthiasloehden/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/matthiasloehden/portfolio/actions/workflows/ci.yml)
[![Deploy](https://github.com/matthiasloehden/portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/matthiasloehden/portfolio/actions/workflows/deploy.yml)

Personal portfolio for Matthias Löhden, built as a polished static Nuxt site and as a reviewable code sample.

Live site: [matthiasloehden.github.io/portfolio](https://matthiasloehden.github.io/portfolio/)

## Code Highlights

| Area | What to inspect |
| --- | --- |
| background orchestration | [`app/layouts/default.vue`](app/layouts/default.vue) selects the ambient scene per route, while [`app/composables/usePortfolioPreferences.ts`](app/composables/usePortfolioPreferences.ts) handles theme and motion preferences. |
| wave grid background | [`app/components/WaveGridBackground.vue`](app/components/WaveGridBackground.vue) renders a Three.js shader scene with pointer, touch, scroll, reduced-motion, and inactive-tab handling. |
| triangle background | [`app/components/TriangleBackground.vue`](app/components/TriangleBackground.vue) uses lightweight CSS geometry and pointer sampling instead of a heavy animation runtime. |
| particle background | [`app/components/ParticleBackground.vue`](app/components/ParticleBackground.vue) implements a responsive GPU-accelerated particle simulation that reacts to mouse movement and scrolling. |
| mesh background | [`app/components/PersonalTriangleMeshBackground.vue`](app/components/PersonalTriangleMeshBackground.vue) renders a viewport-synchronized 2D canvas mesh with procedural vertex animation and pointer-aware deformation. |
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
| `oxlint` | Static quality management for linting. |
| `oxfmt` | Static quality management for formatting. |
| Playwright | Dynamic quality management for browser behavior |
| GitHub Actions | CI/CD pipeline that automates type checking, linting, formatting validation, static generation, browser tests, and automatic deployment to GitHub Pages on successful builds. |

## My Open Source Contributions 
| Work | Status | Link |
| --- | --- | --- |
| Smart-home control for `magic_mapper` | Merged | [feature/add-tcp-command](https://github.com/andrewfraley/magic_mapper/commit/9f45787c178d706ead3e8574dae0f2775ac24d7b) |
| Game-server panel frontend feature | Implemented | ⛓️‍💥 |
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

## Deployment

Every push to `main` runs type checking, linting, formatting checks, static generation, and the Playwright browser suite.
GitHub Pages is automatically deployed only after all checks pass.
