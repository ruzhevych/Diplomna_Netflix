import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MediaGrid from "../../components/MediaGrid";
import { getPopularMovies, getMovieGenres, getAnime, getMovieDetails, getPopularTV, getTopRatedMovies, getUpcomingMovies } from "../../services/movieApi";
import { useEffect, useState } from "react";

export default function MoviesPage() {
    const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    getMovieGenres().then((data) => setGenres(data.genres));
  }, []);
  return (
    <div className="bg-black text-white">
      <Header />
      <div className="mt-20">
        <MediaGrid title="Популярні фільми" fetchData={getUpcomingMovies}  genres={genres}/>;
      </div>
      <Footer />
    </div>
  );
}
