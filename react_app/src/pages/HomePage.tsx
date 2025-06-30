import { useNavigate } from 'react-router-dom';
import '../index.css'
import Header from '../components/Header/Header'

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const dummyMovies = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    title: `Фільм ${i + 1}`,
    image: 'https://via.placeholder.com/300x450?text=Movie',
  }));
  return (
    
    <div className="bg-black text-white min-h-screen">
      <Header/>
      <div className="px-8 pt-8">
        <h1 className="text-4xl font-bold mb-2">Ласкаво просимо,</h1>
        <p className="text-lg text-gray-400 mb-6">Обирай, дивись, насолоджуйся 🎬</p>
      </div>

      <section className="px-8">
        <button onClick={handleLogout}>Вийти</button>
        <h2 className="text-2xl font-semibold mb-4">Популярні зараз</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {dummyMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-zinc-800 rounded overflow-hidden shadow hover:scale-105 transition transform duration-200"
            >
              <img src={movie.image} alt={movie.title} className="w-full h-auto" />
              <div className="p-2">
                <h3 className="text-sm font-medium truncate">{movie.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    
  );
};

export default HomePage;