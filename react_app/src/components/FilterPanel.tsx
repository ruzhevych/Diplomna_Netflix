import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFilters } from "../context/FilterContext";
import { getMovieGenres, getTvGenres } from "../services/movieApi";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Genre {
  id: number;
  name: string;
}

const FilterPanel = ({ onClose }: { onClose: () => void }) => {
  const { filters, setFilters } = useFilters();
  const [localFilters, setLocalFilters] = useState(filters); // локальні зміни
  const [genres, setGenres] = useState<Genre[]>([]);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language; // 'ua' або 'en'

  useEffect(() => {
    const loadGenres = async () => {
      if (
        location.pathname.includes("movies") ||
        location.pathname.includes("cartoons") ||
        location.pathname.includes("new")
      ) {
        const res = await getMovieGenres(1, currentLanguage);
        setGenres(res.genres);
      } else if (
        location.pathname.includes("series") ||
        location.pathname.includes("anime")
      ) {
        const res = await getTvGenres(1, currentLanguage);
        setGenres(res.genres);
      }
    };
    loadGenres();

    // блокуємо скрол сторінки
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [location.pathname]);

  const toggleGenre = (id: number) => {
    setLocalFilters({
      ...localFilters,
      genres: localFilters.genres.includes(id)
        ? localFilters.genres.filter((g) => g !== id)
        : [...localFilters.genres, id],
    });
  };

  const handleSubmit = () => {
    setFilters(localFilters); // застосовуємо глобально
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({ ratingFrom: 1, ratingTo: 10, genres: [] }); // скидаємо локально
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-1/3 h-screen bg-zinc-950 text-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-800">
          <h2 className="text-xl font-semibold">Select filters</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-8 overflow-hidden">
          {/* IMDb Rating */}
          <div>
            <label className="block font-medium mb-3">IMDb Rating</label>
            <input
              type="range"
              min={1}
              max={10}
              value={localFilters.ratingFrom}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  ratingFrom: Number(e.target.value),
                })
              }
              className="w-full accent-lime-400"
            />
            <input
              type="range"
              min={1}
              max={10}
              value={localFilters.ratingTo}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  ratingTo: Number(e.target.value),
                })
              }
              className="w-full accent-lime-400 mt-2"
            />

            <div className="flex justify-between text-sm mt-2 text-gray-300">
              <span>From {localFilters.ratingFrom}</span>
              <span>To {localFilters.ratingTo}</span>
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="block font-medium mb-3">Select genre</label>
            <div className="grid grid-cols-3 gap-3">
              {genres.map((g) => (
                <label
                  key={g.id}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={localFilters.genres.includes(g.id)}
                    onChange={() => toggleGenre(g.id)}
                    className="accent-lime-400"
                  />
                  {g.name}
                </label>
              ))}
            </div>
            <button
              onClick={handleClear}
              className="mt-3 text-sm text-lime-400 hover:underline"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800">
          <button
            onClick={handleSubmit}
            className="w-full bg-gray-200 hover:bg-gray-300 text-black py-2 rounded font-medium"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
