import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';


const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await register({ fullName, email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className='container text-center mt-5'>
    <div className="auth-page">
        <div className="auth-form">
            <h2>Реєстрація</h2>
            <form onSubmit={handleRegister}>
            <input className='formInput'
                type="text"
                placeholder="Ім’я"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
            />
            <br />
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
            <button type="submit" className='loginregBtn'>Зареєструватися</button>
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

export default RegisterPage;