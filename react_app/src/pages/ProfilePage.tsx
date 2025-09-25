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
import visa from "../../public/visa.png";
import mastercard from "../../public/mastercard.png"
import amex from "../../public/amex.png"
import { useTranslation } from "react-i18next";
import {
  useDeleteCardMutation,
  useGetCardsQuery,
  useUpdateCardMutation,
} from "../services/paymentApi";
import type { CardDTO, CardUpdateDTO } from "../types/payment";
import EditCardModal from "../components/PaymentEditSection";
import { useCancelSubscriptionMutation } from "../services/subscriptionApi";

const ProfilePage = () => {
  const { t } = useTranslation();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: user, error, isLoading } = useGetProfileQuery();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { data: cards, isLoading: cardsLoading } = useGetCardsQuery();
  const [updateCard] = useUpdateCardMutation();
  const [editingCard, setEditingCard] = useState<CardDTO | null>(null);
  const [cancelSubscription] = useCancelSubscriptionMutation();
  const [deleteCard] = useDeleteCardMutation();
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleUpdateCard = async (userId: number, card: CardUpdateDTO) => {
    await updateCard({
      id: userId,
      dto: {
        cardNumber: card.cardNumber,
        cardholderName: card.cardholderName,
        cvv: card.cvv,
        expMonth: card.expMonth,
        expYear: card.expYear,
      },
    });
  };

  const handleCancel = async () => {
  try {
    if (!user?.subscriptionId) return;
    await cancelSubscription(user.subscriptionId).unwrap();
    if (user?.cardId) {
      await deleteCard(user.cardId).unwrap();
    }
    navigate("/");
  } catch (err) {
    console.error("Cancel subscription failed:", err);
  }
};

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
    <div className="min-h-screen  bg-[#191716] text-white flex flex-col">
      <Header />
      <ProfileEditModal 
        isOpen={!!editingField} 
        onClose={() => setEditingField(null)} 
        field={editingField} 
      />
      <div className="max-w-7xl mx-auto flex-1 w-full py-12 px-0 mt-16 flex gap-8">
        {/* Left menu */}
        <aside className="w-72 mt-3 backdrop-blur-md rounded-sm p-2 ">
          <ul className="space-y-3 text-xl font-bold">
            {tabs.map((tab) => {
              
              return (
                <li
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center font-semibold gap-3 px-3 py-2 text-3xl rounded-sm cursor-pointer transition ${
                    activeTab === tab.id
                      ? " text-[#ffffff] text-3xl "
                      : "text-[#9c9797] hover:text-[#C4FF00]/90 "
                  }`}
                >
                  
                  {tab.label}
                </li>
              );
            })}
          </ul>
        </aside>
        
        <main className="flex-1 space-y-5">
          {/* Tabs */}
          {activeTab === "overview" && (
            <section className="backdrop-blur-md rounded-2xl p-6 ">
              <h3 className="text-4xl font-bold text-white pb-4 mb-2">
                {t("profile.overview.title")}
              </h3>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="-mt-2.5">
                  <div className="inline-flex justify-between w-full">
                    <h3 className="text-lg font-bold text-white mb-2"> Photo</h3>
                     <Edit size={20} onClick={() => setEditingField('photo')}  className="text-gray-400 self-center cursor-pointer hover:text-white transition"/>
                  </div>
                
                {user?.profilePictureUrl ? (
                  <img
                    src={user?.profilePictureUrl}
                    alt={user.fullName}
                    className="w-64 h-64 rounded-sm object-cover shadow-xl "
                  />
                ) : (
                  <div className="bg-gradient-to-br from-[#C4FF00] to-[#C4FF00]/50 w-56 h-56 text-black rounded-sm flex items-center justify-center text-3xl font-bold shadow-xl">
                    {getInitials(user?.fullName || "")}
                  </div>
                )}      
                </div>

                {/* Basic information */}
                <div className="flex-1 space-y-4">
                  {/* Name field */}
                  <div className="flex flex-col">
                    <label htmlFor="name" className="text-lg -mt-2 font-semibold text-white mb-1">{t("profile.overview.name")}</label>
                    <div className="relative">
                      <input
                        id="name"
                        type="text"
                        value={user?.fullName || ""}
                        readOnly
                        className="bg-[#3D3B3A] font-semibold text-white py-3 px-3  rounded-sm w-full focus:outline-none pr-10"
                      />
                       <Edit size={20} onClick={() => setEditingField('fullName')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white transition" />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="email" className="text-lg font-semibold text-white mb-1">{t("profile.overview.email")}</label>
                    <div className="relative">
                      <input
                        id="email"
                        type="text"
                        value={user?.email || ""}
                        readOnly
                        className="bg-[#3D3B3A] font-semibold text-white py-3 px-3  rounded-sm w-full focus:outline-none pr-10"
                      />
                       <Edit size={20} onClick={() => setEditingField('email')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white transition" />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="flex flex-col">
                    <label htmlFor="password" className="text-lg font-semibold text-white mb-1">{t("profile.overview.password")}</label>
                    <div className="relative">
                      <input
                        id="password"
                        type="password"
                        value="********"
                        readOnly
                        className="bg-[#3D3B3A] font-semibold text-white py-3 px-3 rounded-sm w-full focus:outline-none pr-10"
                      />
                      <Edit size={20} onClick={() => setEditingField('password')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white transition" />
                    </div>
                  </div>

                  {/* -------------------- BUTTONS --------------------- */}
                   <div className="">
                    <button
                      onClick={() => navigate("/movie/history", { state: { user } })}
                      className="w-full flex items-center mt-4 justify-center gap-2 flex-1 px-4 py-2 mb-4 bg-[#C4FF00] hover:bg-[#C4FF00]/80 text-black rounded-sm transition font-semibold"
                    >
                      
                      {t("profile.overview.watchHistory")}
                    </button>
                    <button
                      onClick={() => {
                        navigate("/favorites");
                        window.location.reload();
                      }}
                      className="w-full flex items-center justify-center gap-2 flex-1 px-4 py-2 mb-4 bg-[#C4FF00] hover:bg-[#C4FF00]/80 text-black font-semibold rounded-sm transition"
                    >
                      {t("profile.overview.favorites")}
                    </button>
                    <button
                      onClick={() => {
                        navigate("/for-later");
                        window.location.reload();
                      }}
                      className="w-full flex items-center justify-center gap-2 flex-1 px-4 py-2 mb-4 bg-[#a09d9c] hover:bg-[#3D3B3A]/80 text-black font-semibold rounded-sm transition"
                    >
                      
                      {t("profile.overview.forLater")}
                    </button>
                  </div>
                  <div className="">
                    {/* <button
                      onClick={() => setIsEditOpen(true)}
                      className="w-full mb-4 flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-[#3D3B3A]  hover:bg-[#3D3B3A]/80 rounded-sm transition font-medium"
                    >
                      
                      {t("profile.overview.editProfile")}
                    </button> */}
                    <button
                      onClick={() => {
                        localStorage.removeItem("accessToken");
                        navigate("/login");
                        window.location.reload();
                      }}
                      className="w-full flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-[#ca0101] hover:bg-[#ca0101]/80 font-semibold rounded-sm transition"
                    >
                      
                      {t("profile.overview.logOut")}
                    </button>
                  </div>
                {/* -------------------- BUTTONS --------------------- */}
                </div>
              </div>
             
            </section>
          )}

          {activeTab === "subscription" && (
            <section className="p-6">
              <h3 className="text-3xl font-semibold text-white pb-6">
                {t("profile.subscription.title")}
              </h3>

              {cardsLoading && (
                <p className="text-gray-400">{t("profile.loading")}</p>
              )}

              {!cardsLoading && (
                <>
                  {cards?.map((card) => (
                    <div key={card.id} className="mb-6">
                      {/* Блок з планом */}
                      <div className="bg-lime-800/70  rounded-lg shadow-lg overflow-hidden border border-lime-700">
                        <div className="p-4 text-white  space-y-2">
                          <h4 className="text-lg font-semibold">
                            {user?.subscriptionType.toUpperCase() || "Standart"}
                          </h4>
                          <p className="text-sm text-gray-200">
                            {user?.subscriptionType.toLowerCase() === "basic" ? "1 device, 720p (HD)" : 
                             user?.subscriptionType.toLowerCase() === "standard" ? "2 devices, 1080p (Full HD)" : 
                             user?.subscriptionType.toLowerCase() === "premium" ? "4 devices, 4K (Ultra HD) + HDR" :
                             ""}
                          </p>
                          <p className="text-sm text-gray-300">
                            {t("profile.subscription.startDate")}: {t("profile.subscription.date")}
                          </p>
                          <p className="text-sm text-gray-300">
                            {t("profile.subscription.nextPayment")}: {t("profile.subscription.nextDate")}
                          </p>

                          <div className="flex items-center gap-2 mt-3">
                            <img
                              src={
                                card.brand.toLowerCase() === "visa" ? visa :
                                card.brand.toLowerCase() === "mastercard" ? mastercard :
                                card.brand.toLowerCase() === "amex" ? amex :
                                visa // fallback
                              }
                              alt={card.brand}
                              className="h-6"
                            />
                            <span className="tracking-widest text-sm">
                              •••• •••• •••• {card.last4}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate("/choose-plan")}
                          className="w-full py-2 bg-black/40 text-white text-sm hover:bg-black/60 transition border-t border-lime-700">
                            {t("profile.subscription.changePlan")}
                        </button>
                      </div>

                      <div className="bg-lime-800/70 rounded-lg shadow-lg overflow-hidden border border-lime-700 mt-4">
                        <div className="p-4 text-white space-y-2">
                          <h4 className="text-lg font-semibold">Next payment</h4>
                          <p className="text-sm text-gray-300">
                            {t("profile.subscription.nextDate")}
                          </p>
                          <p className="text-sm text-gray-300">
                            {t("profile.subscription.startDate")}: {t("profile.subscription.date")}
                          </p>

                          <div className="flex items-center gap-2 mt-3">
                            <img
                              src={
                                card.brand.toLowerCase() === "visa" ? visa :
                                card.brand.toLowerCase() === "mastercard" ? mastercard :
                                card.brand.toLowerCase() === "amex" ? amex :
                                visa
                              }
                              alt={card.brand}
                              className="h-6"
                            />
                            <span className="tracking-widest text-sm">
                              •••• •••• •••• {card.last4}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setEditingCard(card)}
                          className="w-full py-2 bg-black/40 text-white text-sm hover:bg-black/60 transition border-t border-lime-700"
                        >
                          Change payment method
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              <button
                onClick={handleCancel}
                className="w-full py-2 bg-[#9A0000] text-white text-sm hover:bg-[#7A0000] transition rounded-sm"
              >
                Cancel subscription
              </button>
            </section>
          )}

          
          {editingCard && (
            <EditCardModal
              card={editingCard}
              isOpen={!!editingCard}
              onClose={() => setEditingCard(null)}
              onUpdate={handleUpdateCard}
            />
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