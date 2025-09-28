import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Play, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetHistoryQuery, useDeleteFromHistoryMutation, useClearHistoryMutation, useAddToHistoryMutation } from "../../services/historyApi";
import { getMovieDetails, getSeriesDetails } from "../../services/movieApi";

export interface HistoryItemDetails {
  id: number;
  movieId: number;
  mediaType: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path?: string | null;
  release_date?: string;
  viewedAt: string;
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

/**
 * A page component that displays the user's viewing history for movies and TV shows.
 * It fetches the history from the backend and then retrieves detailed information for each item.
 * The page provides options to play content again, remove a single item from the history, or clear the entire history.
 *
 * @returns {JSX.Element} The movie history page component.
 */
export default function MovieHistoryPage() {
  const { data: history, isLoading, isError } = useGetHistoryQuery();
  const [deleteFromHistory] = useDeleteFromHistoryMutation();
  const [clearHistory] = useClearHistoryMutation();
  const [addToHistory] = useAddToHistoryMutation();

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
              const data = await getMovieDetails(h.movieId);
              return {
                ...data,
                id: h.id,
                mediaType: "movie",
                movieId: h.movieId,
                viewedAt: h.viewedAt || "",
              };
            } else {
              const data = await getSeriesDetails(h.movieId);
              return {
                ...data,
                id: h.id,
                mediaType: "tv",
                movieId: h.movieId,
                viewedAt: h.viewedAt || "",
              };
            }
          })
        );
        setItems(results);
      } catch (err: any) {
        toast.error("Failed to load history ");
      } finally {
        setLoadingDetails(false);
      }
    };

    loadDetails();
  }, [history]);

  const handleRemove = async (Id: number) => {
    try {
      await deleteFromHistory(Id).unwrap();
      setItems((prev) => prev.filter((item) => item.id !== Id));
      toast.info("Removed from history");
    } catch {
      toast.error("Failed to remove ");
    }
  };

  const handleClear = async () => {
    try {
      await clearHistory().unwrap();
      toast.info("History cleared 🗑️");
    } catch {
      toast.error("Failed to clear history ");
    }
  };
  
  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <div className="px-8 mt-20 py-10 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Viewing History</h1>
          {items.length > 0 && (
            <button
              onClick={handleClear}
              className="border border-lime-400 font-semibold text-white px-4 py-2 rounded hover:bg-lime-700/40 transition"
            >
              Clear History
            </button>
          )}
        </div>

        {(isLoading || loadingDetails) && <p className="text-gray-400">Loading...</p>}
        {isError && <p className="text-red-500">Error loading history</p>}
        {!isLoading && items.length === 0 && <p className="text-gray-400">History is empty</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {items.map((content) => (
            <div key={content.id} className="relative group cursor-pointer rounded-lg overflow-hidden bg-black">
              <img
                src={content.poster_path ? `${IMAGE_BASE_URL}${content.poster_path}` : "/no-poster.png"}
                alt={content.title || content.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-black/90 p-3 rounded-t-lg">
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={async () => { 
                      await addToHistory({
                        id: content.movieId,
                        mediaType: content.mediaType,
                        name: content.title ?? content.name ?? "No name",
                        }).unwrap();
                      navigate(`/${content.mediaType}/${content.movieId}`);
                    }}
                    className="bg-white text-black rounded-full p-2 hover:scale-110 transition"
                  >
                    <Play size={18} />
                  </button>

                  <button
                    onClick={() => handleRemove(content.id)}
                    className="ml-auto border border-red-400 text-white rounded-full p-2 hover:bg-red-700 transition"
                  >
                    <X size={18} />
                  </button>

                  <button
                    onClick={() => toast.info("More details coming soon 😉")}
                    className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>

                <div className="text-gray-300 text-sm mb-1">
                  {new Date(content.viewedAt).toLocaleString("en-US", {
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