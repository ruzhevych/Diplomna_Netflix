import { useNavigate } from "react-router-dom";
import { useGetBlockInfoQuery } from "../services/userApi";
import { useTranslation } from "react-i18next";
import logo from '../../public/logo-green.png';
import loginBg from '../../public/login-bg.png'; // Імпортуємо фон напряму

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
  const blockedDate = new Date(data.blockedAt).toLocaleString(i18n.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  const unblockDate = data.durationDays
    ? new Date(
        new Date(data.blockedAt).getTime() +
        data.durationDays * 24 * 60 * 60 * 1000
      ).toLocaleString(i18n.language, { 
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${loginBg})` }}
    >
      <div className="absolute left-96 top-8">
        <img src={logo} alt="logo" className="l-10 w-32" />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="bg-black/70 rounded-sm py-8 px-10 w-full max-w-sm text-white text-base">
          <h1 className="text-3xl font-semibold mb-2 text-white">
            {t("blockedPage.title")}
          </h1>
          <p className="text-white text-xl font-regular mb-3  ">{t("blockedPage.details")}</p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="font-semibold text-2xl text-white">{t("blockedPage.yourEmail")}:</span>
              <input 
                type="text" 
                value={data.userEmail} 
                readOnly 
                className="bg-[#1e1e1e] border text-white text-sm px-3 py-2.5 mt-1 rounded-sm cursor-not-allowed focus:outline-none"
              />
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-2xl text-white">{t("blockedPage.administratorEmail")}:</span>
              <input 
                type="text" 
                value={data.adminEmail} 
                readOnly 
                className="bg-[#1e1e1e] border-1 text-white text-sm px-3 py-2.5 mt-1 rounded-sm cursor-not-allowed focus:outline-none"
              />
            </div>
            
            <div className="flex flex-col">
              <span className="font-semibold text-2xl text-white">{t("blockedPage.blockingReason")}:</span>
              <span className="text-sm mt-1">{reason}</span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-2xl text-white">{t("blockedPage.blockedOn")}:</span>
              <span className="text-sm mt-1">{blockedDate}</span>
            </div>

            {unblockDate && (
              <div className="flex flex-col">
                <span className="font-semibold text-2xl text-white">{t("blockedPage.unblockingExpected")}:</span>
                <span className="text-sm mt-1">{unblockDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}