const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


const mapI18nToTMDB = (i18nCode: string): string => {
    switch (i18nCode.toLowerCase()) {
        case 'ua':
            return 'uk-UA';
        case 'en':
            return 'en-US';
        // Додайте інші мови, якщо потрібно
        default:
            return 'en-US';
    }
};

const fetchFromTMDB = async (endpoint: string, page: number, languageCode: string) => {
  const tmdbLanguage = mapI18nToTMDB(languageCode);
  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}&language=${tmdbLanguage}`);
  if (!res.ok) throw new Error('Не вдалося отримати дані з TMDB');
  return await res.json();
};

const fetchDatailsFromTMDB = async (endpoint: string, languageCode: string) => {
  const tmdbLanguage = mapI18nToTMDB(languageCode);
  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=${tmdbLanguage}`);
  if (!res.ok) throw new Error('Не вдалося отримати дані з TMDB');
  return await res.json();
};


const fetchFilteredFromTMDB = async (
  endpoint: string,
  page: number,
  languageCode: string,
  filters?: { ratingFrom: number; ratingTo: number; genres: number[] }
) => {
  const tmdbLanguage = mapI18nToTMDB(languageCode);
  const genreParam = filters?.genres.length ? `&with_genres=${filters.genres.join("%2C")}` : "";
  const ratingParam = `&vote_average.gte=${filters?.ratingFrom ?? 1}&vote_average.lte=${filters?.ratingTo ?? 10}`;
  console.log("fetchFilteredFromTMDB called with:", filters);

  const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}${genreParam}${ratingParam}&language=${tmdbLanguage}`;
  //const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}&with_genres=35%2C28&vote_average.gte=5&vote_average.lte=8&language=uk-UA`
  console.log("Fetching TMDB:", url);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Не вдалося отримати дані з TMDB");
  return await res.json();
};

const fetchTopFilteredFromTMDB = async (
  endpoint: string,
  page: number,
  languageCode: string,
  filters?: { ratingFrom: number; ratingTo: number; genres: number[] }
) => {
  const tmdbLanguage = mapI18nToTMDB(languageCode);
  const genreParam = filters?.genres.length ? `&with_genres=${filters.genres.join("%2C")}` : "";
  const ratingParam = `&vote_average.gte=${filters?.ratingFrom ?? 1}&vote_average.lte=${filters?.ratingTo ?? 10}`;
  console.log("fetchFilteredFromTMDB called with:", filters);

  const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}${genreParam}${ratingParam}&show_me=everything&sort_by=vote_average.desc&vote_count.gte=300&language=${tmdbLanguage}`;
  //const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}&with_genres=35%2C28&vote_average.gte=5&vote_average.lte=8&language=uk-UA`
  console.log("Fetching TMDB:", url);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Не вдалося отримати дані з TMDB");
  return await res.json();
};

const fetchAnimeFilteredFromTMDB = async (
  endpoint: string,
  page: number,
  languageCode: string,
  filters?: { ratingFrom: number; ratingTo: number; genres: number[] }
) => {
  const tmdbLanguage = mapI18nToTMDB(languageCode);
  const genreParam = filters?.genres.length ? `&with_genres=16%2C${filters.genres.join("%2C")}` : "&with_genres=16";
  const ratingParam = `&vote_average.gte=${filters?.ratingFrom ?? 1}&vote_average.lte=${filters?.ratingTo ?? 10}`;

  const res = await fetch(
    `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}${genreParam}${ratingParam}&with_original_language=ja&${tmdbLanguage}`
  );
  if (!res.ok) throw new Error("Не вдалося отримати дані з TMDB");
  return await res.json();
};


const fetchCartoonsFilteredFromTMDB = async (
  endpoint: string,
  page: number,
  languageCode: string,
  filters?: { ratingFrom: number; ratingTo: number; genres: number[] }
) => {
  const tmdbLanguage = mapI18nToTMDB(languageCode);
  const genreParam = filters?.genres.length ? `&with_genres=16%2C${filters.genres.join("%2C")}` : "&with_genres=16";
  const ratingParam = `&vote_average.gte=${filters?.ratingFrom ?? 1}&vote_average.lte=${filters?.ratingTo ?? 10}`;

  console.log("fetchFilteredFromTMDB called with:", filters);

  const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}${genreParam}${ratingParam}${tmdbLanguage}`
  console.log("Fetching TMDB:", url);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Не вдалося отримати дані з TMDB");
  return await res.json();
};


export const getPopularMovies = (page: number, languageCode: string, filters?: { ratingFrom: number; ratingTo: number; genres: number[] }) => 
  fetchFilteredFromTMDB("/discover/movie", page, languageCode, filters);

export const getPopularTV = (page: number,languageCode: string, filters?: { ratingFrom: number; ratingTo: number; genres: number[] }) => 
  fetchFilteredFromTMDB('/discover/tv', page,languageCode, filters);

export const getTopRatedMovies = (page: number,languageCode: string, filters?: { ratingFrom: number; ratingTo: number; genres: number[] }) => 
  fetchTopFilteredFromTMDB('/discover/movie', page,languageCode, filters);

export const getUpcomingMovies = (page: number,languageCode: string) => fetchFromTMDB('/movie/upcoming', page, languageCode,);
export const getMovieGenres = (page: number,languageCode: string) => fetchFromTMDB("/genre/movie/list", page, languageCode);
export const getTvGenres = (page: number,languageCode: string) => fetchFromTMDB("/genre/tv/list", page,languageCode);


export const getAnime = (page: number,languageCode: string, filters?: { ratingFrom: number; ratingTo: number; genres: number[]}) => fetchAnimeFilteredFromTMDB('/discover/tv', page,  languageCode, filters);
export const getCartoons = (page: number, languageCode: string, filters?: { ratingFrom: number; ratingTo: number; genres: number[]}) => fetchCartoonsFilteredFromTMDB('/discover/movie', page,  languageCode, filters );

export const getMovieDetails = (id: number,languageCode: string) =>
  fetchDatailsFromTMDB(`/movie/${id}`, languageCode);
export const getSeriesDetails = (id: number,languageCode: string) =>
  fetchDatailsFromTMDB(`/tv/${id}`, languageCode);
export const getCollections = (id: number, page: number,languageCode: string) => fetchFromTMDB(`/collection/${id}`, page, languageCode);

export const getRecomendationsMovies = (id: number, page: number,languageCode: string) => fetchFromTMDB(`/movie/${id}/recommendations`, page, languageCode);
export const getRecomendationsTv = (id: number, page: number,languageCode: string) => fetchFromTMDB(`/tv/${id}/recommendations`, page, languageCode);

export const getSimilarMovies = (id: number, page: number,languageCode: string) => fetchFromTMDB(`/movie/${id}/similar`, page, languageCode);
export const getSimilarTv = (id: number, page: number,languageCode: string) => fetchFromTMDB(`/tv/${id}/similar`, page, languageCode);

export interface CrewMember {
  job: string;
  name: string;
}

export interface CastMember {
  name: string;
}

export interface Credits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export const getMovieCredits = (id: number,languageCode: string): Promise<Credits> =>
  fetchDatailsFromTMDB(`/movie/${id}/credits`,languageCode);


export const getCreditsMovie = (id: number, page: number,languageCode: string) => fetchFromTMDB(`/movie/${id}/credits`, page,languageCode);
export const getCreditsTv = (id: number, page: number,languageCode: string) => fetchFromTMDB(`/tv/${id}/credits`, page,languageCode);


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


export const getMovieVideos = (id: number,languageCode: string): Promise<VideosResponse> =>
  fetchDatailsFromTMDB(`/movie/${id}/videos`,languageCode);
export const getSeriesVideos = (id: number,languageCode: string): Promise<VideosResponse> =>
  fetchDatailsFromTMDB(`/tv/${id}/videos`,languageCode);