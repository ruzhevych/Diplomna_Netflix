import React, { useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import logo from "/logo-green.png";
import Footer from "../components/Footer/Footer";
import { FaDownload, FaChild } from "react-icons/fa";
import { type Movie, type TMDBResponse } from "../types/movie";
import { getPopularMovies } from "../services/movieApi";
import { GiFilmProjector } from "react-icons/gi";
import { MdOutlineScreenSearchDesktop } from "react-icons/md";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useAuth } from "../context/AuthContext";
import { useGetProfileQuery } from "../services/userApi";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const AVATAR_PLACEHOLDER = "https://via.placeholder.com/40/C4FF00/000000?text=👤";

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);

  const { isAuthenticated, isAuthReady } = useAuth();
  
  const { data: userProfile, isLoading: isProfileLoading } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth / 4;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data: TMDBResponse<Movie> = await getPopularMovies(1);
        setMovies(data.results.slice(0, 10));
      } catch (err) {
        console.error("Помилка завантаження:", err);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="absolute top-0 left-0 w-full z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <img src={logo} alt="Logo" className="w-32 md:w-40" />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {isAuthReady ? (
              isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={userProfile?.profilePictureUrl}
                    alt="User Avatar"
                    className={`w-10 h-10 rounded-full border-2 border-[#C4FF00] cursor-pointer transition ${isProfileLoading ? 'animate-pulse' : ''}`}
                  />
                </Link>
              ) : (
                <Link to="/login">
                  <button className="bg-[#C4FF00]/70 px-4 py-2 rounded-sm text-white font-semibold hover:bg-[#C4FF00]/60">
                    {t("landingPage.login")}
                  </button>
                </Link>
              )
            ) : (
              <div className="w-24 h-10 bg-gray-700 rounded-sm animate-pulse"></div>
            )}
          </div>
        </div>
      </header>

      {/* ====================================================================================== */}

      <section className="relative h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/land-bg.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <Trans i18nKey="landingPage.heroTitle">
              Movies, series and lots of other content <br /> without limits
            </Trans>
          </h1>
          {!isAuthenticated && (
            <>
              <h2 className="text-lg md:text-2xl mb-4">
                <Trans i18nKey="landingPage.heroSubtitle">
                  From <span className="text-[#C4FF00]">4,99 EUR</span>. You can cancel subscription anytime
                </Trans>
              </h2>
              <p className="mb-6">{t("landingPage.heroText")}</p>
              <div className="flex rounded-sm flex-col sm:flex-row justify-center gap-4">
                <input
                  type="email"
                  placeholder={t("landingPage.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 w-full sm:w-112 bg-black/70 border border-gray-500"
                />
                <button
                  onClick={() => navigate("/register", { state: { email } })}
                  className="bg-[#C4FF00]/70 px-6 py-3 rounded-sm font-bold text-lg hover:bg-[#C4FF00]/60 transition"
                >
                  {t("landingPage.startButton")}
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ====================================================================================== */}

      <div className="relative">
        <div
          className="absolute -top-11 left-0 w-full h-10
                      bg-gradient-to-r from-[#C4FF00]/20 via-[#C4FF00]/100 to-[#C4FF00]/20
                      rounded-t-[50%]
                      shadow-[0_-20px_30px_rgba(0,0,0,0.6)]"
        />
      </div>

      {/* ====================================================================================== */}

      <div className="relative">
        <div className="absolute -top-10 left-0 w-full h-12 bg-black rounded-t-[50%] shadow-[0_-20px_20px_rgba(0,255,0,0.4)]" />
      </div>
      <section className="bg-black py-12 px-6">
        <div className="max-w-6xl mx-auto relative">
          <div className="inline-flex justify-between w-full">
          <h2 className="text-2xl font-bold mb-6 text-white">{t("landingPage.popularNow")}</h2>
          <div className="flex">
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
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto overflow-y-visible scrollbar-hide scroll-smooth py-2 px-4"
          >
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className="relative min-w-[20%] flex-shrink-0 cursor-pointer group
                         rounded-lg transform transition-transform duration-500 hover:scale-105"
                onClick={() => setSelectedMovie(movie)}
              >
                <div className="gradient-text absolute -left-5 top-2 z-20 text-9xl font-extrabold
                                drop-shadow-[1px_1px_1px_rgba(196,255,0,0.9)]
                                [-webkit-text-stroke:2px_lime]">
                  {index + 1}
                </div>

                <div className="rounded-lg overflow-hidden">
                  <img
                    src={`${IMG_BASE}${movie.poster_path}`}
                    alt={movie.title || movie.original_title}
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          {selectedMovie && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-[#191716] rounded-lg max-w-2xl mx-auto w-full max-h-[90vh] overflow-y-auto relative">
                <div className="relative w-full h-96">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${IMG_BASE}${selectedMovie.backdrop_path})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#191716] via-transparent to-[#191716]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#191716] to-transparent" />
                  </div>
                </div>

                <button
                  className="absolute top-3 right-3 text-white text-3xl font-bold p-1 rounded-full transition z-50"
                  onClick={() => setSelectedMovie(null)}
                >
                  &times;
                </button>

                <div className="p-8 relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {selectedMovie.title || selectedMovie.original_title}
                  </h3>

                  <div className="flex items-center gap-4 mb-4 text-gray-400 text-sm">
                    {selectedMovie.release_date && (
                      <span>{new Date(selectedMovie.release_date).getFullYear()}</span>
                    )}
                    {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {selectedMovie.genres.map(genre => (
                          <span key={genre.id} className="border border-gray-500 rounded-full px-2 py-0.5 text-xs">
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {selectedMovie.vote_average && (
                      <span className="flex items-center gap-1">
                        <svg fill="currentColor" viewBox="0 24 24" className="w-4 h-4 text-yellow-500">
                          <path d="M12 .587l3.668 7.425L24 9.425l-6 5.856L19.332 24 12 20.255 4.668 24 6 15.281 0 9.425l8.332-1.413L12 .587z" />
                        </svg>
                        {selectedMovie.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-300 mb-6">
                    {selectedMovie.overview || t("landingPage.noDescription")}
                  </p>
                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate(`/movie/${selectedMovie.id}`);
                      } else {
                        navigate("/login");
                      }
                    }}
                    className="border text-white no-underline px-6 py-3 rounded-lg hover:bg-[#555555] transition flex items-center justify-center gap-2 font-bold"
                  >
                    {t("landingPage.startButton")}
                    <svg fill="currentColor" viewBox="0 24 24" className="w-5 h-5">
                      <path d="M5 3l14 9-14 9z" />
                    </svg>
                  </button>

                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================================== */}

      <section className="bg-black py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-2xl font-bold text-white mb-8 tracking-wide">
            {t("landingPage.moreReasons")}
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              {
                title: t("landingPage.reasons.tv.title"),
                subtitle: t("landingPage.reasons.tv.subtitle"),
                icon: <GiFilmProjector className="text-[#C4FF00]/100 text-6xl mx-auto mb-4 animate-pulse" />
              },
              {
                title: t("landingPage.reasons.download.title"),
                subtitle: t("landingPage.reasons.download.subtitle"),
                icon: <FaDownload className="text-[#C4FF00]/100 text-6xl mx-auto mb-4 animate-pulse" />
              },
              {
                title: t("landingPage.reasons.anywhere.title"),
                subtitle: t("landingPage.reasons.anywhere.subtitle"),
                icon: <MdOutlineScreenSearchDesktop className="text-[#C4FF00]/100 text-6xl mx-auto mb-4 animate-pulse" />
              },
              {
                title: t("landingPage.reasons.kids.title"),
                subtitle: t("landingPage.reasons.kids.subtitle"),
                icon: <FaChild className="text-[#C4FF00]/100 text-6xl mx-auto mb-4 animate-pulse" />
              },
            ].map((f, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl p-8
                           bg-gradient-to-br from-[#C4FF00]/10 via-black/10 to-[#C4FF00]/20
                           shadow-2xl hover:shadow-3xl transition-transform duration-500 hover:scale-105
                           backdrop-blur-md"
              >
                <div className="relative z-10">{f.icon}</div>
                <h3 className="font-bold text-xl md:text-2xl text-white mb-2 mt-4">{f.title}</h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">{f.subtitle}</p>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-lime-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-lime-500/20 rounded-full blur-3xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================================== */}

      <section className="bg-black py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-2xl font-bold text-white mb-8 tracking-wide">
            {t("landingPage.faq.title")}
          </h2>
          <div className="space-y-2">
            {[
              {
                "q": t("landingPage.faq.q1"),
                "a": t("landingPage.faq.a1")
              },
              {
                "q": t("landingPage.faq.q2"),
                "a": t("landingPage.faq.a2")
              },
              {
                "q": t("landingPage.faq.q3"),
                "a": t("landingPage.faq.a3")
              },
              {
                "q": t("landingPage.faq.q4"),
                "a": t("landingPage.faq.a4")
              },
              {
                "q": t("landingPage.faq.q5"),
                "a": t("landingPage.faq.a5")
              }
            ].map((item, i) => (
              <details
                key={i}
                className="group bg-gradient-to-tr from-lime-700/20 via-lime-600/10 to-lime-900/20
                         backdrop-blur-md rounded-sm p-4
                         transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <summary className="cursor-pointer font-bold text-lg text-white flex justify-between items-center">
                  {item.q}
                  <span className="transition-transform duration-300 group-open:rotate-45 text-lime-400 text-xl">+</span>
                </summary>
                <p className="mt-3 text-gray-300 text-sm md:text-base leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;