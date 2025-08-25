import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../public/logo-green.png'; 
import { useGoogleLogin } from '@react-oauth/google';
import { useGoogleLoginMutation } from '../services/authApi';
import GoogleIcon from '../icons/GoogleIcon';
import { useAuth } from '../context/AuthContext';
import eye_open from '../../public/eye-open.png'
import eye_close from '../../public/eye-close.png'

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [googleLogin] = useGoogleLoginMutation();
  const { setGoogleTempToken, login: loginContext } = useAuth();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    navigate('/plan-intro', { state: { fullName, email, password } });
    toast.success("Успішна реєстрація 🎉");
  };

  const onRegisterGoogleResult = async (googleToken: string) => {
    if (!googleToken) return;
    try {
      const res = await googleLogin({ googleAccessToken: googleToken }).unwrap();
      if(res.accessToken && res.isActive){
        loginContext(res.accessToken);
        navigate("/home");
      } else {
        setGoogleTempToken(googleToken)
        navigate("/plan-intro");
      }

    } catch (error) {
      console.log("Google error : ", error);
    }
  };

  const googleRegisterFunc = useGoogleLogin({
    scope: 'openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    onSuccess: async (tokenResponse) => {
      await onRegisterGoogleResult(tokenResponse.access_token);
    },
    onError: () => toast.error("Помилка при реєстрації через Google"),
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/public/login-bg.png')" }}
    >
      {/* Логотип */}
      <div className="p-6">
        <img src={logo} alt="logo" className="w-32" />
      </div>

      {/* Форма */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-black/80 p-8  w-full max-w-sm">
          <h2 className="text-white text-3xl font-bold mb-6 text-center">Sign Up</h2>

          <form onSubmit={handleNext} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 rounded-sm bg-transparent border border-gray-500 text-white"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-sm bg-transparent border border-gray-500 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Пароль */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 rounded-sm bg-transparent border border-gray-500 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute rounded-sm right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <img src={eye_close}/> : <img src={eye_open}/>}
              </button>
            </div>

            {/* Підтвердження пароля */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full p-3 rounded-sm bg-transparent border border-gray-500 text-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <img src={eye_close}/> : <img src={eye_open}/>}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-lime-400/90 text-black font-semibold py-3 rounded-sm hover:bg-lime-500 transition"
            >
              Continue
            </button>

            <button
            type="button"
            className="flex items-center justify-center w-full bg-gray-800 hover:bg-gray-700 transition text-white font-semibold px-4 py-3 rounded-sm mt-4"
            onClick={() => googleRegisterFunc()}
          >
            <GoogleIcon className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-white hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
