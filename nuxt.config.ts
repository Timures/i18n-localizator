// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    googleGenerativeAiApiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    groqApiKey: process.env.GROQ_API_KEY
  },
  // Подключаем модуль
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  // Включаем совместимость с Nuxt 4
  future: {
    compatibilityVersion: 4,
  },

  // Указываем дату для стабильности функций
  compatibilityDate: '2024-11-01',

  // Это заставит Nuxt пересобрать стили
  devtools: { enabled: true }
})
