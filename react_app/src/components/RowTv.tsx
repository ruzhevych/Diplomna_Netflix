import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Series, TMDBResponse } from '../types/movie';
import { useAddToHistoryMutation } from '../services/historyApi';

interface RowProps {
  title: string;
  fetcher: () => Promise<TMDBResponse<Series>>;
}

const RowTv: React.FC<RowProps> = ({ title, fetcher }) => {
  const [items, setItems] = useState<Series[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [addToHistory] = useAddToHistoryMutation();

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
    const scrollAmount = container.clientWidth;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <div className="flex gap-1 mr-5">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-12 text-white flex items-center justify-center rounded-md hover:bg-opacity-75 transition-colors duration-200"
          >
            <span className="text-5xl font-regular">‹</span>
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-12 text-white flex items-center justify-center rounded-md hover:bg-opacity-75 transition-colors duration-200"
          >
            <span className="text-5xl font-regular">›</span>
          </button>
        </div>
      </div>
      
      <div
        ref={containerRef}
        className="flex overflow-x-auto gap-3 scrollbar-hide scroll-smooth"
      >
        {items.map(item => (
          <div
            key={item.id}
            className="min-w-[230px] cursor-pointer hover:scale-95 transition-transform"
            onClick={async () => {
              await addToHistory({
                id: item.id,
                mediaType: "tv",
                name: item.name,
              }).unwrap();
              navigate(`/tv/${item.id}`);
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.name || item.original_name}
              className="rounded-lg w-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RowTv;
