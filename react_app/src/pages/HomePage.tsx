import { useNavigate } from "react-router-dom";

import "../index.css";
import Header from "../components/Header/Header";
import { useEffect, useState, useRef} from "react";
import Row from "../components/Row";
import HeroBanner from "../components/HeroBanner";
import Footer from "../components/Footer/Footer"
import { useTranslation } from 'react-i18next';
import {
  getPopularMovies,
  getUpcomingMovies,
  getPopularTV,
  getCartoons,
  getAnime,
} from "../services/movieApi";
import type { Movie } from "../types/movie";
import RowTv from "../components/RowTv";
import AboutModal from "../components/AboutModal"; 

const Top10Row = ({ title, fetcher }: { title: string; fetcher: any }) => {
  const [items, setItems] = useState<Movie[]>([]);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetcher();
        setItems(data.results.slice(0, 10));
      } catch (err) {
        console.error("Помилка завантаження:", err);
      }
    };
    load();
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
    <div className="relative p-4 mb-10">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold mb-4 text-3xl text-left">{title}</h2>
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
      
      <div ref={containerRef} className="flex overflow-x-auto gap-2 scrollbar-hide scroll-smooth">
        {items.map((item, index) => (
          <div key={item.id} className="relative ml-32 flex-shrink-0 hover:scale-95 transition-transform" onClick={() => navigate(`/tv/${item.id}`)}>
            <span
              className="absolute -left-24 -top-24 z-0 text-big font-black
                text-[#0d0d0d]
                drop-shadow-[1px_1px_1px_rgba(196,255,0,0.9)]
                [-webkit-text-stroke:8px_#C4FF00]
                [text-shadow:_0_0_px_black,0_0_10px_rgba(0,0,0,0.8)]"
            >
              {index + 1}
            </span>
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.title || item.original_title}
              className="relative w-36 rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await getPopularMovies(1);
        setMovies(data.results);
      } catch (err) {
        console.error("Помилка при завантаженні фільмів:", err);
      }
    };
    loadMovies();
  }, []);

  const handleOpenModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const { t } = useTranslation();
  return (
    <div className="bg-black/95 text-white overflow-x-auto scrollbar-hide">
      
      <Header />
      <div className="mt-20">
        <HeroBanner onAboutClick={handleOpenModal} /> 

        <section className="px-2">
          <Row title={t('homePage.movies')} fetcher={() => getPopularMovies(1)} />
          <RowTv title={t('homePage.tv')} fetcher={() => getPopularTV(1)} />
          <RowTv title={t('homePage.anime')} fetcher={() => getAnime(1)} />
          <Row title={t('homePage.cartoons')} fetcher={() => getCartoons(1)} />
          <Row title={t('homePage.newAndPopular')} fetcher={() => getUpcomingMovies(1)} />
          <Top10Row title={t('homePage.top10')} fetcher={() => getPopularTV(1)} />
        </section>
      </div>
      <Footer />

      {isModalOpen && selectedMovie && (
        <AboutModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default HomePage;