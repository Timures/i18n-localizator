<script setup lang="ts">
const guideCards = [
  {
    title: 'guide.smart.title',
    icon: 'i-lucide-search-code',
    description: 'guide.smart.desc'
  },
  {
    title: 'guide.keys.title',
    icon: 'i-lucide-key-round',
    description: 'guide.keys.desc'
  },
  {
    title: 'guide.dev.title',
    icon: 'i-lucide-file-json-2',
    description: 'guide.dev.desc'
  }
]
</script>

<template>


        <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
  <UCard v-for="(card, index) in guideCards" :key="index" class="shadow-sm border-none bg-white/50 dark:bg-white/5">
    <template #header>
      <div class="flex items-center gap-2 font-bold text-neutral-700 dark:text-neutral-200">
        <UIcon :name="card.icon" class="w-5 h-5 text-primary" />
        {{ $t(card.title) }}
      </div>
    </template>
    <p class="text-sm text-neutral-500 leading-relaxed">
      {{ $t(card.description) }}
    </p>
  </UCard>
</div>
</template>

