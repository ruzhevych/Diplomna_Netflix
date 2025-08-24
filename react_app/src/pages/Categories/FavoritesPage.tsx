import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../../services/favoritesApi";
import { getMovieDetails, getSeriesDetails } from "../../services/movieApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Play, Plus, ThumbsUp, ChevronDown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface FavoriteItem {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  name?: string;
  genres?: { id: number; name: string }[];
  contentType: "movie" | "tv";
}

export default function FavoritesPage() {
  const { data: favorites, isLoading, isError } = useGetFavoritesQuery();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!favorites || favorites.length === 0) {
      setItems([]);
      return;
    }

    const loadDetails = async () => {
      setLoadingDetails(true);
      try {
        const detailsPromises = favorites.map(async (fav) => {
          if (fav.contentType === "movie") {
            const data = await getMovieDetails(fav.contentId);
            return { ...data, contentType: "movie" as const };
          } else {
            const data = await getSeriesDetails(fav.contentId);
            return { ...data, contentType: "tv" as const };
          }
        });

        const results = await Promise.all(detailsPromises);
        setItems(results);
      } catch (err: any) {
        toast.error("Помилка завантаження деталей улюбленого 😢");
      } finally {
        setLoadingDetails(false);
      }
    };

    loadDetails();
  }, [favorites]);

  const handleAdd = async (id: number) => {
    try {
      await addFavorite(id).unwrap();
      toast.success("Додано в улюблене ❤️");
    } catch {
      toast.error("Не вдалося додати в улюблене 😢");
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await removeFavorite(id).unwrap();
      toast.info("Видалено з улюбленого ❌");
    } catch {
      toast.error("Не вдалося видалити 😢");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <div className="px-8 py-10 max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold mb-6">Улюблене</h1>

        {(isLoading || loadingDetails) && (
          <p className="text-gray-400">Завантаження...</p>
        )}
        {isError && (
          <p className="text-red-500">Помилка завантаження улюбленого</p>
        )}
        {!isLoading && items.length === 0 && (
          <p className="text-gray-400">Улюблених ще немає 😢</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {items.map((movie) => (
            <div
              key={movie.id}
              className="relative group cursor-pointer rounded-lg overflow-hidden bg-black"
            >
              <img
                src={
                  movie.poster_path
                    ? `${IMAGE_BASE_URL}${movie.poster_path}`
                    : "/no-poster.png"
                }
                alt={movie.title || movie.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-black/90 p-3 rounded-t-lg">
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="bg-white text-black rounded-full p-2 hover:scale-110 transition"
                  >
                    <Play size={18} />
                  </button>

                  <button
                    onClick={() => handleAdd(movie.id)}
                    className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                  >
                    <Plus size={18} />
                  </button>

                  <button
                    onClick={() => toast.success("Вподобали 👍")}
                    className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                  >
                    <ThumbsUp size={18} />
                  </button>

                  <button
                    onClick={() => handleRemove(movie.id)}
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

                <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                  <span className="px-2 py-0.5 border border-gray-500 rounded">
                    HD
                  </span>
                  <span className="px-2 py-0.5 border border-gray-500 rounded">
                    6+
                  </span>
                  {movie.genres?.slice(0, 3).map((g) => (
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
