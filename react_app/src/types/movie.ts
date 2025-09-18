export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection?: BelongsToCollection | null;
  budget?: number;
  genres?: Genre[] | undefined;
  homepage?: string;
  id: number;
  imdb_id?: string | null;
  origin_country?: string[];
  original_language: string;
  original_title?: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  release_date?: string;
  revenue?: number;
  runtime?: number;
  spoken_languages?: SpokenLanguage[];
  status?: string;
  tagline?: string;
  title: string;
  video?: boolean;
  vote_average: number;
  vote_count: number;
  media_type: 'movie';
}

export interface Series {
  adult: boolean;
  backdrop_path: string | null;
  created_by?: CreatedBy[];
  episode_run_time?: number[];
  first_air_date: string;
  genres?: Genre[];
  homepage?: string;
  id: number;
  in_production?: boolean;
  languages?: string[];
  last_air_date?: string;
  last_episode_to_air?: Episode;
  name: string;
  next_episode_to_air?: Episode | null;
  networks?: Network[];
  number_of_episodes?: number;
  number_of_seasons?: number;
  origin_country?: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  seasons?: Season[];
  spoken_languages?: SpokenLanguage[];
  status?: string;
  tagline?: string;
  type?: string;
  vote_average: number;
  vote_count: number;
  media_type: 'tv';
}

export interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface CreatedBy {
  id: number;
  credit_id: string;
  name: string;
  original_name: string;
  gender: number;
  profile_path: string | null;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
}

export interface Network {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Favorite {
  id: number;
  contentId: number;
  contentType: string;
  createdAt: Date;
}

export interface FavoriteCreate {
  contentId: number;
  contentType: string;
}

export interface ForLater {
  id: number;
  contentId: number;
  contentType: string;
  createdAt: Date;
}

export interface ForLaterCreate {
  contentId: number;
  contentType: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: Movie[];
}
