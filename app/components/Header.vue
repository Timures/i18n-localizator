<template>
  <header class="py-4 bg-slate-50/80 dark:bg-[#0B0F1A]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
    <UContainer>
      <div class="flex justify-between items-center">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:rotate-6 transition-transform">
            <UIcon name="i-lucide-languages" class="w-5 h-5 text-white" />
          </div>
          
          <div class="hidden sm:flex flex-col leading-none">
            <span class="text-xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase">
              i18n<span class="text-primary-500">AI</span>
            </span>
            <span class="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider mt-0.5">
              {{ $t("header.subtitle") }}
            </span>
          </div>
        </NuxtLink>
    
        <div class="flex items-center gap-1 sm:gap-2">
          <LangSwitcher />
          
          <div class="w-px h-4 bg-neutral-200 dark:bg-neutral-800 mx-1"></div>
          
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
      </div>
    </UContainer>
  </header>
</template>