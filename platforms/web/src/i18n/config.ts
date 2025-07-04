import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import I18NextHttpBackend from 'i18next-http-backend';
import i18next from 'i18next';
import type { LanguageDefinition } from '@jwp/ott-common/types/i18n';
import { filterSupportedLanguages } from '@jwp/ott-common/src/utils/i18n';
import { useConfigStore } from '@jwp/ott-common/src/stores/ConfigStore';

import { NAMESPACES } from './resources';

// This list contains all languages that are supported by the OTT Web app by default
// To enable the language, make sure that the language code is added to the `APP_ENABLED_LANGUAGES` environment variable
// Before adding a defined language, ensure that the translation files are added to the `./public/locales/${code}` folder
export const DEFINED_LANGUAGES: LanguageDefinition[] = [
  {
    code: 'en',
    displayName: 'English',
  },
  {
    code: 'es',
    displayName: 'Español',
  },
  {
    code: 'nl',
    displayName: 'Nederlands',
  },
  {
    code: 'fr',
    displayName: 'Français',
  },
  {
    code: 'de',
    displayName: 'Deutsch',
  },
];

const initI18n = async () => {
  const enabledLanguages = import.meta.env.APP_ENABLED_LANGUAGES?.split(',') || [];
  const defaultLanguage = import.meta.env.APP_DEFAULT_LANGUAGE || 'en';

  const supportedLanguages = filterSupportedLanguages(DEFINED_LANGUAGES, enabledLanguages);

  useConfigStore.setState({ supportedLanguages });

  if (!supportedLanguages.some(({ code }) => code === defaultLanguage)) {
    throw new Error(`The default language is not enabled: ${defaultLanguage}`);
  }

  await i18next
    .use(I18NextHttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      supportedLngs: supportedLanguages.map(({ code }) => code),
      fallbackLng: defaultLanguage,
      // this option ensures that empty strings in translations will fall back to the default language
      returnEmptyString: false,
      ns: NAMESPACES,
      defaultNS: 'common',
      fallbackNS: 'common',
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: 'jwapp.language',
      },
      react: {
        // disabled suspense to prevent re-loading the app while loading the resources
        useSuspense: false,
      },
    });
};

export default initI18n;
