import { create } from 'zustand';
import api from '../lib/api';
import type { Board, BoardWithDetails, CreateBoardData, UpdateBoardData, AddMemberData, UpdateMemberRoleData, BoardMember } from '@/types/board';

interface BoardState {
  boards: Board[];
  currentBoard: BoardWithDetails | null;
  loading: boolean;
  error: string | null;
  fetchBoards: () => Promise<void>;
  fetchBoardById: (id: number) => Promise<void>;
  createBoard: (data: CreateBoardData) => Promise<Board>;
  updateBoard: (id: number, data: UpdateBoardData) => Promise<void>;
  deleteBoard: (id: number) => Promise<void>;
  addMember: (boardId: number, data: AddMemberData) => Promise<void>;
  updateMemberRole: (boardId: number, memberId: number, data: UpdateMemberRoleData) => Promise<void>;
  removeMember: (boardId: number, memberId: number) => Promise<void>;
  getBoardMembers: (boardId: number) => Promise<BoardMember[]>;
  clearCurrentBoard: () => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,

  fetchBoards: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/boards');
      set({ boards: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false });
    }
  },

  fetchBoardById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/boards/${id}`);
      set({ currentBoard: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false });
    }
  },

  createBoard: async (data: CreateBoardData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/boards', data);
      set((state) => ({
        boards: [...state.boards, response.data.board],
        loading: false,
      }));
      return response.data.board;
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false });
      throw error;
    }
  },

  updateBoard: async (id: number, data: UpdateBoardData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/boards/${id}`, data);
      set((state) => ({
        boards: state.boards.map((board) =>
          board.id_board === id ? response.data.board : board
        ),
        currentBoard: state.currentBoard && state.currentBoard.board.id_board === id
          ? { ...state.currentBoard, board: response.data.board }
          : state.currentBoard,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false });
      throw error;
    }
  },

  deleteBoard: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/boards/${id}`);
      set((state) => ({
        boards: state.boards.filter((board) => board.id_board !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false });
      throw error;
    }
  },

  addMember: async (boardId: number, data: AddMemberData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/boards/${boardId}/members`, data);
      set((state) => ({
        currentBoard: state.currentBoard && state.currentBoard.board.id_board === boardId
          ? {
              ...state.currentBoard,
              members: [...state.currentBoard.members, response.data.member],
            }
          : state.currentBoard,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false });
      throw error;
    }
  },

  updateMemberRole: async (boardId: number, memberId: number, data: UpdateMemberRoleData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/boards/${boardId}/members/${memberId}`, data);
      set((state) => ({
        currentBoard: state.currentBoard && state.currentBoard.board.id_board === boardId
          ? {
              ...state.currentBoard,
              members: state.currentBoard.members.map((member) =>
                member.id_boardmember === memberId ? response.data.member : member
              ),
            }
          : state.currentBoard,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false });
      throw error;
    }
  },

  removeMember: async (boardId: number, memberId: number) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/boards/${boardId}/members/${memberId}`);
      set((state) => ({
        currentBoard: state.currentBoard && state.currentBoard.board.id_board === boardId
          ? {
              ...state.currentBoard,
              members: state.currentBoard.members.filter(
                (member) => member.id_boardmember !== memberId
              ),
            }
          : state.currentBoard,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false });
      throw error;
    }
  },

  getBoardMembers: async (boardId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/boards/${boardId}/members`);
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      set({ error: error.response?.data?.error || error.message, loading: false });
      throw error;
    }
  },

  clearCurrentBoard: () => {
    set({ currentBoard: null });
  },
}));
