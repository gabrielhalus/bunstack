import type { i18n, InitOptions } from "i18next";

import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import en from "./locales/en";
import fr from "./locales/fr";

export function createClientI18n(extra: Partial<InitOptions> = {}): i18n {
  const instance = i18next.createInstance()
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next);

  const resources = { en, fr };

  const namespaces = Array.from(
    new Set([
      ...Object.keys(en),
      ...Object.keys(fr),
      ...(extra.ns ?? []),
    ]),
  );
  delete extra.ns;

  instance.init({
    fallbackLng: "en",
    defaultNS: "common",
    resources,
    backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
    ns: namespaces,
    ...extra,
  });

  return instance;
}
