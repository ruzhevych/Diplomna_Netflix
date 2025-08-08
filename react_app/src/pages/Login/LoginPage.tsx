// src/pages/Login/LoginPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginService({ email, password });

      // підтримуємо варіанти відповіді: { token }, { accessToken }, {access_token}
      const token =
        (res as any)?.token ||
        (res as any)?.accessToken ||
        (res as any)?.access_token ||
        (res as any)?.data?.token ||
        (res as any)?.data?.accessToken;

      if (!token) {
        throw new Error('Сервер не повернув токен. Спробуй ще раз.');
      }

      // зберігаємо токен через AuthContext (remember визначає куди зберігати)
      authLogin(token, remember);

      toast.success('Успішний вхід 🎉');
      navigate('/home');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Помилка при вході');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url('/login-bg.png')` }}
    >
      {/* затемнення фону */}
      <div className="absolute inset-0 bg-black/60" />

      {/* логотип в лівому верхньому куті */}
      <img
        src="/logo.png"
        alt="Logo"
        className="absolute left-16 top-16 z-20 h-10 object-contain"
      />

      {/* форма */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
        <div
          className="w-full max-w-md bg-black/60 backdrop-blur-md rounded-md p-8"
          role="region"
          aria-labelledby="signin-heading"
        >
          <h1 id="signin-heading" className="text-3xl font-semibold text-white mb-6 text-center">
            Sign In
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm text-white/80">Email or mobile number</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded bg-transparent border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#bfff00]/60"
                placeholder="Email"
                aria-label="Email"
              />
            </label>

            <label className="block relative">
              <span className="text-sm text-white/80">Password</span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded bg-transparent border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#bfff00]/60 pr-10"
                placeholder="Password"
                aria-label="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-[38px] text-white/70"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  // eye-off
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7 1.063-2.03 2.676-3.77 4.7-4.85m2.1-1.18A9.99 9.99 0 0112 5c5 0 9.27 3.11 11 7-.4 1.014-1.046 1.964-1.9 2.8M3 3l18 18" />
                  </svg>
                ) : (
                  // eye
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </label>

            <div className="flex items-center justify-between text-sm text-white/80">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-white/80 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded font-semibold flex items-center justify-center"
              style={{
                backgroundColor: '#bfff00',
                color: '#07120a',
              }}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/80">
            New to the site?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-white underline"
            >
              Sign Up now.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
