export interface Invitation {
  id: string;
  taskId: string;
  inviterId: string;
  inviteeEmail: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  token?: string;
}

export interface CreateInviteRequest {
  email: string;
}