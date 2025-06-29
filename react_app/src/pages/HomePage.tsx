import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h1>Привіт, це головна сторінка</h1>
      <button onClick={handleLogout}>Вийти</button>
    </div>
  );
};

export default HomePage;