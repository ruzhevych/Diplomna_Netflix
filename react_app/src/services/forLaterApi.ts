import { createApi } from "@reduxjs/toolkit/query/react";
import type { ForLater, ForLaterCreate } from "../types/movie.ts";
import {createBaseQueryWithReauth} from "../utils/createBaseQuery.ts";

export const forLaterApi = createApi({
    reducerPath: "forLater",
    tagTypes: ["ForLater"],
    baseQuery: createBaseQueryWithReauth('ForLater'),
    endpoints: (builder) => ({

        getForLaters: builder.query<ForLater[], void>({
            query: () => "/",
            providesTags: ["ForLater"],
        }),
        addForLater: builder.mutation<void, ForLaterCreate>({
            query: ({ contentId, contentType }) => ({
                url: ``,
                method: "POST",
                body: { contentId : String(contentId), contentType }
            }),
            invalidatesTags: ["ForLater"],
        }),
        removeForLater: builder.mutation<void, number>({
            query: (contentId) => ({
                url: `/${contentId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ForLater"],
        }),
    }),
});

export const {
    useGetForLatersQuery,
    useAddForLaterMutation,
    useRemoveForLaterMutation,
} = forLaterApi;
