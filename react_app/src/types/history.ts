export interface HistoryItem {
  id: number;         // MovieId або SeriesId
  name: string
  mediaType: "movie" | "tv";  // Тип контенту
}

export interface GetHistoryItem {
  id: number;         // MovieId або SeriesId
  name: string
  mediaType: "movie" | "tv";  // Тип контенту
  viewedAt: string;
}



export interface HistoryItemDetails {
  movieId: number;
  mediaType: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path?: string | null;
  release_date?: string;
  viewedAt: string;
}

