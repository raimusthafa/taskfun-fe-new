import { create } from 'zustand';
import api from '../lib/api';
import type { UpdateUser } from '@/types/user';

interface User {
  id: number;
  id_user?: string;
  username: string;
  fullname: string;
  email: string;
  profilepic: string;
}

interface UserState {
  user: User | null;
  users: User[];
  token: string | null;
  loading: boolean;
  error: string | null;
  register: (username: string, fullname: string, email: string, password: string) => Promise<{ message?: string; [key: string]: unknown }>;
  login: (identifier: string, password: string) => Promise<{ user?: User; token?: string; message?: string; [key: string]: unknown }>;
  logout: () => void;
  getProfile: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  updateUser: (id: string, updates: Partial<UpdateUser>) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  users: [],
  token: localStorage.getItem('token'),
  loading: false,
  error: null,

  register: async (username, fullname, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/register', {
        username,
        fullname,
        email,
        password,
      });

      set({ loading: false });
      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
      set({
        loading: false,
        error: errorMsg,
      });
      throw error;
    }
  },

  login: async (identifier, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/login', { identifier, password });
      set({ user: response.data.user, token: response.data.token, loading: false });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('token');
  },

  getProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/me');
      set({ user: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false });
    }
  },

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/users');
      set({ users: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false });
    }
  },

  updateUser: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const response = await api.put(`/users/${id}`, formData);
      
      set({
        user: response.data,
        loading: false,
      });
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || "Gagal update user";
      set({
        loading: false,
        error: errorMsg,
      });
      throw error;
    }
  },
}));
