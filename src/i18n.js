// Importing the i18n library for internationalization
import i18n from 'i18next';
// Importing the React bindings for i18next
import { initReactI18next } from 'react-i18next';
// Importing the language detector for browser language detection
import LanguageDetector from 'i18next-browser-languagedetector';

// Importing translation files for English and Spanish
import en from './i18n/en.json';
import es from './i18n/es.json';

// Initializing i18n with the necessary configurations
i18n
    .use(LanguageDetector) // Using the language detector
    .use(initReactI18next) // Initializing React i18next
    .init({
        resources: {
            en: {
                translation: en // English translations
            },
            es: {
                translation: es // Spanish translations
            }
        },
        fallbackLng: 'en', // Fallback language if the detected language is not available
        debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
        interpolation: {
            escapeValue: false // Disable escaping for interpolation
        }
    });

// Exporting the configured i18n instance
export default i18n;
