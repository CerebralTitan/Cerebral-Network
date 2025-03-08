
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { blogPosts, portfolioProjects } from '@shared/schema';
import type { InsertBlogPost, InsertPortfolioProject } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Initialize postgres client
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/blog_portfolio';
const client = postgres(connectionString);
const db = drizzle(client);

class Storage {
  async createBlogPost(postData: InsertBlogPost) {
    try {
      // Make sure date is properly formatted
      if (!postData.date) {
        postData.date = new Date().toISOString().split('T')[0];
      }
      
      // Insert the blog post
      const result = await db.insert(blogPosts).values(postData).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  async getBlogPosts() {
    try {
      // Get all blog posts ordered by pinned status and date
      const result = await db.select().from(blogPosts).orderBy(
        ({ desc }) => [desc(blogPosts.pinned), desc(blogPosts.date)]
      );
      return result;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  }

  async getBlogPostBySlug(slug: string) {
    try {
      // Get a specific blog post by its slug
      const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
      return result[0] || null;
    } catch (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      return null;
    }
  }

  async togglePostPin(id: number) {
    try {
      // Get the current post
      const post = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
      if (!post[0]) {
        throw new Error(`Post with id ${id} not found`);
      }
      
      // Toggle the pinned status
      const updatedPost = await db
        .update(blogPosts)
        .set({ pinned: !post[0].pinned })
        .where(eq(blogPosts.id, id))
        .returning();
        
      return updatedPost[0];
    } catch (error) {
      console.error(`Error toggling pin for post with id ${id}:`, error);
      throw error;
    }
  }

  // Portfolio project methods could be added here
}

export const storage = new Storage();
