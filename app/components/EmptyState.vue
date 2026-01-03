<template>
  <div class="h-4/5 min-h-80 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-white/[0.02]">
    
    <div class="relative mb-6">
      <div class="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full"></div>
      <div class="relative w-16 h-16 bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center justify-center">
        <UIcon name="i-lucide-code-2" class="w-8 h-8 text-primary-500" />
      </div>
    </div>

    <h3 class="text-lg font-bold text-neutral-900 dark:text-white mb-2">
      {{ $t('resultEmptyState.placeholderTitle', 'Ready to generate') }}
    </h3>
    <p class="text-sm text-neutral-500 max-w-[240px] leading-relaxed">
      {{ $t('resultEmptyState.placeholderDesc', 'Paste your text on the left and see the magic happen here.') }}
    </p>

    <div class="mt-8 flex gap-2 opacity-50 grayscale">
      <UBadge variant="soft" color="neutral">en.json</UBadge>
      <UBadge variant="soft" color="neutral">ru.json</UBadge>
      <UBadge variant="soft" color="neutral">de.json</UBadge>
    </div>
  </div>
</template>