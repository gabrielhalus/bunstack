import { createClientI18n } from "@bunstack/i18n";

const i18n = createClientI18n({
  lng: "en",
  supportedLngs: ["en", "fr"],
});

export default i18n;
