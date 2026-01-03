import { generateObject } from 'ai';
// import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { text, keyStyle, isNested } = await readBody(event);

  // Настройка Groq (использует совместимый с OpenAI SDK)
  const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
  });
  try {
    const result = await generateObject({
      // Llama 3.3 70B — это уровень GPT-4, работает молниеносно
      model: groq('openai/gpt-oss-20b'), 
      schema: z.object({
        items: z.array(z.object({
          key: z.string().describe('Semantic English key'),
          value: z.string().describe('Translated English text')
        }))
      }),
      prompt: `Translate this Russian text to English and create i18n keys. 
               Style: ${keyStyle}. Nested: ${isNested}.
               Text: "${text}"`,
    });

    const finalJson = {};
    // ... логика сборки JSON остается прежней ...
    result.object.items.forEach(item => {
      finalJson[item.key] = item.value;
    });

    return finalJson;

  } catch (error: any) {
    console.error('Groq Error:', error.message);
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'AI Service busy, try again later' 
    });
  }
});