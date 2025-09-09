import { useState, useEffect } from "react";
import { X, MessageSquare } from "lucide-react";
import { useUpdateCommentMutation } from "../services/commentApi";

interface CommentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  commentId: string;
  initialContent: string;
}

const CommentEditModal = ({
  isOpen,
  onClose,
  commentId,
  initialContent,
}: CommentEditModalProps) => {
  const [content, setContent] = useState(initialContent);
  const [updateComment] = useUpdateCommentMutation();

  useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
    }
  }, [isOpen, initialContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateComment({ commentId, newContent: content }).unwrap();
      onClose();
    } catch (err) {
      console.error("Помилка редагування коментаря:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 opacity-100"
      />

      {/* Modal */}
      <div
        className="relative bg-white/5 backdrop-blur-xl p-6 rounded-sm shadow-2xl w-full max-w-md text-white
                   transform transition-all duration-300 scale-100 opacity-100"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center space-y-3">
          <h2 className="text-2xl font-bold text-lime-400 drop-shadow-md">
            Edit Comment
          </h2>
          <MessageSquare size={40} className="text-lime-500" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Редагуйте ваш коментар..."
            className="w-full px-3 py-2 rounded-sm bg-black/70 text-white placeholder-gray-500 
                       focus:ring-2 focus:ring-lime-500 outline-none transition resize-none"
          />

          <button
            type="submit"
            className="w-full py-2 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-sm 
                       transition duration-200 shadow-md shadow-lime-500/30 hover:shadow-lime-500/50"
          >
            Зберегти зміни
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentEditModal;

