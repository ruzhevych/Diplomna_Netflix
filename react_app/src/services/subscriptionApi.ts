import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "../utils/createBaseQuery";
import type { SubscriptionCreateDTO, SubscriptionDTO, SubscriptionUpdateDTO } from "../types/subscription";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: createBaseQueryWithReauth("subscription"),
  tagTypes: ["Subscription"],
  endpoints: (builder) => ({
    // додати підписку
    addSubscription: builder.mutation<SubscriptionDTO, SubscriptionCreateDTO>({
        query: ( type ) => ({
            url: `/add`,
            method: "POST",
            body: type,
        }),
        invalidatesTags: ["Subscription"],
    }),

    // оновити підписку
    updateSubscription: builder.mutation<SubscriptionDTO, { id: string; dto: SubscriptionUpdateDTO }>({
      query: ({ id, dto }) => ({
        url: `/${id}`,
        method: "PUT",
        body: dto,
      }),
      invalidatesTags: (_, __, arg) => [{ type: "Subscription", id: arg.id }],
    }),

    // видалити підписку
    cancelSubscription: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useAddSubscriptionMutation,
} = subscriptionApi;