import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Collection, Credits, Movie } from "../types/movie";
import {
  type Video,
  getCollections,
  getCreditsMovie,
  getMovieDetails,
  getMovieVideos,
  getRecomendationsMovies,
  getSimilarMovies,
  getMovieCredits, 
} from "../services/movieApi";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetFavoritesQuery,
} from "../services/favoritesApi";
import { toast } from "react-toastify";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useAddToHistoryMutation } from "../services/historyApi";
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react";
import { useAddForLaterMutation } from "../services/forLaterApi";
import RatingAndComments from "../components/RatingAndComments";
import { useTranslation } from "react-i18next";


interface MediaGridProps {
  title: string;
  fetchData: (page?: number, filters?: { ratingFrom: number; ratingTo: number; genres: number[] }) => Promise<any>;
  genres: { id: number; name: string }[];
}


const MovieDetailsPage = ({ title, fetchData, genres }: MediaGridProps) => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [movie, setMovie] = useState<Movie | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [collections, setCollections] = useState<Collection | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const container2Ref = useRef<HTMLDivElement>(null);
  const [director, setDirector] = useState<string | null>(null);
  const [producers, setProducers] = useState<string[]>([]);
  const [writers, setWriters] = useState<string[]>([]);
  const [actors, setActors] = useState<string[]>([]);
  const [credits, setCredits] = useState<Credits | null>(null);


  const { data: favorites } = useGetFavoritesQuery();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const [inFavorites, setInFavorites] = useState(false);

  const [addToHistory] = useAddToHistoryMutation();
  const [AddForLater] = useAddForLaterMutation();

  const trailerRef = useRef<HTMLDivElement>(null);

  const scrollToTrailer = () => {
    trailerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const scroll2 = (direction: 'left' | 'right') => {
    const container2 = container2Ref.current;
    if (!container2) return;
    const scrollAmount = container2.clientWidth;
    container2.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };


  useEffect(() => {
    if (!movieId) return;
    (async () => {
      try {
        const details = await getMovieDetails(movieId);
        setMovie(details);


        const credits = await getMovieCredits(movieId);
        const newActors = credits.cast.slice(0, 5).map(a => a.name); 
        setActors(newActors);

        const newProducers = credits.crew.filter(c => c.job === "Producer").map(c => c.name);
        setProducers(newProducers);
        
        const newWriters = credits.crew.filter(c => ["Writer", "Screenplay", "Story"].includes(c.job)).map(c => c.name);
        setWriters(newWriters);
        
        const newDirector = credits.crew.find(c => c.job === "Director")?.name || "N/A";
        setDirector(newDirector);

        const similarMovies = await getSimilarMovies(movieId, 1);
        setSimilar(similarMovies.results || similarMovies);

        const recMovies = await getRecomendationsMovies(movieId, 1);
        setRecommendations(recMovies.results || recMovies);

        setSimilar((await getSimilarMovies(movieId, 1)).results);
        setRecommendations((await getRecomendationsMovies(movieId, 1)).results);
        setCredits(await getCreditsMovie(movieId, 1));


        if (details.belongs_to_collection) {
          setCollections(
            (await getCollections(details.belongs_to_collection.id, 1)).results
          );
        } else {
          setCollections(null);
        }

        const vids = await getMovieVideos(movieId);
        setVideos(
          vids.results.filter(
            (v) => v.site === "YouTube" && v.type === "Trailer"
          )
        );
      } catch (e) {
        console.error(e);
      }
    })();
  }, [movieId]);

  useEffect(() => {
    if (favorites) {
      setInFavorites(favorites.some((f) => f.contentId === movieId));
    }
  }, [favorites, movieId]);

  const handleFavorite = async () => {
    try {
      const payload = { contentId: movieId, contentType: "movie" };
      if (inFavorites) {
        const favorite = favorites?.find((f) => f.contentId === movieId);
        if (!favorite) return;

        await removeFavorite(favorite.id).unwrap();
        setInFavorites(false);
        toast.info(t("movieDetails.favorites.removed"));
      } else {
        await addFavorite(payload).unwrap();
        setInFavorites(true);
        toast.success(t("movieDetails.favorites.added"));
      }
    } catch {
      toast.error(t("movieDetails.favorites.error"));
    }
  };


  const formatRuntime = (totalMinutes: number) => {
    if (!totalMinutes) return "—";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const hoursText = hours > 0 ? `${hours} hour` : '';
    const minutesText = minutes > 0 ? `${minutes} min` : '';
    
    if (hours > 0 && minutes > 0) {
      return `${hoursText} ${minutesText}`;
    } else if (hours > 0) {
      return hoursText;
    } else {
      return minutesText;
    }
  };

  const getGenres = (genreIds: number[]) => {
    return genreIds
      ?.map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3); 
  };

  const handlePlay = (id: number) => {
    navigate(`/movie/${id}`);
    window.location.reload()
  };


  const handleAdd = async (id: number) => {
    try {
      await AddForLater({ contentId: id, contentType: "movie" }).unwrap();
      toast.success(t("movieDetails.forLater.added"));
    } catch {
      toast.error(t("movieDetails.forLater.error"));
    }
  };


  const handleLike = async (id: number) => {
    try {
      const payload = { contentId: id, contentType: "movie" };
      await addFavorite(payload).unwrap();
      toast.success(t("movieDetails.favorites.added"));
      console.log("➕ Added to favorites:", id);
    } catch {
      toast.error(t("movieDetails.favorites.error"));
    }
  };
  
    const handleExpand = (id: number) => {
  const newExpandedItems = new Set(expandedItems);
  if (newExpandedItems.has(id)) {
    newExpandedItems.delete(id);
  } else {
    newExpandedItems.add(id);
  }
  setExpandedItems(newExpandedItems);
};


  if (!movie){
    return (
      <p className="text-white text-center mt-10 animate-fadeIn">
        {t("movieDetails.loading")}
      </p>
    );
  }

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const trailer = videos[0];



  return (
    <div className="bg-[#191716] text-white min-h-screen">
      <Header />

      {/* Backdrop */}
      <div
        className="relative h-[80vh] top-20 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#191716] via-[#191716]/70 to-transparent"></div>
      </div>

      {/* Details */}
      <div className="max-w-7xl mx-auto px-4 md:px-0 -mt-96 relative z-10">
        <div className="flex flex-col md:flex-row gap-24 animate-fadeIn">
          <div className="flex-1 flex flex-col gap-1">
            <h1 className="text-8xl font-extrabold">{movie.title}</h1>
            {movie.tagline && (
              <p className="italic text-gray-400 text-xl">"{movie.tagline}"</p>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={scrollToTrailer}
                className="bg-[#C4FF00] gap-2 text-2xl text-black font-semibold rounded-sm w-1/4 h-12 flex items-center justify-center hover:scale-110 transition"
              >
                <Play size={18} />
                Watch
              </button>

              <button
                onClick={() => handleAdd(movie.id)}
                className="border border-gray-400 bg-gray-400/10 rounded-full w-12 h-12 flex items-center justify-center ml-8 text-white hover:bg-gray-700/10 transition"
              >
                <Plus size={18} />
              </button>

              <button
                onClick={handleFavorite}
                className={`border border-gray-400 rounded-full w-12 h-12 flex items-center justify-center text-white hover:bg-gray-700 transition ${
                  inFavorites
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-400/10 text-black hover:bg-gray-700/10"
                }`}
              >
                <ThumbsUp
                  className={`w-6 h-6 ${inFavorites ? "text-red-500" : ""}`}
                />
              </button>
            </div>

            <div className="mt-56 text-gray-300">

              <div className="grid md:grid-cols-2 gap-24">
                <div className="flex flex-col gap-2 text-sm">
                  <p className="leading-relaxed text-3xl mb-0 font-regular text-white">{collections?.name}</p>
                  <div className="text-2xl font-semibold text-gray-400">
                    <span>{movie.release_date?.slice(0, 4)}</span>
                  </div>
                  <div className="text-2xl font-medium text-gray-400">
                    {movie.runtime ? formatRuntime(movie.runtime) : "—"}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-3  text-2xl font-semibold text-gray-400">
                    {movie.genres?.map((g, index) => (
                      <span
                        key={g.id}
                        className={`${index > 0 ? ' relative pl-6 before:absolute before:left-0 before:content-["•"] before:text-white/80 before:font-black' : ''}`}
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>

                  
                  <p className="leading-relaxed text-base text-white">{movie.overview}</p>
                </div>

                <div className="space-y-2 text-sm font-sans">
                  <p>
                    <span className="text-gray-400 text-lg font-regular mr-1">{t("movieDetails.popularity")}:</span>{" "}
                    <span className="text-white text-lg font-regular">{movie.popularity}</span>
                  </p>
                  <p>
                    <span className="text-gray-400 text-lg font-regular">Director:</span>{" "}
                    <span className="text-white text-lg font-regular">{director}</span>
                  </p>
                  <p>
                    <span className="text-gray-400 text-lg font-regular">Producers:</span>{" "}
                    <span className="text-white text-lg font-regular">{producers.join(", ")}</span>
                  </p>
                  <p>
                    <span className="text-gray-400 text-lg font-regular">Actors:</span>{" "}
                    <span className="text-white text-lg font-regular">{actors.join(", ")}</span>
                  </p>
                  <p>
                    <span className="text-gray-400 text-lg font-regular">Writers:</span>{" "}
                    <span className="text-white text-lg font-regular">{writers.join(", ")}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer */}
      {trailer && (
        <div ref={trailerRef} id="trailer-section" className="relative mt-20 max-w-7xl mx-auto px-4 md:px-0 animate-fadeIn">
          <h2 className="text-3xl bg-[#3D3B3A] rounded-sm text-center absolute -mt-10 h-24 w-1/6 font-semibold ">{t("movieDetails.trailer")}</h2>
          <div className="aspect-video z-100 overflow-hidden shadow-2xl z-10 relative">

            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}


      {collections != null && (
        <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <h2 className="text-3xl font-semibold mb-6">{t("movieDetails.collection")}</h2>
          <div className="flex flex-row gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth ">
              {collections.parts.map((c) => (

              <div
                key={c.id}
                className="cursor-pointer hover:scale-105 transition-transform rounded-lg border-b-2 border-r-2 border-[#C4FF00]"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${c.poster_path}`}
                  alt={c.title}
                  className="rounded-lg shadow-md w-64 h-80 object-cover"
                />
              <div className="bg-[#191716] h-24 rounded-lg p-2">
                <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => handlePlay(c.id)}
                  className="bg-white text-black rounded-full p-2 hover:scale-110 transition"
                >
                  <Play size={18} />
                </button>
                <button
                  onClick={() => handleAdd(c.id)}
                  className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => handleLike(c.id)}
                  className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <ThumbsUp size={18} />
                </button>
                <button
                  onClick={() => handleExpand(c.id)}
                  className="ml-auto border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                <span className="px-2 py-0.5 border border-gray-500 rounded">HD</span>
                <span className="px-2 py-0.5 border border-gray-500 rounded">6+</span>
                {c.genres && getGenres(c.genres.map(g => g.id))?.map((g, idx) => (
                <span key={idx}>{g}</span>
              ))}
              </div>
              </div>
            </div>
            ))}
            
            
          </div>
          </div>
       
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <div className="inline-flex justify-between w-full">
            <h2 className="text-3xl font-semibold mb-6">{t("movieDetails.recommendations")}</h2>
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
          
          
          <div ref={containerRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
            
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="cursor-pointer hover:scale-105 transition-transform rounded-lg border-b-2 border-r-2 border-[#C4FF00]"
                
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
                  alt={rec.title}
                  className="rounded-lg shadow-md min-w-64 h-80 object-cover "
                />
                <div className="bg-[#191716] h-24 rounded-lg p-2">
                <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => handlePlay(rec.id)}
                  className="bg-white text-black rounded-full p-2 hover:scale-105 transition"
                >
                  <Play size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAdd(movie.id); }}
                  className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleLike(movie.id); }}
                  className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <ThumbsUp size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleExpand(movie.id); }}
                  className="ml-auto border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <ChevronDown size={18} className={`transition-transform duration-300 ${expandedItems.has(movie.id) ? "rotate-180" : ""}`}/>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                <span className="px-2 py-0.5 border border-gray-500 rounded">HD</span>
                <span className="px-2 py-0.5 border border-gray-500 rounded">6+</span>
                {rec.genres && getGenres(rec.genres.map(g => g.id))?.map((g, idx) => (
                <span key={idx}>{g}</span>
              ))}
              </div>
              {expandedItems.has(movie.id) && (
                <div className="mt-4 transition-opacity duration-300 ease-in-out">
                  <p className="text-sm text-gray-200 overflow-y-auto max-h-24">{movie.overview}</p>
                </div>
              )}
              </div>
      </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <div className="inline-flex justify-between w-full">
          <h2 className="text-3xl font-semibold mb-6">{t("movieDetails.similar")}</h2>
           <div className="flex">
          <button
            onClick={() => scroll2('left')}
            className="w-8 h-12 text-white flex items-center justify-center rounded-md hover:bg-opacity-75 transition-colors duration-200"
          >
            <span className="text-5xl font-regular">‹</span>
          </button>
          <button
            onClick={() => scroll2('right')}
            className="w-8 h-12 text-white flex items-center justify-center rounded-md hover:bg-opacity-75 transition-colors duration-200"
          >
            <span className="text-5xl font-regular">›</span>
          </button>
        </div>
        </div>
          <div ref={container2Ref} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
            {similar.map((sm) => (
              <div
                key={sm.id}
                className="cursor-pointer hover:scale-105 transition-transform rounded-lg border-b-2 border-r-2 border-[#C4FF00]"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${sm.poster_path}`}
                  alt={sm.title}
                  className="rounded-sm shadow-md min-w-64 h-80 object-cover "
                />
                <div className="bg-[#191716] h-24 rounded-lg p-2">
                <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => handlePlay(sm.id)}
                  className="bg-white text-black rounded-full p-2 hover:scale-110 transition"
                >
                  <Play size={18} />
                </button>
                <button
                  onClick={() => handleAdd(sm.id)}
                  className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => handleLike(sm.id)}
                  className="border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <ThumbsUp size={18} />
                </button>
                <button
                  onClick={() => handleExpand(sm.id)}
                  className="ml-auto border border-gray-400 rounded-full p-2 text-white hover:bg-gray-700 transition"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                <span className="px-2 py-0.5 border border-gray-500 rounded">HD</span>
                <span className="px-2 py-0.5 border border-gray-500 rounded">12+</span>
                {sm.genres && getGenres(sm.genres.map(g => g.id))?.map((g, idx) => (
                <span key={idx}>{g}</span>
              ))}
              </div>
              </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 gap-12">
        <RatingAndComments
          contentId={movie.id}
          contentType="movie"
          vote_average={movie.vote_average}
        />
      </div>

      <Footer />
    </div>
  );
};

export default MovieDetailsPage;