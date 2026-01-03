<script setup lang="ts">

  const shareOnX = () => {
  const message = "Только что сэкономил 20 минут на локализации с помощью i18nAI! 🚀";
  const url = "https://i18n-ai.com"; // Твой будущий домен
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
  
  window.open(twitterUrl, '_blank');
};

  onMounted(() => {
  // Проверяем, не добавлен ли скрипт уже
  if (!window.kofiWidgetOverlayConfig) {
    const script = document.createElement('script');
    script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
    script.async = true;
    script.onload = () => {
      kofiWidgetOverlay.draw('timures', {
        'type': 'floating-chat',
        'floating-chat.donateButton.text': 'Support me',
        'floating-chat.donateButton.background-color': '#00b9fe',
        'floating-chat.donateButton.text-color': '#fff'
      });
    };
    document.body.appendChild(script);
  }
});
</script>

<template>
   <footer class="pb-10">
    <UContainer>
      <div class="flex flex-col md:flex-row justify-between my-5">

      
      <div class="flex flex-col md:flex-row gap-4 items-center">
          <p class="text-muted text-sm">
          Copyright © {{ new Date().getFullYear() }} - {{ $t("support.madeWith") }}
        </p>
        <UButton
            icon="i-simple-icons-x"
            variant="ghost"
            color="neutral"
            size="sm"
            class="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            @click="shareOnX"
          >
            <span class="hidden sm:inline text-xs font-semibold">{{ $t("marketing.shareX") }}</span>
          </UButton>
        </div>
  
    <div class="flex flex-col md:flex-row gap-4">
      <UButton
      to="https://boosty.to/твой_никнейм"
      target="_blank"
      color="neutral"
      variant="soft"
      icon="i-lucide-rocket"
      :label="$t('support.boosty')"
    />
    
    <UButton
      to="https://ko-fi.com/timures"
      target="_blank"
      color="neutral"
      variant="ghost"
      icon="i-lucide-coffee"
      :label="$t('support.kofi')"
    />

    
    </div>
    </div>
    </UContainer>
</footer>
</template>