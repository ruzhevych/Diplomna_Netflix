
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react'; 

interface LogoutConfirmModalProps {
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const LIME_COLOR_TAILWIND = "lime-400"; 
  const RED_COLOR_TAILWIND = "red-600"; 

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm"
      onClick={onClose} 
    >
      <div 
        
        className={`bg-[#191716] rounded-xl max-w-sm mx-auto w-full p-8 relative shadow-2xl border-2 border-${LIME_COLOR_TAILWIND}`}
        onClick={(e) => e.stopPropagation()} 
      >
        
        <div className="flex flex-col items-center justify-center text-center">
            <LogOut size={48} className={`text-${LIME_COLOR_TAILWIND} mb-4`} />
            
            <p className="text-gray-200 text-xl font-medium mb-8">
              {t("profile.LogOutModal.message") || "Ви впевнені, що хочете вийти зі свого облікового запису?"}
            </p>
        </div>

        <div className="flex justify-center gap-4 items-center">
          
          <button
            onClick={onClose} 
            className={`flex-1 text-white border border-${LIME_COLOR_TAILWIND} px-4 py-3 rounded-md hover:bg-gray-700 transition font-semibold`}
          >
            {t("profile.LogOutModal.cancel") || "Скасувати"}
          </button>
          
          <button
            onClick={onConfirm} 
            className={`flex-1 bg-${RED_COLOR_TAILWIND} text-white px-4 py-3 rounded-md hover:bg-red-700 transition font-semibold`}
          >
            {t("profile.LogOutModal.confirmLogout") || "Вийти"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;