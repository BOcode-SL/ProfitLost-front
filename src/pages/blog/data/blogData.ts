import { BlogPost } from "../../../types/blogPost";

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
    },
    {
        id: 3,
        title: "blog.post.3.title",
        excerpt: "blog.post.3.excerpt",
        content: `
            <p>{{blog.post.3.content.intro}}</p>
            <p>{{blog.post.3.content.explanation}}</p>

            <h3>{{blog.post.3.content.whatIs.title}}</h3>
            <p>{{blog.post.3.content.whatIs.description}}</p>

            <h3>{{blog.post.3.content.needs.title}}</h3>
            <p>{{blog.post.3.content.needs.description}}</p>
            <ul>
                <li>{{blog.post.3.content.needs.items.1}}</li>
                <li>{{blog.post.3.content.needs.items.2}}</li>
                <li>{{blog.post.3.content.needs.items.3}}</li>
                <li>{{blog.post.3.content.needs.items.4}}</li>
                <li>{{blog.post.3.content.needs.items.5}}</li>
                <li>{{blog.post.3.content.needs.items.6}}</li>
            </ul>
            <p>{{blog.post.3.content.needs.note}}</p>

            <h3>{{blog.post.3.content.wants.title}}</h3>
            <p>{{blog.post.3.content.wants.description}}</p>
            <ul>
                <li>{{blog.post.3.content.wants.items.1}}</li>
                <li>{{blog.post.3.content.wants.items.2}}</li>
                <li>{{blog.post.3.content.wants.items.3}}</li>
                <li>{{blog.post.3.content.wants.items.4}}</li>
                <li>{{blog.post.3.content.wants.items.5}}</li>
            </ul>
            <p>{{blog.post.3.content.wants.note}}</p>

            <h3>{{blog.post.3.content.savings.title}}</h3>
            <p>{{blog.post.3.content.savings.description}}</p>
            <ul>
                <li>{{blog.post.3.content.savings.items.1}}</li>
                <li>{{blog.post.3.content.savings.items.2}}</li>
                <li>{{blog.post.3.content.savings.items.3}}</li>
                <li>{{blog.post.3.content.savings.items.4}}</li>
            </ul>
            <p>{{blog.post.3.content.savings.note}}</p>

            <h3>{{blog.post.3.content.howTo.title}}</h3>
            <ul>
                <li>{{blog.post.3.content.howTo.items.1}}</li>
                <li>{{blog.post.3.content.howTo.items.2}}</li>
                <li>{{blog.post.3.content.howTo.items.3}}</li>
                <li>{{blog.post.3.content.howTo.items.4}}</li>
            </ul>

            <h3>{{blog.post.3.content.benefits.title}}</h3>
            <ul>
                <li>{{blog.post.3.content.benefits.items.1}}</li>
                <li>{{blog.post.3.content.benefits.items.2}}</li>
                <li>{{blog.post.3.content.benefits.items.3}}</li>
                <li>{{blog.post.3.content.benefits.items.4}}</li>
            </ul>
        `,
        date: "2025-02-19",
        image: "https://res.cloudinary.com/dnhlagojg/image/upload/v1739905395/blog/n4rqts7zupjou5kvcewx.png",
        author: "blog.post.3.author",
        contentType: 'html',
        category: 'tips'
    },
    {
        id: 4,
        title: "blog.post.4.title",
        excerpt: "blog.post.4.excerpt",
        content: `
            <p>{{blog.post.4.content.intro}}</p>

            <h3>{{blog.post.4.content.benefits.title}}</h3>
            <ul>
                <li>{{blog.post.4.content.benefits.items.0}}</li>
                <li>{{blog.post.4.content.benefits.items.1}}</li>
                <li>{{blog.post.4.content.benefits.items.2}}</li>
                <li>{{blog.post.4.content.benefits.items.3}}</li>
            </ul>

            <h3>{{blog.post.4.content.installation.title}}</h3>

            <h4>{{blog.post.4.content.installation.android.title}}</h4>
            <ol>
                <li>{{blog.post.4.content.installation.android.steps.0}}</li>
                <li>{{blog.post.4.content.installation.android.steps.1}}</li>
                <li>{{blog.post.4.content.installation.android.steps.2}}</li>
                <li>{{blog.post.4.content.installation.android.steps.3}}</li>
            </ol>

            <h4>{{blog.post.4.content.installation.ios.title}}</h4>
            <ol>
                <li>{{blog.post.4.content.installation.ios.steps.0}}</li>
                <li>{{blog.post.4.content.installation.ios.steps.1}}</li>
                <li>{{blog.post.4.content.installation.ios.steps.2}}</li>
                <li>{{blog.post.4.content.installation.ios.steps.3}}</li>
                <li>{{blog.post.4.content.installation.ios.steps.4}}</li>
            </ol>

            <h4>{{blog.post.4.content.installation.desktop.title}}</h4>
            <ol>
                <li>{{blog.post.4.content.installation.desktop.steps.0}}</li>
                <li>{{blog.post.4.content.installation.desktop.steps.1}}</li>
                <li>{{blog.post.4.content.installation.desktop.steps.2}}</li>
                <li>{{blog.post.4.content.installation.desktop.steps.3}}</li>
            </ol>

            <p>{{blog.post.4.content.conclusion}}</p>
        `,
        date: "2025-02-24",
        image: "https://res.cloudinary.com/dnhlagojg/image/upload/v1740227121/blog/rto8kegs48jmr31o2rdk.png",
        author: "blog.post.4.author",
        contentType: 'html',
        category: 'tutorials'
    },
    {
        id: 5,
        title: "blog.post.5.title",
        excerpt: "blog.post.5.excerpt",
        content: `
            <p>{{blog.post.5.content.intro}}</p>

            <h3>{{blog.post.5.content.howItWorks.title}}</h3>
            <ol>
                <li>{{blog.post.5.content.howItWorks.steps.0}}</li>
                <li>{{blog.post.5.content.howItWorks.steps.1}}</li>
                <li>{{blog.post.5.content.howItWorks.steps.2}}</li>
            </ol>

            <p>{{blog.post.5.content.adaptation}}</p>

            <p>{{blog.post.5.content.callToAction}}</p>

            <p><a href="https://profit-lost.com">profit-lost.com</a></p>
        `,
        date: "2025-03-21",
        image: "https://res.cloudinary.com/dnhlagojg/image/upload/v1742837549/blog/hvhlu9j5qp1ecalrntpd.png",
        author: "blog.post.5.author",
        contentType: 'html',
        category: 'tips'
    }
];