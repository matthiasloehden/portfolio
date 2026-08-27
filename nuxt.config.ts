import tailwindcss from '@tailwindcss/vite';

const baseURL = process.env.NUXT_APP_BASE_URL || '/';
const googleFontFamilies = [
  'Archivo+Narrow:wght@400..700',
  'Cinzel:wght@400..900',
  'IBM+Plex+Sans:wght@100;200;300;400;500;600;700',
  'JetBrains+Mono:wght@100..800',
  'Lora:wght@400..700',
  'Merriweather:wght@300;400;700;900',
  'Nunito+Sans:wght@200..1000',
  'Oswald:wght@200..700',
  'Playfair+Display:wght@400..900',
  'Roboto:wght@100..900',
  'Roboto+Condensed:wght@300..900',
  'Source+Sans+3:wght@200..900',
  'Space+Grotesk:wght@300..700',
];
const googleFontsStylesheet = `https://fonts.googleapis.com/css2?${googleFontFamilies
  .map((family) => `family=${family}`)
  .join('&')}&display=swap`;

export default defineNuxtConfig({
  ssr: true,

  devtools: {
    enabled: false,
  },

  app: {
    baseURL,
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Matthias Löhden | Software Engineer',
      meta: [
        {
          name: 'description',
          content:
            'Portfolio of Matthias Löhden, a software engineer building fast, reliable, and maintainable applications and systems.',
        },
        { name: 'color-scheme', content: 'dark light' },
        { name: 'theme-color', content: '#030509', media: '(prefers-color-scheme: dark)' },
        { name: 'theme-color', content: '#f3f7fc', media: '(prefers-color-scheme: light)' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: googleFontsStylesheet,
        },
      ],
    },
  },

  css: ['@/assets/style/main.css'],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      // These imports live behind client-only background components, so Vite
      // does not reliably discover them before the first browser request.
      // Pre-bundling them prevents a cold E2E run from invalidating modules
      // while the initial Playwright workers are hydrating the app.
      include: ['three', 'three/addons/misc/GPUComputationRenderer.js'],
    },
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
  },

  nitro: {
    preset: 'static',
  },

  compatibilityDate: '2024-12-05',
});
