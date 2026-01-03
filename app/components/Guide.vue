<script setup lang="ts">

</script>

<template>
  <UContainer>
    <UCard class="mt-8 shadow-sm">
      <div class="flex justify-center">
        <h3 class="flex items-center gap-2 mx-auto">
      <UIcon name="i-lucide-book-open" class="text-primary" />
      Как пользоваться инструментом?
    </h3>
      </div>
  <div class="prose prose-sm dark:prose-invert max-w-none">
    
    <div class="flex flex-col gap-8 mt-4">
      <ul class="space-y-2 list-none p-0">
        <li class="flex justify-start gap-2">
          <span class="font-bold text-primary">01.</span>
          <span>Вставьте текст (до 30 строк) в левое поле. ИИ сам определит язык оригинала.</span>
        </li>
        <li class="flex justify-start gap-2">
          <span class="font-bold text-primary">02.</span>
          <span class="">Выберите <b>Key Style</b>: например, <i>camelCase</i> для JS/TS или <i>snake_case</i> для Python/Ruby.</span>
        </li>
      </ul>
      <ul class="space-y-2 list-none p-0">
        <li class="flex justify-start gap-2">
          <span class="font-bold text-primary">03.</span>
          <span>Используйте <b>Nested Structure</b>, если хотите сгруппировать ключи по смысловым блокам через точку.</span>
        </li>
        <li class="flex justify-start gap-2">
          <span class="font-bold text-primary">04.</span>
          <span>Скопируйте результат или скачайте готовый <b>ZIP-архив</b> с двумя JSON файлами.</span>
        </li>
      </ul>
    </div>
  </div>
</UCard>
</UContainer>
</template>