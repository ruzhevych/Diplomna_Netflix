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

  const menuItems = [
    { path: "/movies", label: "Movies" },
    { path: "/tvseries", label: "TV Series" },
    { path: "/anime", label: "Anime" },
    { path: "/cartoons", label: "Cartoons" },
    { path: "/newandpopular", label: "New & Popular" },
  ];

  return (
    <header
      className={`fixed top-0 w-full bg-black/95 backdrop-blur-md z-20 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto flex items-left justify-between py-4 px-6">
        <Link to="/home">
          <img src={logo} alt="Logo" className="w-28" />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-white font-medium">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-white hover:text-lime-400 transition no-underline ${
          location.pathname === item.path ? "border-b-2 border-lime-400 pb-1" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
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
