# Matthias Löhden — Portfolio

Personal portfolio for Matthias Löhden, built as a lean, static Nuxt site.

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
```

The static production site is written to `.output/public`.

## GitHub Pages

For a project site hosted at `https://username.github.io/repository/`, generate with the repository path:

```bash
NUXT_APP_BASE_URL=/repository/ yarn generate
```

Use `/` for a user or organization site hosted at the domain root. The deployment workflow will be added when the repository is ready to publish.

## Content

The résumé PDF in the repository root is private source material for the portfolio. Personal address, phone number, and birth date are intentionally not exposed by the website.
