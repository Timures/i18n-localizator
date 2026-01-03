<script setup lang="ts">
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
   <UFooter class="my-5">
   
    <template #left>
        <p class="text-muted text-sm">
          Copyright © {{ new Date().getFullYear() }} - {{ $t("support.madeWith") }}
        </p>
      </template>
   <template #right>
    <div class="flex flex-col md:flex-row gap-4">
      <UButton
      to="https://boosty.to/твой_никнейм"
      target="_blank"
      color="orange"
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
 </template>

  
  
</UFooter>
</template>