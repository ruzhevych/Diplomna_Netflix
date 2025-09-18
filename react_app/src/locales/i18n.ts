import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationUA from './ua/translation.json';
import translationEN from './en/translation.json';

const resources = {
  ua: {
    translation: translationUA,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', 
    fallbackLng: 'ua',
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;