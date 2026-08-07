import tailwindcss from '@tailwindcss/vite';

const baseURL = process.env.NUXT_APP_BASE_URL || '/';

export default defineNuxtConfig({
  ssr: true,

  devtools: {
    enabled: false,
  },

  app: {
    baseURL,
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Matthias Löhden — Full-Stack Developer',
      meta: [
        {
          name: 'description',
          content: 'Portfolio of Matthias Löhden, a full-stack developer building fast, thoughtful web experiences.',
        },
        { name: 'color-scheme', content: 'dark light' },
        { name: 'theme-color', content: '#090b10', media: '(prefers-color-scheme: dark)' },
        { name: 'theme-color', content: '#f4f5f7', media: '(prefers-color-scheme: light)' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` }],
    },
  },

  css: ['@/assets/style/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  nitro: {
    preset: 'static',
  },

  compatibilityDate: '2024-12-05',
});
