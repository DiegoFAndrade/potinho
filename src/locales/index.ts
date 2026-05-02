import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from './pt.json';
import en from './en.json';

function detectLanguage(): 'pt' | 'en' {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getLocales } = require('expo-localization');
    const code = getLocales()[0]?.languageCode;
    return code === 'en' ? 'en' : 'pt';
  } catch {
    return 'pt';
  }
}

i18n.use(initReactI18next).init({
  resources: {
    pt: { translation: pt },
    en: { translation: en },
  },
  lng: detectLanguage(),
  fallbackLng: 'pt',
  interpolation: { escapeValue: false },
});

export default i18n;
