import { useEffect, useState } from "react";
import { getComments, addComment, deleteComment } from "../services/commentApi";
import type { Comment } from "../types/comment";

interface Props {
  movieId: number;
}

export default function CommentsSection({ movieId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    loadComments();
  }, [movieId]);

  async function loadComments() {
    const data = await getComments(movieId);
    setComments(data);
  }

  async function handleAdd() {
    if (!newComment.trim()) return;
    const created = await addComment({ content: newComment, movieId });
    setComments([created, ...comments]);
    setNewComment("");
  }

  async function handleDelete(id: string) {
    await deleteComment(id);
    setComments(comments.filter(c => c.id !== id));
  }

  return (
    <div className="bg-[#141414]/80 p-4 rounded-lg mt-6">
      <h3 className="text-lg font-semibold mb-4">Коментарі</h3>

      <div className="flex gap-2 mb-4">
        <input
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Напишіть коментар..."
          className="flex-1 px-3 py-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
        >
          Додати
        </button>
      </div>

      <div className="space-y-3">
        {comments.map(c => (
          <div key={c.id} className="p-3 bg-gray-900 rounded">
            <div className="flex items-center gap-2 mb-1">
              {c.userProfilePictureUrl && (
                <img
                  src={c.userProfilePictureUrl}
                  alt={c.userName}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="font-medium">{c.userName}</span>
              <span className="text-gray-400 text-sm">
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>
            <p>{c.content}</p>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-sm text-red-500 mt-2"
            >
              Видалити
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
