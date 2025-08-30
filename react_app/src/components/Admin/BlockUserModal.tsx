import React, { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string, durationDays?: number) => void;
  userEmail?: string;
}

export default function BlockUserModal({ open, onClose, onConfirm, userEmail }: Props) {
  const [reason, setReason] = useState("");
  const [days, setDays] = useState<number | "">("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#111] text-white rounded-xl w-full max-w-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-2">Block user {userEmail ? `— ${userEmail}` : ""}</h3>
        <p className="text-sm text-gray-300 mb-4">
          Enter a reason (optional) and duration in days. Leave duration empty for indefinite ban.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white mb-3"
          rows={4}
          placeholder="Reason for ban (visible to user)"
        />

        <input
          type="number"
          value={days === "" ? "" : days}
          onChange={(e) => setDays(e.target.value === "" ? "" : Number(e.target.value))}
          className="w-40 p-2 rounded bg-gray-800 text-white mb-4"
          placeholder="Duration (days)"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded">Cancel</button>
          <button
            onClick={() => { onConfirm(reason || undefined, typeof days === "number" ? days : undefined); }}
            className="px-4 py-2 bg-red-600 rounded"
          >
            Block
          </button>
        </div>
      </div>
    </div>
  );
}
