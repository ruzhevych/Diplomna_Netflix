// src/components/LanguageSwitcher.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setIsOpen(false); 
  };

  const currentLanguage = i18n.language.toUpperCase();

  return (
    <div className="relative inline-block text-left z-50">
      <div>
        <button
          type="button"
          className="inline-flex justify-center items-center gap-x-1.5 rounded-md bg-transparent px-3 py-2 text-white font-semibold "
          onClick={() => setIsOpen(!isOpen)}
        >
          {currentLanguage}
          <ChevronDown
            className="-mr-1 h-5 w-5 text-gray-400 transition-transform duration-200"
            aria-hidden="true"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-20 origin-top-right rounded-md bg-[#191716] ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <button
              onClick={() => changeLanguage('ua')}
              className="text-white hover:bg-gray-700 block w-full text-left px-4 py-2 text-sm"
            >
              UA
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className="text-white hover:bg-gray-700 block w-full text-left px-4 py-2 text-sm"
            >
              EN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;