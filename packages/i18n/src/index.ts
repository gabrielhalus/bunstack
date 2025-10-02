export { createClientI18n } from "./config.client";
// Note: createServerI18n is exported separately to avoid bundling Node.js dependencies in client builds
// Use: import { createServerI18n } from "@bunstack/i18n/server"
export * from "i18next";
