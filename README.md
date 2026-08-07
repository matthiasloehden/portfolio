# Matthias Löhden — Portfolio

[![Test and deploy](https://github.com/matthiasloehden/portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/matthiasloehden/portfolio/actions/workflows/deploy.yml)

Personal portfolio for Matthias Löhden, built as a lean, static Nuxt site.

Live site: [matthiasloehden.github.io/portfolio](https://matthiasloehden.github.io/portfolio/)

## Stack

- Nuxt 4 and Vue 3
- TypeScript
- Tailwind CSS 4
- Static generation for GitHub Pages

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

The static production site is written to `.output/public`.

## GitHub Pages

For a project site hosted at `https://username.github.io/repository/`, generate with the repository path:

```bash
NUXT_APP_BASE_URL=/repository/ yarn generate
```

Use `/` for a user or organization site hosted at the domain root.

Every push to `main` runs type checking, linting, formatting checks, static generation, and the Playwright browser suite.
GitHub Pages is deployed only after all checks pass. Pull requests run the same validation without deploying.

## Content

The résumé PDF is private source material and intentionally excluded from Git. Personal address, phone number, and birth
date are not exposed by the website.
