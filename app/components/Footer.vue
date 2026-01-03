<script setup lang="ts">

</script>

<template>
    <footer class="mt-12 pb-10 flex flex-col items-center gap-4">
  <div class="flex items-center gap-4">
    <UButton
      to="https://boosty.to/твой_никнейм"
      target="_blank"
      color="orange"
      variant="soft"
      icon="i-lucide-rocket"
      label="Support on Boosty (RU/KZ cards)"
    />
    
    <UButton
      to="https://ko-fi.com/твой_никнейм"
      target="_blank"
      color="neutral"
      variant="ghost"
      icon="i-lucide-coffee"
      label="Support on Ko-fi"
    />
  </div>
  
  <p class="text-[10px] text-neutral-400 uppercase tracking-widest font-medium">
    Created with ❤️ for developers
  </p>
</footer>
</template>