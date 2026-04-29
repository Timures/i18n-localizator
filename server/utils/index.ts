// 1. Промпт (без изменений, всё ок)
export function generateSmartPrompt(
  text: string,
  keyStyle: string,
  isNested: boolean,
) {
  const isJson = text.trim().startsWith("{") || text.trim().startsWith("[");

  if (isJson) {
    return {
      system: `You are a strict JSON-to-JSON translator.
Always respond with valid JSON matching the requested schema exactly.
Never add comments or extra fields.`,
      prompt: `Translate string values from the provided JSON into English.

RULES:
1. DO NOT touch the keys. Every key in the output MUST be identical to the key in the input.
2. If the input is nested, use the full path for the "key" field (e.g. "marketing.shareX").
3. Keep original text in "original" field, English translation in "en" field.
4. Detect the source language, return it as "detectedLanguage" (e.g. "ru", "de").

INPUT:
${text}`,
    };
  }

  return {
    system: `You are an i18n localization expert.
Always respond with valid JSON matching the requested schema exactly.
Never add comments or extra fields.`,
    prompt: `Extract UI strings from raw text and create structured i18n keys.

RULES:
1. Create semantic English keys.
2. Key style: ${keyStyle}.
3. ${isNested ? "Use dot.notation for nested keys." : "Use flat keys only."}
4. Keep original text in "original" field, English translation in "en" field.
5. Detect the source language, return it as "detectedLanguage" (e.g. "ru", "de").
6. Maximum 30 keys.

INPUT:
"${text}"`,
  };
}

// 2. Улучшенный форматтер
export const formatI18nResult = (items: any[], nested: boolean) => {
  const result: Record<string, any> = {};

  items.forEach((item) => {
    if (nested && item.key.includes(".")) {
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
  const keys = path
    .split(".")
    .filter((k) => k !== "__proto__" && k !== "constructor");
  let current = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      // Если на пути встретилась строка (конфликт ключей), создаем объект
      if (current[key] !== null && typeof current[key] !== "object") {
        current[key] = { _val: current[key] };
      }
      current[key] = current[key] || {};
      current = current[key];
    }
  }
}
