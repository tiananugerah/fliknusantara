export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export type CategoryType = 'now_playing' | 'popular' | 'top_rated' | 'upcoming';

export interface Categories {
  [key: string]: string;
}

export const CATEGORIES: Categories = {
  now_playing: 'Sedang Tayang',
  popular: 'Populer',
  top_rated: 'Rating Tertinggi',
  upcoming: 'Akan Datang'
};