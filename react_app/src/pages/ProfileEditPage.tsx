import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateUserMutation } from "../services/userApi";
import type { UserProfile } from "../types/user";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

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
          className="bg-[#141414]/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-lg space-y-6 border border-gray-800"
        >
          <h2 className="text-3xl font-bold text-center text-lime-400">
            Редагування профілю
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Повне ім’я"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-lime-500 outline-none"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-lime-500 outline-none"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Новий пароль (не обов'язково)"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-lime-500 outline-none"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-300 focus:ring-2 focus:ring-lime-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-lg transition duration-200 shadow-md"
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
