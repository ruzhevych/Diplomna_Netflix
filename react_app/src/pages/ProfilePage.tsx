import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/getInitials';
import Header from '../components/Header/Header'

interface UserProfile {
  fullName: string;
  email: string;
  subscriptionType?: string;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  subscriptionIsActive?: boolean;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // const { logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      console.log(token);

      try {
        const res = await fetch('http://localhost:5170/api/Users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Помилка при завантаженні профілю');

        const data = await res.json();
        setUser(data);
        setNewName(data.fullName);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateName = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch('http://localhost:5170/api/Users/update-name', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fullName: newName }),
    });

    if (res.ok) {
      setUser((prev) => prev && { ...prev, fullName: newName });
      setEditingName(false);
    }
  };

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!user) return <p className="text-center mt-10 text-white">Завантаження...</p>;

  return (
  <div className="min-h-screen bg-black text-white py-16 px-4 flex justify-center">
    
    <div className="w-full max-w-md bg-[#141414] rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-bold mb-6 border-b border-gray-600 pb-2">Профіль</h2>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-red-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold">
          {getInitials(user.fullName)}
        </div>
        <div>
          <p className="text-xl font-semibold">{user.fullName}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* <div className="mb-4">
        <p className="text-sm text-gray-400">План підписки</p>
        <p className="text-base font-medium text-white">{user.plan || 'Не вказано'}</p>
      </div> */}
      <p className="text-base font-medium text-white">
        {user.subscriptionType || 'Не вказано'}
      </p>
      <p className="text-sm text-gray-400">
        {user.subscriptionIsActive ? 'Активна' : 'Не активна'}
      </p>

      {/* <div className="mb-4">
        <p className="text-sm text-gray-400">Дата реєстрації</p>
        <p className="text-base font-medium text-white">
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div> */}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => navigate('/profile/edit')}
          className="text-blue-400 hover:underline text-sm"
        >
          Редагувати профіль
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
        >
          Вийти
        </button>
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={() => navigate('/home')}
          className="text-white hover:underline text-sm"
        >
          На головну
        </button>
      </div>
    </div>
  </div>
);

};

export default ProfilePage;
