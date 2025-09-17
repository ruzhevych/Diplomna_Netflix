const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const fetchFromTMDB = async (endpoint: string, page: number) => {
  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}&without_genres=16&language=uk-UA`);
  if (!res.ok) throw new Error('Не вдалося отримати дані з TMDB');
  return await res.json();
};

const fetchDatailsFromTMDB = async (endpoint: string) => {
  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=uk-UA`);
  if (!res.ok) throw new Error('Не вдалося отримати дані з TMDB');
  return await res.json();
};

const fetchAnimeFromTMDB = async (endpoint: string, page: number) => {
  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}&with_genres=16&with_original_language=ja&language=uk-UA`);
  if (!res.ok) throw new Error('Не вдалося отримати дані з TMDB');
  return await res.json();
};

const fetchCartoonsFromTMDB = async (endpoint: string, page: number) => {
  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}&with_genres=16&language=uk-UA`);
  if (!res.ok) throw new Error('Не вдалося отримати дані з TMDB');
  return await res.json();
};


export const getPopularMovies = (page: number) => fetchFromTMDB('/movie/popular', page);
export const getTopRatedMovies = (page: number) => fetchFromTMDB('/movie/top_rated', page);
export const getUpcomingMovies = (page: number) => fetchFromTMDB('/movie/upcoming', page);
export const getPopularTV = (page: number) => fetchFromTMDB('/tv/popular', page);
export const getMovieGenres = (page: number) => fetchFromTMDB("/genre/movie/list", page);
export const getTvGenres = (page: number) => fetchFromTMDB("/genre/tv/list", page);


export const getAnime = (page: number) => fetchAnimeFromTMDB('/discover/tv', page);
export const getCartoons = (page: number) => fetchCartoonsFromTMDB('/discover/movie', page);

export const getMovieDetails = (id: number) =>
  fetchDatailsFromTMDB(`/movie/${id}`);
export const getSeriesDetails = (id: number) =>
  fetchDatailsFromTMDB(`/tv/${id}`);
export const getCollections = (id: number, page: number) => fetchFromTMDB(`/collection/${id}`, page);

export const getRecomendationsMovies = (id: number, page: number) => fetchFromTMDB(`/movie/${id}/recommendations`, page);
export const getRecomendationsTv = (id: number, page: number) => fetchFromTMDB(`/tv/${id}/recommendations`, page);

export const getSimilarMovies = (id: number, page: number) => fetchFromTMDB(`/movie/${id}/similar`, page);
export const getSimilarTv = (id: number, page: number) => fetchFromTMDB(`/tv/${id}/similar`, page);


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
  fetchDatailsFromTMDB(`/movie/${id}/videos`);
export const getSeriesVideos = (id: number): Promise<VideosResponse> =>
  fetchDatailsFromTMDB(`/tv/${id}/videos`);