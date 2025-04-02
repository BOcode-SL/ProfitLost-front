/**
 * Blog Post Models Module
 * 
 * Contains type definitions for blog content used in the application.
 */

/**
 * Represents a blog post in the system
 * Used for educational and marketing content
 */
export interface BlogPost {
    id: number;                  // Unique identifier
    title: string;               // Post title
    excerpt: string;             // Short summary for previews
    content: string;             // Full post content
    date: string;                // Publication date
    image: string;               // Featured image URL
    author: string;              // Author's name
    contentType: 'html';         // Content format type
    category: CategoryType;      // Blog post category
}

/**
 * Categories for blog posts
 * Used for filtering and organization
 */
export type CategoryType = 'introduction' | 'tutorials' | 'tips' | 'updates';
