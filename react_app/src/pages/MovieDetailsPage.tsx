import { useEffect, useState, useRef } from "react";
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
import { useTranslation } from "react-i18next";

const MovieDetailsPage = () => {
  const { t } = useTranslation();
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

  const trailerRef = useRef<HTMLDivElement>(null);

  const scrollToTrailer = () => {
    if (trailerRef.current) {
      trailerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

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
        toast.info(t("movieDetails.favorites.removed"));
      } else {
        await addFavorite(payload).unwrap();
        setInFavorites(true);
        toast.success(t("movieDetails.favorites.added"));
      }
    } catch {
      toast.error(t("movieDetails.favorites.error"));
    }
  };

  const handlePlay = (id: number) => {
    navigate(`/movie/${id}`);
  };

  const handleAdd = async (id: number) => {
    try {
      const payload = { contentId: id, contentType: "movie" };
      await AddForLater(payload).unwrap();
      toast.success(t("movieDetails.forLater.added"));
      console.log("➕ Added to list:", id);
    } catch {
      toast.error(t("movieDetails.forLater.error"));
    }
  };

  const handleLike = async (id: number) => {
    try {
      const payload = { contentId: id, contentType: "movie" };
      await addFavorite(payload).unwrap();
      toast.success(t("movieDetails.favorites.added"));
      console.log("➕ Added to favorites:", id);
    } catch {
      toast.error(t("movieDetails.favorites.error"));
    }
  };

  if (!movie)
    return (
      <p className="text-white text-center mt-10 animate-fadeIn">
        {t("movieDetails.loading")}
      </p>
    );

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const trailer = videos[0];

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <div
        className="relative h-[80vh] top-20 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-0 -mt-96 relative z-10">
        <div className="flex flex-col md:flex-row gap-10 animate-fadeIn">
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-8xl font-extrabold">{movie.title}</h1>
            {movie.tagline && (
              <p className="italic text-gray-400 text-xl">"{movie.tagline}"</p>
            )}
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={scrollToTrailer}
                className="bg-[#C4FF00] gap-2 text-2xl text-black font-semibold rounded-sm w-1/4 h-12 flex items-center justify-center hover:scale-110 transition"
              >
                <Play size={18} />
                Watch
              </button>
              <button
                onClick={() => handleAdd(movie.id)}
                className="border border-gray-400 bg-gray-400/10 rounded-full w-12 h-12 flex items-center justify-center ml-8 text-white hover:bg-gray-700/10 transition"
              >
                <Plus size={18} />
              </button>
              <button
                onClick={handleFavorite}
                className={`border border-gray-400 rounded-full w-12 h-12 flex items-center justify-center text-white hover:bg-gray-700 transition
                ${
                  inFavorites
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-400/10 text-black hover:bg-gray-700/10 shadow-lg hover:shadow-2xl"
                }`}
              >
                {inFavorites ? (
                  <ThumbsUp className="text-red-500 w-6 h-6 bg-green" />
                ) : (
                  <ThumbsUp className="w-6 h-6" />
                )}
              </button>
            </div>
            <div className="mt-48 text-gray-300">
              <div className="grid md:grid-cols-2 gap-24">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-4 text-2xl font-semibold text-gray-200 mb-2">
                    <span>{movie.release_date?.slice(0, 4)}</span>
                    <br />
                    <span>{movie.runtime ? `${movie.runtime} ${t("movieDetails.minutes")}` : "—"}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-4 text-2xl font-semibold text-gray-400">
                    {movie.genres?.map((g) => (
                      <span key={g.id}>{g.name}</span>
                    ))}
                  </div>
                  <p className="leading-relaxed mb-6 text-base">{movie.overview}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-400 text-lg font-medium">{t("movieDetails.popularity")}:</span>{" "}
                    {movie.popularity}
                  </p>
                  <p>
                    <span className="text-gray-400 text-lg font-medium">Director:</span>{" "}
                    {movie.director}
                  </p>
                  <p>
                    <span className="text-gray-400 text-lg font-medium">Producers:</span>{" "}
                    {movie.producers?.join(", ")}
                  </p>
                  <p>
                    <span className="text-gray-400 text-lg font-medium">Actors:</span>{" "}
                    {movie.actors?.join(", ")}
                  </p>
                  <p>
                    <span className="text-gray-400 text-lg font-medium">Writers:</span>{" "}
                    {movie.writers?.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {trailer && (
        <div ref={trailerRef} id="trailer-section" className="mt-20 max-w-7xl mx-auto px-4 md:px-0 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">{t("movieDetails.trailer")}</h2>
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
        <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn ">
          <h2 className="text-3xl font-bold mb-6">{t("movieDetails.collection")}</h2>
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
        <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">{t("movieDetails.recommendations")}</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
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
        <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">{t("movieDetails.similar")}</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
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

      <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 gap-12">
        <RatingAndComments contentId={movie.id} contentType="movie" vote_average={movie.vote_average}/>
      </div>

      <Footer />
    </div>
  );
};

export default MovieDetailsPage;