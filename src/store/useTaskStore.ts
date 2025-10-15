import { create } from 'zustand';
import api from '../lib/api';

interface Task {
  id: string;
  tugas: string;
  deskripsi: string;
  prioritas: string;
  tenggat: string;
  id_user: number;
  id_category: number;
  status: string;
}

interface Stats {
  done: number;
  in_progress: number;
  todo: number;
  total: number;
}

interface TaskState {
  tasks: Task[];
  highTasks: Task[];
  stats: Stats;
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  statsTask: () => Promise<void>;
  createTask: (taskData: Omit<Task, 'id' >) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  taskHigh: () => Promise<void>;
  getTaskById: (id: string) => Promise<Task | null>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  highTasks: [],
  stats: { done: 0, in_progress: 0, todo: 0, total: 0 },
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/tasks');
      set({ tasks: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

createTask: async (taskData) => {
  set({ loading: true, error: null });

  try {
    // log data sebelum dikirim
    // console.log('📤 Data yang dikirim ke API:', taskData); 

    const response = await api.post('/tasks', taskData);

    set((state) => ({
      tasks: [...state.tasks, response.data],
      loading: false
    }));
  } catch (error: any) {
    set({
      error: error.response?.data?.message || error.message,
      loading: false
    });
  }
},


  updateTask: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/tasks/${id}`, updates);
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? response.data : task)),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  statsTask: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/tasks/counts`);
      set({ stats: response.data, loading: false  });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  taskHigh: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/tasks/high`);
      set({ highTasks: response.data, loading: false  });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  getTaskById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/tasks/${id}`);
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Gagal mengambil detail tugas';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching task:', error);
      return null;
    }
  }
}));
