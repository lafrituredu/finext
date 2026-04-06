import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import JSONs
import es from "./language/es/common.json";
import en from "./language/en/common.json";

import homeES from "./language/es/home.json";
import homeEN from "./language/en/home.json";

import navES from "./language/es/nav.json";
import navEN from "./language/en/nav.json";

import error404ES from "./language/es/error404.json";
import error404EN from "./language/en/error404.json";

import footerES from "./language/es/footer.json";
import footerEN from "./language/en/footer.json";

export const resources = {
  es: {
    common: es,
    home: homeES,
    nav: navES,
    error404: error404ES,
    footer: footerES,
  },
  en: {
    common: en,
    home: homeEN,
    nav: navEN,
    error404: error404EN,
    footer: footerEN,
  },
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;