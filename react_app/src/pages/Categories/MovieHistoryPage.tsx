import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Play, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetHistoryQuery, useDeleteFromHistoryMutation, useClearHistoryMutation } from "../../services/historyApi";
import { getMovieDetails, getSeriesDetails } from "../../services/movieApi";
//import type { HistoryItemDetails } from "../../types/history";

export interface HistoryItemDetails {
  movieId: number;
  mediaType: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path?: string | null;
  release_date?: string;
  viewedAt: string;
}


const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function MovieHistoryPage() {
  const { data: history, isLoading, isError } = useGetHistoryQuery();
  const [deleteFromHistory] = useDeleteFromHistoryMutation();
  const [clearHistory] = useClearHistoryMutation();

  const [items, setItems] = useState<HistoryItemDetails[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!history || history.length === 0) {
      setItems([]);
      return;
    }

    const loadDetails = async () => {
      setLoadingDetails(true);
      try {
        const results = await Promise.all(
          history.map(async (h) => {
            if (h.mediaType === "movie") {
              const data = await getMovieDetails(h.id);
              return { 
                ...data, 
                mediaType: "movie",
                movieId: h.id,
                viewedAt: h.viewedAt || "" 
              };
            } else {
              const data = await getSeriesDetails(h.id);
              return { 
                ...data, 
                mediaType: "tv",
                movieId: h.id,
                viewedAt: h.viewedAt || ""
              };
            }
          })
        );
        setItems(results);
      } catch (err: any) {
        toast.error("Не вдалося завантажити історію 😢");
      } finally {
        setLoadingDetails(false);
      }
    };

    loadDetails();
  }, [history]);

  const handleRemove = async (movieId: number) => {
    try {
      await deleteFromHistory(movieId).unwrap();
      toast.info("Видалено з історії ❌");
    } catch {
      toast.error("Не вдалося видалити 😢");
    }
  };

  const handleClear = async () => {
    try {
      await clearHistory().unwrap();
      toast.info("Історія очищена 🗑️");
    } catch {
      toast.error("Не вдалося очистити історію 😢");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <div className="px-8 mt-20 py-10 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Історія переглядів</h1>
          {items.length > 0 && (
            <button
              onClick={handleClear}
              className="border border-red-400 text-red-400 px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Очистити історію
            </button>
          )}
        </div>

        {(isLoading || loadingDetails) && <p className="text-gray-400">Завантаження...</p>}
        {isError && <p className="text-red-500">Помилка завантаження історії</p>}
        {!isLoading && items.length === 0 && <p className="text-gray-400">Історія порожня 😢</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {items.map((content) => (
            <div key={content.movieId} className="relative group cursor-pointer rounded-lg overflow-hidden bg-black">
              <img
                src={content.poster_path ? `${IMAGE_BASE_URL}${content.poster_path}` : "/no-poster.png"}
                alt={content.title || content.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-black/90 p-3 rounded-t-lg">
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => navigate(`/${content.mediaType}/${content.movieId}`)}
                    className="bg-white text-black rounded-full p-2 hover:scale-110 transition"
                  >
                    <Play size={18} />
                  </button>

                  <button
                    onClick={() => handleRemove(content.movieId)}
                    className="ml-auto border border-red-400 text-red-400 rounded-full p-2 hover:bg-red-700 transition"
                  >
                    <X size={18} />
                  </button>

                  <button
                    onClick={() => toast.info("Більше деталей пізніше 😉")}
                    className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>

                <div className="text-gray-300 text-sm mb-1">
                  {new Date(content.viewedAt).toLocaleString("uk-UA", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                  <span className="px-2 py-0.5 border border-gray-500 rounded">
                    {content.mediaType.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
