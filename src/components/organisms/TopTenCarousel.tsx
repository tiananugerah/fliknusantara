import React, { useRef } from 'react';
import MovieCard, { type Movie } from '../molecules/MovieCard';
import Button from '../atoms/Button';
import '@/styles/components/TopTenCarousel.css';

interface TopTenCarouselProps {
  movies: Movie[];
  loading: boolean;
  className?: string;
}

const TopTenCarousel: React.FC<TopTenCarouselProps> = ({ movies, loading, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.8;
      containerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className={`top-movie-carousel ${className || ''}`} data-testid="top-ten-carousel">
      <div className="top-movie-carousel__header">
        <h2 className="top-movie-carousel__title">Top 10 Film</h2>
        <div className="top-movie-carousel__nav">
          <Button
            variant="secondary"
            className="top-movie-carousel__nav-button"
            onClick={() => scroll('left')}
            aria-label="Scroll ke kiri"
          >
            ←
          </Button>
          <Button
            variant="secondary"
            className="top-movie-carousel__nav-button"
            onClick={() => scroll('right')}
            aria-label="Scroll ke kanan"
          >
            →
          </Button>
        </div>
      </div>
      
      <div className="top-movie-carousel__container">
        {loading ? (
          <div data-testid="top-ten-carousel-loader" className="top-movie-carousel__loader">
            <div className="top-movie-carousel__spinner" />
          </div>
        ) : (
          <div className="top-movie-carousel__content"  ref={containerRef}>
            {movies.slice(0, 10).map((movie, index) => (
              <div key={movie.id} className="top-movie-carousel__item">
                <div className="top-movie-carousel__rank">{index + 1}</div>
                <MovieCard key={`topTen-${movie.id}`} movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopTenCarousel;