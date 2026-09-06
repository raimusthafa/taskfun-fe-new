import type { Task } from './task';

export interface Invitation {
  id: string | number;
  taskId?: string | number;
  task_id?: string | number;
  inviterId?: string | number;
  inviter_id?: string | number;
  invitee_email?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt?: string;
  created_at?: string;
  token?: string;
  task: Task;
  inviter: {
    id?: number;
    username: string;
    fullname?: string;
    email?: string;
  };
}

export interface CreateInviteRequest {
  invitee_email?: string;
  user_id?: number;
}