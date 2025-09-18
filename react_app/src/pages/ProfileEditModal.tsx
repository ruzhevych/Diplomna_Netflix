import { useState, useEffect } from "react";
import { useUpdateUserMutation } from "../services/userApi";
import type { UserProfile } from "../types/user";
import { User, Mail, Lock, Image as ImageIcon, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditModal = ({ isOpen, onClose }: ProfileEditModalProps) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    if (!isOpen) return;

    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

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
  }, [isOpen]);

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
      onClose();
    } catch (err) {
      console.error(t("profileEditModal.error"), err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 opacity-100"
      />
      <div
        className="relative bg-white/5 backdrop-blur-xl p-8 rounded-sm shadow-2xl w-full max-w-lg text-white
                    transform transition-all duration-300 scale-100 opacity-100"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col items-center space-y-3">
          <h2 className="text-3xl font-bold text-lime-400 drop-shadow-md">
            {t("profileEditModal.title")}
          </h2>
          <div className="relative">
            <img
              src={
                avatar
                  ? URL.createObjectURL(avatar)
                  : `http://localhost:5170${user?.profilePictureUrl}` || "/default-avatar.png"
              }
              alt={t("profileEditModal.avatarAlt")}
              className="w-28 h-28 rounded-sm object-cover border-1 border-lime-500 shadow-lg"
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
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <User className="absolute top-4 left-3 text-gray-400" size={20} />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("profileEditModal.namePlaceholder")}
              className="w-full pl-10 pr-4 py-3 rounded-sm bg-black/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-500 outline-none transition"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-4 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("profileEditModal.emailPlaceholder")}
              className="w-full pl-10 pr-4 py-3 rounded-sm bg-black/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-500 outline-none transition"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-4 text-gray-400" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("profileEditModal.passwordPlaceholder")}
              className="w-full pl-10 pr-4 py-3 rounded-sm bg-black/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-500 outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-sm transition duration-200 shadow-md shadow-lime-500/30 hover:shadow-lime-500/50"
          >
            {t("profileEditModal.saveChanges")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;