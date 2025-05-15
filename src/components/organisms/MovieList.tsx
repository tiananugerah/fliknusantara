import React from 'react';
import MovieCard, { type Movie } from '../molecules/MovieCard';
import Loader from '../atoms/Loader';
import '@/styles/components/MovieList.css';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

interface MovieListProps {
  movies: Movie[];
  onLoadMore: () => void;
  loading: boolean;
  title?: string;
  isHeroSection?: boolean;
  className?: string;
}

const MovieList: React.FC<MovieListProps> = ({ movies, onLoadMore, loading, title, isHeroSection = false, className = '' }) => {
  const { loadMoreRef } = useInfiniteScroll({
    onLoadMore,
    loading,
    rootMargin: '100px',
  });

  if (isHeroSection && movies.length > 11 && movies[11]) {
    const heroMovie = movies[11];
    const backdropUrl = heroMovie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`
      : '/default-backdrop.jpg';
    
    return (
      <div className="movie-list__hero">
        <div className="movie-list__hero-backdrop">
          <img 
            src={backdropUrl} 
            alt={heroMovie.title} 
            className="movie-list__hero-image" 
          />
          <div className="movie-list__hero-overlay" />
        </div>
        <div className="movie-list__hero-content">
          <div className="movie-list__hero-text">
            <h1 className="movie-list__hero-title">
              {heroMovie.title}
            </h1>
            <p className="movie-list__hero-description">
              {heroMovie.overview}
            </p>
          </div>
          <div className="movie-list__hero-buttons">
            <button className="movie-list__hero-button movie-list__hero-button--secondary">
              Info Selengkapnya
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid={`movie-list-${title?.toLowerCase().replace(/\s+/g, '-') || 'default'}`} className={`movie-list-vertical ${className}`}>
      {title && (
        <h2 className="movie-list-vertical__title">{title}</h2>
      )}
      <div className="movie-list-vertical__grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-list-vertical__item">
            <MovieCard key={`list-${movie.id}`} movie={movie} />
          </div>
        ))}
      </div>
      <div ref={loadMoreRef} className="movie-list-vertical__loader">
        {loading && <Loader data-testid="loader" />}
      </div>
    </div>
  );
};

export default MovieList;