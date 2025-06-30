import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-black text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-red-600">MyFlix</Link>
      <nav className="flex gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/home" className="hover:underline">Головна</Link>
            <Link to="/profile" className="hover:underline">Профіль</Link>
            <button onClick={logout} className="text-red-400 hover:text-red-600">Вийти</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Увійти</Link>
            <Link to="/register" className="hover:underline">Реєстрація</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
