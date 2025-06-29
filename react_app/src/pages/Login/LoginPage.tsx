import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginAPI } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await loginAPI({ email, password });
      login(res.token); // глобально
      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className='container text-center mt-5'>
    <div className="auth-page">
      <div className="auth-form">
        <h2>Увійти</h2>
        <form onSubmit={handleLogin}>
          <input className='formInput'
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <input className='formInput'
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <button type="submit" className='loginregBtn'>Увійти</button>
        </form>
        <button type="button"
        className="loginregBtn mt-3"
        onClick={() => navigate('/')}
        >
        На головну
        </button>
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
    </div>
  );
};

export default LoginPage;