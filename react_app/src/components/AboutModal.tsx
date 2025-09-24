import React from "react";
import { type Movie } from "../types/movie";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaPlay, FaTimes } from "react-icons/fa";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handlePlayClick = () => {
    onClose();
    if (movie.media_type === "movie") {
      navigate(`/movie/${movie.id}`);
    } else {
      navigate(`/tv/${movie.id}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-[#191716] rounded-lg max-w-2xl mx-auto w-full max-h-[90vh] relative shadow-2xl animate-slideInUp">
        <div className="relative w-full h-96">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${IMG_BASE}${movie.backdrop_path})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#191716] via-transparent to-[#191716]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#191716] to-transparent" />
          </div>
        </div>

        <button
          className="absolute top-3 right-3 text-white text-3xl font-bold p-1 rounded-full transition z-50 hover:text-[#C4FF00]"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <div className="p-8 relative z-10 -mt-24 md:-mt-36">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-4">
            <img
              src={`${IMG_BASE}${movie.poster_path}`}
              alt={movie.title || movie.original_title}
              className="w-24 md:w-40 rounded-lg shadow-lg border-2 border-[#C4FF00]"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">
                  {movie.title || movie.original_title || "Unknown"}
                </h3>
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  {movie.release_date && (
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-yellow-500">
                      <path d="M12 .587l3.668 7.425L24 9.425l-6 5.856L19.332 24 12 20.255 4.668 24 6 15.281 0 9.425l8.332-1.413L12 .587z" />
                    </svg>
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="border border-gray-500 rounded-full px-2 py-0.5 text-xs text-white">
                    {movie.media_type || 'movie'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="bg-[#C4FF00] text-black px-6 py-3 rounded-lg hover:bg-lime-500 transition flex items-center justify-center gap-2 font-bold w-full mt-4 md:mt-0"
              >
                <FaPlay />
                {t("heroBanner.watchButton")}
              </button>
            </div>
          </div>
          <p className="text-gray-300 mb-6 text-sm md:text-base">
            {movie.overview || t("landingPage.noDescription")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;