import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "../utils/createBaseQuery.ts";
import type { GetHistoryItem, HistoryItem } from "../types/history.ts";


export const historyApi = createApi({
  reducerPath: "historyApi",
  tagTypes: ["MovieHistory"],
  baseQuery: createBaseQueryWithReauth("MovieHistory"),
  endpoints: (builder) => ({
    getHistory: builder.query<GetHistoryItem[], void>({
      query: () => "/my",
      providesTags: ["MovieHistory"],
    }),
    addToHistory: builder.mutation<void, HistoryItem>({
      query: ({id, name, mediaType}) => ({
        url: `/add`,
        method: "POST",
        body: {id, name, mediaType},
      }),
    }),
    deleteFromHistory: builder.mutation<void, number>({
      query: (Id) => ({
        url: `/delete/${Id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MovieHistory"],
    }),
    clearHistory: builder.mutation<void, void>({
      query: () => ({
        url: "/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["MovieHistory"],
    }),
  }),
});

export const {
  useGetHistoryQuery,
  useAddToHistoryMutation,
  useDeleteFromHistoryMutation,
  useClearHistoryMutation,
} = historyApi;
