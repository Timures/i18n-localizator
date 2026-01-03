// 1. Промпт (без изменений, всё ок)
export function generateSmartPrompt(text: string, keyStyle: string, isNested: boolean) {
  const isJson = text.trim().startsWith('{') || text.trim().startsWith('[');

  if (isJson) {
    return `
      SYSTEM: You are a strict JSON-to-JSON translator.
      TASK: Translate string values from the provided JSON into English.
      
      INPUT_DATA:
      ${text}

      STRICT RULES:
      1. DO NOT touch the keys. Every key in the output MUST be identical to the key in the input.
      2. If the input is nested, use the full path for the "key" field (e.g., "marketing.shareX").
      3. For each value:
         - Keep original text in "original" field.
         - Provide professional English translation in "en" field.
      4. DO NOT attempt to "improve" or "optimize" the key names. Even if they have typos, keep them.
    `;
  }

  return `
    SYSTEM: You are an i18n localization expert.
    TASK: Extract UI strings from raw text and create structured i18n keys.
    
    INPUT_TEXT:
    "${text}"

    RULES:
    1. Create semantic English keys.
    2. KEY_STYLE: ${keyStyle}.
    3. HIERARCHY: ${isNested ? 'Use dot.notation' : 'Flat keys'}.
    4. Provide the original detected text and its English translation.
    5. LIMIT: Maximum 30 keys.
  `;
}

// 2. Улучшенный форматтер
export const formatI18nResult = (items: any[], nested: boolean) => {
  const result: Record<string, any> = {};

  items.forEach(item => {
    if (nested && item.key.includes('.')) {
      // Используем твою же функцию для глубокой вложенности
      setNestedProperty(result, item.key, item.translation);
    } else {
      result[item.key] = item.translation;
    }
  });
  
  return result;
};

// 3. Безопасная установка свойств
export function setNestedProperty(obj: any, path: string, value: any) {
  const keys = path.split('.').filter(k => k !== '__proto__' && k !== 'constructor');
  let current = obj;
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      // Если на пути встретилась строка (конфликт ключей), создаем объект
      if (current[key] !== null && typeof current[key] !== 'object') {
        current[key] = { _val: current[key] }; 
      }
      current[key] = current[key] || {};
      current = current[key];
    }
  }
}