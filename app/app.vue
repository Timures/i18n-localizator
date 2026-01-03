<script setup>
const { t } = useI18n()

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
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogTitle: t('meta.title'),
  ogDescription: t('meta.description'),
  ogImage: '/og-image.png', // Сделай скриншот сайта и положи в public
  twitterCard: 'summary_large_image',
})


</script>

<template>
  <UApp>
    <Header />

    <UMain>
    
      

      <UContainer>

        <Editor />

        <About />

        <Guide />

      </UContainer>

      
 
    </UMain>

     <USeparator icon="i-simple-icons-nuxtdotjs" type="dashed" class="h-px" />

   
    <Footer />
  </UApp>
</template>

