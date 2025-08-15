import { useNavigate } from 'react-router-dom';
import '../index.css'
import Header from '../components/Header/Header'
import { useEffect, useState } from 'react';
import Row from '../components/Row';



import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getPopularTV,
  getAnime
} from '../services/movieApi';
import type { Movie } from '../types/movie';
import HeroBanner from '../components/HeroBanner';

const HomePage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await getPopularMovies();
        setMovies(data.results);
      } catch (err) {
        console.error('Помилка при завантаженні фільмів:', err);
      }
    };
    loadMovies();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    
    <div className="bg-black text-white min-h-screen">
      <Header/>
      <div>
        <HeroBanner/>
      </div>

      <section className="px-8">
       <div className="bg-black min-h-screen">
      <Row title="Популярне" fetcher={getPopularMovies} />
      <Row title="Рейтинг" fetcher={getTopRatedMovies} />
      <Row title="Скоро в кіно" fetcher={getUpcomingMovies} />
      <Row title="Популярні серіали" fetcher={getPopularTV} />
      {/* <Row title="Аніме" fetcher={getAnime} /> */}
    </div>
      </section>
    </div>
    
  );
};

export default HomePage;