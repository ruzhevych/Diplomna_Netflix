import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { IAuthResponse, LoginPayload, RefreshPayload, RegisterPayload } from '../../types/auth';
import { APP_ENV } from '../../env';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${APP_ENV.REMOTE_BASE_URL}/api/auth`,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  }),
  endpoints: (builder) => ({

    register: builder.mutation<void, RegisterPayload>({
      query: (data) => ({
        url: '/register',
        method: 'POST',
        body: {
          ...data,
          subscriptionType: data.plan,
        },
      }),
    }),

    login: builder.mutation<IAuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    refresh: builder.mutation<IAuthResponse, RefreshPayload>({
      query: (refreshTokenDto) => ({
        url: '/refresh-token',
        method: 'POST',
        body: refreshTokenDto,
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useRefreshMutation } = authApi;
