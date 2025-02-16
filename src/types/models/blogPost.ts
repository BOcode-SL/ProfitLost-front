export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    image: string;
    author: string;
    contentType: 'html';
    category: CategoryType;
}

export type CategoryType = 'introduction' | 'tutorials' | 'tips' | 'updates';
