// src/components/Row.tsx
import { useEffect, useState } from 'react';
import type { Movie, TMDBResponse } from '../types/movie';

interface RowProps {
  title: string;
  fetcher: () => Promise<TMDBResponse<Movie>>;
}

const Row = ({ title, fetcher }: RowProps) => {
  const [items, setItems] = useState<Movie[]>([]);

  useEffect(() => {
    fetcher()
      .then(data => setItems(data.results))
      .catch(console.error);
  }, [fetcher]);

  return (
    <section className="p-4">
      <h2 className="text-xl font-semibold mb-2 text-white">{title}</h2>
      <div className="flex overflow-x-auto gap-3">
        {items.map(item => (
          <div key={item.id} className="min-w-[150px]">
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.title || item.name}
              className="rounded-lg"
            />
            <p className="text-sm text-white mt-1">
              {item.title || item.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Row;
