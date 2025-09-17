import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Series } from "../types/movie";
import { type Video, getSeriesDetails, getSeriesVideos, getSimilarTv, getRecomendationsTv } from "../services/movieApi";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetFavoritesQuery,
} from "../services/favoritesApi";
import { toast } from "react-toastify";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useAddToHistoryMutation } from "../services/historyApi";
import { useAddForLaterMutation } from "../services/forLaterApi";
import RatingAndComments from "../components/RatingAndComments";
import { Plus, ThumbsUp } from "lucide-react";

const SeriesDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const seriesId = Number(id);
  const navigate = useNavigate();

  const [series, setSeries] = useState<Series | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [similar, setSimilar] = useState<Series[]>([]);
  const [recommendations, setRecommendations] = useState<Series[]>([]);

  const { data: favorites } = useGetFavoritesQuery();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const [addToHistory] = useAddToHistoryMutation();
  const [AddForLater] = useAddForLaterMutation();

  const [inFavorites, setInFavorites] = useState(false);

  useEffect(() => {
    if (!seriesId) return;
    (async () => {
      try {
        const details = await getSeriesDetails(seriesId);
        setSeries(details);

        const vids = await getSeriesVideos(seriesId);
        setVideos(vids.results.filter((v) => v.site === "YouTube" && v.type === "Trailer"));

        // якщо є API – додаємо схожі та рекомендовані
        const similarSeries = await getSimilarTv(seriesId, 1);
        setSimilar(similarSeries.results || []);
        const recSeries = await getRecomendationsTv(seriesId, 1);
        setRecommendations(recSeries.results || []);

        await addToHistory({
          id: details.id,
          mediaType: "tv",
          name: details.name,
        }).unwrap();
        setVideos(
          vids.results.filter(
            (v) => v.site === "YouTube" && v.type === "Trailer"
          )
        );
          await addToHistory({
            id: details.id,
            mediaType: "tv",
            name: details.name,
        }).unwrap();

      } catch (e) {
        console.error(e);
      }
    })();
  }, [seriesId, addToHistory]);

  useEffect(() => {
    if (favorites) {
      const found = favorites.some((f) => f.contentId === seriesId);
      setInFavorites(found);
    }
  }, [favorites, seriesId]);

  const handleAdd = async (id: number) => {
    try {
      await AddForLater({ contentId: id, contentType: "tv" }).unwrap();
      toast.success("Додано у список на потім");
    } catch {
      toast.error("Не вдалося додати у список на потім 😢");
    }
  };

  const handleFavorite = async () => {
    try {
      const payload = { contentId: seriesId, contentType: "tv" };
      if (inFavorites) {
        const favorite = favorites?.find((f) => f.contentId === seriesId);
        if (!favorite) return;

        await removeFavorite(favorite.id).unwrap();
        toast.info("Removed from favorites ❌");
      } else {
        await addFavorite(payload).unwrap();
        setInFavorites(true);
        toast.success("Added to favorites ❤️");
      }
    } catch (err) {
      toast.error("Error with favorites 😢");
    }
  };
  if (!series)
    return (
      <p className="text-white text-center mt-10 animate-fadeIn">
        Loading...
      </p>
    );

  const posterUrl = `https://image.tmdb.org/t/p/w500${series.poster_path}`;
  const backdropUrl = `https://image.tmdb.org/t/p/original${series.backdrop_path}`;
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-0 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-10 animate-fadeIn">
          {/* Poster */}
          <div className="md:w-1/3 w-full">
            <img src={posterUrl} alt={series.name} className="rounded shadow-2xl w-full" />
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-5xl font-extrabold">{series.name}</h1>
            {series.tagline && <p className="italic text-gray-400 text-xl">"{series.tagline}"</p>}
            <p className="text-gray-300 leading-relaxed">{series.overview}</p>

            {/* Additional info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-400 mb-6">
              { series.genres && (
                <p>
                    <span className="text-white font-semibold">Genres:</span>{" "}
                    {series.genres.map((g) => g.name).join(", ")}
                </p>
              )}
              <p>
                <span className="text-white font-semibold">Seasons:</span>{" "}
                {series.number_of_seasons}
              </p>
              <p>
                <span className="text-white font-semibold">Episodes:</span>{" "}
                {series.number_of_episodes}
              </p>
              <p>
                <span className="text-white font-semibold">Language:</span>{" "}
                {series.original_language.toUpperCase()}
              </p>
              <p>
                <span className="text-white font-semibold">Popularity:</span>{" "}
                {series.popularity}
              </p>
              <p>
                <span className="text-white font-semibold">Status:</span>{" "}
                {series.status}
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4">
                          <button
                            onClick={() => handleAdd(series.id)}
                            className="border border-gray-400 rounded-full w-12 h-12 flex items-center justify-center text-white hover:bg-gray-700 transition"
                          >
                            <Plus size={18} />
                          </button>
            
                          <button
                            onClick={() => handleAdd(series.id)}
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
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium text-lg transition-all duration-300
                ${
                  inFavorites
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-lime-500 text-white hover:bg-lime-600 shadow-lg hover:shadow-2xl"
                }`}
            >
              {inFavorites ? (
                <AiFillHeart className="text-red-500 w-6 h-6" />
              ) : (
                <AiOutlineHeart className="w-6 h-6" />
              )}
              {inFavorites ? "Remove from favorites" : "Add to favorites"}
            </button> */}
          </div>
        </div>
      </div>

      {/* Last Episode */}
      {series.last_episode_to_air && (
        <div className="mt-16 max-w-6xl mx-auto px-4 md:px-0">
          <h2 className="text-3xl font-bold mb-6">Last episode</h2>
          <div className="flex gap-6 bg-gray-900 p-4 rounded-lg shadow-lg">
            <img
              src={`https://image.tmdb.org/t/p/w300${series.last_episode_to_air.still_path}`}
              alt={series.last_episode_to_air.name}
              className="w-52 rounded-md shadow-md"
            />
            <div>
              <h3 className="text-xl font-semibold">{series.last_episode_to_air.name}</h3>
              <p className="text-gray-400 text-sm mb-2">
                {series.last_episode_to_air.air_date} • Episode{" "}
                {series.last_episode_to_air.episode_number} (Season{" "}
                {series.last_episode_to_air.season_number})
              </p>
              <p className="text-gray-300">{series.last_episode_to_air.overview}</p>
            </div>
          </div>
        </div>
      )}

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

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">Рекомендовані серіали</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="min-w-[180px] cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate(`/series/${rec.id}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
                  alt={rec.name}
                  className="rounded-lg shadow-md"
                />
                <p className="mt-2 text-center text-sm">{rec.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Series */}
      {similar.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">Схожі серіали</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {similar.map((sm) => (
              <div
                key={sm.id}
                className="min-w-[180px] cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate(`/series/${sm.id}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${sm.poster_path}`}
                  alt={sm.name}
                  className="rounded-lg shadow-md"
                />
                <p className="mt-2 text-center text-sm">{sm.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating & Comments */}
      <div className="max-w-6xl mx-auto px-4 md:px-0 mt-16 gap-12">
        <RatingAndComments contentId={series.id} contentType="tv" vote_average={series.vote_average} />
      </div>

      <Footer />
    </div>
  );
};

export default SeriesDetailsPage;