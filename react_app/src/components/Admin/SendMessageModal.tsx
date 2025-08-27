import { useEffect, useState } from "react";

interface SendMessageModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (subject: string, message: string) => Promise<void> | void;
  userEmail?: string;
}

export default function SendMessageModal({
  open,
  onClose,
  onSend,
  userEmail,
}: SendMessageModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setSubject("");
      setMessage("");
      setError(null);
      setSending(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSend = async () => {
    setError(null);
    if (!subject.trim() || !message.trim()) {
      setError("Заповніть тему і текст повідомлення");
      return;
    }
    try {
      setSending(true);
      await onSend(subject.trim(), message.trim());
      onClose();
    } catch {
      setError("Не вдалося відправити повідомлення");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      {/* Modal */}
      <div className="relative z-[101] w-full max-w-lg rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Надіслати повідомлення</h2>
          <p className="mt-1 text-sm text-gray-400">
            Кому: <span className="text-gray-200">{userEmail ?? "користувач"}</span>
          </p>
        </div>

        <div className="space-y-3">
          <input
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-lime-500"
            placeholder="Тема"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={sending}
          />
          <textarea
            className="min-h-[140px] w-full resize-y rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-lime-500"
            placeholder="Ваше повідомлення…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sending}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-gray-200 hover:bg-white/10"
            disabled={sending}
          >
            Скасувати
          </button>
          <button
            onClick={handleSend}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            disabled={sending}
          >
            {sending ? "Надсилаю…" : "Надіслати"}
          </button>
        </div>
      </div>
    </div>
  );
}
