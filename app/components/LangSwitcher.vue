<script setup>
const { locale, locales, setLocale } = useI18n()
const currentLocale = computed({
  get: () => locale.value,
  set: (value) => setLocale(value)
})

const items = locales.value.map(l => ({
  label: l.name,
  value: l.code
}))
</script>

<template>
  <USelect 
    v-model="currentLocale" 
    :items="items" 
    icon="i-lucide-globe" 
    variant="ghost" 
    class="w-32" 
  />
</template>