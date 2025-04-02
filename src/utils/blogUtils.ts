/**
 * Blog Content Processing Utility
 * 
 * Provides functionality for processing blog content with localization support.
 * Handles special syntax for translatable content in blog posts.
 */
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for processing blog content with internationalization support
 * Allows blog content to include placeholders that will be replaced with translated text
 * 
 * @returns Object containing the processContent function
 */
export const useProcessBlogContent = () => {
    const { t } = useTranslation();

    /**
     * Processes blog content by replacing translation placeholders with translated text
     * Supports several formats:
     * - {{key}} - Simple translation key
     * - <li>{{key}}</li> - Translation key within list items
     * - <li>{{key}}</li><a href="...">...</a> - Translation key with adjacent link
     * - {{key.items.n}} - Indexed items within a translation object
     * 
     * @param content - The blog content with translation placeholders
     * @returns Processed content with all placeholders replaced by translated text
     */
    const processContent = (content: string): string => {
        // Process special links with translation keys
        // Format: <li>{{key}}</li><a href="url">linkText</a>
        let processedContent = content.replace(
            /<li>{{([\w.]+)}}<\/li>\s*<a\s+href="([^"]+)">([^<]+)<\/a>/g,
            (_, key: string, href: string, linkText: string) => 
                `<li>${t(key)} <a href="${href}">${linkText}</a></li>`
        );

        // Process lists with translation keys
        // Handles both simple keys and indexed items within translation objects
        processedContent = processedContent.replace(
            /<ul>([\s\S]*?)<\/ul>/g,
            (_, listContent: string) => {
                const processedList = listContent.replace(
                    /<li>{{([\w.]+)}}<\/li>/g,
                    (_: string, key: string) => {
                        if (key.includes('.items.')) {
                            // Handle indexed items from a translation array
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
        // Format: {{key}}
        processedContent = processedContent.replace(
            /{{([\w.]+)}}/g,
            (_: string, key: string) => t(key)
        );

        return processedContent;
    };

    return { processContent };
}; 