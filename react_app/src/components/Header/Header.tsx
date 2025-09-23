// src/components/Header.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, type FormEvent } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import FilterPanel from "../FilterPanel";
import { useGetProfileQuery } from "../../services/userApi";
import { getInitials } from "../../utils/getInitials";
import {
  LogOut,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from 'lucide-react';

import logo from "../../../public/logo-green.png";

const Header = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const [showFilters, setShowFilters] = useState(false);
  const { data: user } = useGetProfileQuery();


  const [menuOpen, setMenuOpen] = useState(false);

  const allowedPaths = ["/movies", "/tvseries", "/anime", "/cartoons", "/newandpopular"];
  const isFilterVisible = allowedPaths.includes(location.pathname);



  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY.current = window.scrollY;
    };


    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);




  const menuItems = [
    { path: "/movies", label: t("menu.movies") },
    { path: "/tvseries", label: t("menu.tvseries") },
    { path: "/anime", label: t("menu.anime") },
    { path: "/cartoons", label: t("menu.cartoons") },
    { path: "/newandpopular", label: t("menu.newAndPopular") },
  ];

  return (
    <header
      className={`fixed top-0 w-full bg-[#171716]/100 backdrop-blur-md z-20 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-left justify-between py-4 px-24">
        <div className="flex items-left">
          <Link to="/home">
            <img src={logo} alt="Logo" className="w-28" />
          </Link>
          <nav className="hidden md:flex ml-24 items-center gap-6 text-white font-medium">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-white hover:text-lime-400 transition no-underline ${
                  location.pathname === item.path
                    ? "border-b-2 border-lime-400 pb-1"
                    : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 relative">

          <form onSubmit={handleSearch} className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-40 px-3 py-1 rounded bg-zinc-800 text-white text-sm focus:outline-none focus:ring-1 focus:ring-lime-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-lime-400"
            >
              <Search size={18} />
            </button>
          </form>

          <button
            onClick={() => setShowFilters(true)}
            className="text-gray-300 ml-3 hover:text-lime-400 transition"
          >
            <SlidersHorizontal size={22} />
          </button>

          {showFilters && <FilterPanel onClose={() => setShowFilters(false)} />}

          <LanguageSwitcher />

          <div className="relative">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="flex items-center gap-1 focus:outline-none"
            >
              {user?.profilePictureUrl ? (
                <img
                  src={user?.profilePictureUrl}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-sm object-cover shadow-xl "
                />
              ) : (
                <div className="bg-gradient-to-br from-[#C4FF00] to-[#C4FF00]/50 w-8 h-8 text-black rounded-sm flex items-center justify-center text-xs font-bold shadow-xl">
                  {getInitials(user?.fullName || "")}
                </div>
              )}
                <ChevronDown
                            className="-mr-1 h-5 w-5 text-gray-400 transition-transform duration-200"
                            aria-hidden="true"
                            style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                <path d="M5.25 7.5L10 12.25 14.75 7.5H5.25z" />
              
            </button>

            {menuOpen && (
              <div className="absolute  left-1/3 -translate-x-1/2 mt-2 w-48 bg-black/60 text-white rounded-sm shadow-lg py-1 z-50">
                <Link
                  to="/profile"
                  className="flex no-underline items-center gap-2 px-4 py-2 text-white hover:bg-neutral-800"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  Account
                </Link>
                {/* <Link
                  to="/profiles"
                  className="flex no-underline items-center gap-2 text-white px-4 py-2 hover:bg-neutral-800"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3L19 5c0-1.66-1.34-3-3-3s-3 1.34-3 3v3c0 1.66 1.34 3 3 3zM6 11c1.66 0 2.99-1.34 2.99-3L9 5c0-1.66-1.34-3-3-3S3 3.34 3 5v3c0 1.66 1.34 3 3 3zm10 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zM6 13c-2.33 0-7 1.17-7 3.5V19h7v-2.5c0-2.33 4.67-3.5 7-3.5z" />
                  </svg>
                  Managing Profiles
                </Link> */}
                <div className="border-t w-10/12 items-center justify-center ml-4 border-neutral-700 my-2" />
                <button
                  onClick={() => {
                    
                    localStorage.removeItem("accessToken");
                    navigate("/login");
                  }}
                  className="flex items-left items-center gap-2 flex-1 px-4 py-2  hover:font-semibold rounded-sm transition">
                  <LogOut size={18} />
                  {t("profile.overview.logOut")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
