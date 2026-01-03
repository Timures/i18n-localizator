<script setup lang="ts">
const guideCards = [
  {
    title: 'Smart Detection',
    icon: 'i-lucide-search-code',
    description: 'Автоматически определяет язык ввода (RU, KZ, DE и др.) и подготавливает структуру для английской локализации.'
  },
  {
    title: 'Professional Keys',
    icon: 'i-lucide-key-round',
    description: 'Генерирует осмысленные ключи на английском языке, которые легко использовать в коде вместо случайных ID.'
  },
  {
    title: 'Ready for Dev',
    icon: 'i-lucide-file-json-2',
    description: 'Выходные данные полностью соответствуют формату i18n. Просто скачайте ZIP и перенесите файлы в проект.'
  }
]
</script>

<template>
<div class="my-10 text-center">
          
          <p class="text-neutral-500 text-lg max-w-none md:max-w-3/4 text-center mx-auto">An intelligent tool for developers that automates the routine process of creating localization files. The application takes raw text in any language and transforms it into structured JSON files with semantically correct keys in English.</p>
        </div>

        <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
  <UCard v-for="(card, index) in guideCards" :key="index" class="shadow-sm border-none bg-white/50 dark:bg-white/5">
    <template #header>
      <div class="flex items-center gap-2 font-bold text-neutral-700 dark:text-neutral-200">
        <UIcon :name="card.icon" class="w-5 h-5 text-primary" />
        {{ card.title }}
      </div>
    </template>
    <p class="text-sm text-neutral-500 leading-relaxed">
      {{ card.description }}
    </p>
  </UCard>
</div>
</template>

