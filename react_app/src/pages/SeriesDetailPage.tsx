import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type Credits, type Genre, type Series } from "../types/movie";
import {
  type Video,
  getSeriesDetails,
  getSeriesVideos,
  getSimilarTv,
  getRecomendationsTv,
  getCreditsTv,
  getTvGenres,
} from "../services/movieApi";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetFavoritesQuery,
} from "../services/favoritesApi";
import { toast } from "react-toastify";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react";
import { useAddToHistoryMutation } from "../services/historyApi";
import { useAddForLaterMutation } from "../services/forLaterApi";
import RatingAndComments from "../components/RatingAndComments";
import { useTranslation } from "react-i18next";

const SeriesDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language; 
  const { id } = useParams<{ id: string }>();
  const seriesId = Number(id);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const container2Ref = useRef<HTMLDivElement>(null);
  const [series, setSeries] = useState<Series | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [similar, setSimilar] = useState<Series[]>([]);
  const [recommendations, setRecommendations] = useState<Series[]>([]);
  const [creditsTv, setCreditsTv] = useState<Credits | null>(null);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  const [openedRec, setOpenedRec] = useState<null | typeof recommendations[0]>(null);

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


  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const scroll2 = (direction: 'left' | 'right') => {
    const container2 = container2Ref.current;
    if (!container2) return;
    const scrollAmount = container2.clientWidth;
    container2.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (!seriesId) return;
    (async () => {
      try {
        const details = await getSeriesDetails(seriesId, currentLanguage);
        setSeries(details);

        const vids = await getSeriesVideos(seriesId, currentLanguage);
        setVideos(
          vids.results.filter(
            (v) => v.site === "YouTube" && v.type === "Trailer"
          )
        );

        const tvList = await getTvGenres(1);
        setTvGenres(tvList.genres);
        setCreditsTv(await getCreditsTv(seriesId, 1));

        setSimilar((await getSimilarTv(seriesId, 1, currentLanguage)).results || []);
        setRecommendations((await getRecomendationsTv(seriesId, 1, currentLanguage)).results || []);
        setCreditsTv(await getCreditsTv(seriesId, 1, currentLanguage));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [seriesId, currentLanguage]);

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
    } catch (err: any) {
      if (err?.status === 409) {
        toast.info(t("mediaGrid.alreadyInWatchLater")); // 👈 нове повідомлення
      } else {
        toast.error(t("mediaGrid.addToWatchLaterError"));
      }
    }
  };

   const handlePlay = async (id: number, name: string) => {
    await addToHistory({
      id: id,
      mediaType: "tv",
      name: name,
    }).unwrap();
    navigate(`/tv/${id}`);
    window.location.reload();
  };

  const handleLike = async (id: number) => {
    try {
      const payload = { contentId: id, contentType: "movie" };
      await addFavorite(payload).unwrap();
      toast.success(t("movieDetails.favorites.added"));
      console.log("➕ Added to favorites:", id);
    } catch (err: any) {
      if (err?.status === 409) {
        toast.info(t("mediaGrid.alreadyInWatchLater")); // 👈 нове повідомлення
      } else {
        toast.error(t("mediaGrid.addToWatchLaterError"));
      }
    }
  };
  
    const handleExpand = (id: number) => {
      console.log("🔽 Expand details:", id);
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
    <div className="bg-[#191716] text-white min-h-screen">
      <Header />

      {/* Backdrop */}
      <div
        className="relative h-[80vh] top-20 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#191716] via-[#191716]/70 to-transparent"></div>
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
                  <div className="flex flex-col items-left gap-2 text-2xl font-semibold text-gray-200 mb-2">
                    <span >{series.first_air_date?.slice(0, 4)}</span>
                    <span>
                      {series.number_of_seasons} {t("seriesDetails.seasons")} •{" "}
                      {series.number_of_episodes} {t("seriesDetails.episodes")}
                    </span>
                  </div>
                  <hr className="mt-3 mb-0 "/>
                  <div className="flex flex-wrap gap-3 text-2xl font-semibold text-gray-300/70">
                    {series.genres?.map((g, index) => (
                      <span
                        key={g.id}
                        className={`${index > 0 ? ' relative pl-6 before:absolute before:left-0 before:content-["•"] before:text-white/80 before:font-black' : ''}`}
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                  <hr className="mt-3 "/>
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
        <div ref={trailerRef} id="trailer-section" className="relative mt-36 max-w-7xl mx-auto px-4 md:px-0 animate-fadeIn">
          <h2 className="text-3xl bg-[#3D3B3A] rounded-sm text-center absolute -mt-10 h-24 w-1/6 font-semibold ">{t("movieDetails.trailer")}</h2>
          <div className="aspect-video z-100 overflow-hidden shadow-2xl z-10 relative">
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
          <div className="flex flex-col md:flex-row gap-6 bg-[#191716] p-6 rounded-lg shadow-[0_0_5px_#C4FF00]">
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
                <p className="text-gray-300 leading-relaxed">{series.last_episode_to_air.overview || t("seriesDetails.noOverview")}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <div className="inline-flex justify-between w-full">
          <h2 className="text-3xl font-bold mb-6">
            {t("seriesDetails.recommendations")}
          </h2>
          <div className="flex">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-12 text-white flex items-center justify-center rounded-md hover:bg-opacity-75 transition-colors duration-200"
          >
            <span className="text-5xl font-regular">‹</span>
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-12 text-white flex items-center justify-center rounded-md hover:bg-opacity-75 transition-colors duration-200"
          >
            <span className="text-5xl font-regular">›</span>
          </button>
        </div>
          </div>
          <div ref={containerRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="cursor-pointer hover:scale-105 transition-transform rounded-lg border-b-2 border-r-2 border-[#C4FF00]"
                onClick={async () => {
                  await addToHistory({
                    id: rec.id,
                    mediaType: "tv",
                    name: rec.name,
                  }).unwrap();
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
                  alt={rec.name}
                  className="rounded-lg shadow-md min-w-64 h-80 object-cover "
                />
                <div className="bg-[#191716] h-24 rounded-lg p-2 ">
                <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => handlePlay(rec.id, rec.name)}
                  className="bg-white text-black rounded-full p-2 hover:scale-110 transition"
                >
                  <Play size={18} />
                </button>
                <button
                  onClick={() => handleAdd(rec.id)}
                  className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => handleLike(rec.id)}
                  className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <ThumbsUp size={18} />
                </button>
                <button
                  onClick={() => setOpenedRec(rec)}
                  className="ml-auto border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                <span className="px-2 py-0.5 border border-gray-500 rounded">HD</span>
                <span className="px-2 py-0.5 border border-gray-500 rounded">6+</span>

              </div>
              {openedRec && (
              <div className="fixed inset-0 flex items-center justify-center z-50 ">
                <div className="bg-[#191716] max-w-lg w-full rounded-lg p-6 relative shadow-[0_0_2px_#C4FF00] animate-fadeIn">
                  <button
                    onClick={() => setOpenedRec(null)}
                    className="absolute top-2 right-2 text-[#C4FF00] hover:text-gray-400"
                  >
                    ✕
                  </button>
                  <h3 className="text-[#C4FF00] text-xl mb-4">{openedRec.name}</h3>
                  <hr />
                  <p className="text-sm text-gray-200 overflow-y-auto max-h-64">
                    {openedRec.overview}
                  </p>
                </div>
              </div>
            )}
              </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <div className="inline-flex justify-between w-full">
          <h2 className="text-3xl font-semibold mb-6">{t("movieDetails.similar")}</h2>
           <div className="flex">
          <button
            onClick={() => scroll2('left')}
            className="w-8 h-12 text-white flex items-center justify-center rounded-md hover:bg-opacity-75 transition-colors duration-200"
          >
            <span className="text-5xl font-regular">‹</span>
          </button>
          <button
            onClick={() => scroll2('right')}
            className="w-8 h-12 text-white flex items-center justify-center rounded-md hover:bg-opacity-75 transition-colors duration-200"
          >
            <span className="text-5xl font-regular">›</span>
          </button>
        </div>
        </div>
          <div ref={container2Ref} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
            {similar.map((sm) => (
              <div
                key={sm.id}
                className="cursor-pointer hover:scale-105 transition-transform rounded-lg border-b-2 border-r-2 border-[#C4FF00]"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${sm.poster_path}`}
                  alt={sm.name}
                  className="rounded-sm shadow-md min-w-64 h-80 object-cover "
                />
                <div className="bg-[#191716] h-24 rounded-lg p-2 ">
                <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => handlePlay(sm.id, sm.name)}
                  className="bg-white text-black rounded-full p-2 hover:scale-110 transition"
                >
                  <Play size={18} />
                </button>
                <button
                  onClick={() => handleAdd(sm.id)}
                  className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => handleLike(sm.id)}
                  className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <ThumbsUp size={18} />
                </button>
                <button
                  onClick={() => setOpenedRec(sm)}
                  className="ml-auto border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                <span className="px-2 py-0.5 border border-gray-500 rounded">HD</span>
                <span className="px-2 py-0.5 border border-gray-500 rounded">12+</span>

              </div>
              {openedRec && (
              <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 ">
                <div className="bg-[#191716] max-w-lg w-full rounded-lg p-6 relative shadow-[0_0_2px_#C4FF00] animate-fadeIn">
                  <button
                    onClick={() => setOpenedRec(null)}
                    className="absolute top-2 right-2 text-[#C4FF00] hover:text-gray-400"
                  >
                    ✕
                  </button>
                  <h3 className="text-[#C4FF00] text-xl mb-4">{openedRec.name}</h3>
                  <hr />
                  <p className="text-sm text-gray-200 overflow-y-auto max-h-64">
                    {openedRec.overview}
                  </p>
                </div>
              </div>
            )}
              </div>
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
