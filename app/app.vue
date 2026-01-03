<script setup>
const inputText = ref('')
const resultJson = ref(null)
const isLoading = ref(false)

const keyStyle = ref('camelCase')
const isNested = ref(true)

const options = [
  { label: 'camelCase', value: 'camelCase' },
  { label: 'snake_case', value: 'snake_case' },
  { label: 'dot.notation', value: 'dot.notation' }
]

// В Nuxt UI v3 используем новый хук для уведомлений
const toast = useToast()

async function generateI18n() {
  if (!inputText.value) return

  isLoading.value = true
  resultJson.value = null

  try {
    const data = await $fetch('/api/generate', {
      method: 'POST',
      body: {
        text: inputText.value,
        keyStyle: keyStyle.value,
        isNested: isNested.value
      }
    })
    resultJson.value = data
    toast.add({ title: 'Success!', description: 'JSON generated', color: 'success' })
  } catch (err) {
    toast.add({ title: 'Error', description: 'Failed to generate', color: 'error' })
  } finally {
    isLoading.value = false
  }
}

function copyToClipboard() {
  if (!resultJson.value) return
  navigator.clipboard.writeText(JSON.stringify(resultJson.value, null, 2))
  toast.add({ title: 'Copied to clipboard', color: 'info' })
}
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6">
      <UContainer>
        <header class="mb-10 text-center">
          <h1 class="text-4xl font-extrabold tracking-tight mb-2">i18n AI Generator</h1>
          <p class="text-neutral-500">Convert Russian text to structured English JSON</p>
        </header>

        <UCard class="mb-8">
          <div class="flex flex-wrap items-center gap-6">
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold">Style:</span>
              <USelect v-model="keyStyle" :items="options" class="w-40" />
            </div>
            
            <UCheckbox v-model="isNested" label="Nested Structure" />
            
            <UButton 
              :loading="isLoading" 
              label="Generate JSON"
              icon="i-lucide-sparkles" 
              @click="generateI18n"
              :disabled="!inputText"
            />
          </div>
        </UCard>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Source Text</label>
            <UTextarea
              v-model="inputText"
              placeholder="Введите текст здесь..."
              :rows="15"
              variant="outline"
              class="font-sans"
            />
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Result JSON</label>
              <UButton
                v-if="resultJson"
                variant="ghost"
                color="neutral"
                icon="i-lucide-copy"
                label="Copy"
                size="xs"
                @click="copyToClipboard"
              />
            </div>
            
            <div class="relative flex-1 min-h-[400px] rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden">
              <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-neutral-950/60 z-10">
                <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary" />
              </div>

              <pre v-if="resultJson" class="p-4 text-sm font-mono text-blue-600 dark:text-blue-400 overflow-auto max-h-[600px]">{{ JSON.stringify(resultJson, null, 2) }}</pre>
              
              <div v-else-if="!isLoading" class="flex items-center justify-center h-full text-neutral-400 italic">
                Ready for input...
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>
  </UApp>
</template>