import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoginMutation, useGoogleLoginMutation } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from '../../icons/GoogleIcon';
//import { APP_ENV } from '../../env';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login({ email, password }).unwrap();
      loginContext(res.accessToken);
      toast.success("Успішний вхід");
      navigate('/home');
    } catch (err: any) {
      setError(err?.data?.message || 'Сталася помилка під час входу');
    }
  };

  const onLoginGoogleResult = async (googleToken: string) => {
    if (!googleToken) return;
    try {
      await googleLogin({ googleAccessToken: googleToken, });
      navigate("/home");
    } catch (error) {
      console.log("Google error : ", error);
    }
  };

  const googleLoginFunc = useGoogleLogin({
    scope: 'openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    onSuccess: async (tokenResponse) => {
      console.log("Access token:", tokenResponse.access_token);
      await onLoginGoogleResult(tokenResponse.access_token);
    },
    onError: () => toast.error("Помилка при вході через Google"),
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    //<GoogleOAuthProvider clientId={APP_ENV.CLIENT_ID}>
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
          <button
            type="submit"
            className="w-full bg-red-600 py-3 rounded hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? 'Зачекайте...' : 'Увійти'}
          </button>
        </form>

        <button
          type="button"
          className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-4 py-3 rounded mt-4"
          onClick={() => googleLoginFunc()}
        >
          <GoogleIcon className="w-5 h-5 mr-2" />
          Увійти через Google
        </button>

        <p className="mt-4 text-center text-sm">
          <button 
            onClick={() => navigate('/forgot-password')} 
            className="text-blue-400 hover:underline"
          >
            Забули пароль?
          </button>
        </p>

        <p className="mt-4 text-center text-sm">
          Ще не маєте акаунту?{' '}
          <button onClick={() => navigate('/register')} className="text-blue-400 hover:underline">Зареєструйтесь</button>
        </p>
      </div>
    </div>
    //</GoogleOAuthProvider>
  );
};

export default LoginPage;