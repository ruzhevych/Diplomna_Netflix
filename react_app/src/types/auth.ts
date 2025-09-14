export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  plan: string;
}

export interface RefreshPayload {
  refreshToken: string;
}

export interface IAuthResponse {
  token(token: any): unknown;
  accessToken: string;
  isActive: boolean;
  isBlocked : boolean;
}

export interface IGoogleLoginRequest {
    googleAccessToken: string;  
}

export interface IGoogleRegisterRequest {
    googleAccessToken: string;
    subscriptionType: string;
}

export interface IForgotPasswordRequest {
    email: string;
}

export interface IResetPasswordRequest {
    email: string;
    token: string;
    newPassword: string;
}