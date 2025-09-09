import { createApi } from "@reduxjs/toolkit/query/react";
import type { Comment, CommentCreateDto } from "../types/comment";
import { createBaseQueryWithReauth } from "../utils/createBaseQuery.ts";

export const commentsApi = createApi({
    reducerPath: "commentsApi",
    tagTypes: ["Comments"],
    baseQuery: createBaseQueryWithReauth("Comment"),
    endpoints: (builder) => ({

        getComments: builder.query<Comment[], {movieId: number, movieType: string}>({
            query: ({movieId, movieType}) => `/movie/${movieId}?movieType=${movieType}`,
            providesTags: ["Comments"],
        }),

        addComment: builder.mutation<Comment, CommentCreateDto>({
            query: (dto) => ({
                url: `/add`,
                method: "POST",
                body: dto,
            }),
            invalidatesTags: ["Comments"],
        }),

        updateComment: builder.mutation<Comment, { commentId: string; newContent: string }>({
            query: ({ commentId, newContent }) => ({
                url: `/update/${commentId}`,
                method: "PUT",
                body: JSON.stringify(newContent),
                headers: { "Content-Type": "application/json" },
            }),
            invalidatesTags: ["Comments"],
        }),

        deleteComment: builder.mutation<void, string>({
            query: (commentId) => ({
                url: `/delete/${commentId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Comments"],
        }),
    }),
});

export const {
    useGetCommentsQuery,
    useAddCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = commentsApi;
