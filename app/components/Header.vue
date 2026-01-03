<template>
  <UHeader :links="[]">
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center shadow-md shrink-0 group-hover:rotate-6 transition-transform">
          <UIcon name="i-lucide-languages" class="w-5 h-5 text-white" />
        </div>
        
        <div class="hidden sm:flex flex-col leading-none">
          <span class="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            i18n<span class="text-primary-500">AI</span>
          </span>
          <span class="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
            {{ $t("header.subtitle") }}
          </span>
        </div>
      </NuxtLink>
    </template>

    <template #right>
      <div class="flex items-center gap-1 sm:gap-2">
        <LangSwitcher />
        <UColorModeButton />
        
        <UButton
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          to="https://github.com/your-username"
          target="_blank"
          class="hidden xs:flex"
        />
      </div>
    </template>

    <template #panel>
      <div />
    </template>
  </UHeader>
</template>

<style scoped>
/* Убираем кнопку бургер-меню, если Nuxt UI её рендерит автоматически */
:deep(button[aria-label="Open menu"]) {
  display: none !important;
}
</style>