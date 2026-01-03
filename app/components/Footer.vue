<script setup lang="ts">
</script>

<template>
   <UFooter>
   <template #left>
        <p class="text-muted text-sm">
          Copyright © {{ new Date().getFullYear() }} - {{ $t("support.madeWith") }}
        </p>
      </template>
   <template #right>
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
 </template>
  
  
</UFooter>
</template>