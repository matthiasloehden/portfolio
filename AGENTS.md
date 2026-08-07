# Matthias Löhden Portfolio

## Product goal

Build a sleek, professional portfolio for Matthias Löhden that presents him as an experienced web developer. The finished site should make his skills, experience, and selected projects easy to understand while feeling polished, modern, and personal.

The résumé in the repository root is an initial content source. Matthias has additional skills and projects that will be added later; never invent missing project details, metrics, employers, dates, or technologies.

## Experience principles

- Minimal and editorial rather than template-like or crowded.
- Dark mode is a first-class experience. Respect the visitor's system preference and preserve a path for a manual theme control.
- Use subtle ambient background motion and purposeful micro-interactions. Prefer CSS transforms, opacity, and gradients over heavy canvas, WebGL, video, or animation libraries.
- Motion must never block reading and must honor `prefers-reduced-motion`.
- Responsive from small phones through large desktop screens.
- Accessible keyboard navigation, visible focus states, semantic HTML, sufficient contrast, and meaningful labels are required.
- Optimize for excellent Core Web Vitals: minimal JavaScript, no unnecessary dependencies, responsive media, and no layout shifts.

## Technical scope

- Nuxt 4, Vue 3, TypeScript, Tailwind CSS 4, and Vite.
- Frontend-only static site. Production output is generated with `yarn generate`.
- Deployment target is GitHub Pages, including repository subpath support via `NUXT_APP_BASE_URL`.
- Do not add server routes, middleware, runtime secrets, databases, authentication, or other backend-only features.
- Prefer static content and compile-time data. Add client-side state only when a real interaction requires it.
- Use yarn only. Do not introduce another package manager or lockfile.

## Content and privacy

- Public professional facts may be drawn from the résumé: name, profile summary, professional experience, education, and skills.
- Do not publish the résumé's street address, phone number, birth date, or other sensitive personal data unless Matthias explicitly asks for it.
- The résumé PDF is source material, not automatically a public download.
- Keep portfolio copy concise, specific, credible, and available in English first. A second language can be added later if requested.

## Code conventions

- Application code lives under `app/`; static public assets live under `public/`.
- Use Vue Composition API and `<script setup lang="ts">` when a script is needed.
- Keep TypeScript strict. Avoid `any`.
- Use Tailwind utilities for common layout and spacing. Keep global CSS for design tokens, base styles, and animations that are clearer in CSS.
- Do not use `@apply`.
- Prefer native browser and Vue capabilities over new packages. Every new dependency needs a concrete benefit.
- Components should be focused and reusable when repetition or interaction justifies extraction; avoid abstraction for its own sake.

## Commands

```bash
yarn install
yarn dev
yarn type-check
yarn lint
yarn format
yarn format:check
yarn check
yarn generate
yarn preview
```

Run `yarn check` and `yarn generate` before handing off material code changes.

## Boundaries

Do not modify or index generated or dependency directories: `.nuxt/`, `.output/`, `dist/`, `node_modules/`, or `.yarn/`.

Preserve user-authored content and unrelated changes. Ask before publishing personal contact information beyond what is already approved for the site.
