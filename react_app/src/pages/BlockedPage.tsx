import { useNavigate } from "react-router-dom";
import { useGetBlockInfoQuery } from "../services/userApi";

export default function BlockedPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetBlockInfoQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Завантаження...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Не вдалося отримати інформацію про блокування.</p>
      </div>
    );
  }

  // ✅ Дані про блокування
  const reason = data.reason || "Вас заблокував адміністратор.";
  const unblockDate = data.durationDays
    ? new Date(
        new Date(data.blockedAt).getTime() + data.durationDays * 24 * 60 * 60 * 1000
      ).toLocaleString()
    : null;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-[#141414] p-8 rounded-xl max-w-xl text-center">
        <h1 className="text-2xl font-bold mb-4">Ваш акаунт заблоковано</h1>

        <p className="text-gray-300 mb-4">{reason}</p>

        {data.userId && (
          <p className="text-gray-400 mb-2">
            <span className="font-semibold">Email користувача:</span> {data.userEmail}
          </p>
        )}

        {data.adminId && (
          <p className="text-gray-400 mb-2">
            <span className="font-semibold">Адміністратор:</span> {data.adminEmail}
          </p>
        )}

        <p className="text-gray-400 mb-2">
          <span className="font-semibold">Дата блокування:</span>{" "}
          {new Date(data.blockedAt).toLocaleString()}
        </p>

        {unblockDate && (
          <p className="text-sm text-gray-400 mb-4">
            Розблокування очікується: {unblockDate}
          </p>
        )}

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-700 rounded"
          >
            На головну
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="px-4 py-2 bg-lime-500 rounded"
          >
            Вийти
          </button>
        </div>
      </div>
    </div>
  );
}
