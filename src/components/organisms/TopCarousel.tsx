import React, { useRef } from 'react';
import MovieCard, { type Movie } from '../molecules/MovieCard';
import '@/styles/components/TopCarousel.css';

interface TopCarouselProps {
  movies: Movie[];
  title?: string;
  className?: string;
}

const TopCarousel: React.FC<TopCarouselProps> = ({ movies, title = 'Top 10 Film', className = '' }) => {
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
    <div data-testid="top-carousel" className={`top-carousel ${className}`}>
      {title && (
        <h2 className="top-carousel__title">{title}</h2>
      )}
      <div className="top-carousel__container">
        <button
          onClick={() => scroll('left')}
          className="top-carousel__scroll-button top-carousel__scroll-button--left"
          aria-label="Scroll ke kiri"
        >
          ◀
        </button>
        <div
          ref={containerRef}
          className="top-carousel__content scrollbar-hide"
        >
          {movies.slice(0, 10).map((movie, index) => (
            <div key={movie.id} className="top-carousel__item">
              <div className="top-carousel__rank">{index + 1}</div>
              <MovieCard key={`top-${movie.id}`} movie={movie} />
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="top-carousel__scroll-button top-carousel__scroll-button--right"
          aria-label="Scroll ke kanan"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default TopCarousel;