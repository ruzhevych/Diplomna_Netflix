import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../public/logo-green.png';
import { useGoogleLogin } from '@react-oauth/google';
import { useGoogleLoginMutation } from '../services/authApi';
import GoogleIcon from '../icons/GoogleIcon';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import eye_open from '../../public/eye-open.png'
import eye_close from '../../public/eye-close.png'

const RegisterPage = () => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();
  const [googleLogin] = useGoogleLoginMutation();
  const { setGoogleTempToken, login: loginContext } = useAuth();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('register.passwordsDontMatch'));
      return;
    }
    
    if (!isAgreed) {
      setError(t('register.agreeTermsError'));
      return;
    }

    navigate('/plan-intro', { state: { fullName, email, password } });
    toast.success(t('register.success'));
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
    prompt: "select_account",
    onSuccess: async (tokenResponse) => {
      await onRegisterGoogleResult(tokenResponse.access_token);
    },
    onError: () => toast.error(t("register.googleError")),
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/public/login-bg.png')" }}
    >
      
      <div className="absolute left-20 top-8">
        <img src={logo} alt="logo" className="l-10 w-32" />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="bg-black/80 py-8 px-10 w-full max-w-md">
          <h2 className="text-white text-3xl font-bold mb-6 py-2 text-left">{t("register.title")}</h2>

          <form onSubmit={handleNext} className="space-y-4">
            <input
              type="text"
              placeholder={t("register.fullNamePlaceholder")}
              className="w-full p-3 rounded-sm bg-[#191716]/80 border-1 border-gray-500 text-white"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder={t("register.emailPlaceholder")}
              className="w-full p-3 rounded-sm bg-[#191716]/80 border-1 border-gray-500 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Пароль */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("register.passwordPlaceholder")}
                className="w-full p-3 rounded-sm bg-[#191716]/80 border-1 border-gray-500 text-white"
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

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("register.confirmPasswordPlaceholder")}
                className="w-full p-3 rounded-sm bg-[#191716]/80 border-1 border-gray-500 text-white"
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

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms-checkbox"
                className="form-checkbox text-[#C4FF00] rounded-sm bg-gray-700 border-gray-500 w-5 h-5 cursor-pointer"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <label htmlFor="terms-checkbox" className="ml-3 text-white font-semibold text-md">
                {t("register.agreeToTerms")}
              </label>
            </div>

            <button
              type="submit"
              className={`w-full bg-[#C4FF00]/90 text-black text-xl font-bold py-2.5 rounded-sm transition ${!isAgreed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#C4FF00]'}`}
              disabled={!isAgreed}
            >
              {t("register.continueButton")}
            </button>

            <button
            type="button"
            className="flex items-center justify-center w-full bg-gray-100 text-xl hover:bg-gray-200 transition text-black font-bold px-4 py-2.5 rounded-sm mt-3"
            onClick={() => googleRegisterFunc()}
            >
              <GoogleIcon className="w-5 h-5 mr-2" />
              {t("register.googleButton")}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-400">
            {t("register.alreadyHaveAccount")}
            <button onClick={() => navigate('/login')} className="text-white hover:underline">
              {t("register.signInLink")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;