import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "../utils/createBaseQuery";
import type { CardCreateDTO, CardDTO, CardUpdateDTO } from "../types/payment";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: createBaseQueryWithReauth("payment"),
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    // список карт користувача
    getCards: builder.query<CardDTO[], void>({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),

    // додати карту
    addCard: builder.mutation<CardDTO, CardCreateDTO>({
      query: (card) => ({
        url: "",
        method: "POST",
        body: card,
      }),
      invalidatesTags: ["Payment"],
    }),

    // оновити карту
    updateCard: builder.mutation<CardDTO, { id: number; dto: CardUpdateDTO }>({
      query: ({ id, dto }) => ({
        url: `/${id}`,
        method: "PUT",
        body: dto,
      }),
      invalidatesTags: (_, __, arg) => [{ type: "Payment", id: arg.id }],
    }),

    // видалити карту
    deleteCard: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useGetCardsQuery,
  useAddCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
} = paymentApi;
