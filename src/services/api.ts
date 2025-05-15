import axios from 'axios';
import type { Movie } from '../components/molecules/MovieCard';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  vote_average: number;
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
    }>;
  };
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'id-ID',
  },
});

export const getMovies = async (endpoint: string, page: number = 1) => {
  const response = await api.get<MovieResponse>(endpoint, {
    params: { page },
  });
  return response.data;
};

export const getMovieDetails = async (movieId: number) => {
  const response = await api.get<MovieDetails>(`/movie/${movieId}`, {
    params: {
      append_to_response: 'credits',
    },
  });
  return response.data;
};

export const searchMovies = async (query: string, page: number = 1) => {
  const response = await api.get<MovieResponse>('/search/movie', {
    params: {
      query,
      page,
    },
  });
  return response.data;
};

export const getRandomMovies = async () => {
  // Menggunakan discover/movie dengan parameter acak untuk mendapatkan film yang berbeda
  const randomYear = Math.floor(Math.random() * (2024 - 2000) + 2000);
  const randomPage = Math.floor(Math.random() * 10) + 1;
  
  const response = await api.get<MovieResponse>('/discover/movie', {
    params: {
      sort_by: 'popularity.desc',
      'primary_release_year': randomYear,
      page: randomPage,
      'vote_count.gte': 100, // Memastikan film memiliki cukup ulasan
    },
  });
  return response.data;
};

export default api;