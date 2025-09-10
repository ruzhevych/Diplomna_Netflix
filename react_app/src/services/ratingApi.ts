import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "../utils/createBaseQuery.ts";
import type { RatingDto } from "../types/comment.ts";


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
    getUserRating: builder.query<number, { contentId: number; contentType: string }>({
      query: ({ contentId, contentType }) =>
        `/Rating/movie/${contentId}?movieType=${contentType}`,
      providesTags: ["Ratings"],
    }),
  }),
});

export const { useAddRatingMutation, useGetUserRatingQuery } = ratingApi;

