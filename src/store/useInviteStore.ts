import { create } from 'zustand';
import api from '../lib/api';
import type { Invitation, CreateInviteRequest } from '../types/invitation';

interface InviteStore {
  invites: Invitation[];
  loading: boolean;
  error: string | null;
  // Actions
  createInvite: (taskId: string, data: CreateInviteRequest) => Promise<void>;
  listInvites: (taskId: string) => Promise<void>;
  acceptInvite: (taskId: string, inviteId: string) => Promise<void>;
  rejectInvite: (taskId: string, inviteId: string) => Promise<void>;
  acceptInviteByToken: (token: string) => Promise<void>;
}

const useInviteStore = create<InviteStore>((set) => ({
  invites: [],
  loading: false,
  error: null,

  createInvite: async (taskId: string, data: CreateInviteRequest) => {
    try {
      set({ loading: true, error: null });
      await api.post(`/tasks/${taskId}/invites`, data);
      // Refresh the invites list after creating a new invite
      const response = await api.get(`/tasks/${taskId}/invites`);
      set({ invites: response.data });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal mengirim undangan';
      set({ error: errorMessage });
      throw errorMessage;
    } finally {
      set({ loading: false });
    }
  },

  listInvites: async (taskId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`/tasks/${taskId}/invites`);
      set({ invites: response.data });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal memuat daftar undangan';
      set({ error: errorMessage });
      throw errorMessage;
    } finally {
      set({ loading: false });
    }
  },

  acceptInvite: async (taskId: string, inviteId: string) => {
    try {
      set({ loading: true, error: null });
      await api.post(`/tasks/${taskId}/invites/${inviteId}/accept`);
      // Update the local state to reflect the acceptance
      set((state) => ({
        invites: state.invites.map((invite) =>
          invite.id === inviteId
            ? { ...invite, status: 'accepted' }
            : invite
        ),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal menerima undangan';
      set({ error: errorMessage });
      throw errorMessage;
    } finally {
      set({ loading: false });
    }
  },

  rejectInvite: async (taskId: string, inviteId: string) => {
    try {
      set({ loading: true, error: null });
      await api.post(`/tasks/${taskId}/invites/${inviteId}/reject`);
      // Update the local state to reflect the rejection
      set((state) => ({
        invites: state.invites.map((invite) =>
          invite.id === inviteId
            ? { ...invite, status: 'rejected' }
            : invite
        ),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal menolak undangan';
      set({ error: errorMessage });
      throw errorMessage;
    } finally {
      set({ loading: false });
    }
  },

  acceptInviteByToken: async (token: string) => {
    try {
      set({ loading: true, error: null });
      await api.post(`/invite/accept?token=${token}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal menerima undangan dengan token';
      set({ error: errorMessage });
      throw errorMessage;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useInviteStore;