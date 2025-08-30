import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils/getInitials";
import { useForgotPasswordMutation } from "../services/authApi";
import { toast } from "react-toastify";
import type { UserProfile } from "../types/user";
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
} from "lucide-react";
import { useGetProfileQuery } from "../services/userApi";
import ChangePasswordRequest from "../components/ChangePasswordRequest";


const tabs = [
  { id: "overview", label: "Огляд", icon: User },
  { id: "subscription", label: "Підписка", icon: CreditCard },
  { id: "security", label: "Безпека", icon: Shield },
  { id: "devices", label: "Пристрої", icon: MonitorSmartphone },
  { id: "profiles", label: "Профілі", icon: Users },
];

const ProfilePage = () => {
  const { data: user, error, isLoading } = useGetProfileQuery();
  // const [user, setUser] = useState<UserProfile | null>(null);
  // const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     const token = localStorage.getItem("accessToken");
  //     if (!token) {
  //       navigate("/login");
  //       return;
  //     }

  //     try {
  //       const res = await fetch("http://localhost:5170/api/Users/profile", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
        

  //       if (!res.ok) throw new Error("Помилка при завантаженні профілю");

  //       const data = await res.json();
  //       setUser({
  //         ...data,
  //         avatarUrl: data.profilePictureUrl,
  //       });
  //     } catch (err: any) {
  //       setError(err.message);
  //     }
  //   };

  //   fetchProfile();
  // }, []);

  if (error)
    return <p className="text-red-500 text-center mt-10">{(error as any).data?.message || "Помилка"}</p>;
  if (isLoading)
    return <p className="text-center mt-10 text-white">Завантаження...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white flex flex-col">
      <Header />

      <div className="max-w-7xl mx-auto flex-1 w-full py-12 px-6 mt-16 flex gap-8">
        {/* Ліве меню */}
        <aside className="w-56 bg-[#141414]/80 backdrop-blur-md rounded-sm p-6 shadow-xl ">
          <h2 className="text-lg font-bold mb-6 text-gray-200 tracking-wide">
            Обліковий запис
          </h2>
          <ul className="space-y-3 text-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-sm cursor-pointer transition ${
                    activeTab === tab.id
                      ? "bg-lime-500/20 text-lime-400 font-semibold"
                      : "text-gray-300 hover:text-lime-400 hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Основний контент */}
        <main className="flex-1 space-y-5">
          {/* Вкладки */}
          {activeTab === "overview" && (
  <section className="bg-[#141414]/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl  transition hover:scale-[1.01] duration-300">
    <h3 className="text-2xl font-bold text-white pb-4 border-b border-gray-700 mb-6">
      Профіль користувача
    </h3>

    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
      {/* Аватар */}
      {user?.profilePictureUrl ? (
        <img
          src={user.profilePictureUrl}
          alt={user.fullName}
          className="w-24 h-24 rounded-full object-cover shadow-xl border-2 border-gray-700"
        />
      ) : (
        <div className="bg-gradient-to-br from-lime-400 to-green-600 text-black w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-xl">
          {getInitials(user?.fullName || "")}
        </div>
      )}

      {/* Основна інформація */}
      <div className="flex-1 flex flex-col gap-0">
        <p className="text-2xl font-semibold text-lime-400">{user?.fullName}</p>
        <p className="text-gray-400">{user?.email}</p>
        <p className="text-gray-400">
          <span className="font-semibold text-l text-gray-200">Роль:</span> {user?.role || "Користувач"}
        </p>
        <p className="text-gray-400">
          <span className="font-semibold text-gray-200">Статус:</span> {user?.isActive ? "Активний ✅" : "Неактивний ❌"}
        </p>
        <p className="text-gray-400">
          <span className="font-semibold text-gray-200">Реєстрація:</span> {new Date(user?.createdAt || "").toLocaleDateString()}
        </p>
        <p className="text-gray-400">
          <span className="font-semibold text-gray-200">Улюблені фільми:</span> {user?.favoritesCount || 0}
        </p>
      </div>
    </div>

    
    <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-2">
      <div className="bg-gray-800/60 rounded-lg p-3 text-center shadow-md hover:bg-gray-700 transition">
        <p className="text-lg font-bold text-white">{user?.watchTime || 0} годин</p>
        <p className="text-gray-400 text-sm">Переглянуто</p>
      </div>
      <div className="bg-gray-800/60 rounded-lg p-3 text-center shadow-md hover:bg-gray-700 transition">
        <p className="text-lg font-bold text-white">{user?.reviewsCount || 0}</p>
        <p className="text-gray-400 text-sm">Вподобані</p>
      </div>
      
    </div>
  </section>
)}


          {activeTab === "subscription" && (
            <section className="bg-[#141414]/80 backdrop-blur-md rounded-sm p-6 shadow-lg ">
              <h3 className="text-xl font-semibold text-gray-100 pb-3 mb-6 -b -gray-700">
                Інформація про підписку
              </h3>
              <div className="space-y-3">
                <p>
                  <span className="text-gray-400">План: </span>
                  <span className="font-medium text-lime-400">
                    {user?.subscriptionType || "Не вказано"}
                  </span>
                </p>
                <button className="px-4 py-2  -lime-500 text-lime-400 hover:bg-lime-500 hover:text-black rounded-sm transition font-medium">
                  Змінити план
                </button>
              </div>
            </section>
          )}

          {activeTab === "security" && (
        <section className="bg-[#141414]/80 backdrop-blur-md rounded-sm p-6 shadow-lg space-y-4">
          <h3 className="text-xl font-semibold text-gray-100 pb-3 mb-6 border-b border-gray-700">
            Безпека
          </h3>

          <p className="text-gray-400 mb-4">
            🔒 Керування паролем та безпекою вашого акаунту.
          </p>

          {/* Зміна пароля через email */}
          <ChangePasswordRequest email={user?.email || ""} />
        </section>
      )}

          {activeTab === "devices" && (
            <section className="bg-[#141414]/80 backdrop-blur-md rounded-sm p-6 shadow-lg ">
              <h3 className="text-xl font-semibold text-gray-100 pb-3 mb-6 -b -gray-700">
                Пристрої
              </h3>
              <p className="text-gray-400">📱 Тут список активних пристроїв.</p>
            </section>
          )}

          {activeTab === "profiles" && (
            <section className="bg-[#141414]/80 backdrop-blur-md rounded-sm p-6 shadow-lg ">
              <h3 className="text-xl font-semibold text-gray-100 pb-3 mb-6 -b -gray-700">
                Профілі
              </h3>
              <p className="text-gray-400">
                👥 Тут можна буде керувати профілями користувачів.
              </p>
            </section>
          )}

          {/* Кнопки */}
          <div className="flex justify-between gap-4">
            <button
              onClick={() => navigate("/profile/edit", { state: { user } })}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-transparent border border-lime-500 hover:bg-lime-700 rounded-sm transition font-medium"
            >
              <Edit size={18} />
              Редагувати профіль
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                navigate("/login");
              }}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-sm transition"
            >
              <LogOut size={18} />
              Вийти
            </button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
