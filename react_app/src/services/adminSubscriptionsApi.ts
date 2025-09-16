// src/services/adminSubscriptionsApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "../utils/createBaseQuery";
import type { PagedResult } from "../types/admin";
import type { AdminSubscriptionCreateDto, AdminSubscriptionDto, AdminSubscriptionUpdateDto } from "../types/adminSubscriptions";

export const adminSubscriptionsApi = createApi({
  reducerPath: "adminSubscriptionsApi",
  baseQuery: createBaseQueryWithReauth("admin/subscriptions"),
  tagTypes: ["AdminSubscriptions"],
  endpoints: (builder) => ({
    getAllSubscriptions: builder.query<
      AdminSubscriptionDto[], 
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
      providesTags: (_res) => [{ type: "AdminSubscriptions", id: "LIST" }],
    }),

    getSubscriptionById: builder.query<AdminSubscriptionDto, number>({
        query: (id) => ({ url: `/${id}`, method: "GET" }),
        providesTags: (_res, _err, id) => [{ type: "AdminSubscriptions", id }],
    }),
    updateSubscription: builder.mutation<void, { id: number; dto: AdminSubscriptionUpdateDto }>({
        query: ({ id, dto }) => ({ url: `/${id}`, method: "PATCH", body: dto }),
        invalidatesTags: (_res, _err, { id }) => [{ type: "AdminSubscriptions", id }, { type: "AdminSubscriptions", id: "LIST" }],
    }),
    deleteSubscription: builder.mutation<void, string>({
    query: (id) => ({
      url: `/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: (_res, _err, id) => [
      { type: "AdminSubscriptions", id },
      { type: "AdminSubscriptions", id: "LIST" },
    ],
  }),
  }),
});

export const {
  useGetAllSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} = adminSubscriptionsApi;