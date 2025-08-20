import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MovieGrid from "../../components/MovieGrid";
import { getPopularMovies } from "../../services/movieApi";

export default function MoviesPage() {
  return (
    <div className="bg-black text-white">
      <Header />

      <MovieGrid fetchFn={getPopularMovies} title="Movies" />

      <Footer />
    </div>
  );
}
