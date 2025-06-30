import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  fullName: string;
  email: string;
  plan: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

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
    <div className="max-w-xl mx-auto mt-16 bg-zinc-900 p-8 rounded shadow-md text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Профіль</h2>

      <div className="space-y-6">
        {/* Імʼя */}
        <div>
          <label className="text-gray-400 text-sm">Ім’я</label>
          {editingName ? (
            <div className="flex gap-2 mt-1">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-zinc-800 px-3 py-1 rounded w-full"
              />
              <button onClick={handleUpdateName} className="bg-green-600 px-3 rounded">Зберегти</button>
              <button onClick={() => setEditingName(false)} className="bg-red-500 px-3 rounded">Скасувати</button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold">{user.fullName}</p>
              <button onClick={() => setEditingName(true)} className="text-sm text-blue-400 hover:underline">Редагувати</button>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-gray-400 text-sm">Email</label>
          <p className="text-xl font-semibold">{user.email}</p>
        </div>

        {/* Підписка (тільки показуємо) */}
        <div>
          <label className="text-gray-400 text-sm">План підписки</label>
          <span className="inline-block font-semibold bg-zinc-700 px-4 py-1 rounded mt-1">
            {user.plan}
          </span>
        </div>

        {/* Вихід */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="bg-red-600 px-6 py-2 rounded hover:bg-red-700"
          >
            Вийти
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
