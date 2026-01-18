import { Blog8 } from "../components/blocks/blog8"
import "../index.css"

const demoData = {
  heading: "Companies",
  description:
    "Discover the latest insights and tutorials about modern web development, UI design, and component-driven architecture.",
  posts: [
    {
      id: "post-1",
      title:
        "Building Modern UIs: A Deep Dive into Shadcn and React Components",
      summary:
        "Join us for an in-depth exploration of building modern user interfaces using shadcn/ui and React. Learn best practices and advanced techniques.",
      label: "Web Design",
      author: "Sarah Chen",
      published: "15 Feb 2024",
      url: "https://shadcnblocks.com",
      image: "https://www.shadcnblocks.com/images/block/placeholder-dark-1.svg",
      tags: ["Web Design", "UI Development"],
    },
    {
      id: "post-2",
      title: "Mastering Tailwind CSS: From Basics to Advanced Techniques",
      summary:
        "Discover how to leverage the full power of Tailwind CSS to create beautiful, responsive websites with clean and maintainable code.",
      label: "Web Design",
      author: "Michael Park",
      published: "22 Feb 2024",
      url: "https://shadcnblocks.com",
      image: "https://www.shadcnblocks.com/images/block/placeholder-dark-1.svg",
      tags: ["Web Design", "CSS"],
    },
    {
      id: "post-3",
      title: "Mastering Tailwind CSS: From Basics to Advanced Techniques",
      summary:
        "Discover how to leverage the full power of Tailwind CSS to create beautiful, responsive websites with clean and maintainable code.",
      label: "Web Design",
      author: "Michael Park",
      published: "22 Feb 2024",
      url: "https://shadcnblocks.com",
      image: "https://www.shadcnblocks.com/images/block/placeholder-dark-1.svg",
      tags: ["Web Design", "CSS"],
    },
    {
      id: "post-4",
      title: "Mastering Tailwind CSS: From Basics to Advanced Techniques",
      summary:
        "Discover how to leverage the full power of Tailwind CSS to create beautiful, responsive websites with clean and maintainable code.",
      label: "Web Design",
      author: "Michael Park",
      published: "22 Feb 2024",
      url: "https://shadcnblocks.com",
      image: "https://www.shadcnblocks.com/images/block/placeholder-dark-1.svg",
      tags: ["Web Design", "CSS"],
    },
  ],
};

function Blog8Demo() {
  return <Blog8 {...demoData} />;
}

export { Blog8Demo };
export default Blog8Demo;
