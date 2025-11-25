import { create } from 'zustand';
import api from '../lib/api';

interface Category {
  id_category: number;
  category: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  success: string | null;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (category: string) => Promise<void>;
  updateCategory: (id: number, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  setError: (msg: string | null) => void;
  setSuccess: (msg: string | null) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  success: null,
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
      console.log('POST /categories payload:', { category });
      const response = await api.post('/categories', { category });
      set((state) => ({
        categories: [...state.categories, response.data.category],
        loading: false,
        success: response.data.message || "Category created successfully",
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },


  
  updateCategory: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/categories/${id}`, updates);
      set((state) => ({
        categories: state.categories.map((cat) => (cat.id_category === id ? response.data : cat)),
        loading: false,
        success: response.data.message || "Category edited successfully",
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id_category !== id),
        loading: false,
        success: "Category deleted successfully",
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },
  setError: (msg) => set({ error: msg }),
  setSuccess: (msg) => set({ success: msg }),
}));
