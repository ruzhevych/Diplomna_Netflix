import { useNavigate } from "react-router-dom";
import { useGetBlockInfoQuery } from "../services/userApi";

export default function BlockedPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetBlockInfoQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="animate-pulse text-gray-400">Завантаження…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-[#141414] p-6 rounded-xl text-center">
          <h2 className="text-xl font-semibold mb-2">
            Не вдалося отримати інформацію про блокування
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded mt-4"
          >
            Увійти знову
          </button>
        </div>
      </div>
    );
  }

  const reason = data.reason || "Вас заблокував адміністратор.";
  const unblockDate = data.durationDays
    ? new Date(
        new Date(data.blockedAt).getTime() +
          data.durationDays * 24 * 60 * 60 * 1000
      ).toLocaleString()
    : null;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="bg-[#141414] p-8 rounded-sm max-w-xl w-full text-center shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-red-500">
          Ваш акаунт заблоковано
        </h1>

        <p className="text-gray-300 mb-6">{reason}</p>

        {data.userEmail && (
          <p className="text-gray-400 mb-2">
            <span className="font-semibold">Ваш email:</span> {data.userEmail}
          </p>
        )}

        {data.adminEmail && (
          <p className="text-gray-400 mb-2">
            <span className="font-semibold">Адміністратор:</span>{" "}
            {data.adminEmail}
          </p>
        )}

        <p className="text-gray-400 mb-2">
          <span className="font-semibold">Дата блокування:</span>{" "}
          {new Date(data.blockedAt).toLocaleString()}
        </p>

        {unblockDate && (
          <p className="text-sm text-gray-400 mb-4">
            <span className="font-semibold">Розблокування очікується:</span>{" "}
            {unblockDate}
          </p>
        )}

        {/* Доступні дії */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-sm text-sm"
          >
            На головну (обмежений доступ)
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-sm text-sm"
          >
            Вийти з акаунту
          </button>

          <a
            href="mailto:support@yourapp.com"
            className="px-4 py-2 bg-lime-500 hover:bg-lime-400 rounded-sm text-sm text-white block"
          >
            Зв’язатися з підтримкою
          </a>
        </div>
      </div>
    </div>
  );
}
