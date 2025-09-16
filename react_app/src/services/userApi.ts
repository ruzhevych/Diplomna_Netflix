import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from '../utils/createBaseQuery';
import type { BlockedUser, IUserCreateDTO, IUserDTO, UserProfile } from '../types/user';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: createBaseQueryWithReauth('Users'),
  tagTypes: ['Users'],
  endpoints: (builder) => ({

    getUserById: builder.query<IUserDTO, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'Users', id }],
    }),

    getUserByEmail: builder.query<IUserDTO, string>({
      query: (email) => ({
        url: `/email`,
        params: { email },
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),

    createUser: builder.mutation<void, IUserCreateDTO>({
      query: (user) => ({
        url: '',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['Users'],
    }),

    updateUser: builder.mutation<void, FormData>({
      query: (formData) => {
        const id = formData.get("Id");
        return {
          url: `/${id}`,  
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

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    getBlockInfo: builder.query<BlockedUser | null, void>({
      query: () => ({
        url: `/blocked`,
        method: 'GET',
      }),
      transformResponse: (response, meta) => {
        if (meta?.response?.status === 423) {
          return response as BlockedUser;
        }
        return null;
      },
      
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
  useGetBlockInfoQuery,
} = userApi;
