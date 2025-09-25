import { useState, useEffect } from "react";
import { useUpdateUserMutation } from "../services/userApi";
import type { UserProfile } from "../types/user";
import { User, Mail, Lock, Image as ImageIcon, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: string | null;
  user: UserProfile | null;
}

const ProfileEditModal = ({ isOpen, onClose, field, user }: ProfileEditModalProps) => {
  const { t } = useTranslation();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const [updateUser] = useUpdateUserMutation();

  // Synchronize user data with the form's initial state when the modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [isOpen, user]);

  // Reset the state when the modal closes
  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setAvatar(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData();
    formData.append("Id", user.id.toString());
    
    if (field === 'fullName') {
      formData.append("FullName", fullName);
    } else if (field === 'email') {
      formData.append("Email", email);
    } else if (field === 'password') {
      if (password) formData.append("Password", password);
    } else if (field === 'photo') {
      if (avatar) formData.append("ProfilePictureFile", avatar);
    }

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
        className="relative bg-[#191716] backdrop-blur-xl p-8 rounded-lg  w-full max-w-lg text-white
                    transform transition-all duration-300 scale-100 opacity-100 shadow-[0_0_5px_#C4FF00]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col items-left space-y-3">
          <h2 className="text-3xl font-bold text-white mt-3 drop-shadow-md">
            {t("profileEditModal.title")}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          {field === 'photo' && (
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <img
                  src={
                    avatar
                      ? URL.createObjectURL(avatar)
                      : user?.profilePictureUrl
                  }
                  alt={t("profileEditModal.avatarAlt")}
                  className="w-28 h-28 rounded-sm object-cover border-1 border-lime-500"
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
          )}

          {field === 'fullName' && (
            <div className="relative">
              
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("profileEditModal.namePlaceholder")}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#191716] border-1 text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-500 outline-none transition"
              />
            </div>
          )}

          {field === 'email' && (
            <div className="relative">
              
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("profileEditModal.emailPlaceholder")}
                className="w-full pl-10 pr-4 py-3 rounded-sm bg-[#191716] text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-500 outline-none transition"
              />
            </div>
          )}

          {field === 'password' && (
            <div className="relative">
              
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("profileEditModal.passwordPlaceholder")}
                className="w-full pl-10 pr-4 py-3 rounded-sm bg-[#191716] text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-500 outline-none transition"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-[#C4FF00] hover:bg-lime-600 text-black font-semibold rounded-lg text-xl transition duration-200  shadow-lime-500/30"
          >
            {t("profileEditModal.saveChanges")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;