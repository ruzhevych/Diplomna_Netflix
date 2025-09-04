import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, type FormEvent } from "react";
import { Search, User } from "lucide-react";

import logo from "../../../public/logo-green.png";

const Header = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

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

  

  return (
    <header
      className={`fixed top-0 w-full bg-black/95 backdrop-blur-md z-20 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto flex items-left justify-between py-4 px-6">
        {/* Лого */}
        <Link to="/home">
          <img src={logo} alt="Logo" className="w-28" />
        </Link>

        {/* Навігація */}
        <nav className="hidden md:flex items-center gap-6 text-white font-medium">
          <Link to="/home">
          <p className="text-white hover:text-lime-400 transition no-underline">Return Home</p>
         </Link>
        </nav>

        {/* Праворуч: пошук і профіль */}
        <div className="flex items- gap-4 font-bold">
          ADMIN DASHBOARD

          {/* Іконка профілю */}
          <Link
            to="/profile"
            className="text-gray-300 hover:text-lime-400 transition"
          >
            <User size={22} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
