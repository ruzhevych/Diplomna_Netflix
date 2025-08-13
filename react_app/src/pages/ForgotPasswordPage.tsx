import { useState } from 'react';
import { useForgotPasswordMutation } from '../services/authApi';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      toast.success('Інструкції для скидання пароля надіслано на вашу пошту');
    } catch {
      toast.error('Сталася помилка при надсиланні листа');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded text-white">
      <h2 className="text-2xl mb-4">Відновлення пароля</h2>
      <input
        type="email"
        placeholder="Введіть ваш email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-3 rounded bg-gray-700 mb-4"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-blue-600 rounded hover:bg-blue-700"
      >
        {isLoading ? 'Зачекайте...' : 'Відправити інструкції'}
      </button>
    </form>
  );
};

export default ForgotPasswordPage;

