import { useState } from 'react';
import { useResetPasswordMutation } from '../services/authApi';
import { toast } from 'react-toastify';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Паролі не співпадають');
      return;
    }
    try {
      await resetPassword({ email, token, newPassword }).unwrap();
      toast.success('Пароль успішно змінено');
      navigate('/login');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Сталася помилка');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded text-white">
      <h2 className="text-2xl mb-4">Встановити новий пароль</h2>
      <input
        type="password"
        placeholder="Новий пароль"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="w-full p-3 rounded bg-gray-700 mb-4"
      />
      <input
        type="password"
        placeholder="Підтвердження пароля"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="w-full p-3 rounded bg-gray-700 mb-4"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-green-600 rounded hover:bg-green-700"
      >
        {isLoading ? 'Зачекайте...' : 'Змінити пароль'}
      </button>
    </form>
  );
};

export default ResetPasswordPage;

