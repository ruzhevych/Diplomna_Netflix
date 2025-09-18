import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Movie, TMDBResponse } from '../types/movie';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { toast } from 'react-toastify';
import { Play, Plus, ChevronDown, ThumbsUp } from 'lucide-react';
import { getMovieDetails, getSeriesDetails } from '../services/movieApi';
import { useAddForLaterMutation } from '../services/forLaterApi';
import { useAddFavoriteMutation } from '../services/favoritesApi';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

async function searchTMDB(query: string): Promise<TMDBResponse<Movie>> {
  const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=uk-UA&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to perform search');
  return res.json();
}

interface SearchItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  genres?: { id: number; name: string }[];
  media_type: 'movie' | 'tv';
}

const SearchPage = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const query = params.get('query') || '';
  const [results, setResults] = useState<SearchItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [addForLater] = useAddForLaterMutation();
  const [addFavorite] = useAddFavoriteMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchTMDB(query)
      .then((data) => {
        // Беремо тільки movie та tv
        const filtered = data.results.filter(r => r.media_type === 'movie' || r.media_type === 'tv');
        setResults(filtered);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  const handleAdd = async (id: number, type: string) => {
    try {
      await addForLater({ contentId: id, contentType: type }).unwrap();
      toast.success("Added to 'Watch Later' list ❤️");
    } catch {
      toast.error("Failed to add to 'Watch Later' list 😢");
    }
  };

  const handleLike = async (id: number, type: string) => {
      try {
        const payload = { contentId: id, contentType: type };
        await addFavorite(payload).unwrap();
        toast.success("Added to favorites ❤️");
      } catch {
        toast.error("Failed to add to favorites 😢");
      }
    };

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <div className="px-8 mt-20 py-10 max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search Results for: "{query}"</h1>

        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && results.length === 0 && <p className="text-gray-400">Nothing was found.</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {results.map((content) => (
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
                    onClick={() => navigate(`/${content.media_type}/${content.id}`)}
                    className="bg-white text-black rounded-full p-2 hover:scale-110 transition"
                  >
                    <Play size={18} />
                  </button>

                  <button
                    onClick={() => handleAdd(content.id, content.media_type)}
                    className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                  >
                    <Plus size={18} />
                  </button>

                  <button
                    onClick={() => handleLike(content.id, content.media_type)}
                    className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                  >
                    <ThumbsUp size={18} />
                  </button>

                  <button
                    onClick={() => toast.info("More details coming soon 😉")}
                    className="ml-auto border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>

                {content.genres && (
                  <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                    {content.genres.slice(0, 3).map((g) => (
                      <span key={g.id}>{g.name}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
