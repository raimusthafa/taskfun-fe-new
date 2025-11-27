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
