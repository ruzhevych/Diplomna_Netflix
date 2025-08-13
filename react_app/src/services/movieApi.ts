const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const fetchFromTMDB = async (endpoint: string) => {
  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=uk-UA`);
  if (!res.ok) throw new Error('Не вдалося отримати дані з TMDB');
  return await res.json();
};

export const getPopularMovies = () => fetchFromTMDB('/movie/popular');
export const getTopRatedMovies = () => fetchFromTMDB('/movie/top_rated');
export const getUpcomingMovies = () => fetchFromTMDB('/movie/upcoming');
export const getPopularTV = () => fetchFromTMDB('/tv/popular');
export const getAnime = () => fetchFromTMDB('/discover/tv&with_genres=16');
export const getMovieDetails = (id: number) =>
  fetchFromTMDB(`/movie/${id}`);

export interface Video {
  id: string;
  key: string;       
  name: string;
  site: string;     
  type: string;      
}

export interface VideosResponse {
  id: number;
  results: Video[];
}


export const getMovieVideos = (id: number): Promise<VideosResponse> =>
  fetchFromTMDB(`/movie/${id}/videos`);