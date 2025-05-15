import React, { useState, useEffect, useCallback } from 'react';
import '@/styles/components/HeroSection.css';
import type { Movie } from '../molecules/MovieCard';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  movies: Movie[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const topMovies = movies.slice(0, 5); // Mengambil 10 film teratas

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === topMovies.length - 1 ? 0 : prevIndex + 1
    );
  }, [topMovies.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? topMovies.length - 1 : prevIndex - 1
    );
  }, [topMovies.length]);

  // Auto slideshow setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  // Handler untuk navigasi keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (topMovies.length === 0) {
    return null;
  }

  return (
    <div className="hero-section" role="region" aria-label="Film Unggulan">
      <div className="hero-section__slides">
        {topMovies.map((movie, index) => {
          const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
          return (
            <div
              key={movie.id}
              className={`hero-section__slide ${index === currentIndex ? 'hero-section__slide--active' : ''}`}
              aria-hidden={index !== currentIndex}
            >
              <div className="hero-section__backdrop">
                <img
                  src={backdropUrl}
                  alt={movie.title}
                  className="hero-section__image"
                />
                <div className="hero-section__overlay" />
              </div>
              <div className="hero-section__content">
                <div className="hero-section__text">
                  <h1 className="hero-section__title">{movie.title}</h1>
                  <p className="hero-section__description">{movie.overview}</p>
                </div>
                <div className="hero-section__buttons">
                  <Link to={`/movie/${movie.id}`} className="movie-card">
                    <button
                      className="hero-section__button hero-section__button--secondary"
                      aria-label="Lihat informasi lebih lanjut"
                    >
                      Info Selengkapnya
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigasi slide */}
      <button
        className="hero-section__nav hero-section__nav--prev"
        onClick={prevSlide}
        aria-label="Slide sebelumnya"
      >
        ❮
      </button>
      <button
        className="hero-section__nav hero-section__nav--next"
        onClick={nextSlide}
        aria-label="Slide berikutnya"
      >
        ❯
      </button>

      {/* Indikator dot */}
      <div className="hero-section__indicators">
        {topMovies.map((_, index) => (
          <button
            key={index}
            className={`hero-section__indicator ${index === currentIndex ? 'hero-section__indicator--active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Pergi ke slide ${index + 1}`}
            aria-current={index === currentIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;