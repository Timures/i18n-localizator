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

// 1. Определяем, является ли ввод JSON-ом
const isJsonInput = computed(() => {
  const trimmed = inputText.value.trim()
  // Если текст начинается с { или [, скорее всего, это JSON
  return trimmed.startsWith('{') || trimmed.startsWith('[')
})

// 2. Валидация JSON (только если мы определили, что это JSON)
const isValidJson = computed(() => {
  if (!isJsonInput.value) return true // Обычный текст всегда "валиден"
  try {
    JSON.parse(inputText.value)
    return true
  } catch (e) {
    return false
  }
})
// composable
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
  } catch (error:any) {
    // Проверяем, не исчерпан ли лимит (код 429 или 503)
    if (error.status === 429 || error.status === 503) {
      toast.add({
        title: t('toasts.error'),
        description: t('toasts.limitError'), // Наш новый текст
        icon: 'i-lucide-clock',
        color: 'warning', // Оранжевый цвет намекает на временную проблему
        timeout: 10000 // Даем пользователю больше времени прочитать (10 сек)
      })
    } else {
      // Обычная ошибка (сеть, сервер и т.д.)
      toast.add({
        title: t('toasts.error'),
        description: t('toasts.genError'),
        color: 'error'
      })
    }
  } finally {
    isLoading.value = false
  }
}

function clearInput() {
  inputText.value = ''
  results.value = null
  sourceLanguageName.value = 'Source'
  localStorage.removeItem('i18n_draft')
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
// Метод для "красивого" форматирования (Beautify)
const beautifyJson = () => {
  try {
    const obj = JSON.parse(inputText.value)
    inputText.value = JSON.stringify(obj, null, 2)
    
    // Опционально: уведомление об успехе
    toast.add({
      title: 'Formatted!',
      icon: 'i-lucide-check',
      color: 'success',
      timeout: 2000
    })
  } catch (e) {
    toast.add({
      title: 'Invalid JSON',
      description: 'Cannot format: structure is broken',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  }
}
// 1. При загрузке компонента восстанавливаем данные
onMounted(() => {
  const savedDraft = localStorage.getItem('i18n_draft')
  if (savedDraft) {
    inputText.value = savedDraft
  }
})

// 2. Следим за изменениями и сохраняем (с небольшой задержкой/debounce)
watch(inputText, (newValue) => {
  localStorage.setItem('i18n_draft', newValue)
})
</script>

<template>
  <div class="min-h-screen bg-transparent font-sans py-10">
    
    <div class="fixed top-[var(--header-height)] left-0 right-0 z-50 h-0.5">
      <UProgress v-if="isLoading" animation="carousel" size="xs" color="primary" />
    </div>

    <UCard 
      class="mb-8 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-[#131926]"
      :ui="{ body: { padding: 'px-4 py-3 sm:p-4' } }"
    >
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex items-center gap-3">
          <span class="text-sm font-semibold text-slate-600 dark:text-slate-400">
            {{ $t("toolbar.keyStyle") }}:
          </span>
          <USelect v-model="keyStyle" :items="options" class="w-44" />
        </div>
        <UCheckbox v-model="isNested" :label="$t('toolbar.nested')" />
        
        <UButton 
          :loading="isLoading" 
          :label="$t('toolbar.generate')"
          icon="i-lucide-sparkles" 
          size="lg"
          class="ml-auto shadow-lg shadow-primary-500/20"
          @click="generateI18n"
          :disabled="!inputText || isLoading || isOverLimit"
        />
      </div>
    </UCard>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      
      <div class="flex flex-col gap-3">
        <div class="flex justify-between items-center px-1 min-h-6">
          <div class="flex gap-4 items-center">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {{ $t("editor.sourceLabel") }} ({{ sourceLanguageName }})
            </label>
            <div class="flex gap-2 items-center">
              <span v-if="inputText" class="text-[10px] text-slate-400 italic animate-pulse">
                Draft saved
              </span>
              <span :class="['text-[10px] font-bold', isOverLimit ? 'text-error-500' : 'text-slate-400']">
                {{ $t('editor.keysCount', { n: estimatedKeys, max: MAX_KEYS_SUGGESTION }) }}
              </span>
            </div>
          </div>
          <UButton 
            v-if="inputText" 
            variant="ghost" 
            color="error" 
            icon="i-lucide-trash-2" 
            size="xs" 
            @click="clearInput" 
          />
        </div>

        <UAlert v-if="isOverLimit" icon="i-lucide-alert-triangle" color="error" variant="subtle" :title="$t('toasts.error')" :description="$t('editor.tooMuchData')" class="mb-2" />
        <UAlert v-if="showWarning" icon="i-lucide-info" color="warning" variant="subtle" title="Tip" :description="$t('editor.tip')" class="mb-1" />

        <div class="h-125 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#131926] shadow-sm focus-within:ring-2 focus-within:ring-primary-500/50 transition-all">
          <UTextarea
            v-model="inputText"
            :rows="24"
            font-mono
            variant="none"
            autoresize
            class="w-full h-full"
            :placeholder="$t('editor.placeholder')"
          />
        </div>

        <div class="flex justify-between items-center px-1">
          <p class="text-[10px] text-slate-400 italic">{{$t("editor.limitNote")}}</p>
          <div class="flex items-center gap-2">
            <Transition name="fade" mode="out-in">
              <UBadge
                v-if="inputText.trim() && isJsonInput"
                :key="isValidJson ? 'valid' : 'invalid'"
                :color="isValidJson ? 'success' : 'error'"
                variant="subtle"
                size="xs"
                class="font-bold uppercase"
              >
                <UIcon :name="isValidJson ? 'i-lucide-check-circle' : 'i-lucide-x-circle'" class="mr-1" />
                {{ isValidJson ? 'JSON Valid' : 'JSON Invalid' }}
              </UBadge>
            </Transition>
            <UButton
              v-if="inputText.trim() && isJsonInput && isValidJson"
              icon="i-lucide-wand-2"
              label="Beautify"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="beautifyJson"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <div class="flex justify-between items-center px-1 min-h-6">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ $t("result.label") }}</label>
          <UButton v-if="results" variant="ghost" color="neutral" icon="i-lucide-copy" :label="$t('result.copy')" size="xs" @click="copyToClipboard" />
        </div>
        
        <div class="relative h-125 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131926] overflow-hidden shadow-sm flex flex-col">
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            mode="out-in"
          >
            <div v-if="isLoading" key="loading" class="absolute inset-0 p-6 flex flex-col gap-4 bg-white/80 dark:bg-[#0B0F1A]/80 z-20 backdrop-blur-[2px]">
              <USkeleton class="h-4 w-[15%]" />
              <div class="space-y-4 ml-6 flex-1">
                <div v-for="i in 6" :key="i" class="flex gap-4">
                  <USkeleton class="h-3 w-[35%]" /> <USkeleton class="h-3 w-[45%]" />
                </div>
              </div>
              <USkeleton class="h-4 w-[10%]" />
            </div>

            <div v-else-if="results" key="results" class="flex flex-col h-full p-4 gap-4">
              <div class="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg shrink-0">
                <button @click="activeTab = 'original'" :class="[activeTab === 'original' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-500' : 'text-slate-500', 'flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2']">
                  <UIcon name="i-lucide-languages" /> {{ sourceLanguageName }}
                </button>
                <button @click="activeTab = 'en'" :class="[activeTab === 'en' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-500' : 'text-slate-500', 'flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2']">
                  <UIcon name="i-lucide-globe" /> English
                </button>
              </div>

              <div class="flex-1 overflow-hidden rounded-lg bg-[#0B0F1A] border border-slate-800 shadow-inner">
                <div class="h-full overflow-y-auto p-4 font-mono text-[11px] leading-relaxed">
                  <pre v-if="activeTab === 'original'" class="text-emerald-400 whitespace-pre-wrap">{{ JSON.stringify(results.original, null, 2) }}</pre>
                  <pre v-if="activeTab === 'en'" class="text-sky-400 whitespace-pre-wrap">{{ JSON.stringify(results.en, null, 2) }}</pre>
                </div>
              </div>

              <div class="shrink-0 pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                <UButton :label="$t('result.download')" color="neutral" variant="ghost" icon="i-lucide-archive" size="sm" @click="downloadZip" />
                <span class="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{{ $t("result.ready") }}</span>
              </div>
            </div>

            <div v-else key="empty" class="h-full">
              <EmptyState />
            </div>
          </Transition>   
        </div>
        <p class="px-1 text-[10px] text-slate-400 italic text-right">{{ $t("result.footerNote") }}</p>
      </div>
    </div>
    
    <div class="my-16 text-center">
      <p class="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
        {{ $t("guide.title") }}
      </p>
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