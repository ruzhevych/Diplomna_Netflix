import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Series } from "../types/movie";
import { type Video } from "../services/movieApi";
import { getSeriesDetails, getSeriesVideos } from "../services/movieApi";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetFavoritesQuery,
} from "../services/favoritesApi";
import { toast } from "react-toastify";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const SerisesDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const seriesId = Number(id);

  const [series, setSeries] = useState<Series | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  const { data: favorites } = useGetFavoritesQuery();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const [inFavorites, setInFavorites] = useState(false);

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
      } catch (e) {
        console.error(e);
      }
    })();
  }, [seriesId]);

  useEffect(() => {
    if (favorites) {
      const found = favorites.some((f) => f.contentId === seriesId);
      setInFavorites(found);
    }
  }, [favorites, seriesId]);

  const handleFavorite = async () => {
    try {
      const payload = { contentId: seriesId, contentType: "tv" }; 
      if (inFavorites) {
        const favorite = favorites?.find((f) => f.contentId === seriesId);
        if (!favorite) return;

        await removeFavorite(favorite.id).unwrap();
        toast.info("Видалено з улюбленого ❌");
      } else {
        await addFavorite(payload).unwrap();
        setInFavorites(true);
        toast.success("Додано в улюблене ❤️");
      }
    } catch (err) {
      toast.error("Помилка з улюбленим 😢");
    }
  };

  if (!series)
    return <p className="text-white text-center mt-10 animate-fadeIn">Завантаження...</p>;

  const posterUrl = `https://image.tmdb.org/t/p/w500${series.poster_path}`;
  const trailer = videos[0];

  return (
    <div className="bg-gradient-to-b from-black via-black/90 to-black text-white min-h-screen pt-10">
      <Header />
      <div className="max-w-6xl mt-20 mx-auto flex flex-col md:flex-row gap-8 animate-fadeIn">
        {/* Poster */}
        <div className="relative w-full md:w-1/3">
          <img
            src={posterUrl}
            alt={series.title || series.name}
            className="rounded-2xl shadow-2xl w-full transform hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-2xl"></div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-5xl font-extrabold mb-4 tracking-wide">{series.title || series.name}</h1>
            <p className="text-gray-400 mb-6">{series.release_date || series.first_air_date}</p>
            <p className="text-gray-300 mb-8 leading-relaxed">{series.overview}</p>
          </div>

          <button
          onClick={handleFavorite}
          className={`
            flex self-start items-center gap-2 px-6 py-3 rounded-sm font-regular text-lg transition-all duration-300
            
            ${inFavorites 
              ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:border-gray-600"
              : "bg-lime-500 text-white border-lime-600 hover:bg-lime-600 hover:border-lime-700 shadow-lg hover:shadow-2xl"
            }
          `}
        >
          {inFavorites ? <AiFillHeart className="text-red-500 w-5 h-5" /> : <AiOutlineHeart className="w-5 h-5" />}
          {inFavorites ? "Видалити з улюбленого" : "Додати в улюблене"}
        </button>
        </div>
      </div>

      {/* Trailer */}
      {trailer && (
        <div className="mt-16 max-w-6xl mx-auto animate-fadeIn">
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
      <CommentsSection movieId={series.id} />
      <Footer />
    </div>
    
  );
};

export default SerisesDetailsPage;

