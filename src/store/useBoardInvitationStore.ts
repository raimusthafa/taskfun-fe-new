import { create } from 'zustand';
import api from '../lib/api';
import type { BoardInvitation, SendBoardInvitationData } from '@/types/board';

interface BoardInvitationState {
  invitations: BoardInvitation[];
  loading: boolean;
  error: string | null;
  sendInvitation: (boardId: number, data: SendBoardInvitationData) => Promise<BoardInvitation>;
  fetchInvitations: (status?: string) => Promise<void>;
  acceptInvitation: (invitationId: number) => Promise<void>;
  declineInvitation: (invitationId: number) => Promise<void>;
  cancelInvitation: (invitationId: number) => Promise<void>;
  getPendingCount: () => number;
}

export const useBoardInvitationStore = create<BoardInvitationState>((set, get) => ({
  invitations: [],
  loading: false,
  error: null,

  sendInvitation: async (boardId: number, data: SendBoardInvitationData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/boards/${boardId}/invite`, data);
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false });
      throw error;
    }
  },

  fetchInvitations: async (status?: string) => {
    set({ loading: true, error: null });
    try {
      const url = status ? `/board-invitations?status=${status}` : '/board-invitations';
      const response = await api.get(url);
      set({ invitations: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false });
    }
  },

  acceptInvitation: async (invitationId: number) => {
    set({ loading: true, error: null });
    try {
      await api.post(`/board-invitations/${invitationId}/accept`);
      set((state) => ({
        invitations: state.invitations.filter((inv) => inv.id_boardinvitation !== invitationId),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false });
      throw error;
    }
  },

  declineInvitation: async (invitationId: number) => {
    set({ loading: true, error: null });
    try {
      await api.post(`/board-invitations/${invitationId}/decline`);
      set((state) => ({
        invitations: state.invitations.filter((inv) => inv.id_boardinvitation !== invitationId),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false });
      throw error;
    }
  },

  cancelInvitation: async (invitationId: number) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/board-invitations/${invitationId}`);
      set((state) => ({
        invitations: state.invitations.filter((inv) => inv.id_boardinvitation !== invitationId),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false });
      throw error;
    }
  },

  getPendingCount: () => {
    const state = get();
    return state.invitations.filter((inv) => inv.status === 'pending').length;
  },
}));
