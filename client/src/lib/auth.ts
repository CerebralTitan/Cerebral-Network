import { create } from 'zustand';
import { apiRequest } from './queryClient';

interface AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: async (username: string, password: string) => {
    await apiRequest('POST', '/api/auth/login', { username, password });
    set({ isAuthenticated: true });
  },
  logout: async () => {
    await apiRequest('POST', '/api/auth/logout');
    set({ isAuthenticated: false });
  },
}));
