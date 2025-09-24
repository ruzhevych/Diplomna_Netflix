import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Collection, Credits, Movie } from "../types/movie";
import {
  type Video,
  getCollections,
  getCreditsMovie,
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
  const [credits, setCredits] = useState<Credits | null>(null);

  const { data: favorites } = useGetFavoritesQuery();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const [inFavorites, setInFavorites] = useState(false);

  const [addToHistory] = useAddToHistoryMutation();
  const [AddForLater] = useAddForLaterMutation();

  const trailerRef = useRef<HTMLDivElement>(null);

  const scrollToTrailer = () => {
    trailerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!movieId) return;
    (async () => {
      try {
        const details = await getMovieDetails(movieId);
        setMovie(details);

        setSimilar((await getSimilarMovies(movieId, 1)).results);
        setRecommendations((await getRecomendationsMovies(movieId, 1)).results);
        setCredits(await getCreditsMovie(movieId, 1));

        if (details.belongs_to_collection) {
          setCollections(
            (await getCollections(details.belongs_to_collection.id, 1)).results
          );
        } else {
          setCollections(null);
        }

        const vids = await getMovieVideos(movieId);
        setVideos(
          vids.results.filter(
            (v) => v.site === "YouTube" && v.type === "Trailer"
          )
        );
      } catch (e) {
        console.error(e);
      }
    })();
  }, [movieId]);

  useEffect(() => {
    if (favorites) {
      setInFavorites(favorites.some((f) => f.contentId === movieId));
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

  const handleAdd = async (id: number) => {
    try {
      await AddForLater({ contentId: id, contentType: "movie" }).unwrap();
      toast.success(t("movieDetails.forLater.added"));
    } catch {
      toast.error(t("movieDetails.forLater.error"));
    }
  };

  if (!movie) {
    return (
      <p className="text-white text-center mt-10 animate-fadeIn">
        {t("movieDetails.loading")}
      </p>
    );
  }

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const trailer = videos[0];

  const writers = credits?.crew
    ?.filter((el) => el.department === "Writing")
    .slice(0, 10)
    .map((el) => el.name)
    .join(", ");

  const directors = credits?.crew
    ?.filter((el) => el.department === "Directing")
    .slice(0, 5)
    .map((el) => el.name)
    .join(", ");

  const producers = credits?.crew
    ?.filter((el) => el.department === "Production")
    .slice(0, 10)
    .map((el) => el.name)
    .join(", ");

  const actors = credits?.cast
    ?.slice(0, 15)
    .map((el) => el.name)
    .join(", ");

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />

      {/* Backdrop */}
      <div
        className="relative h-[80vh] top-20 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>

      {/* Details */}
      <div className="max-w-7xl mx-auto px-4 md:px-0 -mt-96 relative z-10">
        <div className="flex flex-col md:flex-row gap-10 animate-fadeIn">
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-8xl font-extrabold">{movie.title}</h1>
            {movie.tagline && (
              <p className="italic text-gray-400 text-xl">"{movie.tagline}"</p>
            )}

            {/* Buttons */}
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
                className={`border border-gray-400 rounded-full w-12 h-12 flex items-center justify-center text-white hover:bg-gray-700 transition ${
                  inFavorites
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-400/10 text-black hover:bg-gray-700/10"
                }`}
              >
                <ThumbsUp
                  className={`w-6 h-6 ${inFavorites ? "text-red-500" : ""}`}
                />
              </button>
            </div>

            {/* Info */}
            <div className="mt-48 text-gray-300">
              <div className="grid md:grid-cols-2 gap-24">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-4 text-2xl font-semibold text-gray-200 mb-2">
                    <span>{movie.release_date?.slice(0, 4)}</span>
                    <span>
                      {movie.runtime
                        ? `${movie.runtime} ${t("movieDetails.minutes")}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-4 text-2xl font-semibold text-gray-400">
                    {movie.genres?.map((g) => (
                      <span key={g.id}>{g.name}</span>
                    ))}
                  </div>
                  <p className="leading-relaxed mb-6 text-base">
                    {movie.overview}
                  </p>
                </div>

                <div className="space-y-2 text-sm font-sans">
                  <p>
                    <span className="text-gray-400 text-lg">
                      {t("movieDetails.popularity")}:
                    </span>{" "}
                    {movie.popularity}
                  </p>
                  {directors && (
                    <>
                      <p>
                        <span className="text-gray-400 text-lg">Directors:</span>{" "}
                        <span>{directors}</span>
                      </p>
                    </>
                  )}
                  {producers && (
                    <>
                      <p>
                        <span className="text-gray-400 text-lg">Producers:</span>{" "}
                        <span>{producers}</span>
                      </p>
                    </>
                  )}
                  {writers && (
                    <>
                      <p>
                        <span className="text-gray-400 text-lg">Writers:</span>{" "}
                        <span>{writers}</span>
                      </p>
                    </>
                  )}
                  {actors && (
                    <>
                      <p>
                        <span className="text-gray-400 text-lg">Actors:</span>{" "}
                        <span>{actors}</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer */}
      {trailer && (
        <div
          ref={trailerRef}
          className="mt-20 max-w-7xl mx-auto px-4 md:px-0 animate-fadeIn"
        >
          <h2 className="text-3xl font-bold mb-6">
            {t("movieDetails.trailer")}
          </h2>
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

      {/* Collections */}
      {collections && (
        <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">
            {t("movieDetails.collection")}
          </h2>
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

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">
            {t("movieDetails.recommendations")}
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="min-w-[180px] cursor-pointer hover:scale-105 transition-transform"
                onClick={async () => {
                  await addToHistory({
                    id: rec.id,
                    mediaType: "movie",
                    name: rec.title,
                  }).unwrap();
                  navigate(`/movie/${rec.id}`);
                }}
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

      {/* Similar */}
      {similar.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">{t("movieDetails.similar")}</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
            {similar.map((sm) => (
              <div
                key={sm.id}
                className="min-w-[180px] cursor-pointer hover:scale-105 transition-transform"
                onClick={async () => {
                  await addToHistory({
                    id: sm.id,
                    mediaType: "movie",
                    name: sm.title,
                  }).unwrap();
                  navigate(`/movie/${sm.id}`);
                }}
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

      {/* Comments */}
      <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 gap-12">
        <RatingAndComments
          contentId={movie.id}
          contentType="movie"
          vote_average={movie.vote_average}
        />
      </div>

      <Footer />
    </div>
  );
};

export default MovieDetailsPage;
