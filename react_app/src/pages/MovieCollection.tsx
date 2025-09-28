import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCollections } from "../services/movieApi";
import type { Collection } from "../types/movie";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useTranslation } from "react-i18next";

const MovieCollection = () => {
  const { id } = useParams<{ id: string }>();
  const collectionId = Number(id);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language; 
  const [collection, setCollection] = useState<Collection | null>(null);

  useEffect(() => {
    if (!collectionId) return;
    (async () => {
      try {
        const data = await getCollections(collectionId, 1,currentLanguage);
        setCollection(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [collectionId]);

  if (!collection)
    return (
      <p className="text-white text-center mt-10 animate-fadeIn">
        Downloading...
      </p>
    );

  const backdropUrl = `https://image.tmdb.org/t/p/original${collection.backdrop_path}`;

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />

      <div
        className="relative h-72 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <h1 className="absolute bottom-4 left-4 text-4xl font-bold z-10">
          {collection.name}
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-0 mt-10 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6">Movies in collection</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {collection.parts.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="group relative rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title || movie.original_title}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-lg font-semibold">{movie.title || movie.original_title}</h3>
                <p className="text-gray-300 text-sm mt-1">
                  {movie.release_date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MovieCollection;

