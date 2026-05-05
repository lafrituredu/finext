import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import JSONs
import es from "./language/es/common.json";
import en from "./language/en/common.json";

import homeES from "./language/es/home.json";
import homeEN from "./language/en/home.json";

import loginES from "./language/es/login.json";
import loginEN from "./language/en/login.json";

import registerES from "./language/es/register.json";
import registerEN from "./language/en/register.json";
import verifyEmailES from "./language/es/verifyEmail.json";
import verifyEmailEN from "./language/en/verifyEmail.json";

import navES from "./language/es/nav.json";
import navEN from "./language/en/nav.json";

import error404ES from "./language/es/error404.json";
import error404EN from "./language/en/error404.json";

import footerES from "./language/es/footer.json";
import footerEN from "./language/en/footer.json";

import overviewES from "./language/es/overview.json";
import overviewEN from "./language/en/overview.json";

import sidebarES from "./language/es/sidebar.json";
import sidebarEN from "./language/en/sidebar.json";

import transactionsES from "./language/es/transactions.json";
import transactionsEN from "./language/en/transactions.json";

import aboutES from  "./language/es/about.json";
import aboutEN from  "./language/en/about.json";

import contactES from  "./language/es/contact.json";
import ContactEN from  "./language/en/contact.json";

import utilsES from "./language/es/utils.json";
import utilsEN from "./language/en/utils.json";

import profileES from "./language/es/profile.json";
import profileEN from "./language/en/profile.json";

import billsES from "./language/es/bills.json";
import billsEN from "./language/en/bills.json";

import recurrentES from "./language/es/recurrent.json";
import recurrentEN from "./language/en/recurrent.json";

import transactionsFormES from "./language/es/transactionsForms.json";
import transactionsFormEN from "./language/en/transactionsForm.json";

export const resources = {
  es: {
    common: es,
    home: homeES,
    nav: navES,
    error404: error404ES,
    footer: footerES,
    overview: overviewES,
    sidebar: sidebarES,
    transactions: transactionsES,
    transactionsForm: transactionsFormES,
    login: loginES,
    register: registerES,
    verifyEmail: verifyEmailES,
    about: aboutES,
    contact: contactES,
    utils: utilsES,
    bills: billsES,
    recurrent: recurrentES,
    profile: profileES,
  },
  en: {
    common: en,
    home: homeEN,
    nav: navEN,
    error404: error404EN,
    footer: footerEN,
    overview: overviewEN,
    sidebar: sidebarEN,
    transactions: transactionsEN,
    transactionsForm: transactionsFormEN,
    login: loginEN,
    register: registerEN,
    verifyEmail: verifyEmailEN,
    about: aboutEN,
    contact: ContactEN,
    utils: utilsEN,
    bills: billsEN,
    recurrent: recurrentEN,
    profile: profileEN,
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
