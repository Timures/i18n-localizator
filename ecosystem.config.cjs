module.exports = {
  apps: [
    {
      name: "i18n-ai-main",
      script: "./.output/server/index.mjs",
      env_file: "./.env",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        GROQ_API_KEY: "", // Или оставь пустым, если PM2 должен брать из системы
      },
    },
  ],
};
