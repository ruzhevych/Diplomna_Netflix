// src/components/HeroBanner.tsx
import { useEffect, useState } from "react";
import type { Movie, TMDBResponse } from "../types/movie";
import { getPopularMovies } from "../services/movieApi";
import { useNavigate } from "react-router-dom";

const HeroBanner = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data: TMDBResponse<Movie> = await getPopularMovies();
        const pick =
          data.results[Math.floor(Math.random() * data.results.length)];
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
      className="relative h-[85vh] w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backdrop})` }}
    >
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent " />

      
      <div className="absolute bottom-36 left-14 w-[600px] text-white ">
        <h1 className="text-4xl font-bold leading-tight drop-shadow-lg">
          {movie.title || movie.original_title}
        </h1>

        <p className="mt-6 text-lg text-gray-200 line-clamp-3 drop-shadow-md">
          {movie.overview}
        </p>

        
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="bg-lime-500 hover:bg-lime-600 text-black px-8 py-3 rounded-sm w-50 text-lg font-semibold transition"
          >
            Watch
          </button>
          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="bg-transparent border border-lime-600me hover:bg-gray-400/40 text-white px-8 py-3 rounded-sm w-50 text-lg font-semibold  transition"
          >
            About
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
