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
fullName: string;
firstName?: string;
lastName?: string;
// avatarUrl?: string;
profilePictureUrl?: string;
subscriptionType: string;
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
  refreshToken?: string | null;
  isLoggingOut?: boolean;
}

export interface IUserDTO {
  id: number;
  email: string;
  fullName: string;
  profilePictureUrl?: string;
  roles: string[];
}

export interface IUserCreateDTO {
  email: string;
  password: string;
  fullName: string;
}
