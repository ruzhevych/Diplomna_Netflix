import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../utils/createBaseQuery';
import { handleAuthQueryStarted } from '../utils/handleAuthQueryStarted';
import type { 
  IAuthResponse, 
  IForgotPasswordRequest, 
  IGoogleLoginRequest, 
  IGoogleRegisterRequest, 
  IResetPasswordRequest, 
  LoginPayload, 
  RefreshPayload, 
  RegisterPayload 
} from '../types/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['AuthUser'],
  baseQuery: createBaseQuery('Auth'),
  endpoints: (builder) => ({

    register: builder.mutation<IAuthResponse, RegisterPayload>({
      query: (data) => ({
        url: '/register',
        method: 'POST',
        body: {
          ...data,
          subscriptionType: data.plan,
        },
      }),
      onQueryStarted: handleAuthQueryStarted,
      invalidatesTags: ['AuthUser'],
    }),

    login: builder.mutation<IAuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      onQueryStarted: handleAuthQueryStarted,
      invalidatesTags: ['AuthUser'],
    }),

    refresh: builder.mutation<IAuthResponse, RefreshPayload>({
      query: (refreshTokenDto) => ({
        url: '/refresh-token',
        method: 'POST',
        body: refreshTokenDto,
      }),
      onQueryStarted: handleAuthQueryStarted,
      invalidatesTags: ['AuthUser'],
    }),

    googleLogin: builder.mutation<IAuthResponse, IGoogleLoginRequest>({
      query: (data) => ({
        url: '/google-login',
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      onQueryStarted: handleAuthQueryStarted,
      invalidatesTags: ['AuthUser'],
    }),

    googleRegister: builder.mutation<IAuthResponse, IGoogleRegisterRequest>({
      query: (data) => ({
        url: '/google-register',
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      onQueryStarted: handleAuthQueryStarted,
      invalidatesTags: ['AuthUser'],
    }),

    forgotPassword: builder.mutation<void, IForgotPasswordRequest>({
      query: (emailDto) => ({
        url: '/forgot-password',
        method: 'POST',
        body: emailDto,
      }),
    }),

    resetPassword: builder.mutation<void, IResetPasswordRequest>({
      query: (data) => ({
        url: '/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

  }),
});

export const { 
  useRegisterMutation,
  useLoginMutation, 
  useRefreshMutation, 
  useGoogleLoginMutation, 
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGoogleRegisterMutation
} = authApi;
