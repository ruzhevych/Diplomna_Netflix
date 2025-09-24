import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "../utils/createBaseQuery.ts";
import type { RatingDto } from "../types/comment.ts";

export interface UserRating {
  userId: string;
  stars: number;
}

export const ratingApi = createApi({
  reducerPath: "ratingApi",
  tagTypes: ["Ratings"],
  baseQuery: createBaseQueryWithReauth("Rating"),
  endpoints: (builder) => ({
    addRating: builder.mutation<void, RatingDto>({
      query: (dto) => ({
        url: `/add-or-update`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["Ratings"],
    }),
    getUserRating: builder.query<{ stars: number } | null, { contentId: number; contentType: string }>({
      query: ({ contentId, contentType }) =>
        `/movie/${contentId}?movieType=${contentType}`,
      transformResponse: (response: any[]) => response[0] || null,
      providesTags: ["Ratings"],
    }),
    getAllRatings: builder.query<UserRating[], { contentId: number; contentType: string }>({
      query: ({ contentId, contentType }) => `/movie/${contentId}?movieType=${contentType}`,
      transformResponse: (response: any[]) => response, // Припускаємо, що API повертає масив
      providesTags: ["Ratings"],
    }),
  }),
});

export const { useAddRatingMutation, useGetUserRatingQuery, useGetAllRatingsQuery } = ratingApi;

