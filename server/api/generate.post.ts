import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  // 1. Согласуем название: на фронте у тебя было 'text', используем его везде
  const { text, keyStyle, isNested } = await readBody(event);

  if (!text) {
    throw createError({ statusCode: 400, statusMessage: 'Text is required' });
  }

  const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: config.groqApiKey, // Ключ должен быть в runtimeConfig.public или private
  });

  try {
    // 2. Исправлено: передаем 'text', а не 'inputText'
    const promptText = generateSmartPrompt(text, keyStyle, isNested);

    const { object } = await generateObject({
      // Убедись, что ID модели корректен для Groq API
      model: groq('openai/gpt-oss-20b'), 
      schema: z.object({
        detectedLanguage: z.string(),
        items: z.array(z.object({
          key: z.string(),
          original: z.string(),
          en: z.string()
        }))
      }),
      prompt: promptText
    });

    // Определяем, был ли входной текст JSON-ом для корректной сборки
    const isInputJson = text.trim().startsWith('{') || text.trim().startsWith('[');

    // 3. Собираем финальный ответ с правильными ссылками на переменные
    const response = {
      detectedLanguage: object.detectedLanguage,
      results: {
        original: formatI18nResult(
          object.items.map(i => ({ key: i.key, translation: i.original })), 
          isNested || isInputJson
        ),
        en: formatI18nResult(
          object.items.map(i => ({ key: i.key, translation: i.en })), 
          isNested || isInputJson
        )
      }
    };

    return response;

  } catch (error: any) {
    console.error('Generation Error:', error);
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'AI Error: ' + (error.message || 'Unknown error')
    });
  } 
});