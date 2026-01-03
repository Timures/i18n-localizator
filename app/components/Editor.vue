<script setup lang="ts">
    import JSZip from 'jszip'
// Состояние
const inputText = ref('')
const results = ref(null) 
const isLoading = ref(false)
const keyStyle = ref('camelCase')
const isNested = ref(true)
const activeTab = ref('original') 
const sourceLanguageName = ref('Source')

// Константы
const MAX_KEYS_SUGGESTION = 30
const options = [
  { label: 'camelCase', value: 'camelCase' },
  { label: 'snake_case', value: 'snake_case' },
  { label: 'dot.notation', value: 'dot.notation' }
]


// Вычисляемые свойства
const estimatedKeys = computed(() => {
  if (!inputText.value) return 0
  return inputText.value.split('\n').filter(line => line.trim().length > 0).length
})

const isOverLimit = computed(() => estimatedKeys.value > MAX_KEYS_SUGGESTION)

const showWarning = computed(() => {
  return !isNested.value && inputText.value.includes(':')
})

const toast = useToast()
const { t } = useI18n()
// Функции
async function generateI18n() {
  if (!inputText.value || isOverLimit.value) return
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
    
    results.value = {
      original: data.original,
      en: data.en
    }
    sourceLanguageName.value = data.sourceLang
    activeTab.value = 'original'
    toast.add({ title: t('toasts.success'), description: t('toasts.genSuccess'), color: 'success' })
  } catch (err) {
    toast.add({ title: t('toasts.error'), description: err.statusMessage || t('toasts.genError'), color: 'error' })
  } finally {
    isLoading.value = false
  }
}

function clearInput() {
  inputText.value = ''
  results.value = null
  sourceLanguageName.value = 'Source'
}

function copyToClipboard() {
  if (!results.value) return
  const isOriginal = activeTab.value === 'original'
  const data = isOriginal ? results.value.original : results.value.en
  
  navigator.clipboard.writeText(JSON.stringify(data, null, 2))
  toast.add({ title: t('toasts.copied'), description: `${t('toasts.copiedDesc', { lang:isOriginal ? sourceLanguageName.value : 'English'})}`, color: 'info' })
}

async function downloadZip() {
  if (!results.value) return
  const zip = new JSZip()
  zip.file(`${sourceLanguageName.value.toLowerCase()}.json`, JSON.stringify(results.value.original, null, 2))
  zip.file("en.json", JSON.stringify(results.value.en, null, 2))

  const content = await zip.generateAsync({ type: "blob" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(content)
  link.download = "locales.zip"
  link.click()
  toast.add({ title: 'ZIP Created', description: 'Download started', color: 'success' })
}
</script>

<template>
<div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 font-sans py-10">
        

        <UCard class="mb-8 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800">
          <div class="flex flex-wrap items-center gap-6">
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold text-neutral-600 dark:text-neutral-400">{{ $t("toolbar.keyStyle") }}:</span>
              <USelect v-model="keyStyle" :items="options" class="w-44" />
            </div>
            <UCheckbox v-model="isNested" :label="$t('toolbar.nested')" />
            <UButton 
              :loading="isLoading" 
              :label="$t('toolbar.generate')"
              icon="i-lucide-sparkles" 
              size="lg"
              class="ml-auto"
              @click="generateI18n"
              :disabled="!inputText || isLoading || isOverLimit"
            />
          </div>
        </UCard>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center px-1 min-h-6">
              <div class="flex gap-4 items-center">
                <label class="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  {{ $t("editor.sourceLabel") }} ({{ sourceLanguageName }})
                </label>
                <span :class="['text-[10px] font-bold transition-colors', isOverLimit ? 'text-red-500' : 'text-neutral-400']">
                {{ $t('editor.keysCount', { n: estimatedKeys, max: MAX_KEYS_SUGGESTION }) }}
              </span>
              </div>
              <UButton v-if="inputText" variant="ghost" color="error" icon="i-lucide-trash-2" :label="$t('editor.clear')" size="xs" @click="clearInput" />
            </div>

            <UAlert
  v-if="isOverLimit"
  icon="i-lucide-alert-triangle"
  color="error"
  variant="subtle"
  :title="$t('toasts.error')"
  :description="$t('editor.tooMuchData')"
  class="mb-2"
/>

            <UAlert v-if="showWarning" icon="i-lucide-info" color="warning" variant="subtle" title="Tip" description="$t('editor.tip')" class="mb-1" />

            <div class="h-125 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-950 shadow-sm flex flex-col focus-within:ring-2 focus-within:ring-primary-500 transition-all">
              <UTextarea
                v-model="inputText"
                :placeholder="$t('editor.placeholder')"
                class="flex-1 items-start"
                :rows="25"
                variant="none"
                control-class="h-full overflow-y-auto resize-none p-4 font-sans text-sm focus:ring-0"
              />
            </div>
            <p class="px-1 text-[10px] text-neutral-400 italic">{{$t("editor.limitNote")}}</p>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center px-1 min-h-6">
              <label class="text-xs font-bold text-neutral-400 uppercase tracking-widest">{{ $t("result.label") }}</label>
              <UButton v-if="results" variant="ghost" color="neutral" icon="i-lucide-copy" :label="$t('result.copy')" size="xs" @click="copyToClipboard" />
            </div>
            
            <div class="relative h-125 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden shadow-sm flex flex-col">
              <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-neutral-950/80 z-20 backdrop-blur-[1px]">
                <UIcon name="i-lucide-loader-2" class="w-10 h-10 animate-spin text-primary" />
              </div>

              <div v-if="results" class="flex flex-col h-full p-4 gap-4">
                <div class="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg shrink-0">
                  <button @click="activeTab = 'original'" :class="[activeTab === 'original' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary' : 'text-neutral-500', 'flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-2']">
                    <UIcon name="i-lucide-languages" /> {{ sourceLanguageName }}
                  </button>
                  <button @click="activeTab = 'en'" :class="[activeTab === 'en' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary' : 'text-neutral-500', 'flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-2']">
                    <UIcon name="i-lucide-globe" /> English
                  </button>
                </div>

                <div class="flex-1 overflow-hidden rounded-lg bg-neutral-900 border border-neutral-800">
                  <div class="h-full overflow-y-auto p-4 font-mono text-[11px] leading-relaxed">
                    <pre v-if="activeTab === 'original'" class="text-green-400 whitespace-pre-wrap">{{ JSON.stringify(results.original, null, 2) }}</pre>
                    <pre v-if="activeTab === 'en'" class="text-blue-400 whitespace-pre-wrap">{{ JSON.stringify(results.en, null, 2) }}</pre>
                  </div>
                </div>

                <div class="shrink-0 pt-2 flex justify-between items-center border-t border-neutral-100 dark:border-neutral-800">
                  <UButton :label="$t('result.download')" color="neutral" variant="ghost" icon="i-lucide-archive" size="sm" @click="downloadZip" />
                  <span class="text-[10px] text-neutral-400 uppercase font-bold tracking-tighter tracking-widest">{{ $t("result.ready") }}</span>
                </div>
              </div>

              <div v-else-if="!isLoading" class="flex flex-col items-center justify-center h-full text-neutral-400 italic gap-2 opacity-40">
                <UIcon name="i-lucide-file-json-2" class="w-12 h-12" />
                <p>{{ $t("result.placeholder") }}</p>
              </div>
            </div>
            <p class="px-1 text-[10px] text-neutral-400 italic text-right">{{ $t("result.footerNote") }}</p>
          </div>
        </div>
<div class="my-10 text-center">
          
          <p class="text-neutral-500 text-lg max-w-none md:max-w-3/4 text-center mx-auto">{{ $t("guide.title") }}</p>
        </div>
        </div>
</template>

<style scoped>
pre {
  tab-size: 2;
}
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 10px;
}
</style>