import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema, insertTemplateSchema, insertPostSchema, insertCategorySchema } from "@shared/schema";
import { requireAdmin, handleLogin, handleLogout } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/logout", handleLogout);

  // Protected routes
  app.post("/api/posts", requireAdmin, async (req, res) => {
    const result = insertPostSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid post data" });
    }
    const post = await storage.createPost(result.data);
    res.json(post);
  });

  app.patch("/api/posts/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertPostSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid post data" });
    }
    try {
      const post = await storage.updatePost(id, result.data);
      res.json(post);
    } catch (err) {
      res.status(404).json({ message: "Post not found" });
    }
  });

  app.delete("/api/posts/:id", requireAdmin, async (req, res) => {
    await storage.deletePost(parseInt(req.params.id));
    res.status(204).end();
  });

  app.post("/api/categories", requireAdmin, async (req, res) => {
    const result = insertCategorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid category data" });
    }
    const category = await storage.createCategory(result.data);
    res.json(category);
  });

  // Public routes
  app.get("/api/posts", async (req, res) => {
    const { category, tag, limit, offset } = req.query;
    const posts = await storage.listPosts({
      category: category as string,
      tag: tag as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });
    res.json(posts);
  });

  app.get("/api/posts/:slug", async (req, res) => {
    const post = await storage.getPostBySlug(req.params.slug);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  });

  app.get("/api/categories", async (_req, res) => {
    const categories = await storage.listCategories();
    res.json(categories);
  });

  app.get("/api/categories/:slug", async (req, res) => {
    const category = await storage.getCategoryBySlug(req.params.slug);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  });

  app.get("/api/search", async (req, res) => {
    const query = req.query.q as string;
    if (!query) return res.status(400).json({ message: "Query parameter required" });
    const results = await storage.searchPosts(query);
    res.json(results);
  });

  // Notes API (Retained from original code)
  app.get("/api/notes/:id", async (req, res) => {
    const note = await storage.getNote(parseInt(req.params.id));
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  });

  app.post("/api/notes", async (req, res) => {
    const result = insertNoteSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid note data" });
    }
    const note = await storage.createNote(result.data);
    res.json(note);
  });

  app.patch("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertNoteSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid note data" });
    }
    try {
      const note = await storage.updateNote(id, result.data);
      res.json(note);
    } catch (err) {
      res.status(404).json({ message: "Note not found" });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    await storage.deleteNote(parseInt(req.params.id));
    res.status(204).end();
  });


  // Templates API (Retained from original code)
  app.get("/api/templates/:type", async (req, res) => {
    const template = await storage.getTemplateByType(req.params.type);
    if (!template) return res.status(404).json({ message: "Template not found" });
    res.json(template);
  });

  app.post("/api/templates", async (req, res) => {
    const result = insertTemplateSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid template data" });
    }
    const template = await storage.createTemplate(result.data);
    res.json(template);
  });

  // Folder structure API (Retained from original code)
  app.get("/api/folders", async (_req, res) => {
    const structure = await storage.getFolderStructure();
    res.json(structure);
  });

  const httpServer = createServer(app);
  return httpServer;
}