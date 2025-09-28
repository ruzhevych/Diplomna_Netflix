import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MediaTvGrid from "../../components/MediaTvGrid";
import { getAnime, getTvGenres } from "../../services/movieApi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function MoviesPage() {
const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    getTvGenres(1, currentLanguage).then((data) => setGenres(data.genres));
  }, []);

  return (
    <div className="bg-black text-white">
      <Header />
      <div className="mt-20">
        <MediaTvGrid titleKey="Популярні аніме" fetchData={(page, filters) => getAnime(page ?? 1, currentLanguage,filters)} genres={genres}/>
      </div>
      <Footer />
    </div>
  );
}
