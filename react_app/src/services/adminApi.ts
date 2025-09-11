// src/services/adminApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "../utils/createBaseQuery";
import type { AdminUser, PagedResult, SendMessageDto, SendMessageResponse, Role } from "../types/admin";


export interface BlockUserDto {
  userId: number;
  adminId: number;
  durationDays?: number;
  reason?: string;
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: createBaseQueryWithReauth("admin/users"),
  tagTypes: ["AdminUsers"],
  endpoints: (builder) => ({

    // GET /api/admin/users?page=1&pageSize=10&search=...
    getUsers: builder.query<
      PagedResult<AdminUser>,
      { page?: number; pageSize?: number; search?: string } | void
    >({
      query: (args) => {
        const page = args?.page ?? 1;
        const pageSize = args?.pageSize ?? 10;
        const search = args?.search?.trim() || undefined;
        return {
          url: "/",
          method: "GET",
          params: { page, pageSize, search },
        };
      },
      providesTags: (_res) => [{ type: "AdminUsers", id: "LIST" }],
    }),

    // PATCH /api/admin/users/{id}/block
    blockUser: builder.mutation<void, BlockUserDto>({
      query: (dto) => ({
        url: `/block`,
        method: "PATCH",
        body: dto,
      }),
      invalidatesTags: [{ type: "AdminUsers", id: "LIST" }],
    }),

    // PATCH /api/admin/users/{id}/unblock
    unblockUser: builder.mutation<void, { userId: number; adminId: number }>({
      query: ({ userId, adminId }) => ({
        url: `/unblock`,
        method: "PATCH",
        params: { userId, adminId }
      }),
      invalidatesTags: [{ type: "AdminUsers", id: "LIST" }],
    }),

    // PATCH /api/admin/users/{id}/role?role=Admin|User|Moderator
    changeUserRole: builder.mutation<void, { id: number; role: Role | string }>({
      query: ({ id, role }) => ({
        url: `/${id}/role`,
        method: "PATCH",
        params: { role },
      }),
      invalidatesTags: [{ type: "AdminUsers", id: "LIST" }],
    }),

    // DELETE /api/admin/users/{id}
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "AdminUsers", id: "LIST" }],
    }),

    // POST /api/admin/users/send-message
    sendMessage: builder.mutation<SendMessageResponse, SendMessageDto>({
      query: (body) => ({
        url: `/send-message`,
        method: "POST",
        body,
      }),
      
    }),
  }),
});

export const {
  useGetUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  useChangeUserRoleMutation,
  useDeleteUserMutation,
  useSendMessageMutation,
} = adminApi;
