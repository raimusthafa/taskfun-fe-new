import { create } from 'zustand';
import api from '../lib/api';

interface Category {
  id_category: number;
  category: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (category: string) => Promise<void>;
  updateCategory: (id: number, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/categories'); 
      set({ categories: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  createCategory: async (category) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/categories', { category });
      set((state) => ({
        categories: [...state.categories, response.data.category],
        loading: false,
      }));
      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      set({
        error: errorMsg,
        loading: false,
      });
      throw error;
    }
  },

  updateCategory: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/categories/${id}`, updates);
      set((state) => ({
        categories: state.categories.map((cat) => (cat.id_category === id ? response.data : cat)),
        loading: false,
      }));
      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id_category !== id),
        loading: false,
      }));
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },
}));
