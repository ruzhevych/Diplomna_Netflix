import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForgotPasswordMutation } from '../services/authApi';
import logo from '../../public/logo-green.png'; // твій логотип

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await forgotPassword({ email }).unwrap();
      toast.success('Password reset instructions have been sent to your email');
    } catch {
      setError('Something went wrong while sending the email');
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/public/login-bg.png')" }}
    >
      {/* Logo */}
      <div className="p-6">
        <img src={logo} alt="logo" className="w-32" />
      </div>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-black/80 p-8  w-full max-w-sm">
          <h2 className="text-white text-2xl font-bold mb-6 text-left">
            Forgot Password
          </h2>
          <p className="text-white text-l font-light mb-6 text-left">
            Enter your email then we will send you a code to reset your password.
            </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-sm bg-transparent border border-gray-500 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-lime-400/80 text-black font-semibold py-2 mt-4 rounded-sm hover:bg-lime-500 transition"
            >
              {isLoading ? 'Please wait...' : 'Email me'}
            </button>
          </form>

          <button
            onClick={() => navigate(-1)}
            className="w-full mt-3 bg-gray-700/80 text-white py-2 rounded-sm hover:bg-gray-600 transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
