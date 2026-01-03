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
  <div class="min-h-screen bg-slate-50 dark:bg-[#0B0F1A] transition-colors duration-500">
    <UApp>
      <Header />

      <UMain class="pb-10 bg-transparent">
        <UContainer>
          <Editor />
          <About />
          <Guide />
        </UContainer>
      </UMain>

<div class="py-12"> <USeparator 
    type="solid" 
    class="h-px"
    :ui="{ 
      border: { base: 'border-slate-300 dark:border-slate-800' } 
    }"
  >
    <template #default>
      <div class="p-1.5 rounded-full bg-white dark:bg-slate-800 ring-4 ring-slate-50 dark:ring-[#0B0F1A] shadow-sm border border-slate-200 dark:border-slate-700">
         <UIcon 
           name="i-simple-icons-tsnode" 
           class="w-4 h-4 text-primary-600 dark:text-primary-400 block" 
         />
      </div>
    </template>
  </USeparator>
</div>
      <Footer />
    </UApp>
  </div>
</template>

