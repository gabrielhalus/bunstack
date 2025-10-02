import type { InitOptions } from "i18next";

import i18next from "i18next";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export async function createServerI18n(appName?: string, extra: Partial<InitOptions> = {}) {
  // Only import i18next-fs-backend when actually needed on the server
  if (typeof window !== "undefined") {
    throw new TypeError("createServerI18n can only be used in server environments");
  }

  try {
    // Dynamic import to prevent bundling in client builds
    const { default: Backend } = await import("i18next-fs-backend");

    const appLocalesPath = appName ? join(process.cwd(), "src/locales") : null;

    return i18next.createInstance().use(Backend).init({
      fallbackLng: "en",
      ns: ["common", "validation"],
      defaultNS: "common",
      backend: {
        loadPath: appLocalesPath
          ? [
              join(appLocalesPath, "{{lng}}/{{ns}}.json"),
              join(__dirname, "locales/{{lng}}/{{ns}}.json"),
            ]
          : join(__dirname, "locales/{{lng}}/{{ns}}.json"),
      },
      ...extra,
    });
  } catch (error) {
    throw new Error(`Failed to initialize server i18n: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
