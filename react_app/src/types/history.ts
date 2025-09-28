export interface HistoryItem {
  id: number;
  name: string
  mediaType: "movie" | "tv"; 
}

export interface GetHistoryItem {
  id: number;    
  movieId: number;   
  name: string
  mediaType: "movie" | "tv";  
  viewedAt: string;
}

export interface HistoryItemDetails {
  id: number;
  movieId: number;
  mediaType: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path?: string | null;
  release_date?: string;
  viewedAt: string;
}

