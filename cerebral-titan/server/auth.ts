import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// This is a temporary token for development. In production, use environment variables
export const ADMIN_TOKEN = "cerebral-titan-admin-token-2024";

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export const handleLogin = async (req: Request, res: Response) => {
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

export const handleLogout = (_req: Request, res: Response) => {
  res.json({ message: "Logged out successfully" });
};