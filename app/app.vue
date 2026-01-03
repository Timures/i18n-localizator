<script setup>
const { t } = useI18n()

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

     <USeparator icon="i-simple-icons-tsnode" type="dashed" class="h-px" />

   
    <Footer />
  </UApp>
</template>

