import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../atoms/Button';
import '@/styles/components/MovieCard.css';

export interface Movie {
  [x: string]: unknown;
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const releaseYear = new Date(movie.release_date).getFullYear();

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-card__container">
        <img
          src={imageUrl}
          alt={movie.title}
          className="movie-card__image"
        />
        <div className="movie-card__overlay">
          <div className="movie-card__content">
            <h3 className="movie-card__title">{movie.title}</h3>
            <p className="movie-card__year">{releaseYear}</p>
            <p className="movie-card__description">{movie.overview}</p>
            <div className="movie-card__buttons">
              <Button variant="secondary" className="movie-card__button movie-card__button--secondary">
                Info
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;