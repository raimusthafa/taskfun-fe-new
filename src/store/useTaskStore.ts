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

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (taskData: Omit<Task, 'id' >) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
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
    console.log('📤 Data yang dikirim ke API:', taskData); // log data sebelum dikirim

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
}));
