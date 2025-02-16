import { BlogPost } from "../../../types/models/blogPost";

export const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: "blog.post.1.title",
        excerpt: "blog.post.1.excerpt",
        content: `
            <p>{{blog.post.1.content.intro}}</p>

            <p>{{blog.post.1.content.question}}</p>

            <h3>{{blog.post.1.content.historyTitle}}</h3>
            <p>{{blog.post.1.content.historyContent}}</p>

            <h3>{{blog.post.1.content.featuresTitle}}</h3>
            <ul>
                <li>{{blog.post.1.content.features.1}}</li>
                <li>{{blog.post.1.content.features.2}}</li>
                <li>{{blog.post.1.content.features.3}}</li>
                <li>{{blog.post.1.content.features.4}}</li>
            </ul>

            <p>{{blog.post.1.content.callToAction}}</p>

            <p><a href="https://profit-lost.com">profit-lost.com</a></p>
        `,
        date: "2024-03-20",
        image: "https://res.cloudinary.com/dnhlagojg/image/upload/v1739636810/blog/fefy4e0cgpnt0tjfornm.jpg",
        author: "blog.post.1.author",
        contentType: 'html',
        category: 'introduction'
    },
    {
        id: 2,
        title: "blog.post.2.title",
        excerpt: "blog.post.2.excerpt",
        content: `
            <p>{{blog.post.2.content.intro}}</p>

            <h3>{{blog.post.2.content.step1.title}}</h3>
            <ul>
                <li>{{blog.post.2.content.step1.items.0}} <a href="https://profit-lost.com/auth">profit-lost.com/auth</a> ⛓️‍💥</li>
                <li>{{blog.post.2.content.step1.items.1}}</li>
                <li>{{blog.post.2.content.step1.items.2}}</li>
            </ul>

            <h3>{{blog.post.2.content.step2.title}}</h3>
            <ul>
                <li>{{blog.post.2.content.step2.items.0}}</li>
                <li>{{blog.post.2.content.step2.items.1}}</li>
                <li>{{blog.post.2.content.step2.items.2}}</li>
            </ul>

            <h3>{{blog.post.2.content.step3.title}}</h3>
            <ul>
                <li>{{blog.post.2.content.step3.items.0}}</li>
                <li>{{blog.post.2.content.step3.items.1}}</li>
            </ul>

            <h3>{{blog.post.2.content.step4.title}}</h3>
            <ul>
                <li>{{blog.post.2.content.step4.items.0}}</li>
                <li>{{blog.post.2.content.step4.items.1}}</li>
            </ul>

            <h3>{{blog.post.2.content.additionalTips.title}}</h3>
            <ul>
                <li>{{blog.post.2.content.additionalTips.items.0}}</li>
                <li>{{blog.post.2.content.additionalTips.items.1}}</li>
            </ul>

            <p>{{blog.post.2.content.callToAction}}</p>
        `,
        date: "2025-02-15",
        image: "https://res.cloudinary.com/dnhlagojg/image/upload/v1739553639/AppPhotos/Brand/mockup/annualreport.png",
        author: "blog.post.2.author",
        contentType: 'html',
        category: 'tutorials'
    }
];