// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import bcrypt from "bcryptjs";
var MemStorage = class {
  admins;
  currentAdminId;
  notes;
  templates;
  currentNoteId;
  currentTemplateId;
  posts;
  categories;
  currentPostId;
  currentCategoryId;
  constructor() {
    this.admins = /* @__PURE__ */ new Map();
    this.currentAdminId = 1;
    this.notes = /* @__PURE__ */ new Map();
    this.templates = /* @__PURE__ */ new Map();
    this.currentNoteId = 1;
    this.currentTemplateId = 1;
    this.posts = /* @__PURE__ */ new Map();
    this.categories = /* @__PURE__ */ new Map();
    this.currentPostId = 1;
    this.currentCategoryId = 1;
    this.createAdmin({
      username: "admin",
      password: bcrypt.hashSync("admin", 10)
    });
    this.createTemplate({
      name: "Gratitude Template",
      content: "# Daily Gratitude\n\n1. \n2. \n3. ",
      type: "gratitude"
    });
    this.createTemplate({
      name: "Recall Template",
      content: "# Daily Recall\n\n## Key Insights\n\n## Action Items\n\n## Questions",
      type: "recall"
    });
    this.createCategory({
      name: "Python Basics",
      slug: "python-basics",
      description: "Fundamental concepts in Python programming"
    });
    this.createCategory({
      name: "Advanced Python",
      slug: "advanced-python",
      description: "Advanced topics and techniques in Python"
    });
  }
  async getAdminByUsername(username) {
    return Array.from(this.admins.values()).find(
      (admin) => admin.username === username
    );
  }
  async createAdmin(insertAdmin) {
    const id = this.currentAdminId++;
    const admin = { ...insertAdmin, id };
    this.admins.set(id, admin);
    return admin;
  }
  async validateAdminCredentials(username, password) {
    const admin = await this.getAdminByUsername(username);
    if (!admin) return false;
    return bcrypt.compareSync(password, admin.password);
  }
  async getNote(id) {
    return this.notes.get(id);
  }
  async getNoteByPath(path3) {
    return Array.from(this.notes.values()).find((note) => note.path === path3);
  }
  async createNote(insertNote) {
    const id = this.currentNoteId++;
    const note = {
      ...insertNote,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.notes.set(id, note);
    return note;
  }
  async updateNote(id, update) {
    const existing = await this.getNote(id);
    if (!existing) throw new Error("Note not found");
    const updated = {
      ...existing,
      ...update
    };
    this.notes.set(id, updated);
    return updated;
  }
  async deleteNote(id) {
    this.notes.delete(id);
  }
  async getTemplate(id) {
    return this.templates.get(id);
  }
  async getTemplateByType(type) {
    return Array.from(this.templates.values()).find((t) => t.type === type);
  }
  async createTemplate(insertTemplate) {
    const id = this.currentTemplateId++;
    const template = { ...insertTemplate, id };
    this.templates.set(id, template);
    return template;
  }
  async getFolderStructure() {
    const root = { name: "root", path: "/", children: [] };
    const notes2 = Array.from(this.notes.values());
    notes2.forEach((note) => {
      const parts = note.path.split("/").filter(Boolean);
      let current = root;
      parts.slice(0, -1).forEach((part) => {
        let folder = current.children.find(
          (child) => "path" in child && child.path === `${current.path}${part}/`
        );
        if (!folder) {
          folder = {
            name: part,
            path: `${current.path}${part}/`,
            children: []
          };
          current.children.push(folder);
        }
        current = folder;
      });
      current.children.push(note);
    });
    return root;
  }
  async searchNotes(query) {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.notes.values()).filter(
      (note) => note.title.toLowerCase().includes(lowercaseQuery) || note.content.toLowerCase().includes(lowercaseQuery)
    );
  }
  async getPost(id) {
    return this.posts.get(id);
  }
  async getPostBySlug(slug) {
    return Array.from(this.posts.values()).find((post) => post.slug === slug);
  }
  async createPost(insertPost) {
    const id = this.currentPostId++;
    const now = /* @__PURE__ */ new Date();
    const post = {
      ...insertPost,
      id,
      publishedAt: now,
      updatedAt: now
    };
    this.posts.set(id, post);
    return post;
  }
  async updatePost(id, update) {
    const existing = await this.getPost(id);
    if (!existing) throw new Error("Post not found");
    const updated = {
      ...existing,
      ...update,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.posts.set(id, updated);
    return updated;
  }
  async deletePost(id) {
    this.posts.delete(id);
  }
  async listPosts(options = {}) {
    let posts2 = Array.from(this.posts.values());
    if (options.category) {
      posts2 = posts2.filter((post) => post.category === options.category);
    }
    if (options.tag) {
      posts2 = posts2.filter((post) => post.tags.includes(options.tag));
    }
    posts2.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    const offset = options.offset || 0;
    const limit = options.limit || posts2.length;
    return posts2.slice(offset, offset + limit);
  }
  async getCategory(id) {
    return this.categories.get(id);
  }
  async getCategoryBySlug(slug) {
    return Array.from(this.categories.values()).find((cat) => cat.slug === slug);
  }
  async createCategory(insertCategory) {
    const id = this.currentCategoryId++;
    const category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  async listCategories() {
    return Array.from(this.categories.values());
  }
  async searchPosts(query) {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.posts.values()).filter(
      (post) => post.title.toLowerCase().includes(lowercaseQuery) || post.content.toLowerCase().includes(lowercaseQuery) || post.excerpt?.toLowerCase().includes(lowercaseQuery)
    ).sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertAdminSchema = createInsertSchema(admins).pick({
  username: true,
  password: true
});
var notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  path: text("path").notNull(),
  // Full path including folders
  tags: text("tags").array().default([]),
  metadata: jsonb("metadata").$type().default({}),
  linkedNotes: text("linked_notes").array().default([]),
  createdAt: timestamp("created_at").defaultNow()
});
var templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull()
  // 'gratitude' or 'recall'
});
var insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true
});
var insertTemplateSchema = createInsertSchema(templates).omit({
  id: true
});
var posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull(),
  excerpt: text("excerpt"),
  category: text("category").notNull(),
  tags: text("tags").array().default([]),
  metadata: jsonb("metadata").$type().default({}),
  publishedAt: timestamp("published_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description")
});
var insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  publishedAt: true,
  updatedAt: true
});
var insertCategorySchema = createInsertSchema(categories).omit({
  id: true
});

// server/auth.ts
var ADMIN_TOKEN = "cerebral-titan-admin-token-2024";
var requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
var handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  const isValid = await storage.validateAdminCredentials(username, password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  res.json({ token: ADMIN_TOKEN });
};
var handleLogout = (_req, res) => {
  res.json({ message: "Logged out successfully" });
};

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/auth/login", handleLogin);
  app2.post("/api/auth/logout", handleLogout);
  app2.post("/api/posts", requireAdmin, async (req, res) => {
    const result = insertPostSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid post data" });
    }
    const post = await storage.createPost(result.data);
    res.json(post);
  });
  app2.patch("/api/posts/:id", requireAdmin, async (req, res) => {
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
  app2.delete("/api/posts/:id", requireAdmin, async (req, res) => {
    await storage.deletePost(parseInt(req.params.id));
    res.status(204).end();
  });
  app2.post("/api/categories", requireAdmin, async (req, res) => {
    const result = insertCategorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid category data" });
    }
    const category = await storage.createCategory(result.data);
    res.json(category);
  });
  app2.get("/api/posts", async (req, res) => {
    const { category, tag, limit, offset } = req.query;
    const posts2 = await storage.listPosts({
      category,
      tag,
      limit: limit ? parseInt(limit) : void 0,
      offset: offset ? parseInt(offset) : void 0
    });
    res.json(posts2);
  });
  app2.get("/api/posts/:slug", async (req, res) => {
    const post = await storage.getPostBySlug(req.params.slug);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  });
  app2.get("/api/categories", async (_req, res) => {
    const categories2 = await storage.listCategories();
    res.json(categories2);
  });
  app2.get("/api/categories/:slug", async (req, res) => {
    const category = await storage.getCategoryBySlug(req.params.slug);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  });
  app2.get("/api/search", async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: "Query parameter required" });
    const results = await storage.searchPosts(query);
    res.json(results);
  });
  app2.get("/api/notes/:id", async (req, res) => {
    const note = await storage.getNote(parseInt(req.params.id));
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  });
  app2.post("/api/notes", async (req, res) => {
    const result = insertNoteSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid note data" });
    }
    const note = await storage.createNote(result.data);
    res.json(note);
  });
  app2.patch("/api/notes/:id", async (req, res) => {
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
  app2.delete("/api/notes/:id", async (req, res) => {
    await storage.deleteNote(parseInt(req.params.id));
    res.status(204).end();
  });
  app2.get("/api/templates/:type", async (req, res) => {
    const template = await storage.getTemplateByType(req.params.type);
    if (!template) return res.status(404).json({ message: "Template not found" });
    res.json(template);
  });
  app2.post("/api/templates", async (req, res) => {
    const result = insertTemplateSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid template data" });
    }
    const template = await storage.createTemplate(result.data);
    res.json(template);
  });
  app2.get("/api/folders", async (_req, res) => {
    const structure = await storage.getFolderStructure();
    res.json(structure);
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
