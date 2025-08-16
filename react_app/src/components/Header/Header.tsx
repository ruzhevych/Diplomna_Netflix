import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { Search, User } from "lucide-react";

import logo from "../../../public/logo-green.png";

const Header = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <header className="fixed top-0 w-full bg-black/70 backdrop-blur-md z-20">
      <div className="container mx-auto flex items-left justify-between py-4 px-6">
        {/* Лого */}
        <Link to="/home">
          <img src={logo} alt="Logo" className="w-28" />
        </Link>

        {/* Навігація */}
        <nav className="hidden md:flex items-center gap-6 text-white font-medium">
          <Link to="/movies" className=" text-white hover:text-lime-400">
            Movies
          </Link>
          <Link to="/tv" className="text-white hover:text-lime-400">
            TV Series
          </Link>
          <Link to="/anime" className="text-white hover:text-lime-400">
            Anime
          </Link>
          <Link to="/cartoons" className="text-white hover:text-lime-400">
            Cartoons
          </Link>
          <Link to="/popular" className="text-white hover:text-lime-400">
            New & Popular
          </Link>
        </nav>

        {/* Праворуч: пошук і профіль */}
        <div className="flex items-center gap-4">
          {/* Пошук (іконка відкриває інпут) */}
          <form
            onSubmit={handleSearch}
            className="relative hidden md:block"
          >
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
