import { create } from 'zustand';
import api from '../lib/api';
import type { UpdateUser } from '@/types/user';

interface User {
  id_user: string;
  username: string;
  fullname: string;
  email: string;
  profilepic: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  register: (username: string, fullname: string, email: string, password: string) => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
  updateUser: (id: string, updates: Partial<UpdateUser>) => Promise<void>;
  setError: (msg: string | null) => void;        // ✅ Tambahkan ini
  setSuccess: (msg: string | null) => void;      // ✅ Tambahkan ini
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
  success: null,

register: async (username, fullname, email, password) => {
  set({ loading: true, error: null, success: null });
  try {
    const response = await api.post('/register', {
      username,
      fullname,
      email,
      password,
    });

    // ✅ Jangan set user/token karena backend tidak kirim itu saat register
    set({
      loading: false,
      success: response.data.message || "Yeay! Registrasi berhasil 🎉",
    });
  } catch (error: any) {
    set({
      loading: false,
      error: error.response?.data?.error || error.message,
      success: null,
    });
  }
},


  login: async (identifier, password) => {
    set({ loading: true, error: null, success: null });
    try {
      const response = await api.post('/login', { identifier, password });
      set({ user: response.data.user, token: response.data.token, loading: false, success: response.data.message || "Login successful" });
      localStorage.setItem('token', response.data.token);
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false, success: null });
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

    updateUser: async (id, updates) => {
    set({ loading: true, error: null, success: null });
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
        success: response.data.message || "User updated successfully",
      });
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || "Gagal update user";
      set({
        loading: false,
        success: null,
        error: errorMsg,
      });
      throw error;
    }
  },


    setError: (msg) => set({ error: msg }),
  setSuccess: (msg) => set({ success: msg }),
}));
