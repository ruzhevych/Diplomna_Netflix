import { useNavigate } from "react-router-dom";
import "../index.css";
import Header from "../components/Header/Header";
import { useEffect, useState } from "react";
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


const Top10Row = ({ title, fetcher }: { title: string; fetcher: any }) => {
  const [items, setItems] = useState<Movie[]>([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetcher();
        setItems(data.results.slice(0, 7));
      } catch (err) {
        console.error("Помилка завантаження:", err);
      }
    };
    load();
  }, [fetcher]);

  return (
    <div className="mb-10">
  <h2 className="font-bold mb-4 ml-6 text-3xl text-left">{title}</h2>
  <div className="flex w-full gap-24 overflow-x-auto scrollbar-hide justify-center items-center">
    {items.map((item, index) => (
      <div key={item.id} className="relative flex-shrink-0 hover:scale-95 transition-transform" onClick={() => navigate(`/tv/${item.id}`)}>
        <span
          className="absolute -left-20 -top-8 z-0 text-big font-black
            text-[#0d0d0d]
            drop-shadow-[1px_1px_1px_rgba(196,255,0,0.9)]
            [-webkit-text-stroke:2px_#C4FF00]
            [text-shadow:_0_0_2px_black,0_0_10px_rgba(0,0,0,0.8)]"
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const { t } = useTranslation();
  return (
    <div className="bg-black/95 text-white overflow-x-auto scrollbar-hide">
      
      <Header />
      <div className="mt-20">
        <HeroBanner />

        <section className="px-2">
          <Row title={t('homePage.movies')} fetcher={() => getPopularMovies(1)} />
          <RowTv title={t('homePage.tv')} fetcher={() => getPopularTV(1)} />
          <RowTv title={t('homePage.anime')} fetcher={() => getAnime(1)} />
          <Row title={t('homePage.cartoons')} fetcher={() => getCartoons(1)} />
          <Row title={t('homePage.newAndPopular')} fetcher={() => getUpcomingMovies(1)} />
          <Top10Row title={t('homePage.top10')} fetcher={() => getPopularTV(1)} />
        </section>
      </div>
      {/* Футер */}
      <Footer />
    </div>
  );
};

export default HomePage;
