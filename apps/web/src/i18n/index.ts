import { createClientI18n } from "@bunstack/i18n";

const i18n = createClientI18n({
  supportedLngs: ["en", "fr"],
  ns: ["common", "app", "auth", "users", "roles"],
});

export default i18n;
