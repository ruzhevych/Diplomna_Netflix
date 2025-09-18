import { useNavigate } from "react-router-dom";
import { useGetBlockInfoQuery } from "../services/userApi";
import { useTranslation } from "react-i18next";

export default function BlockedPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetBlockInfoQuery();
  const { t, i18n } = useTranslation(); 

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="animate-pulse text-gray-400">{t("blockedPage.loading")}</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-[#141414] p-6 rounded-xl text-center">
          <h2 className="text-xl font-semibold mb-2">
            {t("blockedPage.error.title")}
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded mt-4"
          >
            {t("blockedPage.error.loginAgain")}
          </button>
        </div>
      </div>
    );
  }

  const reason = data.reason || t("blockedPage.defaultReason");
  const unblockDate = data.durationDays
    ? new Date(
        new Date(data.blockedAt).getTime() +
          data.durationDays * 24 * 60 * 60 * 1000
      ).toLocaleString(i18n.language, { 
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    : null;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="bg-[#141414] p-8 rounded-sm max-w-xl w-full text-center shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-red-500">
          {t("blockedPage.title")}
        </h1>

        <p className="text-gray-300 mb-6">{reason}</p>

        {data.userEmail && (
          <p className="text-gray-400 mb-2">
            <span className="font-semibold">{t("blockedPage.yourEmail")}:</span> {data.userEmail}
          </p>
        )}

        {data.adminEmail && (
          <p className="text-gray-400 mb-2">
            <span className="font-semibold">{t("blockedPage.administrator")}:</span>{" "}
            {data.adminEmail}
          </p>
        )}

        <p className="text-gray-400 mb-2">
          <span className="font-semibold">{t("blockedPage.blockingDate")}:</span>{" "}
          {new Date(data.blockedAt).toLocaleString(i18n.language, { 
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>

        {unblockDate && (
          <p className="text-sm text-gray-400 mb-4">
            <span className="font-semibold">{t("blockedPage.unblockingExpected")}:</span>{" "}
            {unblockDate}
          </p>
        )}

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-sm text-sm"
          >
            {t("blockedPage.goToHomepage")}
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-sm text-sm"
          >
            {t("blockedPage.logOut")}
          </button>

          <a
            href="mailto:support@yourapp.com"
            className="px-4 py-2 bg-lime-500 hover:bg-lime-400 rounded-sm text-sm text-white block"
          >
            {t("blockedPage.contactSupport")}
          </a>
        </div>
      </div>
    </div>
  );
}