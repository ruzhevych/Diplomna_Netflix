import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useGetProfileQuery } from "../services/userApi";
import ChangePasswordRequest from "../components/ChangePasswordRequest";
import type { IUserAuth } from "../types/user";
import ProfileEditModal from "./ProfileEditModal";



const tabs = [
  { id: "overview", label: "Огляд", icon: User },
  { id: "subscription", label: "Підписка", icon: CreditCard },
  { id: "security", label: "Безпека", icon: Shield },
  { id: "devices", label: "Пристрої", icon: MonitorSmartphone },
  // { id: "profiles", label: "Профілі", icon: Users },
];

const ProfilePage = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: user, error, isLoading } = useGetProfileQuery();
  // const [user, setUser] = useState<UserProfile | null>(null);
  // const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const [userAuth] = useState<IUserAuth | null>(null);
  

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
    return <p className="text-center mt-10 bg-gradient-to-b ">Downloading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white flex flex-col">
      <Header />
      <ProfileEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
      <div className="max-w-7xl mx-auto flex-1 w-full py-12 px-0 mt-16 flex gap-8">
        {/* Ліве меню */}
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
          <section className=" backdrop-blur-md rounded-2xl p-6 shadow-2xl  transition hover:scale-[1.01] duration-300">
            <h3 className="text-3xl font-bold text-white pb-4 border-b border-gray-700 mb-6">
              User Profile
            </h3>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Аватар */}
              {user?.profilePictureUrl ? (
                <img
                  src={user?.profilePictureUrl ? `http://localhost:5170${user.profilePictureUrl}` : "/default-avatar.png"}
                  alt={user.fullName}
                  className="w-56 h-56 rounded-sm object-cover shadow-xl border-2 border-gray-700"
                />
              ) : (
                <div className="bg-gradient-to-br from-lime-400 to-green-600 text-black w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-xl">
                  {getInitials(user?.fullName || "")}
                </div>
                
      )}

      {/* Основна інформація */}
      <div className="flex-1 flex flex-col gap-0">
        <p className="text-l font-regular text-white-400">Name: <p className="text-2xl font-semibold text-lime-400">{user?.fullName}</p></p>
         <p className="text-l font-regular text-white-400">E-mail: <p className="text-gray-400">{user?.email}</p></p>
      </div>
    </div>
    <div className="flex gap-4 mt-10">
            <button
              onClick={() => navigate("/profile/edit", { state: { user } })}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2  bg-lime-500 hover:bg-lime-600 text-black rounded-sm transition font-medium"
            >
              <History size={18} />
              Watch history
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                navigate("/login");
              }}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-sm transition"
            >
              <Book size={18} />
              Favorites
            </button>
          </div>
            <div className="flex gap-4 mt-3">
                    <button
          onClick={() => setIsEditOpen(true)}
          className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-transparent border border-lime-500 hover:bg-lime-700 rounded-sm transition font-medium"
        >
          <Edit size={18} />
          Edit profile
        </button>

        
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                navigate("/login");
              }}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-transparent border border-lime-500 hover:bg-lime-700 font-semibold rounded-sm transition"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
  </section>
  
    )}
          {activeTab === "subscription" && (
            <section className="backdrop-blur-md rounded-sm p-6 shadow-lg ">
              <h3 className="text-3xl font-semibold text-gray-100 pb-3 mb-6 -b -gray-700">
                Subscription
              </h3>
              <div className="space-y-3 w-full bg-lime-400/30 rounded-sm p-3 text-white">
                <div>
                  <span className="font-medium text-xl">
                    {user?.subscriptionType || "Не вказано"}
                  </span>
                  </div>
                <button className="px-0 py-1 w-full text-white hover:text-black/10 transition font-medium">
                  <hr />
                  Change plan
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
          {userAuth?.isUser && (
            
              <button
                className={`text-left text-lg font-medium transition ${
                  activeTab === "admin"
                    ? "text-lime-400"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("admin")}
              >
                Admin Panel
              </button>
            )}

          {/* {activeTab === "profiles" && (
            <section className="bg-[#141414]/80 backdrop-blur-md rounded-sm p-6 shadow-lg ">
              <h3 className="text-xl font-semibold text-gray-100 pb-3 mb-6 -b -gray-700">
                Профілі
              </h3>
              <p className="text-gray-400">
                👥 Тут можна буде керувати профілями користувачів.
              </p>
            </section>
          )} */}

          {/* Кнопки */}
          
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
