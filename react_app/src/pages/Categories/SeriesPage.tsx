import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MediaTvGrid from "../../components/MediaTvGrid";
import { getTvGenres, getPopularTV } from "../../services/movieApi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function MoviesPage() {
    const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language; 


  useEffect(() => {
    getTvGenres(1, currentLanguage).then((data) => setGenres(data.genres));
    //getSeriesEpisode().then((data) => setSpisode(data.))
  }, []);
  return (
    <div className="bg-black text-white">
      <Header />
      <div className="mt-20">
        <MediaTvGrid titleKey="Популярні серіали" fetchData={(page, filters) => getPopularTV(page ?? 1, currentLanguage,filters)}  genres={genres}/>;
      </div>
      <Footer />
    </div>
  );
}
