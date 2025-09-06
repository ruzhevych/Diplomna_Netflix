import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MediaTvGrid from "../../components/MediaTvGrid";
import { getTvGenres, getPopularTV } from "../../services/movieApi";
import { useEffect, useState } from "react";

export default function MoviesPage() {
    const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
    //const [episode, setSpisode] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    getTvGenres().then((data) => setGenres(data.genres));
    //getSeriesEpisode().then((data) => setSpisode(data.))
  }, []);
  return (
    <div className="bg-black text-white">
      <Header />
      <div className="mt-20">
        <MediaTvGrid title="Популярні фільми" fetchData={getPopularTV}  genres={genres}/>;
      </div>
      <Footer />
    </div>
  );
}
