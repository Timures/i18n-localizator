import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

function setNestedProperty(obj: any, path: string, value: any) {
  // Защита от Prototype Pollution
  const keys = path.split('.').filter(k => k !== '__proto__' && k !== 'constructor');
  let current = obj;
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      // Проверка: если там уже строка, превращаем в объект (или пропускаем)
      if (typeof current[key] === 'string') {
        current[key] = { _value: current[key] }; 
      }
      current[key] = current[key] || {};
      current = current[key];
    }
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { text, keyStyle, isNested } = await readBody(event);

  // Используем ключ из конфига или окружения
  const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: config.groqApiKey || process.env.GROQ_API_KEY,
  });

  try {
    const result = await generateObject({
      // Рекомендуемая модель для четкого следования Zod схеме
      model: groq('openai/gpt-oss-20b'), 
      schema: z.object({
        detectedLanguage: z.string().describe('Language name, e.g. "Russian", "Kazakh"'),
        items: z.array(z.object({
          key: z.string().describe('English semantic key'),
          original: z.string().describe('Source text'),
          en: z.string().describe('English translation')
        }))
      }),
      prompt: `
        Task: Extract i18n keys and translations.
        Source Text: "${text}"
        
        Rules:
        1. LIMIT: Extract NO MORE than 30 semantic keys. If the text is longer, focus on the most important UI elements.
        2. Source Language: Detect automatically.
        3. Key Style: ${keyStyle}.
        4. Hierarchy: ${isNested ? 'Use dot.notation' : 'Flat keys'}.
        5. Values: Extract ONLY text, clean from "Label:", "Button:", etc.
        6. Quality: Keys must be semantic English.
      `,
    });

    const { detectedLanguage, items } = result.object;
    const originalJson = {};
    const enJson = {};

    items.forEach(item => {
      if (isNested) {
        setNestedProperty(originalJson, item.key, item.original);
        setNestedProperty(enJson, item.key, item.en);
      } else {
        originalJson[item.key] = item.original;
        enJson[item.key] = item.en;
      }
    });

    return { 
      sourceLang: detectedLanguage,
      original: originalJson, 
      en: enJson 
    };

  } catch (error: any) {
    console.error('Generation Error:', error.message);
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'AI Error: ' + error.message 
    });
  }
});