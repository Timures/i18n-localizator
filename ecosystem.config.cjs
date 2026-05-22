module.exports = {
  apps: [
    {
      name: "i18n-ai-main",
      script: "./.output/server/index.mjs",
      env_file: "./.env",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
