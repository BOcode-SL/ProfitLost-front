// Importing the i18n library for internationalization support
import i18n from 'i18next';
// Importing the React bindings for i18next to integrate with React
import { initReactI18next } from 'react-i18next';
// Importing the language detector to automatically detect the user's language
import LanguageDetector from 'i18next-browser-languagedetector';

// Importing translation files for English and Spanish languages
import en from './i18n/en.json';
import es from './i18n/es.json';

// Function to normalize language codes
const normalizeLanguage = (lng) => {
    // Convert es-ES, es-AR, etc. to simply 'es'
    if (lng.startsWith('es')) return 'es';
    // Convert en-US, en-GB, etc. to simply 'en'
    if (lng.startsWith('en')) return 'en';
    return 'en'; // default language
};

// Initializing i18n with the required configurations
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: en
            },
            es: {
                translation: es
            }
        },
        fallbackLng: 'en',
        debug: false,
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'i18nextLng',
            caches: ['localStorage']
        },
        load: 'languageOnly', // Load only the main language code (e.g., 'es' instead of 'es-ES')
        interpolation: {
            escapeValue: false
        }
    });

// Normalize the current language if necessary
const currentLng = localStorage.getItem('i18nextLng');
if (currentLng) {
    const normalizedLng = normalizeLanguage(currentLng);
    if (currentLng !== normalizedLng) {
        i18n.changeLanguage(normalizedLng);
    }
}

// Exporting the configured i18n instance for use in the application
export default i18n;
