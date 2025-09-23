import { useEffect, useState } from "react";
import type { Movie, TMDBResponse } from "../types/movie";
import { getPopularMovies } from "../services/movieApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface HeroBannerProps {
  onAboutClick: (movie: Movie) => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ onAboutClick }) => {
  const { t } = useTranslation();
  const [movie, setMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data: TMDBResponse<Movie> = await getPopularMovies(1);
        const pick =
          data.results[Math.floor(Math.random() * data.results.length)];
        setMovie(pick);
      } catch (err) {
        console.error(t("heroBanner.errorLoading"));
        console.error(err);
      }
    })();
  }, [t]);

  if (!movie) return null;

  const backdrop = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
    <div
      className="relative h-[85vh] w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backdrop})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/90 to-transparent " />

      <div className="absolute bottom-36 left-14 w-[750px] text-white ">
        <h1 className="text-7xl font-black
             text-white
             drop-shadow-[1px_1px_1px_rgba(196,255,0,0.9)]
             
             [text-shadow:0_0_10px_rgba(0,0,0,0.8)]">
          {movie.title || movie.original_title}
        </h1>

        <p className="mt-6 text-lg text-gray-200 font-bold line-clamp-3 drop-shadow-md">
          {movie.overview}
        </p>
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="bg-[#C4FF00] hover:bg-lime-600 text-black px-8 py-2 rounded-sm w-50 text-lg font-semibold transition"
          >
            {t("heroBanner.watchButton")}
          </button>
          <button
            onClick={() => onAboutClick(movie)}
            className="bg-[#D9D9D9]/30 hover:bg-[#D9D9D9]/50 text-white px-8 py-2 rounded-sm w-50 text-lg font-semibold transition"
          >
            {t("heroBanner.aboutButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;