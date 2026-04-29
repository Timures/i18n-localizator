module.exports = {
  apps: [
    {
      name: "i18n-ai-main",
      script: "./.output/server/index.mjs",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        GROQ_API_KEY:
          "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", // Или оставь пустым, если PM2 должен брать из системы
      },
    },
  ],
};
