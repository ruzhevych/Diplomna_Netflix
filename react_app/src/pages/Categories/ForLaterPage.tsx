import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import {
  useGetForLatersQuery,
  useRemoveForLaterMutation,
} from "../../services/forLaterApi";
import { getMovieDetails, getSeriesDetails } from "../../services/movieApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Play, ThumbsUp, ChevronDown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAddFavoriteMutation } from "../../services/favoritesApi";
import { useAddToHistoryMutation } from "../../services/historyApi";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface ForLaterItem {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  name?: string;
  genres?: { id: number; name: string }[];
  contentType: "movie" | "tv";
  contentId: number;
  forLaterId: number;
}


export default function ForLaterPage() {
  const { data: forLaters, isLoading, isError } = useGetForLatersQuery();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeForLater] = useRemoveForLaterMutation();
  const [addToHistory] = useAddToHistoryMutation();

  const [forLaterItems, setForLaterItems] = useState<ForLaterItem[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!forLaters || forLaters.length === 0) {
      setForLaterItems([]);
      return;
    }

    const loadDetails = async () => {
      setLoadingDetails(true);
      try {
        const detailsPromises = forLaters.map(async (fl) => {
          if (fl.contentType === "movie") {
            const data = await getMovieDetails(fl.contentId);
            return {
              ...data,
              contentType: "movie" as const,
              contentId: Number(fl.contentId),
              forLaterId: fl.id,
            };
          } else {
            const data = await getSeriesDetails(fl.contentId);
            return {
              ...data,
              contentType: "tv" as const,
              contentId: Number(fl.contentId),
              forLaterId: fl.id,
            };
          }
        });

        const results = await Promise.all(detailsPromises);
        setForLaterItems(results);
      } catch (err: any) {
        toast.error("Error loading 'watch later' details 😢");
      } finally {
        setLoadingDetails(false);
      }
    };

    loadDetails();
  }, [forLaters]);

  const handleAdd = async (id: number, type: string) => {
    try {
      const payload = { contentId: id, contentType: type };
      await addFavorite(payload).unwrap();
      toast.success("Added to favorites ❤️");
    } catch {
      toast.error("Failed to add to favorites 😢");
    }
  };

  const handleRemove = async (forLaterId: number) => {
    try {
      await removeForLater(forLaterId).unwrap();
      toast.info("Removed from 'watch later' list ❌");
    } catch {
      toast.error("Failed to remove 😢");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <div className="px-8 mt-20 py-10 max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold mb-6">Watch Later</h1>

        {(isLoading || loadingDetails) && (
          <p className="text-gray-400">Loading...</p>
        )}
        {isError && (
          <p className="text-red-500">Error loading 'watch later' list</p>
        )}
        {!isLoading && forLaterItems.length === 0 && (
          <p className="text-gray-400">Your 'watch later' list is empty 😢</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {forLaterItems.map((content) => (
            <div
              key={content.id}
              className="relative group cursor-pointer rounded-lg overflow-hidden bg-black"
            >
              <img
                src={
                  content.poster_path
                    ? `${IMAGE_BASE_URL}${content.poster_path}`
                    : "/no-poster.png"
                }
                alt={content.title || content.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-black/90 p-3 rounded-t-lg">
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={async () => { 
                      await addToHistory({
                        id: content.id,
                        mediaType: content.contentType,
                        name: content.title ?? content.name,
                        }).unwrap();
                      navigate(`/${content.contentType}/${content.id}`);
                    }}
                    className="bg-white text-black rounded-full p-2 hover:scale-110 transition"
                  >
                    <Play size={18} />
                  </button>

                  <button
                    onClick={() => handleAdd(content.id, content.contentType)}
                    className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                  >
                    <ThumbsUp size={18} />
                  </button>

                  <button
                    onClick={() => handleRemove(content.forLaterId)}
                    className="ml-auto border border-red-400 text-red-400 rounded-full p-2 hover:bg-red-700 transition"
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

                <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                  <span className="px-2 py-0.5 border border-gray-500 rounded">
                    HD
                  </span>
                  <span className="px-2 py-0.5 border border-gray-500 rounded">
                    6+
                  </span>
                  {content.genres?.slice(0, 3).map((g) => (
                    <span key={g.id}>{g.name}</span>
                  ))}
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