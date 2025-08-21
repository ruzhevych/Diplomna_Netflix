import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie, TMDBResponse } from '../types/movie';

interface RowProps {
  title: string;
  fetcher: () => Promise<TMDBResponse<Movie>>;
}

const Row: React.FC<RowProps> = ({ title, fetcher }) => {
  const [items, setItems] = useState<Movie[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    fetcher()
      .then(data => {
        if (isMounted) setItems(data.results);
      })
      .catch(err => console.error('Помилка при завантаженні:', err));
    return () => { isMounted = false; };
  }, [fetcher]);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth; // прокрутити на ширину видимої області
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative p-4">
      <h2 className="text-xl font-semibold mb-2 text-white">{title}</h2>
      {/* Кнопки для прокрутки */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-75"
      >
        ‹
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-75"
      >
        ›
      </button>
      {/* Контейнер без скролбара */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto gap-3 scrollbar-hide scroll-smooth"
      >
        {items.map(item => (
          <div
            key={item.id}
            className="min-w-[230px] cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate(`/movie/${item.id}`)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.title || item.name}
              className="rounded-lg w-full"
            />
            <p className="text-sm text-white mt-1 truncate">
              {item.title || item.name}
            </p>
          </div>
        ))}
      </div>
    </section>
);
}

export default Row;