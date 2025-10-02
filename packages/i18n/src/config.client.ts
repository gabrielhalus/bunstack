import type { i18n, InitOptions } from "i18next";

import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export function createClientI18n(extra: Partial<InitOptions> = {}): i18n {
  const instance = i18next.createInstance()
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next);

  instance.init({
    fallbackLng: "en",
    ns: ["common", "validation"],
    defaultNS: "common",
    backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
    ...extra,
  });

  return instance;
}
