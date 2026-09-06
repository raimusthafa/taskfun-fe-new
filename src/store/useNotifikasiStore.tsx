import { create } from 'zustand';
import api from '../lib/api';
import type { Invitation } from '../types/invitation';

interface NotifikasiStore {
  invites: Invitation[];
  loading: boolean;
  error: string | null;
  // Actions
  listInvitesUser: () => Promise<void>;
  acceptInvite: (taskId: string | number, inviteId: string | number) => Promise<void>;
  rejectInvite: (taskId: string | number, inviteId: string | number) => Promise<void>;
}

const useNotifikasiStore = create<NotifikasiStore>((set, get) => ({
  invites: [],
  loading: false,
  error: null,

  listInvitesUser: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`/tasks/invites/user`);
      set({ invites: response.data });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Gagal memuat daftar undangan';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  acceptInvite: async (taskId: string | number, inviteId: string | number) => {
    try {
      set({ loading: true, error: null });
      await api.post(`/tasks/${taskId}/invites/${inviteId}/accept`);
      // Update state lokal seketika agar badge & UI langsung berubah
      set((state) => ({
        invites: state.invites.map((inv) =>
          String(inv.id) === String(inviteId)
            ? { ...inv, status: 'accepted' as const }
            : inv
        ),
      }));
      // Sinkronisasi data server di background
      get().listInvitesUser();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Gagal menerima undangan';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  rejectInvite: async (taskId: string | number, inviteId: string | number) => {
    try {
      set({ loading: true, error: null });
      await api.post(`/tasks/${taskId}/invites/${inviteId}/reject`);
      // Update state lokal seketika agar badge & UI langsung berubah
      set((state) => ({
        invites: state.invites.map((inv) =>
          String(inv.id) === String(inviteId)
            ? { ...inv, status: 'rejected' as const }
            : inv
        ),
      }));
      // Sinkronisasi data server di background
      get().listInvitesUser();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Gagal menolak undangan';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useNotifikasiStore;