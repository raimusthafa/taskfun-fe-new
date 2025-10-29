export interface UpdateUser {
  id_user: string;
  username: string;
  fullname: string;
  email: string;
  profilepic: string | File;
  password: string;
}