import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  tags: text("tags").array().notNull(),
  date: text("date").notNull(),
  pinned: boolean("pinned").notNull().default(false),
  slug: text("slug").notNull(),
});

export const portfolioProjects = pgTable("portfolio_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  tags: text("tags").array().notNull(),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
});

// Modified schema to handle wiki links and slugs
export const insertBlogPostSchema = createInsertSchema(blogPosts)
  .omit({ id: true })
  .extend({
    content: z.string().transform((content) => {
      // Replace wiki-style links with proper HTML links
      return content.replace(/\[\[(.*?)\]\]/g, (_, text) => {
        const slug = text.toLowerCase().replace(/\s+/g, '-');
        return `<a href="/blog/${slug}" class="text-primary hover:underline">${text}</a>`;
      });
    }),
    slug: z.string().transform((_, ctx) => {
      const title = ctx.input.title as string;
      return title.toLowerCase().replace(/\s+/g, '-');
    }),
    pinned: z.boolean().default(false),
  });

export const insertPortfolioProjectSchema = createInsertSchema(portfolioProjects).omit({ id: true });

export type BlogPost = typeof blogPosts.$inferSelect;
export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertPortfolioProject = z.infer<typeof insertPortfolioProjectSchema>;