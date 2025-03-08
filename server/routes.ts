import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Blog posts endpoints
  app.post("/api/posts", async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid blog post data" });
    }
  });

  app.get("/api/posts", async (_req, res) => {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  });

  app.get("/api/posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/posts/:id/toggle-pin", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.togglePostPin(id);
      res.json(post);
    } catch (error) {
      res.status(404).json({ message: "Post not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}