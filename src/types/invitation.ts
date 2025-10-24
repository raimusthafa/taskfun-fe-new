import type { Task } from './task';

export interface Invitation {
  id: string;
  taskId: string;
  inviterId: string;
  invitee_email: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  token?: string;
  task: Task;
  inviter: {
    username: string;
  };
}

export interface CreateInviteRequest {
  invitee_email?: string;
  user_id?: number;
}