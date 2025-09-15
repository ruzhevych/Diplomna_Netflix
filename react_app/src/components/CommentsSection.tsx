import { useState } from "react";
import {
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} from "../services/commentApi";
import type { CommentCreateDto } from "../types/comment";
import CommentEditModal from "../pages/CommentEditModal";
import { useAppSelector } from "../store/hooks";
import edit_icon from "../../public/edit_icon.png";
import delete_icon from "../../public/delete_icon.png"

interface Props {
  movieId: number;
  movieType: string;
}

export default function CommentsSection({ movieId, movieType }: Props) {
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedComment, setSelectedComment] = useState<{id: string, content: string} | null>(null);
  const currentUser = useAppSelector((state) => state.user.user);

  // RTK Query hooks
  const { data: comments = [], isLoading, isError } = useGetCommentsQuery({
    movieId,
    movieType,
  });

  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  async function handleAdd() {
    if (!newComment.trim()) return;
    const dto: CommentCreateDto = {
      content: newComment,
      movieId,
      movieType,
    };
    try {
      await addComment(dto).unwrap();
      setNewComment("");
    } catch (err) {
      console.error("Помилка при додаванні коментаря:", err);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteComment(id).unwrap();
    } catch (err) {
      console.error("Помилка при видаленні коментаря:", err);
    }
  }

  return (
    <div className="max-w-6xl mx-auto gap-8 mt-20 bg-[#141414]/80 p-4 rounded-lg mt-6">
      <h3 className="text-lg font-semibold mb-4">Коментарі</h3>

      <div className="flex gap-2 mb-4">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Напишіть коментар..."
          className="flex-1 px-3 py-2 rounded bg-[#E0E2DB] text-black"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-[#C4FF00] hover:bg-[#C4FF00] rounded text-black"
        >
          Додати
        </button>
      </div>

      {isLoading && <p>Завантаження...</p>}
      {isError && <p className="text-red-500">Помилка при завантаженні коментарів</p>}

      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="p-3 bg-[#E0E2DB] text-black rounded">
            <div className="flex justify-between items-start mb-1">
              {/* Ліва частина — аватар, ім'я, дата */}
              <div className="flex items-center gap-2">
                {c.userProfilePictureUrl && (
                  <img
                    src={c.userProfilePictureUrl ? `http://localhost:5170${c.userProfilePictureUrl}` : "/default-avatar.png"}
                    alt={c.userName}
                    className="w-8 h-8 rounded"
                  />
                )}
                <span className="font-medium">{c.userName}</span>
                <span className="text-gray-400 text-sm">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              {/* Права частина — кнопки редагування/видалення */}
              {c.userName === currentUser?.fullName && (
                <div className="flex gap-2">
                  <button
                  //onClick={() => handleUpdate(c.id, c.content)}
                    onClick={() => {
                      setSelectedComment({ id: c.id, content: c.content });
                      setIsEditing(true);
                    }}
                  >
                    <img src={edit_icon} alt="edit" className="w-3 h-3" />
                  </button>
                  <button className="flex gap-2" onClick={() => handleDelete(c.id)}>
                    <img src={delete_icon} alt="delete" className="w-3 h-3" />
                  </button>
                </div>
              )}          
            </div>
            {/* Текст коментаря */}
            <p className="mt-2">{c.content}</p>
            {/* Модалка редагування */}
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
