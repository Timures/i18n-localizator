// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    groqApiKey: process.env.GROQ_API_KEY
  },
  // Подключаем модуль
  modules: ['@nuxt/ui', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  // 2. ЛОКАЛИЗАЦИЯ: Исправляем пути
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'ru', name: 'Русский', file: 'ru.json' }
    ],
    langDir: 'locales/',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: 'en'
    }
  },

  // 3. UI & ЦВЕТА
  ui: {
    icons: ['lucide', 'simple-icons'] // Явно указываем коллекции для оптимизации
  },

  // 4. SEO & HEAD (Очень важно для домена)
  app: {
    head: {
      charset: 'utf-16',
      viewport: 'width=device-width, initial-scale=1',
      title: 'i18n AI - Professional Localization Generator',
      meta: [
        { name: 'description', content: 'Convert text to i18n JSON structure with AI power.' }
      ],
    }
  },
  // Включаем совместимость с Nuxt 4
  future: {
    compatibilityVersion: 4,
  },
  // Указываем дату для стабильности функций
  compatibilityDate: '2024-11-01',

  // Это заставит Nuxt пересобрать стили
  devtools: { enabled: true }
})