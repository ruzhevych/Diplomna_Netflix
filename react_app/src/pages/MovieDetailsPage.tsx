import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Collection, Movie } from "../types/movie";
import {
  type Video,
  getCollections,
  getMovieDetails,
  getMovieVideos,
  getRecomendationsMovies,
  getSimilarMovies,
} from "../services/movieApi";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetFavoritesQuery,
} from "../services/favoritesApi";
import { toast } from "react-toastify";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useAddToHistoryMutation } from "../services/historyApi";
import { Play, Plus, ThumbsUp } from "lucide-react";
import { useAddForLaterMutation } from "../services/forLaterApi";
import RatingAndComments from "../components/RatingAndComments";
import { AiFillHeart } from "react-icons/ai";

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [collections, setCollections] = useState<Collection | null>(null);

  const { data: favorites } = useGetFavoritesQuery();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const [inFavorites, setInFavorites] = useState(false);
  const [addToHistory] = useAddToHistoryMutation();
  const [AddForLater] = useAddForLaterMutation();

  useEffect(() => {
    if (!movieId) return;
    (async () => {
      try {
        const details = await getMovieDetails(movieId);
        setMovie(details);

        const similarMovies = await getSimilarMovies(movieId, 1);
        setSimilar(similarMovies.results || similarMovies); 

        const recMovies = await getRecomendationsMovies(movieId, 1);
        setRecommendations(recMovies.results || recMovies);

        if (details.belongs_to_collection) {
        const data = await getCollections(details.belongs_to_collection.id, 1);
        setCollections(data.results || data);
      } else {
        setCollections(null); 
      }

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
        toast.info("Deleted from Favorites");
      } else {
        await addFavorite(payload).unwrap();
        setInFavorites(true);
        toast.success("Added to Favorites");
      }
    } catch {
      toast.error("Error with Favorites");
    }
  };

  const handlePlay = (id: number) => {
      navigate(`/movie/${id}`);
    };
  
    const handleAdd = async (id: number) => {
      try {
        const payload = { contentId: id, contentType: "movie" }; 
        await AddForLater(payload).unwrap();
        toast.success("Додано у список на потім");
        console.log("➕ Added to list:", id);
      }
      catch {
        toast.error("Не вдалося додати у список на потім 😢");
      }
      
    };
    
    const handleLike = async (id: number) => {
      try {
        const favorite = favorites?.find((f) => f.contentId === movieId);
        if (!favorite) return;
        const payload = { contentId: id, contentType: "movie" }; 
        await addFavorite(payload).unwrap();
        toast.success("Додано в улюблене 👍");
        console.log("➕ Added to list:", id);
      }
      catch {
        toast.error("Не вдалося додати в улюблене 😢");
      }
    };

  if (!movie)
    return (
      <p className="text-white text-center mt-10 animate-fadeIn">
        Downloading...
      </p>
    );

  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const trailer = videos[0];

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <div
        className="relative h-[80vh] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-0 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-10 animate-fadeIn">
          <div className="md:w-1/3 w-full">
            <img
              src={posterUrl}
              alt={movie.title || movie.original_title}
              className="rounded shadow-2xl w-full"
            />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-5xl font-extrabold">{movie.title}</h1>
            {movie.tagline && (
              <p className="italic text-gray-400 text-xl">"{movie.tagline}"</p>
            )}
            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-400 mt-4">
              <p>
                <span className="text-white font-semibold">Популярність:</span>{" "}
                {movie.popularity}
              </p>
              <p>
                <span className="text-white font-semibold">Жанри:</span>{" "}
                {movie.genres?.map((g) => g.name).join(", ")}
              </p>
              <p>
                <span className="text-white font-semibold">Тривалість:</span>{" "}
                {movie.runtime} хв
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => handlePlay(movie.id)}
                className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 transition"
              >
                <Play size={18} />
              </button>

              <button
                onClick={() => handleAdd(movie.id)}
                className="border border-gray-400 rounded-full w-12 h-12 flex items-center justify-center text-white hover:bg-gray-700 transition"
              >
                <Plus size={18} />
              </button>

              <button
                onClick={() => handleLike(movie.id)}
                className={`border border-gray-400 rounded-full w-12 h-12 flex items-center justify-center text-white hover:bg-gray-700 transition
                ${
                  inFavorites
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-lime-500 text-black hover:bg-lime-600 shadow-lg hover:shadow-2xl"
                }`}
              >
                {/* <ThumbsUp size={18} /> */}
                {inFavorites ? (
                <ThumbsUp className="text-red-500 w-6 h-6 bg-green" />
              ) : (
                <ThumbsUp className="w-6 h-6" />
              )}
              </button>
            </div>

            {/* Favorites button */}
            {/* <button
              <p><span className="text-white font-semibold">Popularity:</span> {movie.popularity}</p>
              { movie.genres && (
                <p><span className="text-white font-semibold">Genres:</span> {movie.genres.map((g) => g.name).join(", ")}</p>
              )}
              <p><span className="text-white font-semibold">Duration:</span> {movie.runtime} хв</p>
              <p><span className="text-white font-semibold">Budget:</span> ${movie.budget?.toLocaleString()}</p>
              <p><span className="text-white font-semibold">Total Supply:</span> ${movie.revenue?.toLocaleString()}</p>
              <p><span className="text-white font-semibold">Language:</span> {movie.original_language.toUpperCase()}</p>
            </div>


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
              {inFavorites ? "Delete from Favorites" : "Add to Favorites"}
            </button>
            */}
          </div>
        </div>
      </div>

      {/* Trailer */}
      {trailer && (
        <div className="mt-16 max-w-6xl mx-auto px-4 md:px-0 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">Trailer</h2>
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

      {collections != null && (
        <div className="max-w-6xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">Колекція</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {collections.parts.map((c) => (
              <div
                key={c.id}
                className="min-w-[180px] cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate(`/movie/${c.id}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${c.poster_path}`}
                  alt={c.title}
                  className="rounded-lg shadow-md"
                />
                <p className="mt-2 text-center text-sm">{c.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">Рекомендовані</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="min-w-[180px] cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate(`/movie/${rec.id}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
                  alt={rec.title}
                  className="rounded-lg shadow-md"
                />
                <p className="mt-2 text-center text-sm">{rec.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {similar.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">Схожі фільми</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {similar.map((sm) => (
              <div
                key={sm.id}
                className="min-w-[180px] cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate(`/movie/${sm.id}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${sm.poster_path}`}
                  alt={sm.title}
                  className="rounded-lg shadow-md"
                />
                <p className="mt-2 text-center text-sm">{sm.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating & Comments */}
      <div className="max-w-6xl mx-auto px-4 md:px-0 mt-16 gap-12">
        <RatingAndComments contentId={movie.id} contentType="movie" vote_average={movie.vote_average.toFixed(1)}/>
      </div>

      <Footer />
    </div>
  );
};

export default MovieDetailsPage;
