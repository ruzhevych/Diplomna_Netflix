import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    navigate('/choose-plan', {
      state: { fullName, email, password }
    });
    toast.success("Успішний вхід 🎉");
  };

useEffect(() => {
      if (error) {
        toast.error(error);
      }
    }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Реєстрація</h2>
        <form onSubmit={handleNext} className="space-y-4">
          <input
            type="text"
            placeholder="Ім’я"
            className="w-full p-3 rounded bg-zinc-800"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
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
          <button type="submit" className="w-full bg-red-600 py-3 rounded hover:bg-red-700">Продовжити</button>
        </form>
        <p className="mt-4 text-center text-sm">
          Вже маєте акаунт?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-400 hover:underline">Увійти</button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
