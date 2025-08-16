import { Link, useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import logo from '../../../public/logo-green.png';

const Header = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <header className="fixed top-0 w-full bg-black bg-opacity-90 z-20">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/home">
          <img src={logo} alt="Logo" className="l-10 w-32"/>
        </Link>
        <form onSubmit={handleSearch} className="flex-1 mx-6">
          <input
            type="text"
            placeholder="Пошук фільмів, серіалів..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white focus:outline-none"
          />
        </form>
        <nav className="flex items-center gap-4">
          <Link to="/profile" className="text-white hover:underline">
            Профіль
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
