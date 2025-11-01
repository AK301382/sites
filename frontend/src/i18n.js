import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import commonEN from './locales/en/common.json';
import publicEN from './locales/en/public.json';
import adminEN from './locales/en/admin.json';

import commonDE from './locales/de/common.json';
import publicDE from './locales/de/public.json';
import adminDE from './locales/de/admin.json';

import commonFR from './locales/fr/common.json';
import publicFR from './locales/fr/public.json';

const resources = {
  en: {
    common: commonEN,
    public: publicEN,
    admin: adminEN,
  },
  de: {
    common: commonDE,
    public: publicDE,
    admin: adminDE,
  },
  fr: {
    common: commonFR,
    public: publicFR,
    admin: {}, // French doesn't have admin translations
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    ns: ['common', 'public', 'admin'],
    defaultNS: 'public',
    fallbackNS: 'common',
    fallbackLng: 'de',
    lng: 'de',
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
