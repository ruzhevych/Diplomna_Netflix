import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from '../utils/createBaseQuery';
import type { IUserCreateDTO, IUserDTO, UserProfile } from '../types/user';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: createBaseQueryWithReauth('Users'),
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
      query: (formData) => {
        const id = formData.get("Id");
        return {
          url: `/${id}`,   // ✅ обов’язково з ID
          method: "PUT",
          body: formData,
        };
      },
    }),
          
    getProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
      providesTags: ['Users'],
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
  useGetProfileQuery,
} = userApi;
