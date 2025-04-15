/**
 * Blog Content Processing Utility
 * 
 * Provides functionality for processing blog content with localization support.
 * Handles special syntax for translatable content in blog posts.
 * 
 * @module BlogUtils
 */
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for processing blog content with internationalization support.
 * Allows blog content to include placeholders that will be replaced with translated text.
 * 
 * @returns {Object} An object containing the processContent function
 * @returns {Function} object.processContent - Function to process translation placeholders
 */
export const useProcessBlogContent = () => {
    const { t } = useTranslation();

    /**
     * Processes blog content by replacing translation placeholders with translated text.
     * 
     * Supports several placeholder formats:
     * - {{key}} - Simple translation key replacement
     * - <li>{{key}}</li> - Translation key within list items
     * - <li>{{key}}</li><a href="...">...</a> - Translation key with adjacent link
     * - {{key.items.n}} - Indexed items within a translation object (where n is a numeric index)
     * 
     * @param {string} content - The blog content with translation placeholders
     * @returns {string} Processed content with all placeholders replaced by translated text
     */
    const processContent = (content: string): string => {
        // Process special links with translation keys
        // Format: <li>{{key}}</li><a href="url">linkText</a>
        // This pattern handles list items that need to be followed by a link
        let processedContent = content.replace(
            /<li>{{([\w.]+)}}<\/li>\s*<a\s+href="([^"]+)">([^<]+)<\/a>/g,
            (_, key: string, href: string, linkText: string) => 
                `<li>${t(key)} <a href="${href}">${linkText}</a></li>`
        );

        // Process lists with translation keys
        // Finds all <ul> blocks and processes their <li> elements that contain translation keys
        processedContent = processedContent.replace(
            /<ul>([\s\S]*?)<\/ul>/g,
            (_, listContent: string) => {
                const processedList = listContent.replace(
                    /<li>{{([\w.]+)}}<\/li>/g,
                    (_: string, key: string) => {
                        if (key.includes('.items.')) {
                            // Handle indexed items from a translation array
                            // Example: {{blog.list.items.0}} refers to the first item in blog.list.items array
                            const [base, index] = key.split('.items.');
                            const items = t(`${base}.items`, { returnObjects: true });
                            return `<li>${Array.isArray(items) ? items[parseInt(index)] : t(key)}</li>`;
                        }
                        return `<li>${t(key)}</li>`;
                    }
                );
                return `<ul>${processedList}</ul>`;
            }
        );

        // Process all remaining simple translation keys
        // Format: {{key}} - Replaces with corresponding translation
        processedContent = processedContent.replace(
            /{{([\w.]+)}}/g,
            (_: string, key: string) => t(key)
        );

        return processedContent;
    };

    return { processContent };
}; 