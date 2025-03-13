import { 
  Note, InsertNote, Template, InsertTemplate, Folder,
  Post, InsertPost, Category, InsertCategory,
  Admin, InsertAdmin
} from "@shared/schema";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Admin
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  validateAdminCredentials(username: string, password: string): Promise<boolean>;

  // Notes
  getNote(id: number): Promise<Note | undefined>;
  getNoteByPath(path: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note>;
  deleteNote(id: number): Promise<void>;
  
  // Templates
  getTemplate(id: number): Promise<Template | undefined>;
  getTemplateByType(type: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Folders
  getFolderStructure(): Promise<Folder>;
  searchNotes(query: string): Promise<Note[]>;

  // Posts
  getPost(id: number): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post>;
  deletePost(id: number): Promise<void>;
  listPosts(options?: { 
    category?: string;
    tag?: string;
    limit?: number;
    offset?: number;
  }): Promise<Post[]>;

  // Categories
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  listCategories(): Promise<Category[]>;

  // Search
  searchPosts(query: string): Promise<Post[]>;
}

export class MemStorage implements IStorage {
  private admins: Map<number, Admin>;
  private currentAdminId: number;
  private notes: Map<number, Note>;
  private templates: Map<number, Template>;
  private currentNoteId: number;
  private currentTemplateId: number;
  private posts: Map<number, Post>;
  private categories: Map<number, Category>;
  private currentPostId: number;
  private currentCategoryId: number;

  constructor() {
    this.admins = new Map();
    this.currentAdminId = 1;
    this.notes = new Map();
    this.templates = new Map();
    this.currentNoteId = 1;
    this.currentTemplateId = 1;
    this.posts = new Map();
    this.categories = new Map();
    this.currentPostId = 1;
    this.currentCategoryId = 1;

    // Create default admin account
    this.createAdmin({
      username: "admin",
      password: bcrypt.hashSync("admin", 10)
    });

    // Initialize default templates
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

    // Initialize default categories
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

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(
      (admin) => admin.username === username
    );
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = this.currentAdminId++;
    const admin: Admin = { ...insertAdmin, id };
    this.admins.set(id, admin);
    return admin;
  }

  async validateAdminCredentials(username: string, password: string): Promise<boolean> {
    const admin = await this.getAdminByUsername(username);
    if (!admin) return false;
    return bcrypt.compareSync(password, admin.password);
  }

  async getNote(id: number): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async getNoteByPath(path: string): Promise<Note | undefined> {
    return Array.from(this.notes.values()).find(note => note.path === path);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = this.currentNoteId++;
    const note: Note = {
      ...insertNote,
      id,
      tags: insertNote.tags || null,
      metadata: insertNote.metadata || null,
      linkedNotes: insertNote.linkedNotes || null,
      createdAt: new Date()
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: number, update: Partial<InsertNote>): Promise<Note> {
    const existing = await this.getNote(id);
    if (!existing) throw new Error("Note not found");
    
    const updated: Note = {
      ...existing,
      ...update,
    };
    this.notes.set(id, updated);
    return updated;
  }

  async deleteNote(id: number): Promise<void> {
    this.notes.delete(id);
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getTemplateByType(type: string): Promise<Template | undefined> {
    return Array.from(this.templates.values()).find(t => t.type === type);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.currentTemplateId++;
    const template: Template = { ...insertTemplate, id };
    this.templates.set(id, template);
    return template;
  }

  async getFolderStructure(): Promise<Folder> {
    const root: Folder = { name: "root", path: "/", children: [] };
    
    const notes = Array.from(this.notes.values());
    notes.forEach(note => {
      const parts = note.path.split('/').filter(Boolean);
      let current = root;
      parts.slice(0, -1).forEach(part => {
        let folder = current.children.find(
          child => 'path' in child && child.path === `${current.path}${part}/`
        ) as Folder | undefined;
        
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

  async searchNotes(query: string): Promise<Note[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.notes.values()).filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    return Array.from(this.posts.values()).find(post => post.slug === slug);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const now = new Date();
    const post: Post = {
      ...insertPost,
      id,
      publishedAt: now,
      updatedAt: now,
      tags: insertPost.tags || null,
      metadata: insertPost.metadata || null,
      excerpt: insertPost.excerpt || null
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, update: Partial<InsertPost>): Promise<Post> {
    const existing = await this.getPost(id);
    if (!existing) throw new Error("Post not found");

    const updated: Post = {
      ...existing,
      ...update,
      updatedAt: new Date()
    };
    this.posts.set(id, updated);
    return updated;
  }

  async deletePost(id: number): Promise<void> {
    this.posts.delete(id);
  }

  async listPosts(options: {
    category?: string;
    tag?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<Post[]> {
    let posts = Array.from(this.posts.values());

    if (options.category) {
      posts = posts.filter(post => post.category === options.category);
    }

    if (options.tag) {
      posts = posts.filter(post => post.tags?.includes(options.tag as string));
    }

    posts.sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));

    const offset = options.offset || 0;
    const limit = options.limit || posts.length;

    return posts.slice(offset, offset + limit);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { 
      ...insertCategory, 
      id,
      description: insertCategory.description ?? null 
    };
    this.categories.set(id, category);
    return category;
  }

  async listCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async searchPosts(query: string): Promise<Post[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.posts.values())
      .filter(post => 
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery) ||
        post.excerpt?.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));
  }
}

export const storage = new MemStorage();