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
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {items.map((item, index) => (
          <div key={item.id} className="relative flex-shrink-0">
            <span className="absolute -left-4 top-2 text-6xl font-bold text-lime-400 drop-shadow-md">
              {index + 1}
            </span>
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.title || item.name}
              className="w-40 rounded-md"
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
        const data = await getPopularMovies();
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
    <div className="bg-black/95 text-white min-h-screen">
      
      <Header />
      <HeroBanner />

      <section className="px-8">
        <Row title="Movies" fetcher={getPopularMovies} />
        <Row title="TV Series" fetcher={getPopularTV} />
        {/* <Row title="Anime" fetcher={getAnime} /> */}
        <Row title="Cartoons" fetcher={getTopRatedMovies} />
        <Row title="New & Popular" fetcher={getUpcomingMovies} />
        <Top10Row title="Top 10 TV Series Today" fetcher={getPopularTV} />
      </section>

      {/* Футер */}
      <Footer />
    </div>
  );
};

export default HomePage;
