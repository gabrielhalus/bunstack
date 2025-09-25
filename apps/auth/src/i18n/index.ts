import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "fr"],
    defaultNS: "common",
    backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
