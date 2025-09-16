import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { useAddFavoriteMutation } from "../services/favoritesApi";
import { useAddForLaterMutation } from "../services/forLaterApi";

interface MediaGridProps {
  title: string;
  fetchData: (page?: number) => Promise<any>;
  genres: { id: number; name: string }[];
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";


const MediaTvGrid = ({ title, fetchData, genres }: MediaGridProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [addFavorite] = useAddFavoriteMutation();
  const [AddForLater] = useAddForLaterMutation();

  const navigate = useNavigate();

  useEffect(() => {
    loadData(1, true);
  }, [fetchData]);

  const loadData = async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      const data = await fetchData(pageNum);
      setItems((prev) => (reset ? data.results : [...prev, ...data.results]));
      setPage(pageNum);
    } catch (err: any) {
      setError("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const getGenres = (genreIds: number[]) => {
    return genreIds
      ?.map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3);
  };

  const handlePlay = (id: number) => {
    navigate(`/tv/${id}`);
  };

  const handleAdd = async (id: number) => {
    try {
      const payload = { contentId: id, contentType: "tv" };
      await AddForLater(payload).unwrap();
      toast.success("Added to 'Watch Later' list");
      console.log("➕ Added to list:", id);
    } catch {
      toast.error("Failed to add to 'Watch Later' list 😢");
    }
  };

  const handleLike = async (id: number) => {
    try {
      const payload = { contentId: id, contentType: "tv" };
      await addFavorite(payload).unwrap();
      toast.success("Added to favorites 👍");
      console.log("➕ Added to favorites:", id);
    } catch {
      toast.error("Failed to add to favorites 😢");
    }
  };

  const handleExpand = (id: number) => {
    console.log("🔽 Expand details:", id);
  };

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="px-8 py-10 max-w-[1600px] mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative group cursor-pointer rounded-lg overflow-hidden bg-black"
          >
            <img
              src={
                item.poster_path
                  ? `${IMAGE_BASE_URL}${item.poster_path}`
                  : "/no-poster.png"
              }
              alt={item.title || item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-black/90 p-3 rounded-t-lg">
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => handlePlay(item.id)}
                  className="bg-white text-black rounded-full p-2 hover:scale-110 transition"
                >
                  <Play size={18} />
                </button>
                <button
                  onClick={() => handleAdd(item.id)}
                  className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => handleLike(item.id)}
                  className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <ThumbsUp size={18} />
                </button>
                <button
                  onClick={() => handleExpand(item.id)}
                  className="ml-auto border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                <span className="px-2 py-0.5 border border-gray-500 rounded">HD</span>
                <span className="px-2 py-0.5 border border-gray-500 rounded">6+</span>
                {getGenres(item.genre_ids)?.map((g, idx) => (
                  <span key={idx}>{g}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <button
            onClick={() => loadData(page + 1)}
            className="px-6 py-2 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-200 transition"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default MediaTvGrid;