<script setup>
  import JSZip from 'jszip';
  
const inputText = ref('')
const results = ref(null) 
const isLoading = ref(false)

const keyStyle = ref('camelCase')
const isNested = ref(true)
const activeTabIndex = ref(0) 
const sourceLanguageName = ref('Source')

const options = [
  { label: 'camelCase', value: 'camelCase' },
  { label: 'snake_case', value: 'snake_case' },
  { label: 'dot.notation', value: 'dot.notation' }
]

const activeTab = ref('original') // 'original' или 'en'

const showWarning = computed(() => {
  return !isNested.value && inputText.value.includes(':')
})

const toast = useToast()

async function generateI18n() {
  if (!inputText.value) return

  results.value = null
  isLoading.value = true

  try {
    const data = await $fetch('/api/generate', {
      method: 'POST',
      body: { 
        text: inputText.value, 
        keyStyle: keyStyle.value,
        isNested: isNested.value 
      }
    })
    
    // Сохраняем структуру в соответствии с ответом сервера
    results.value = {
      original: data.original,
      en: data.en
    }
    sourceLanguageName.value = data.sourceLang
    activeTab.value = 'original' 
    toast.add({ title: 'Success!', description: 'JSON generated', color: 'success' })
  } catch (err) {
    toast.add({ title: 'Error', description: 'Failed to generate', color: 'error' })
  } finally {
    isLoading.value = false
  }
}

function copyToClipboard() {
  if (!results.value) return
  
  // ИСПРАВЛЕНО: используем original вместо ru
  const isOriginal = activeTabIndex.value === 0
  const currentData = isOriginal ? results.value.original : results.value.en
  const langLabel = isOriginal ? sourceLanguageName.value : 'English'
  
  navigator.clipboard.writeText(JSON.stringify(currentData, null, 2))
  
  toast.add({ 
    title: 'Copied!', 
    description: `JSON (${langLabel}) copied to clipboard`, 
    color: 'info' 
  })
}

async function downloadZip() {
  if (!results.value) return;

  const zip = new JSZip();
  // Добавляем файлы в архив
  zip.file("original.json", JSON.stringify(results.value.original, null, 2));
  zip.file("en.json", JSON.stringify(results.value.en, null, 2));

  const content = await zip.generateAsync({ type: "blob" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = "locales.zip";
  link.click();
  
  toast.add({ title: 'Download started', icon: 'i-lucide-download', color: 'success' });
}
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6 font-sans">
      <UContainer>
        <header class="mb-10 text-center">
          <h1 class="text-4xl font-extrabold tracking-tight mb-2 text-neutral-900 dark:text-white">i18n AI Generator</h1>
          <p class="text-neutral-500 text-lg">Keys in English, Content kept Original</p>
        </header>

        <UCard class="mb-8 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800">
          <div class="flex flex-wrap items-center gap-6">
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Key Style:</span>
              <USelect v-model="keyStyle" :items="options" class="w-44" />
            </div>
            
            <UCheckbox v-model="isNested" label="Nested Structure" />
            
            <UButton 
              :loading="isLoading" 
              label="Generate JSON"
              icon="i-lucide-sparkles" 
              size="lg"
              class="ml-auto"
              @click="generateI18n"
              :disabled="!inputText || isLoading"
            />
          </div>
        </UCard>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center px-1">
              <label class="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                Source Text ({{ sourceLanguageName }})
              </label>
              <span class="text-[10px] text-neutral-400">{{ inputText.length }} chars</span>
            </div>
            
            <UAlert
              v-if="showWarning"
              icon="i-lucide-info"
              color="warning"
              variant="subtle"
              title="Optimization Tip"
              description="Your text has sections. Enable 'Nested Structure' for better grouping."
              class="mb-2"
            />
            
            <UTextarea
              v-model="inputText"
              placeholder="Paste your text here... (e.g., Login Button: Sign In)"
              :rows="18"
              autoresize
              class="shadow-inner"
            />
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center px-1">
              <label class="text-xs font-bold text-neutral-400 uppercase tracking-widest">Resulting Locales</label>
              <UButton
                v-if="results"
                variant="ghost"
                color="neutral"
                icon="i-lucide-copy"
                label="Copy Active"
                size="xs"
                @click="copyToClipboard"
              />
            </div>
            
            <div class="relative min-h-[480px] rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden shadow-sm flex flex-col">
            <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-neutral-950/80 z-20 backdrop-blur-[1px]">
  <UIcon name="i-lucide-loader-2" class="w-10 h-10 animate-spin text-primary" />
</div>

<div v-if="results" class="flex flex-col h-full p-4 gap-4">
  
  <div class="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
    <button 
      @click="activeTab = 'original'"
      :class="[
        'flex-1 flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium rounded-md transition-all',
        activeTab === 'original' 
          ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary' 
          : 'text-neutral-500 hover:text-neutral-700'
      ]"
    >
      <UIcon name="i-lucide-languages" />
      {{ sourceLanguageName }}
    </button>
    <button 
      @click="activeTab = 'en'"
      :class="[
        'flex-1 flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium rounded-md transition-all',
        activeTab === 'en' 
          ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary' 
          : 'text-neutral-500 hover:text-neutral-700'
      ]"
    >
      <UIcon name="i-lucide-globe" />
      English
    </button>
  </div>

  <div class="flex-1 min-h-0 relative">
    <div v-if="activeTab === 'original'" class="h-full rounded-lg bg-neutral-900 p-4 font-mono text-[11px] overflow-auto border border-neutral-800">
      <pre class="text-green-400">{{ JSON.stringify(results.original, null, 2) }}</pre>
    </div>
    
    <div v-if="activeTab === 'en'" class="h-full rounded-lg bg-neutral-900 p-4 font-mono text-[11px] overflow-auto border border-neutral-800">
      <pre class="text-blue-400">{{ JSON.stringify(results.en, null, 2) }}</pre>
    </div>
  </div>

  <div class="pt-4 flex justify-between items-center border-t border-neutral-100 dark:border-neutral-800">
    <UButton label="Download ZIP" color="neutral" variant="ghost" icon="i-lucide-archive" size="sm" @click="downloadZip" />
    <span class="text-[10px] text-neutral-400 uppercase tracking-tighter font-bold">Ready to export</span>
  </div>
</div>

<div v-else-if="!isLoading" class="flex flex-col items-center justify-center h-full text-neutral-400 italic gap-2">
  <UIcon name="i-lucide-file-json-2" class="w-12 h-12 opacity-10" />
  <p>Your JSON will appear here</p>
</div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>
  </UApp>
</template>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>