import type {FC} from "react";
import type {Movie} from "../types/movie";
import { useRemoveFavoriteMutation } from "../services/favoritesApi.ts";
import { X } from "lucide-react";

interface Props {
    movie: Movie;
}

const MovieCard: FC<Props> = ({ movie }) => {
    const [removeFavorite] = useRemoveFavoriteMutation();

    return (
        <div className="relative w-48 cursor-pointer group">
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded-2xl shadow-lg group-hover:opacity-80 transition"
            />
            <button
                onClick={() => removeFavorite(movie.id)}
                className="absolute top-2 right-2 bg-black bg-opacity-60 text-white p-1 rounded-full hover:bg-red-500 transition"
            >
                <X size={16} />
            </button>
            <p className="mt-2 text-sm text-center text-white">{movie.title}</p>
        </div>
    );
};

export default MovieCard;
