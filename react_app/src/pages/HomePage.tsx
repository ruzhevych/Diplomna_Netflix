import { useNavigate } from 'react-router-dom';
import '../app.css'
import Header from '../components/Header/Header'

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    
    <div>
      <Header/>
      <div className='container'>
      <h1>Привіт, це головна сторінка</h1>
      <button onClick={handleLogout}>Вийти</button>
      </div>
    </div>
  );
};

export default HomePage;