import type { PortfolioProject } from "@shared/schema";

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 1,
    title: "E-commerce Dashboard",
    description: "A modern dashboard for managing online stores with real-time analytics.",
    imageUrl: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2",
    tags: ["React", "TypeScript", "Dashboard"],
    githubUrl: "https://github.com/username/project",
    liveUrl: "https://project-demo.com",
  },
  {
    id: 2,
    title: "AI Image Generator",
    description: "An application that generates unique images using machine learning.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    tags: ["AI", "Python", "React"],
    githubUrl: "https://github.com/username/project",
    liveUrl: "https://project-demo.com",
  },
  {
    id: 3,
    title: "Travel Blog Platform",
    description: "A platform for travel enthusiasts to share their experiences.",
    imageUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
    tags: ["Next.js", "MongoDB", "Blog"],
    githubUrl: "https://github.com/username/project",
    liveUrl: "https://project-demo.com",
  },
  // Add more projects as needed
];
