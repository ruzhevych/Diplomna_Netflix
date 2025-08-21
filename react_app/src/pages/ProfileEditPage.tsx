import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateUserMutation } from "../services/userApi";
import type { UserProfile } from "../types/user";

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

        // 🔥 Заповнюємо поля тільки коли дані прийшли
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#141414] p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold">Редагування профілю</h2>

        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Повне ім’я"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Новий пароль (не обов'язково)"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded"
        />

        <button
          type="submit"
          className="w-full py-2 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-lg"
        >
          Зберегти
        </button>
      </form>
    </div>
  );
};

export default ProfileEditPage;
