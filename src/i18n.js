/**
 * Internationalization (i18n) Configuration
 * 
 * Sets up multilingual support for the application using i18next.
 * Handles language detection, translation loading, and language normalization.
 * 
 * This module configures:
 * - Translation resource loading (English and Spanish)
 * - Automatic language detection based on browser settings
 * - Language persistence using localStorage
 * - Normalization of language codes for consistency (e.g., 'es-ES' → 'es')
 * 
 * @module i18n
 */

// Core i18n library for internationalization functionality
import i18n from 'i18next';
// React bindings to integrate i18next with React components
import { initReactI18next } from 'react-i18next';
// Browser language detector plugin to automatically detect user's preferred language
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resource files
import en from './i18n/en.json';
import es from './i18n/es.json';

/**
 * Normalizes language codes to simplify language handling
 * Converts regional variants (e.g., es-ES, en-US) to base language codes (es, en)
 * 
 * @param {string} lng - Language code to normalize
 * @returns {string} Normalized language code ('en' or 'es')
 */
const normalizeLanguage = (lng) => {
    // Convert es-ES, es-AR, etc. to simply 'es'
    if (lng.startsWith('es')) return 'es';
    // Convert en-US, en-GB, etc. to simply 'en'
    if (lng.startsWith('en')) return 'en';
    return 'en'; // default language
};

// Initialize i18n with configuration options
i18n
    // Add language detection plugin
    .use(LanguageDetector)
    // Add React integration plugin
    .use(initReactI18next)
    // Configure i18n instance
    .init({
        // Define available translation resources
        resources: {
            en: {
                translation: en
            },
            es: {
                translation: es
            }
        },
        fallbackLng: 'en',           // Default language if translation is missing
        debug: false,                 // Disable debug mode in production
        detection: {
            order: ['localStorage', 'navigator'],  // Check localStorage first, then browser settings
            lookupLocalStorage: 'i18nextLng',      // Key to use in localStorage
            caches: ['localStorage']               // Cache the language selection
        },
        load: 'languageOnly',         // Load only the base language code (e.g., 'es' instead of 'es-ES')
        interpolation: {
            escapeValue: false        // React already escapes values, so this is safe
        }
    });

// Check and normalize the current language if needed
const currentLng = localStorage.getItem('i18nextLng');
if (currentLng) {
    const normalizedLng = normalizeLanguage(currentLng);
    if (currentLng !== normalizedLng) {
        i18n.changeLanguage(normalizedLng);
    }
}

// Export the configured i18n instance for use throughout the application
export default i18n;
