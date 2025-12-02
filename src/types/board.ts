export interface Board {
  id_board: number;
  title: string;
  description: string;
  id_user: number;
  visibility: 'public' | 'private';
  created_at: string;
}

export interface BoardMember {
  id_boardmember: number;
  id_board: number;
  id_user: number;
  role: 'admin' | 'member';
  created_at: string;
  user?: {
    id: number;
    username: string;
    fullname: string;
    email: string;
  };
}

export interface BoardWithDetails {
  board: Board;
  members: BoardMember[];
  tasks: any[];
}

export interface CreateBoardData {
  title: string;
  description: string;
  visibility: 'public' | 'private';
}

export interface UpdateBoardData {
  title?: string;
  description?: string;
  visibility?: 'public' | 'private';
}

export interface AddMemberData {
  id_user: number;
  role: 'admin' | 'member';
}

export interface UpdateMemberRoleData {
  role: 'admin' | 'member';
}

export interface BoardInvitation {
  id_boardinvitation: number;
  id_board: number;
  inviter_id: number;
  invitee_id?: number;
  invitee_email: string;
  role: 'admin' | 'member';
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
  board?: Board & {
    user?: {
      id: number;
      username: string;
      fullname: string;
    };
  };
  inviter?: {
    id: number;
    username: string;
    fullname: string;
    email: string;
  };
  invitee?: {
    id: number;
    username: string;
    fullname: string;
    email: string;
  };
}

export interface SendBoardInvitationData {
  invitee_id?: number;
  invitee_email?: string;
  role: 'admin' | 'member';
}
