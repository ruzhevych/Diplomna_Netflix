import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "../utils/createBaseQuery";
import type {
  AdminSubscriptionDto,
  AdminSubscriptionCreateDto,
  AdminSubscriptionUpdateDto,
} from "../types/adminSubscriptions";

export const adminSubscriptionsApi = createApi({
  reducerPath: "adminSubscriptionsApi",
  baseQuery: createBaseQueryWithReauth("admin/subscriptions"),
  tagTypes: ["AdminSubscriptions"],
  endpoints: (builder) => ({
    // GET /api/admin/subscriptions?search&type
    getAllSubscriptions: builder.query<AdminSubscriptionDto[], void>({
        
        query: () => ({
            url: "",
            method: "GET",
            
        }),
        providesTags: ["AdminSubscriptions"],
        }),

    // GET /api/admin/subscriptions/{id}
    getSubscriptionById: builder.query<AdminSubscriptionDto, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "AdminSubscriptions", id }],
    }),

    // POST /api/admin/subscriptions
    createSubscription: builder.mutation<AdminSubscriptionDto, AdminSubscriptionCreateDto>({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminSubscriptions"],
    }),

    // PUT /api/admin/subscriptions/{id}
    updateSubscription: builder.mutation<void, { id: string; data: AdminSubscriptionUpdateDto }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, arg) => [{ type: "AdminSubscriptions", id: arg.id }],
    }),

    // DELETE /api/admin/subscriptions/{id}
    deleteSubscription: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminSubscriptions"],
    }),
  }),
});

export const {
  useGetAllSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} = adminSubscriptionsApi;
