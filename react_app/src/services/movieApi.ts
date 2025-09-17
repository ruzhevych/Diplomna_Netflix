const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const fetchFromTMDB = async (endpoint: string, page: number) => {
  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}&language=uk-UA`);
  if (!res.ok) throw new Error('Не вдалося отримати дані з TMDB');
  return await res.json();
};

const fetchDatailsFromTMDB = async (endpoint: string) => {
  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=uk-UA`);
  if (!res.ok) throw new Error('Не вдалося отримати дані з TMDB');
  return await res.json();
};


const fetchFilteredFromTMDB = async (
  endpoint: string,
  page: number,
  filters?: { ratingFrom: number; ratingTo: number; genres: number[] }
) => {
  const genreParam = filters?.genres.length ? `&with_genres=${filters.genres.join("%2C")}` : "";
  const ratingParam = `&vote_average.gte=${filters?.ratingFrom ?? 1}&vote_average.lte=${filters?.ratingTo ?? 10}`;
  console.log("fetchFilteredFromTMDB called with:", filters);

  const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}${genreParam}${ratingParam}&language=uk-UA`;
  //const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}&with_genres=35%2C28&vote_average.gte=5&vote_average.lte=8&language=uk-UA`
  console.log("Fetching TMDB:", url);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Не вдалося отримати дані з TMDB");
  return await res.json();
};

const fetchTopFilteredFromTMDB = async (
  endpoint: string,
  page: number,
  filters?: { ratingFrom: number; ratingTo: number; genres: number[] }
) => {
  const genreParam = filters?.genres.length ? `&with_genres=${filters.genres.join("%2C")}` : "";
  const ratingParam = `&vote_average.gte=${filters?.ratingFrom ?? 1}&vote_average.lte=${filters?.ratingTo ?? 10}`;
  console.log("fetchFilteredFromTMDB called with:", filters);

  const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}${genreParam}${ratingParam}&show_me=everything&sort_by=vote_average.desc&vote_count.gte=300&language=uk-UA`;
  //const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}&with_genres=35%2C28&vote_average.gte=5&vote_average.lte=8&language=uk-UA`
  console.log("Fetching TMDB:", url);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Не вдалося отримати дані з TMDB");
  return await res.json();
};

const fetchAnimeFilteredFromTMDB = async (
  endpoint: string,
  page: number,
  filters?: { ratingFrom: number; ratingTo: number; genres: number[] }
) => {
  const genreParam = filters?.genres.length ? `&with_genres=16%2C${filters.genres.join("%2C")}` : "&with_genres=16";
  const ratingParam = `&vote_average.gte=${filters?.ratingFrom ?? 1}&vote_average.lte=${filters?.ratingTo ?? 10}`;

  const res = await fetch(
    `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}${genreParam}${ratingParam}&with_original_language=ja&language=uk-UA`
  );
  if (!res.ok) throw new Error("Не вдалося отримати дані з TMDB");
  return await res.json();
};


const fetchCartoonsFilteredFromTMDB = async (
  endpoint: string,
  page: number,
  filters?: { ratingFrom: number; ratingTo: number; genres: number[] }
) => {
  const genreParam = filters?.genres.length ? `&with_genres=16%2C${filters.genres.join("%2C")}` : "&with_genres=16";
  const ratingParam = `&vote_average.gte=${filters?.ratingFrom ?? 1}&vote_average.lte=${filters?.ratingTo ?? 10}`;

  console.log("fetchFilteredFromTMDB called with:", filters);

  const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}${genreParam}${ratingParam}&language=uk-UA`
  console.log("Fetching TMDB:", url);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Не вдалося отримати дані з TMDB");
  return await res.json();
};


export const getPopularMovies = (page: number, filters?: { ratingFrom: number; ratingTo: number; genres: number[] }) => 
  fetchFilteredFromTMDB("/discover/movie", page, filters);

export const getPopularTV = (page: number, filters?: { ratingFrom: number; ratingTo: number; genres: number[] }) => 
  fetchFilteredFromTMDB('/discover/tv', page, filters);

export const getTopRatedMovies = (page: number, filters?: { ratingFrom: number; ratingTo: number; genres: number[] }) => 
  fetchTopFilteredFromTMDB('/discover/movie', page, filters);

export const getUpcomingMovies = (page: number) => fetchFromTMDB('/movie/upcoming', page);
export const getMovieGenres = (page: number) => fetchFromTMDB("/genre/movie/list", page);
export const getTvGenres = (page: number) => fetchFromTMDB("/genre/tv/list", page);


export const getAnime = (page: number, filters?: { ratingFrom: number; ratingTo: number; genres: number[]}) => fetchAnimeFilteredFromTMDB('/discover/tv', page, filters);
export const getCartoons = (page: number, filters?: { ratingFrom: number; ratingTo: number; genres: number[]}) => fetchCartoonsFilteredFromTMDB('/discover/movie', page, filters);

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