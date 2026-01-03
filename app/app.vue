<script setup>


useHead({
  script: [
    {
      src: 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js',
      defer: true,
      onload: () => {
        // Инициализация виджета после загрузки скрипта
        // @ts-ignore
        kofiWidgetOverlay.draw('твой_никнейм', {
          'type': 'widget',
          'fixed': 'true',
          'bottom-offset': '20px',
          'left-offset': '20px',
          'generic-button-color': '#00dc82', // Цвет кнопки (Nuxt Green)
          'font-color': '#fff'
        });
      }
    }
  ]
})

useSeoMeta({
  title: 'i18n AI Generator | Smart JSON Localization',
  ogTitle: 'i18n AI Generator',
  description: 'Convert raw text to structured i18n JSON with AI. Semantic keys, professional translation, multi-language support.',
  ogDescription: 'Automate your localization workflow with AI.',
  ogImage: '/og-image.png', // Сделай скриншот сайта и положи в public
  twitterCard: 'summary_large_image',
})


</script>

<template>
  <UApp>
    <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 font-sans py-10">
      <Header />

      <UContainer>

        <Editor />

        <About />

        <Guide />

      </UContainer>

      <Footer />
    </div>
  </UApp>
</template>

