import { useNavigate } from "react-router-dom";
import "../index.css";
import Header from "../components/Header/Header";
import { useEffect, useState } from "react";
import Row from "../components/Row";
import HeroBanner from "../components/HeroBanner";
import Footer from "../components/Footer/Footer"

import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getPopularTV,
  getCartoons,
  getAnime,
  //getAnime,
} from "../services/movieApi";
import type { Movie } from "../types/movie";


// Топ-10 рядок
const Top10Row = ({ title, fetcher }: { title: string; fetcher: any }) => {
  const [items, setItems] = useState<Movie[]>([]);

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

  return (
    <div className="mb-10 ">
      <h2 className="text-lg font-bold mb-2 text-left">{title}</h2>
      <div className="flex w-full gap-4 overflow-x-auto scrollbar-hide justify-center items-center">
        {items.map((item, index) => (
          <div key={item.id} className="relative flex-shrink-0">
            <span className="absolute -left-5 top-2 z-20 text-8xl font-bold text-white
               drop-shadow-[2px_2px_4px_rgba(0,0,0,0.9)]
               [text-shadow:_0_0_2px_white,0_0_10px_black]
               [-webkit-text-stroke:2px_white]">
              {index + 1}
            </span>
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.title || item.original_title}
              className=" w-40 rounded-md"
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

  return (
    <div className="bg-black/95 text-white overflow-x-auto scrollbar-hide">
      
      <Header />
      <div className="mt-20">
        <HeroBanner />

        <section className="px-">
          <Row title="Movies" fetcher={() => getPopularMovies(1)} />
          <Row title="TV Series" fetcher={() => getPopularTV(1)} />
          <Row title="Anime" fetcher={() => getAnime(1)} />
          <Row title="Cartoons" fetcher={() => getCartoons(1)} />
          <Row title="New & Popular" fetcher={() => getUpcomingMovies(1)} />
          <Top10Row title="Top 10 TV Series Today" fetcher={() => getPopularTV(1)} />
        </section>
      </div>
      {/* Футер */}
      <Footer />
    </div>
  );
};

export default HomePage;
