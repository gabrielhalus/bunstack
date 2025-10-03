// config-ssr.ts
import type { i18n, InitOptions as I18NextInitOptions } from "i18next";

import i18next from "i18next";

import en from "./locales/en";
import fr from "./locales/fr";

type ArbitraryNamespace = string & { __brand?: "ArbitraryNamespace" };
type Namespace = keyof typeof en | ArbitraryNamespace;
type NsOption = Namespace | readonly Namespace[];

const bundledResources = { en, fr };

export type InitOptions = { ns?: NsOption } & Omit<I18NextInitOptions, "ns">;

export function createServerI18n(extra: Partial<InitOptions> = {}): i18n {
  const instance = i18next.createInstance();

  instance.init({
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common", "ui"], // namespaces present in your bundled JSON
    supportedLngs: ["en", "fr"],
    resources: bundledResources, // ⚡ static JSON imports
    interpolation: { escapeValue: false },
    ...extra,
  });

  return instance;
}
