import tailwindcss from '@tailwindcss/vite';

const baseURL = process.env.NUXT_APP_BASE_URL || '/';

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
      title: 'Matthias Löhden — Software Engineer',
      meta: [
        {
          name: 'description',
          content: 'Portfolio of Matthias Löhden, a software engineer building fast, reliable, and maintainable applications and systems.',
        },
        { name: 'color-scheme', content: 'dark light' },
        { name: 'theme-color', content: '#030509', media: '(prefers-color-scheme: dark)' },
        { name: 'theme-color', content: '#f3f7fc', media: '(prefers-color-scheme: light)' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` }],
    },
  },

  css: ['@/assets/style/main.css'],

  vite: {
    plugins: [tailwindcss()],
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
