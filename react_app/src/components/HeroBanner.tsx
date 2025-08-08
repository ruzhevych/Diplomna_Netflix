// src/components/HeroBanner.tsx
import { useEffect, useState } from 'react';
import type { Movie, TMDBResponse } from '../types/movie';
import { getPopularMovies } from '../services/movieService';
import { useNavigate } from 'react-router-dom';

const HeroBanner = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data: TMDBResponse<Movie> = await getPopularMovies();
        // вибираємо випадковий або перший фільм
        const pick = data.results[Math.floor(Math.random() * data.results.length)];
        setMovie(pick);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  if (!movie) return null;

  const backdrop = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
    <div
      className="relative h-[80vh] w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backdrop})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
      <div className="absolute bottom-16 left-8 max-w-xl text-white">
        <h1 className="text-5xl font-bold drop-shadow-lg">{movie.title || movie.name}</h1>
        <p className="mt-4 text-lg line-clamp-3 drop-shadow-md">{movie.overview}</p>
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded text-lg font-semibold transition"
          >
            Дивитися
          </button>
          <button
            onClick={() => {}}
            className="bg-white bg-opacity-30 hover:bg-opacity-50 px-6 py-3 rounded text-lg font-semibold transition"
          >
            Мій список
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
