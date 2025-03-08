import type { BlogPost } from "@shared/schema";

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Art of Minimalist Design",
    excerpt: "Exploring the principles of minimalist design and how to apply them in your projects.",
    content: "Full content here...",
    imageUrl: "https://images.unsplash.com/photo-1518384401463-d3876163c195",
    tags: ["Design", "Minimalism"],
    date: new Date("2024-01-15").toISOString(),
  },
  {
    id: 2,
    title: "Future of Web Development",
    excerpt: "A look at emerging trends and technologies shaping the future of web development.",
    content: "Full content here...",
    imageUrl: "https://images.unsplash.com/photo-1620287341056-49a2f1ab2fdc",
    tags: ["Web Development", "Technology"],
    date: new Date("2024-01-10").toISOString(),
  },
  {
    id: 3,
    title: "Mastering Typography in UI Design",
    excerpt: "Learn how to use typography effectively to create beautiful and readable interfaces.",
    content: "Full content here...",
    imageUrl: "https://images.unsplash.com/photo-1499728603263-13726abce5fd",
    tags: ["Design", "Typography"],
    date: new Date("2024-01-05").toISOString(),
  },
  // Add more blog posts as needed
];
