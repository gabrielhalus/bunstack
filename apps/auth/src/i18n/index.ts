import { createClientI18n } from "@bunstack/i18n";

const i18n = createClientI18n({
  supportedLngs: ["en", "fr"],
  ns: ["auth"],
});

export default i18n;
