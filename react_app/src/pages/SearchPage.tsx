import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { Movie, TMDBResponse } from '../types/movie';
import Header from '../components/Header/Header';
import { useTranslation } from 'react-i18next';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

async function searchTMDB(query: string, language: string): Promise<TMDBResponse<Movie>> {
  const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=${language}&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to perform search');
  return res.json();
}

const SearchPage = () => {
  const { t, i18n } = useTranslation();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const query = params.get('query') || '';
  const [results, setResults] = useState<Movie[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
   
    searchTMDB(query, i18n.language)
      .then((data) => {
        setResults(data.results);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query, i18n.language]); 

  return (
    <div className="pt-20 bg-black min-h-screen text-white">
      <Header />
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-4">
          {t('searchResults.title')} “{query}”
        </h2>
        {loading && <p>{t('searchResults.loading')}</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && results.length === 0 && (
          <p>{t('searchResults.noResults')}</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((item) => (
            <div key={item.id} className="bg-zinc-800 p-2 rounded">
              <img
                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                alt={item.title || item.original_title}
                className="rounded"
              />
              <p className="mt-2 text-sm">{item.title || item.original_title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;