require("dotenv").config(); // загружает .env

module.exports = {
  apps: [
    {
      name: "i18n-ai-main",
      script: "./.output/server/index.mjs",
      env_file: "./.env",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        NUXT_GROQ_API_KEY: process.env.NUXT_GROQ_API_KEY,
      },
    },
  ],
};
