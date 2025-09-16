import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Movie } from "../types/movie";
import { type Video, getMovieDetails, getMovieVideos } from "../services/movieApi";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetFavoritesQuery,
} from "../services/favoritesApi";
import { toast } from "react-toastify";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import CommentsSection from "../components/CommentsSection";
import RatingSection from "../components/RatingSection";
import { useAddToHistoryMutation } from "../services/historyApi";

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
    const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  const { data: favorites } = useGetFavoritesQuery();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const [inFavorites, setInFavorites] = useState(false);
  const [addToHistory] = useAddToHistoryMutation();

  useEffect(() => {
    if (!movieId) return;
    (async () => {
      try {
        const details = await getMovieDetails(movieId);
        setMovie(details);

        const vids = await getMovieVideos(movieId);
        setVideos(
          vids.results.filter((v) => v.site === "YouTube" && v.type === "Trailer")
        );
        await addToHistory({
          id: details.id,
          mediaType: "movie",
          name: details.title,
        }).unwrap();
      } catch (e) {
        console.error(e);
      }
    })();
  }, [movieId, addToHistory]);

  useEffect(() => {
    if (favorites) {
      const found = favorites.some((f) => f.contentId === movieId);
      setInFavorites(found);
    }
  }, [favorites, movieId]);

  const handleFavorite = async () => {
    try {
      const payload = { contentId: movieId, contentType: "movie" };
      if (inFavorites) {
        const favorite = favorites?.find((f) => f.contentId === movieId);
        if (!favorite) return;

        await removeFavorite(favorite.id).unwrap();
        setInFavorites(false);
        toast.info("Видалено з улюбленого ❌");
      } else {
        await addFavorite(payload).unwrap();
        setInFavorites(true);
        toast.success("Додано в улюблене ❤️");
      }
    } catch {
      toast.error("Помилка з улюбленим 😢");
    }
  };

  if (!movie)
    return (
      <p className="text-white text-center mt-10 animate-fadeIn">
        Завантаження...
      </p>
    );

  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const trailer = videos[0];

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />

      {/* Backdrop */}
      <div
        className="relative h-[80vh] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 md:px-0 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-10 animate-fadeIn">
          {/* Poster */}
          <div className="md:w-1/3 w-full">
            <img
              src={posterUrl}
              alt={movie.title || movie.original_title}
              className="rounded-sm+
               shadow-2xl w-full"
            />
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-5xl font-extrabold">{movie.title || movie.original_title}</h1>
            {movie.tagline && (
              <p className="italic text-gray-400 text-xl">"{movie.tagline}"</p>
            )}
            <p className="text-gray-400 text-lg">
              {movie.release_date} • ⭐{" "}
              {movie.vote_average.toFixed()} ({movie.vote_count} голосів)
            </p>
            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-400 mt-4">
              <p><span className="text-white font-semibold">Популярність:</span> {movie.popularity}</p>
              { movie.genres && (
                <p><span className="text-white font-semibold">Жанри:</span> {movie.genres.map((g) => g.name).join(", ")}</p>
              )}
              <p><span className="text-white font-semibold">Тривалість:</span> {movie.runtime} хв</p>
              <p><span className="text-white font-semibold">Бюджет:</span> ${movie.budget?.toLocaleString()}</p>
              <p><span className="text-white font-semibold">Касові збори:</span> ${movie.revenue?.toLocaleString()}</p>
              <p><span className="text-white font-semibold">Мова:</span> {movie.original_language.toUpperCase()}</p>
            </div>

            {/* Favorites button */}
            <button
              onClick={handleFavorite}
              className={`mt-6 flex items-center gap-2 px-6 py-3 rounded-md font-medium text-lg transition-all duration-300
                ${
                  inFavorites
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-lime-500 text-black hover:bg-lime-600 shadow-lg hover:shadow-2xl"
                }`}
            >
              {inFavorites ? <AiFillHeart className="text-red-500 w-6 h-6" /> : <AiOutlineHeart className="w-6 h-6" />}
              {inFavorites ? "Видалити з улюбленого" : "Додати в улюблене"}
            </button>
          </div>
        </div>
      </div>

      {/* Collection */}
      {movie.belongs_to_collection && (
        <div className="mt-12 max-w-6xl mx-auto px-4 md:px-0 animate-fadeIn">
          <h3 className="text-2xl font-bold mb-4">Колекція</h3>
          <div className="flex items-center gap-6 bg-gray-900 p-4 rounded-lg shadow-lg hover:bg-gray-800 transition">
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.belongs_to_collection.poster_path}`}
              alt={movie.belongs_to_collection.name}
              className="w-32 rounded-md shadow-md"
            />
            {movie.belongs_to_collection && (
              <div>
              <h4 className="text-xl font-semibold">{movie.belongs_to_collection.name}</h4>
              <button
                onClick={() => {
                  navigate(`/collection/${movie.belongs_to_collection?.id}`);
                }}
                className="mt-3 px-4 py-2 bg-lime-500 text-black rounded hover:bg-lime-600"
              >
                Переглянути колекцію
              </button>
            </div>
            )}
          </div>
        </div>
      )}

      {/* Trailer */}
      {trailer && (
        <div className="mt-16 max-w-6xl mx-auto px-4 md:px-0 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">Трейлер</h2>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Rating & Comments */}
      <div className="max-w-6xl mx-auto px-4 md:px-0 mt-16 gap-12">
        <RatingSection contentId={movie.id} contentType="movie" />
        <CommentsSection movieId={movie.id} movieType="movie" />
      </div>

      <Footer />
    </div>
  );
};

export default MovieDetailsPage;
