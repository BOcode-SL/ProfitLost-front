import { useTranslation } from 'react-i18next';

export const useProcessBlogContent = () => {
    const { t } = useTranslation();

    const processContent = (content: string): string => {
        // First, process special links
        let processedContent = content.replace(
            /<li>{{([\w.]+)}}<\/li>\s*<a\s+href="([^"]+)">([^<]+)<\/a>/g,
            (_, key: string, href: string, linkText: string) => 
                `<li>${t(key)} <a href="${href}">${linkText}</a></li>`
        );

        // Process normal lists
        processedContent = processedContent.replace(
            /<ul>([\s\S]*?)<\/ul>/g,
            (_, listContent: string) => {
                const processedList = listContent.replace(
                    /<li>{{([\w.]+)}}<\/li>/g,
                    (_: string, key: string) => {
                        if (key.includes('.items.')) {
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

        // Process the remaining content
        processedContent = processedContent.replace(
            /{{([\w.]+)}}/g,
            (_: string, key: string) => t(key)
        );

        return processedContent;
    };

    return { processContent };
}; 