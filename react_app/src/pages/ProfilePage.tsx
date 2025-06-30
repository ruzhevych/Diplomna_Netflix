import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  fullName: string;
  email: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
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
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p className="error-text">{error}</p>;
  if (!user) return <p>Завантаження...</p>;

  return (
    <div className="container text-center mt-5">
      <h2>Профіль</h2>
      <p><strong>Ім’я:</strong> {user.fullName}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default ProfilePage;

