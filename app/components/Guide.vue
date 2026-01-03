<script setup lang="ts">

</script>

<template>
  <UContainer>
    <UCard class="mt-8 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-[#131926]">
      <div class="flex justify-center">
        <h3 class="flex items-center gap-2 mx-auto">
      <UIcon name="i-lucide-book-open" class="text-primary" />
      {{ $t("tutorial.title") }}
    </h3>
      </div>
  <div class="prose prose-sm dark:prose-invert max-w-none">
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
      <ul class="space-y-2 list-none p-0">
        <li class="flex justify-start gap-2">
          <span class="font-bold text-primary">01.</span>
          <span>{{ $t("tutorial.step1") }}</span>
        </li>
        <li class="flex justify-start gap-2">
          <span class="font-bold text-primary">02.</span>
          <span>{{ $t("tutorial.step2") }}</span>
        </li>
        <li class="flex justify-start gap-2">
          <span class="font-bold text-primary">03.</span>
         <span>{{ $t("tutorial.step3") }}</span>
        </li>
      </ul>
      <ul class="space-y-2 list-none p-0">
        
        <li class="flex justify-start gap-2">
          <span class="font-bold text-primary">04.</span>
          <span>{{ $t("tutorial.step4") }}</span>
        </li>
        <li class="flex justify-start gap-2">
          <span class="font-bold text-primary">05.</span>
          <span>{{ $t("tutorial.step5") }}</span>
        </li>
      </ul>
    </div>
  </div>
</UCard>
</UContainer>
</template>