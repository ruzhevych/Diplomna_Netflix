export interface IUser {
  id: string;
  name: string;
  email: string;
  fullName: string;
  roles: string[];  
  avatar?: string;
}

export interface UserProfile {
id: number;
email: string;
fullName: string;
firstName?: string;
lastName?: string;
profilePictureUrl?: string;
subscriptionType: string;
role: string;
isBlocked: boolean;
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
  isBlocked?: boolean;
}

export interface IUserCreateDTO {
  email: string;
  password: string;
  fullName: string;
}

export interface BlockedUser {
  userId: number;
  userEmail: string;
  adminId: number;
  adminEmail: string;
  blockedAt: string;
  durationDays: number;
  reason: string;
}

