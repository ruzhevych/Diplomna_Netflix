import { useEffect, useState } from "react";
import { FaStar, FaStarOfLife, FaStarAndCrescent, FaStarOfDavid } from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  useAddRatingMutation,
  useGetUserRatingQuery,
  useGetAllRatingsQuery
} from "../services/ratingApi";

import {
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} from "../services/commentApi";
import type { CommentCreateDto } from "../types/comment";
import CommentEditModal from "../pages/CommentEditModal";
import { useAppSelector } from "../store/hooks";
import edit_icon from "../../public/edit_icon.png";
import delete_icon from "../../public/delete_icon.png";

interface Props {
  contentId: number;
  contentType: string;
  vote_average: number;
}

export default function RatingAndComments({ contentId, contentType, vote_average }: Props) {
  const { t } = useTranslation();
  // ----- Rating -----
  const [hover, setHover] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const { data: userRating, isLoading: isRatingLoading } =
    useGetUserRatingQuery({ contentId, contentType });
  const [addRating] = useAddRatingMutation();

const { data: allRatings = [] } = useGetAllRatingsQuery({
    contentId,
    contentType,
  });

  useEffect(() => {
    if (userRating) setSelected(userRating.stars);
  }, [userRating]);

  async function handleRatingClick(stars: number) {
    setSelected(stars);
    try {
      await addRating({ contentId, contentType, stars }).unwrap();
      toast.success(t("ratingAndComments.rateSuccess", { stars }));
    } catch (err: any) {
      toast.error(err?.data?.message || t("ratingAndComments.rateError"));
    }
  }

  // ----- Comments -----
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedComment, setSelectedComment] = useState<{
    id: string;
    content: string;
  } | null>(null);

  const currentUser = useAppSelector((state) => state.user.user);

  const {
    data: comments = [],
    isLoading: isCommentsLoading,
    isError,
  } = useGetCommentsQuery({
    movieId: contentId,
    movieType: contentType,
  });

  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  async function handleAddComment() {
    if (!newComment.trim()) return;
    const dto: CommentCreateDto = {
      content: newComment,
      movieId: contentId,
      movieType: contentType,
    };
    try {
      await addComment(dto).unwrap();
      setNewComment("");
      toast.success(t("ratingAndComments.commentSuccess"));
    } catch (err) {
      toast.error(t("ratingAndComments.commentError"));
      console.error("Помилка при додаванні коментаря:", err);
    }
  }

  async function handleDeleteComment(id: string) {
    try {
      await deleteComment(id).unwrap();
      toast.success(t("ratingAndComments.deleteSuccess"));
    } catch (err) {
      toast.error(t("ratingAndComments.deleteError"));
      console.error("Помилка при видаленні коментаря:", err);
    }
  }

  return (
    <div className="max-w-7xl">
      {/* ----- Rating Section ----- */}
      <h3 className="text-3xl font-semibold mb-3">{t("ratingAndComments.commentsTitle")}</h3>
      {isRatingLoading ? (
        <p>{t("ratingAndComments.loadingRating")}</p>
      ) : (
        <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <FaStar
            key={star}
            size={40}
            className={`cursor-pointer transition-colors ${
              (hover ?? selected ?? 0) >= star
                ? "text-[#C4FF00]"
                : "text-gray-500/20"
            }`}
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            aria-label={t("ratingAndComments.starLabel", { star })}
          />
        ))}
      </div>
      )}
      {/* {selected && (
        <p className="mt-2 text-sm text-gray-400">
          {t("ratingAndComments.yourRatingText", { selected })}
        </p>
      )} */}

      {/* <p className="text-gray-400 text-sm">{t("ratingAndComments.totalRating", { vote_average })}</p> */}

      {/* ----- Comments Section ----- */}

      <div className="flex flex-col gap-2 mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={t("ratingAndComments.commentPlaceholder")}
          className="flex-1 px-4 py-3 rounded-lg bg-[#E0E2DB] text-black resize-none"
          rows={8}
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 w-1/4 mt-3 mb-4 bg-[#C4FF00] hover:bg-[#C4FF00]/90 rounded-sm font-medium text-black self-center"
        >
          {t("ratingAndComments.addCommentButton")}
        </button>
      </div>

      {isCommentsLoading && <p>{t("ratingAndComments.loadingComments")}</p>}
      {isError && (
        <p className="text-red-500">{t("ratingAndComments.commentsError")}</p>
      )}
      <h3 className="text-3xl font-semibold mt-10 mb-4">
        Futured Reviews
      </h3>
      <div className="space-y-3">
        {comments.map((c) => (
          
          <div key={c.id} className="p-3 bg-[#E0E2DB] text-black rounded-lg">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                {c.userProfilePictureUrl && (
                  <img
                    src={
                      c.userProfilePictureUrl}
                    alt={c.userName}
                    className="w-8 h-8 rounded-sm"
                  />
                )}
                <span className="font-medium">{c.userName}</span>
                <span className="text-[#191716]/60 font-bold text-md">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {c.userName === currentUser?.fullName && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedComment({ id: c.id, content: c.content });
                      setIsEditing(true);
                    }}
                    aria-label={t("ratingAndComments.editCommentButton")}
                  >
                    <img src={edit_icon} alt="edit" className="w-3 h-3" />
                  </button>
                  <button
                    className="flex gap-2"
                    onClick={() => handleDeleteComment(c.id)}
                    aria-label={t("ratingAndComments.deleteCommentButton")}
                  >
                    <img src={delete_icon} alt="delete" className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <p className="mt-2">{c.content}</p>
            {isEditing && selectedComment?.id === c.id && (
              <CommentEditModal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                commentId={selectedComment.id}
                initialContent={selectedComment.content}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}