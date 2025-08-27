import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BlockedPage() {
  const navigate = useNavigate();
  const raw = localStorage.getItem('blockedInfo');
  const info = raw ? JSON.parse(raw) : null;

  const reason = info?.reason || "You have been blocked by an administrator.";
  const unblockDate = info?.unblockDate ? new Date(info.unblockDate).toLocaleString() : null;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-[#141414] p-8 rounded-xl max-w-xl text-center">
        <h1 className="text-2xl font-bold mb-4">Ваш акаунт заблоковано</h1>
        <p className="text-gray-300 mb-4">{reason}</p>
        {unblockDate && <p className="text-sm text-gray-400 mb-4">Розблокування очікується: {unblockDate}</p>}
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-700 rounded">На головну</button>
          <button onClick={() => { localStorage.removeItem('blockedInfo'); navigate('/login'); }} className="px-4 py-2 bg-lime-500 rounded">Вийти</button>
        </div>
      </div>
    </div>
  );
}
