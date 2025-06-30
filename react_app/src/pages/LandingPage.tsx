import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const LandingPage: React.FC = () => {

  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="overlay">
        <header className="landing-header">
          <img src="/logo.png" alt="Netflix Logo" className="logo" />
          <div>
            <select className="lang-select">
              <option value="ua">Українська</option>
              <option value="en">English</option>
            </select>
            <Link to="/login">
              <button className="btn-login">Увійти</button>
            </Link>
          </div>
        </header>

        <main className="landing-main">
          <h1>Фільми, серіали й інший контент без обмежень</h1>
          <h2>За ціною від 4,99 EUR. Скасувати підписку можна будь-коли.</h2>
          <p>Готові до перегляду? Введіть адресу електронної пошти, щоб оформити або поновити підписку.</p>
          <div className="email-form">
            <input type="email" placeholder="Адреса електронної пошти" />
            <button onClick={() => navigate('/register')}>Почати</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
