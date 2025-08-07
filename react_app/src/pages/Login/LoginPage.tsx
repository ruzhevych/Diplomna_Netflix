import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login({ email, password });
      loginContext(res.accessToken);
      toast.success("Успішний вхід 🎉");
      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    }
  };

    useEffect(() => {
      if (error) {
        toast.error(error);
      }
    }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Вхід у Netflix</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-zinc-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-3 rounded bg-zinc-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" className="w-full bg-red-600 py-3 rounded hover:bg-red-700">Увійти</button>
        </form>
        <p className="mt-4 text-center text-sm">
          Ще не маєте акаунту?{' '}
          <button onClick={() => navigate('/register')} className="text-blue-400 hover:underline">Зареєструйтесь</button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
