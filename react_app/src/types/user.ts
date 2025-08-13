export interface IUser {
  id: string;
  name: string;
  email: string;
  fullName: string;
  roles: string[];  // 'User' | 'Admin' | 'Moderator'
  avatar?: string;
}

export interface UserProfile {
id: number;
email: string;
username: string;
firstName?: string;
lastName?: string;
avatarUrl?: string;
}

export interface IUserAuth {
  isAdmin: boolean;
  isUser: boolean;
  isAuth: boolean;
  roles: string[];
}

export interface IUserState {
  user: IUser | null;
  token: string | null;
  auth: IUserAuth;
}

export interface IUserDTO {
  id: number;
  email: string;
  fullName: string;
  imageUrl?: string;
  roles: string[];
}

export interface IUserCreateDTO {
  email: string;
  password: string;
  fullName: string;
}
