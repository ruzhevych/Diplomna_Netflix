import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useAddRatingMutation,
  useGetUserRatingQuery,
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
  contentType: string; // "movie" | "series"
  vote_average: number;
}

export default function RatingAndComments({ contentId, contentType, vote_average }: Props) {
  // ----- Rating -----
  const [hover, setHover] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const { data: userRating, isLoading: isRatingLoading } =
    useGetUserRatingQuery({ contentId, contentType });
  const [addRating] = useAddRatingMutation();

  useEffect(() => {
    if (userRating) setSelected(userRating.stars);
  }, [userRating]);

  async function handleRatingClick(stars: number) {
    setSelected(stars);
    try {
      await addRating({ contentId, contentType, stars }).unwrap();
      toast.success(`Ви поставили оцінку ${stars} ⭐`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Помилка при збереженні оцінки");
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
    } catch (err) {
      console.error("Помилка при додаванні коментаря:", err);
    }
  }

  async function handleDeleteComment(id: string) {
    try {
      await deleteComment(id).unwrap();
    } catch (err) {
      console.error("Помилка при видаленні коментаря:", err);
    }
  }

  return (
    <div className="max-w-6xl mx-auto gap-8 my-10 bg-[#141414]/80 p-6 rounded-xl">
      {/* ----- Rating Section ----- */}
      <h3 className="text-lg font-semibold mb-3">Ваша оцінка</h3>
      {isRatingLoading ? (
        <p>Завантаження вашої оцінки...</p>
      ) : (
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={32}
              className={`cursor-pointer transition-colors ${
                (hover ?? selected ?? 0) >= star
                  ? "text-yellow-400"
                  : "text-gray-500"
              }`}
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </div>
      )}
      {selected && (
        <p className="mt-2 text-sm text-gray-400">
          Ваша оцінка: {selected} / 5
        </p>
      )}
        <p className="text-gray-400 text-sm">Загальна оцінка: ⭐ {(vote_average/2).toFixed(1)}+</p>
      {/* ----- Comments Section ----- */}
      <h3 className="text-lg font-semibold mt-10 mb-4">Коментарі</h3>

      <div className="flex gap-2 mb-4">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Напишіть коментар..."
          className="flex-1 px-3 py-2 rounded bg-[#E0E2DB] text-black"
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-[#C4FF00] hover:bg-[#C4FF00]/90 rounded text-black"
        >
          Додати
        </button>
      </div>

      {isCommentsLoading && <p>Завантаження...</p>}
      {isError && (
        <p className="text-red-500">Помилка при завантаженні коментарів</p>
      )}

      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="p-3 bg-[#E0E2DB] text-black rounded">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                {c.userProfilePictureUrl && (
                  <img
                    src={
                      c.userProfilePictureUrl
                        ? `http://localhost:5170${c.userProfilePictureUrl}`
                        : "/default-avatar.png"
                    }
                    alt={c.userName}
                    className="w-8 h-8 rounded"
                  />
                )}
                <span className="font-medium">{c.userName}</span>
                <span className="text-gray-400 text-sm">
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
                  >
                    <img src={edit_icon} alt="edit" className="w-3 h-3" />
                  </button>
                  <button
                    className="flex gap-2"
                    onClick={() => handleDeleteComment(c.id)}
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

