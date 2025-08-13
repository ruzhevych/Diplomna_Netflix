import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { Movie, TMDBResponse } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

async function searchTMDB(query: string): Promise<TMDBResponse<Movie>> {
  const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=uk-UA&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Не вдалося виконати пошук');
  return res.json();
}

const SearchPage = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const query = params.get('query') || '';
  const [results, setResults] = useState<Movie[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchTMDB(query)
      .then((data) => {
        setResults(data.results);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="pt-20 bg-black min-h-screen text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-4">Результати пошуку: “{query}”</h2>
        {loading && <p>Завантаження...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && results.length === 0 && (
          <p>Нічого не знайдено.</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((item) => (
            <div key={item.id} className="bg-zinc-800 p-2 rounded">
              <img
                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                alt={item.title || item.name}
                className="rounded"
              />
              <p className="mt-2 text-sm">{item.title || item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
