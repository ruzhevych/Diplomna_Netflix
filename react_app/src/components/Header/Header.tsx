import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <nav className="container">
        <h1 className="logo">Netflix Clone</h1>
        <ul className="nav-links">
          <li><Link to="/">Головна</Link></li>
          <li><Link to="/about">Про нас</Link></li>
          <li><Link to="/login">Увійти</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;