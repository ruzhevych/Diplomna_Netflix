import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoginMutation, useGoogleLoginMutation } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from '../../icons/GoogleIcon';
import logo from '../../../public/logo-green.png';
import eye_open from '../../../public/eye-open.png'
import eye_close from '../../../public/eye-close.png'


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setGoogleTempToken, login: loginContext } = useAuth();

  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login({ email, password }).unwrap();
      if (res.isBlocked) {
        navigate('/blocked');
      } else {
        loginContext(res.accessToken);
        toast.success("Successful login");
        navigate('/home');
      }
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred during login');
    }
  };

  const onLoginGoogleResult = async (googleToken: string) => {
    if (!googleToken) return;
    try {
      const res = await googleLogin({ googleAccessToken: googleToken }).unwrap();
      if (res.accessToken && res.isActive) {
        loginContext(res.accessToken);
        navigate("/home");
      } else {
        setGoogleTempToken(googleToken)
        navigate("/plan-intro");
      }

    } catch (error) {
      console.log("Google error: ", error);
      toast.error("An error occurred during Google login");
    }
  };

  const googleLoginFunc = useGoogleLogin({
    scope: 'openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    prompt: "select_account",
    onSuccess: async (tokenResponse) => {
      await onLoginGoogleResult(tokenResponse.access_token);
    },
    onError: () => toast.error("Error during Google login"),
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
      <div className="p-6">
        <img src={logo} alt="logo" className="l-10 w-32" />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="bg-black/70 p-8 w-full max-w-sm">
          <h2 className="text-white text-3xl font-bold mb-6 text-center">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email or mobile number"
              className="w-full p-3 rounded-sm bg-black/40 border border-gray-500 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 rounded-sm bg-black/40 border border-gray-500 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <img src={eye_close} alt="Hide password" /> : <img src={eye_open} alt="Show password" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-lime-400/90 text-black font-semibold py-3 rounded-sm hover:bg-lime-500 transition"
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : 'Sign In'}
            </button>
          </form>

          <button
            type="button"
            className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 transition text-black font-semibold px-4 py-3 rounded-sm mt-4"
            onClick={() => googleLoginFunc()}
          >
            <GoogleIcon className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>

          <div className="flex justify-between items-center text-sm text-gray-400 mt-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-lime-400" />
              <span>Remember me</span>
            </label>
            <button
              onClick={() => navigate('/forgot-password')}
              className="hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-400">
            New to Bingatch?{' '}
            <button onClick={() => navigate('/register')} className="text-white hover:underline">
              Sign Up now.
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;