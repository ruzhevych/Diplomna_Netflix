import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from '../utils/createBaseQuery';
import type { IUserCreateDTO, IUserDTO } from '../types/user';
import type { IAuthResponse } from '../types/auth';
import { handleAuthQueryStarted } from '../utils/handleAuthQueryStarted';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: createBaseQueryWithReauth('users'),
  tagTypes: ['Users'],
  endpoints: (builder) => ({

    // Отримати користувача за ID
    getUserById: builder.query<IUserDTO, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'Users', id }],
    }),

    // Отримати користувача за email
    getUserByEmail: builder.query<IUserDTO, string>({
      query: (email) => ({
        url: `/email`,
        params: { email },
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),

    // Створити нового користувача
    createUser: builder.mutation<void, IUserCreateDTO>({
      query: (user) => ({
        url: '',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['Users'],
    }),

    // Оновити користувача (наприклад, фото профілю)
    updateUser: builder.mutation<void, FormData>({
      query: (data) => ({
        url: `/users`,
        method: "PUT",
        body: data,
      }),
    }),
          

    // Видалити користувача за ID
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useGetUserByEmailQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
