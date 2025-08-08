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
}
