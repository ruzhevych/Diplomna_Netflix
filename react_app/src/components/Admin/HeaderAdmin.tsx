
import { Link } from "react-router-dom";
import logo from "../../../public/logo-green.png";

const HeaderAdmin = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-28" />
          </Link>
        </div>
        <nav className="flex items-center space-x-6">
          <Link
            to="/home"
            className="text-gray-400 hover:text-white transition-colors duration-200 underline"
          >
            Return Home
          </Link>
          <div className="font-semibold text-white">ADMIN DASHBOARD</div>
        </nav>
      </div>
    </header>
  );
};

export default HeaderAdmin;