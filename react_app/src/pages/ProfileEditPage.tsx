import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateUserMutation } from "../services/userApi";
import type { UserProfile } from "../types/user";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { User, Mail, Lock, Image as ImageIcon } from "lucide-react";

const ProfileEditPage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const [updateUser] = useUpdateUserMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await fetch("http://localhost:5170/api/Users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data: UserProfile = await res.json();
        setUser(data);

        setFullName(data.fullName || "");
        setEmail(data.email || "");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData();
    formData.append("Id", user.id.toString());
    formData.append("FullName", fullName);
    formData.append("Email", email);
    if (password) formData.append("Password", password);
    if (avatar) formData.append("ProfilePictureFile", avatar);

    try {
      await updateUser(formData).unwrap();
      navigate("/profile");
    } catch (err) {
      console.error("Помилка оновлення:", err);
    }
  };

  if (!user) {
    return <p className="text-center text-gray-400 mt-10">Завантаження...</p>;
  }

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="relative bg-[#141414]/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-lg space-y-6 "
        >
          {/* Аватар */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <img
                src={
                  avatar
                    ? URL.createObjectURL(avatar)
                    : user.profilePictureUrl || "/default-avatar.png"
                }
                alt="Avatar"
                className="w-28 h-28 rounded-full object-cover border-4 border-lime-500 shadow-lg"
              />
              <label className="absolute bottom-0 right-0 bg-lime-500 text-black p-2 rounded-full cursor-pointer hover:bg-lime-600 transition">
                <ImageIcon size={18} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
            <h2 className="text-3xl font-extrabold text-lime-400 drop-shadow-md">
              Редагування профілю
            </h2>
          </div>

          {/* Інпути */}
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Повне ім’я"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/80 text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-500 outline-none transition"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/80 text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-500 outline-none transition"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Новий пароль (не обов'язково)"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/80 text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-500 outline-none transition"
              />
            </div>
          </div>

          {/* Кнопка */}
          <button
            type="submit"
            className="w-full py-3 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-lg transition duration-200 shadow-md shadow-lime-500/30 hover:shadow-lime-500/50"
          >
            Зберегти зміни
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default ProfileEditPage;
