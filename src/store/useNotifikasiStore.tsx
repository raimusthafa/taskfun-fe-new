import { create } from 'zustand';
import api from '../lib/api';
import type { Invitation } from '../types/invitation';

interface NotifikasiStore {
  invites: Invitation[];
  loading: boolean;
  error: string | null;
  // Actions
  listInvitesUser: () => Promise<void>;
}

const useNotifikasiStore = create<NotifikasiStore>((set) => ({
  invites: [],
  loading: false,
  error: null,

  listInvitesUser: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`/tasks/invites/user`);
      set({ invites: response.data });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal memuat daftar undangan';
      set({ error: errorMessage });
      throw errorMessage;
    } finally {
      set({ loading: false });
    }
  },

}));

export default useNotifikasiStore;