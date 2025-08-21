import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Movie } from '../types/movie';
import { type Video} from '../services/movieApi';
import {
  //getSeriesDetails,
  getMovieDetails,
  getMovieVideos
} from '../services/movieApi';
import {
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist
} from '../utils/watchlist';

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [inList, setInList] = useState(false);

  useEffect(() => {
    if (!movieId) return;
    (async () => {
      try {
        const details = await getMovieDetails(movieId);
        setMovie(details);
        const vids = await getMovieVideos(movieId);
        setVideos(vids.results.filter(v => v.site === 'YouTube' && v.type === 'Trailer'));
        setInList(isInWatchlist(movieId));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [movieId]);

  const handleWatchlist = () => {
    if (inList) {
      removeFromWatchlist(movieId);
      setInList(false);
    } else {
      addToWatchlist(movieId);
      setInList(true);
    }
  };

  if (!movie) return <p className="text-white text-center mt-10">Завантаження...</p>;

  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const trailer = videos[0];

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
        <img src={posterUrl} alt={movie.title || movie.name} className="rounded-lg w-full md:w-1/3" />
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{movie.title || movie.name}</h1>
          <p className="text-gray-400 mb-4">{movie.release_date || movie.first_air_date}</p>
          <p className="mb-6">{movie.overview}</p>
          <button
            onClick={handleWatchlist}
            className={`px-4 py-2 rounded ${inList ? 'bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {inList ? 'Видалити з переглянуто' : 'Додати в список на потім'}
          </button>
        </div>
      </div>

      {trailer && (
        <div className="mt-10 max-w-5xl mx-auto">
          <h2 className="text-2xl mb-4">Трейлер</h2>
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;