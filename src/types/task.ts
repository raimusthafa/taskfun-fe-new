export interface Task {
  id: string;
  tugas: string;
  deskripsi: string;
  prioritas: 'high' | 'medium' | 'low';
  tenggat: string;
  id_user: number;
  id_category: number;
  status: 'todo' | 'in_progress' | 'done';
}

import type { Dayjs } from 'dayjs';

export interface TaskFormData extends Omit<Task, 'id' | 'id_user' | 'id_category' | 'tenggat'> {
  id?: string;
  tenggat: Dayjs;
}

export interface TaskModalFormValues {
  tugas: string;
  deskripsi: string;
  status: 'todo' | 'in_progress' | 'done';
  prioritas: 'low' | 'medium' | 'high';
  tenggat: Dayjs;
  kategori: string;
}

export interface TaskCreateData extends Omit<Task, 'id'> {
  kategori?: string;
}

export interface TaskStats {
  done: number;
  in_progress: number;
  todo: number;
  total: number;
}

// Helper types
export type Priority = Task['prioritas'];
export type Status = Task['status'];

// Utility type untuk form update
export type TaskUpdateData = Partial<Task>;