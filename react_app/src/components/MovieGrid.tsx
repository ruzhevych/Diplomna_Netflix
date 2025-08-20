import { useEffect, useState } from "react";
import { type Movie, type TMDBResponse } from "../types/movie";
import { useNavigate } from "react-router-dom";

interface Props {
  fetchFn: (page?: number) => Promise<TMDBResponse<Movie>>;
  title: string;
}

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieGrid({ fetchFn, title }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadMovies(1, true);
  }, []);

  const loadMovies = async (pageNum: number, replace = false) => {
    setLoading(true);
    try {
      const data = await fetchFn(pageNum);
      setMovies(prev => (replace ? data.results : [...prev, ...data.results]));
      setPage(pageNum);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white/5 min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto mt-14 -inset-4 -z-10">
        <h2 className="text-2xl font-bold text-white mb-6 -inset-4 -z-10">{title}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3">
          {movies.map((m) => (
            <div
              key={m.id}
              className="relative group rounded-lg overflow-hidden aspect-[2/3]
                         bg-center bg-cover transition-transform duration-300 hover:scale-105"
              style={{
                backgroundImage: `url(${
                  m.poster_path
                    ? `${IMG_BASE}${m.poster_path}`
                    : "/no-poster.jpg"
                })`,
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                              transition-opacity duration-300
                              bg-gradient-to-t from-black/90 via-black/60 to-transparent
                              flex flex-col justify-between p-3 text-white">
                <div>
                  <h3 className="font-semibold text-sm">{m.title || m.name}</h3>
                  <p className="text-[11px] text-gray-300 mb-2">
                    {(m.release_date || m.first_air_date || "").slice(0, 4)}
                  </p>
                  <p className="text-xs line-clamp-4">
                    {m.overview || "Опис недоступний."}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start">
                  {/* Play */}
                  <button
                    onClick={() => navigate(`/movie/${m.id}`)}
                    className="w-10 h-10 rounded-full bg-lime-500 hover:bg-lime-400 text-black
                               flex items-center justify-center transition"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>

                  {/* Info */}
                  <button
                    onClick={() => navigate(`/movie/${m.id}`)}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white
                               flex items-center justify-center transition"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11 7h2v2h-2V7zm0 4h2v6h-2v-6zm1-9C6.48 2 2 6.48 2 12s4.48 10 
                               10 10 10-4.48 10-10S17.52 2 12 2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            disabled={loading}
            onClick={() => loadMovies(page + 1)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Завантаження..." : "Load more"}
          </button>
        </div>
      </div>
    </section>
  );
}
