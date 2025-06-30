import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    // <header className="bg-black text-white p-4 flex justify-between items-center">
    //   <Link to="/" className="text-2xl font-bold text-red-600">MyFlix</Link>
    //   <nav className="flex gap-4">
    //     {isAuthenticated ? (
    //       <>
    //         <Link to="/home" className="hover:underline">Головна</Link>
    //         <Link to="/profile" className="hover:underline">Профіль</Link>
    //         <button onClick={logout} className="text-red-400 hover:text-red-600">Вийти</button>
    //       </>
    //     ) : (
    //       <>
    //         <Link to="/login" className="hover:underline">Увійти</Link>
    //         <Link to="/register" className="hover:underline">Реєстрація</Link>
    //       </>
    //     )}
    //   </nav>
    // </header>
    <header className="bg-black text-white px-8 py-4 flex items-center justify-between shadow-lg">
      <div
        className="text-2xl font-bold cursor-pointer text-red-600"
        onClick={() => navigate('/home')}
      >
        NetflixClone
      </div>

      <nav className="space-x-6 hidden md:block">
        <button onClick={() => navigate('/home')} className="hover:text-red-500 transition">
          Головна
        </button>
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

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 transition px-4 py-1 rounded text-sm"
      >
        Вийти
      </button>
    </header>
  );
};

export default Header;
