import { createApi } from "@reduxjs/toolkit/query/react";
import type { Favorite } from "../types/movie";
import {createBaseQueryWithReauth} from "../utils/createBaseQuery.ts";

export const favoritesApi = createApi({
    reducerPath: "favoritesApi",
    tagTypes: ["Favorites"],
    baseQuery: createBaseQueryWithReauth('Favorites'),
    endpoints: (builder) => ({

        getFavorites: builder.query<Favorite[], void>({
            query: () => "/",
            providesTags: ["Favorites"],
        }),
        addFavorite: builder.mutation<void, number>({
            query: (movieId) => ({
                url: `/${movieId}`,
                method: "POST",
            }),
            invalidatesTags: ["Favorites"],
        }),
        removeFavorite: builder.mutation<void, number>({
            query: (movieId) => ({
                url: `/${movieId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Favorites"],
        }),
    }),
});

export const {
    useGetFavoritesQuery,
    useAddFavoriteMutation,
    useRemoveFavoriteMutation,
} = favoritesApi;
