import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MediaTvGrid from "../../components/MediaTvGrid";
import { getAnime, getTvGenres } from "../../services/movieApi";
import { useEffect, useState } from "react";


export default function MoviesPage() {
const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    getTvGenres(1).then((data) => setGenres(data.genres));
  }, []);


  return (
    <div className="bg-black text-white">
      <Header />
      <div className="mt-20">
        <MediaTvGrid title="Популярні аніме" fetchData={(page) => getAnime(page ?? 1)} genres={genres}/>
      </div>
      <Footer />
    </div>
  );
}
