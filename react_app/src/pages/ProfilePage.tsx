import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils/getInitials";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import {
  User,
  Shield,
  MonitorSmartphone,
  Users,
  CreditCard,
  LogOut,
  Edit,
  History,
  Book,
  Pin,
} from "lucide-react";
import { useGetProfileQuery } from "../services/userApi";
import ChangePasswordRequest from "../components/ChangePasswordRequest";
import ProfileEditModal from "./ProfileEditModal";
import cib_visa from "../../public/cib_visa.png";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const { t } = useTranslation();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: user, error, isLoading } = useGetProfileQuery();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const tabs = [
    { id: "overview", label: t("profile.menu.overview"), icon: User },
    { id: "subscription", label: t("profile.menu.subscription"), icon: CreditCard },
    { id: "security", label: t("profile.menu.security"), icon: Shield },
    { id: "devices", label: t("profile.menu.devices"), icon: MonitorSmartphone },
    ...(user?.role === "Admin"
      ? [{ id: "admin", label: t("profile.menu.adminPanel"), icon: Users }]
      : []),
  ];

  if (error)
    return <p className="text-red-500 text-center mt-10">{(error as any).data?.message || t("profile.error")}</p>;
  if (isLoading)
    return <p className="text-center mt-10 bg-gradient-to-b">{t("profile.loading")}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white flex flex-col">
      <Header />
      <ProfileEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
      <div className="max-w-7xl mx-auto flex-1 w-full py-12 px-0 mt-16 flex gap-8">
        {/* Left menu */}
        <aside className="w-72 backdrop-blur-md rounded-sm p-2 shadow-xl ">
          <ul className="space-y-3 text-xl font-bold">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-sm cursor-pointer transition ${
                    activeTab === tab.id
                      ? "bg-lime-500/20 text-[#C4FF00] font-semibold"
                      : "text-gray-300 hover:text-[#C4FF00]/90 hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 space-y-5">
          {/* Tabs */}
          {activeTab === "overview" && (
            <section className="backdrop-blur-md rounded-2xl p-6 shadow-2xl transition hover:scale-[1.01] duration-300">
              <h3 className="text-3xl font-bold text-white pb-4 border-b border-gray-700 mb-6">
                {t("profile.overview.title")}
              </h3>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                {user?.profilePictureUrl ? (
                  <img
                    src={user?.profilePictureUrl ? `http://localhost:5170${user.profilePictureUrl}` : "/default-avatar.png"}
                    alt={user.fullName}
                    className="w-56 h-56 rounded-sm object-cover shadow-xl border-2 border-gray-700"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-[#C4FF00] to-[#C4FF00]/50 w-56 h-56 text-black rounded-sm flex items-center justify-center text-3xl font-bold shadow-xl">
                    {getInitials(user?.fullName || "")}
                  </div>
                )}

                {/* Basic information */}
                <div className="flex-1 flex flex-col gap-0">
                  <p className="text-l font-regular text-white-400">{t("profile.overview.name")}: <span className="text-2xl font-semibold text-lime-400">{user?.fullName}</span></p>
                  <p className="text-l font-regular text-white-400">{t("profile.overview.email")}: <span className="text-gray-400">{user?.email}</span></p>
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => navigate("/movie/history", { state: { user } })}
                  className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-[#C4FF00] hover:bg-[#C4FF00]/80 text-black rounded-sm transition font-medium"
                >
                  <History size={18} />
                  {t("profile.overview.watchHistory")}
                </button>
                <button
                  onClick={() => {
                    navigate("/favorites");
                  }}
                  className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-[#C4FF00] hover:bg-[#C4FF00]/80 text-black font-semibold rounded-sm transition"
                >
                  <Book size={18} />
                  {t("profile.overview.favorites")}
                </button>
                <button
                  onClick={() => {
                    navigate("/for-later");
                  }}
                  className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-[#C4FF00] hover:bg-[#C4FF00]/80 text-black font-semibold rounded-sm transition"
                >
                  <Pin size={18} />
                  {t("profile.overview.forLater")}
                </button>
              </div>
              <div className="flex gap-4 mt-3">
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-transparent border border-[#C4FF00] hover:bg-[#C4FF00]/80 rounded-sm transition font-medium"
                >
                  <Edit size={18} />
                  {t("profile.overview.editProfile")}
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("accessToken");
                    navigate("/login");
                  }}
                  className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-transparent border border-[#C4FF00] hover:bg-[#C4FF00]/80 font-semibold rounded-sm transition"
                >
                  <LogOut size={18} />
                  {t("profile.overview.logOut")}
                </button>
              </div>
            </section>
          )}
          {activeTab === "subscription" && (
            <section className="rounded-sm p-6 shadow-lg">
              <h3 className="text-3xl font-semibold text-white pb-6">
                {t("profile.subscription.title")}
              </h3>
              <div className="bg-lime-600 rounded-md mb-6 shadow-lg">
                <div className="p-4 space-y-2 text-white">
                  <h4 className="text-lg font-semibold">
                    {t(`profile.subscription.planType.${user?.subscriptionType || "Standart"}`)}
                  </h4>
                  <p className="text-sm text-gray-200">{t("profile.subscription.details")}</p>
                  <p className="text-sm text-gray-300">
                    {t("profile.subscription.startDate")}: {t("profile.subscription.date")}
                  </p>
                  <p className="text-sm text-gray-300">
                    {t("profile.subscription.nextPayment")}: {t("profile.subscription.nextDate")}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={cib_visa}
                      alt="Visa"
                      className="h-6"
                    />
                    <span className="tracking-widest">•••• •••• •••• 4444</span>
                  </div>
                </div>
                <button className="w-full py-2 bg-black/40 text-white text-sm hover:bg-black/60 transition">
                  {t("profile.subscription.changePlan")}
                </button>
              </div>
            </section>
          )}
          {activeTab === "security" && (
            <section className="bg-[#141414]/80 backdrop-blur-md rounded-sm p-6 shadow-lg space-y-4">
              <h3 className="text-xl font-semibold text-gray-100 pb-3 mb-6 border-b border-gray-700">
                {t("profile.security.title")}
              </h3>
              <p className="text-gray-400 mb-4">
                {t("profile.security.description")}
              </p>
              <ChangePasswordRequest email={user?.email || ""} />
            </section>
          )}
          {activeTab === "devices" && (
            <section className="bg-[#141414]/80 backdrop-blur-md rounded-sm p-6 shadow-lg ">
              <h3 className="text-xl font-semibold text-gray-100 pb-3 mb-6 -b -gray-700">
                {t("profile.devices.title")}
              </h3>
              <p className="text-gray-400">{t("profile.devices.description")}</p>
            </section>
          )}
          {user?.role === "Admin" && activeTab === "admin" && (
            <section className="bg-[#141414]/80 backdrop-blur-md rounded-sm p-6 shadow-lg">
              <button
                className={`text-left text-lg font-medium transition ${
                  activeTab === "admin"
                    ? "text-[#C4FF00]"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => navigate("/admin")}
              >
                {t("profile.admin.adminPanel")}
              </button>
            </section>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;