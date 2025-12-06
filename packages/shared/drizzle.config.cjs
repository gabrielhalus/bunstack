const { defineConfig } = require("drizzle-kit");

module.exports = defineConfig({
  schema: "./src/database/schemas/*.ts",
  out: "./src/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // eslint-disable-next-line node/no-process-env
    url: process.env.DATABASE_URL,
  },
});
