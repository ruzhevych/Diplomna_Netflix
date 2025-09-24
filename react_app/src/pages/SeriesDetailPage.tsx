import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type Credits, type Series } from "../types/movie";
import {
  type Video,
  getSeriesDetails,
  getSeriesVideos,
  getSimilarTv,
  getRecomendationsTv,
  getCreditsTv,
} from "../services/movieApi";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetFavoritesQuery,
} from "../services/favoritesApi";
import { toast } from "react-toastify";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Play, Plus, ThumbsUp } from "lucide-react";
import { useAddToHistoryMutation } from "../services/historyApi";
import { useAddForLaterMutation } from "../services/forLaterApi";
import RatingAndComments from "../components/RatingAndComments";
import { useTranslation } from "react-i18next";

const SeriesDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const seriesId = Number(id);
  const navigate = useNavigate();

  const [series, setSeries] = useState<Series | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [similar, setSimilar] = useState<Series[]>([]);
  const [recommendations, setRecommendations] = useState<Series[]>([]);
  const [creditsTv, setCreditsTv] = useState<Credits | null>(null);

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
    if (!seriesId) return;
    (async () => {
      try {
        const details = await getSeriesDetails(seriesId);
        setSeries(details);

        const vids = await getSeriesVideos(seriesId);
        setVideos(
          vids.results.filter(
            (v) => v.site === "YouTube" && v.type === "Trailer"
          )
        );

        
        setSimilar((await getSimilarTv(seriesId, 1)).results || []);
        setRecommendations((await getRecomendationsTv(seriesId, 1)).results || []);
        setCreditsTv(await getCreditsTv(seriesId, 1));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [seriesId]);

  useEffect(() => {
    if (favorites) {
      setInFavorites(favorites.some((f) => f.contentId === seriesId));
    }
  }, [favorites, seriesId]);

  const handleFavorite = async () => {
    try {
      const payload = { contentId: seriesId, contentType: "tv" };
      if (inFavorites) {
        const favorite = favorites?.find((f) => f.contentId === seriesId);
        if (!favorite) return;

        await removeFavorite(favorite.id).unwrap();
        setInFavorites(false);
        toast.info(t("seriesDetails.favorites.removed"));
      } else {
        await addFavorite(payload).unwrap();
        setInFavorites(true);
        toast.success(t("seriesDetails.favorites.added"));
      }
    } catch {
      toast.error(t("seriesDetails.favorites.error"));
    }
  };

  const handleAdd = async (id: number) => {
    try {
      await AddForLater({ contentId: id, contentType: "tv" }).unwrap();
      toast.success(t("seriesDetails.forLater.added"));
    } catch {
      toast.error(t("seriesDetails.forLater.error"));
    }
  };

  if (!series) {
    return (
      <p className="text-white text-center mt-10 animate-fadeIn">
        {t("seriesDetails.loading")}
      </p>
    );
  }

  const backdropUrl = `https://image.tmdb.org/t/p/original${series.backdrop_path}`;
  const trailer = videos[0];

  const writers = creditsTv?.crew
    ?.filter((el) => el.department === "Writing")
    .slice(0, 10)
    .map((el) => el.original_name)
    .join(", ");

  const directors = creditsTv?.crew
    ?.slice(0, 5)
    .filter((el) => el.department === "Directing")
    .map((el) => el.original_name)
    .join(", ");

  const producers = creditsTv?.crew
    ?.filter((el) => el.department =="Production")
    .slice(0, 10)
    .map((el) => el.original_name)
    .join(", ");

  const actors = creditsTv?.cast
    ?.slice(0, 15)
    .map((el) => el.original_name)
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
            <h1 className="text-8xl font-extrabold">{series.name}</h1>
            {series.tagline && (
              <p className="italic text-gray-400 text-xl">"{series.tagline}"</p>
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
                onClick={() => handleAdd(series.id)}
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
                    <span>{series.first_air_date?.slice(0, 4)}</span>
                    <span>
                      {series.number_of_seasons} {t("seriesDetails.seasons")} •{" "}
                      {series.number_of_episodes} {t("seriesDetails.episodes")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-4 text-2xl font-semibold text-gray-400">
                    {series.genres?.map((g) => (
                      <span key={g.id}>{g.name}</span>
                    ))}
                  </div>
                  <p className="leading-relaxed mb-6 text-base">
                    {series.overview}
                  </p>
                </div>

                <div className="space-y-2 text-sm font-sans">
                  <p>
                    <span className="text-gray-400 text-lg">
                      {t("seriesDetails.popularity")}:
                    </span>{" "}
                    {series.popularity}
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
            {t("seriesDetails.trailer")}
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

      {series.last_episode_to_air && (
        <div className="mt-16 max-w-7xl mx-auto px-4 md:px-0 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">{t("seriesDetails.lastEpisode")}</h2>
          <div className="flex flex-col md:flex-row gap-6 bg-gray-900 p-6 rounded-2xl shadow-xl">
            <img
              src={`https://image.tmdb.org/t/p/w300${series.last_episode_to_air.still_path}`}
              alt={series.last_episode_to_air.name}
              className="w-full md:w-52 rounded-lg shadow-lg object-cover"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold mb-2">{series.last_episode_to_air.name}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {series.last_episode_to_air.air_date} • {t("seriesDetails.episode")} {series.last_episode_to_air.episode_number} ({t("seriesDetails.season")} {series.last_episode_to_air.season_number})
                </p>
          <     p className="text-gray-300 leading-relaxed">{series.last_episode_to_air.overview || t("seriesDetails.noOverview")}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">
            {t("seriesDetails.recommendations")}
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="min-w-[180px] cursor-pointer hover:scale-105 transition-transform"
                onClick={async () => {
                  await addToHistory({
                    id: rec.id,
                    mediaType: "tv",
                    name: rec.name,
                  }).unwrap();
                  navigate(`/tv/${rec.id}`);
                }}
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

      {/* Similar */}
      {similar.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">
            {t("seriesDetails.similar")}
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
            {similar.map((sm) => (
              <div
                key={sm.id}
                className="min-w-[180px] cursor-pointer hover:scale-105 transition-transform"
                onClick={async () => {
                  await addToHistory({
                    id: sm.id,
                    mediaType: "tv",
                    name: sm.name,
                  }).unwrap();
                  navigate(`/tv/${sm.id}`);
                }}
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

      {/* Comments */}
      <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 gap-12">
        <RatingAndComments
          contentId={series.id}
          contentType="tv"
          vote_average={series.vote_average}
        />
      </div>

      <Footer />
    </div>
  );
};

export default SeriesDetailsPage;
