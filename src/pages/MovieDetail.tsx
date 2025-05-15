import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, type MovieDetails } from '../services/api';
import Button from '../components/atoms/Button';
import '@/styles/pages/MovieDetail.css';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        if (id) {
          const data = await getMovieDetails(parseInt(id));
          setMovie(data);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="movie-detail__loading" data-testid="movie-detail-loading">
        <div className="movie-detail__spinner" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-detail__error" data-testid="movie-detail-error">
        <p>Film tidak ditemukan</p>
      </div>
    );
  }

  const director = movie.credits.crew.find(person => person.job === 'Director');
  const mainCast = movie.credits.cast.slice(0, 5);

  return (
    <div className="movie-detail" data-testid="movie-detail-content">
      <div className="movie-detail__container">
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="movie-detail__back-button"
        >
          ← Kembali
        </Button>

        <div className="movie-detail__content">
          <div className="movie-detail__layout">
            <div className="movie-detail__poster">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-detail__poster-image"
              />
            </div>
            <div className="movie-detail__info">
              <h1 className="movie-detail__title">{movie.title}</h1>
              <p className="movie-detail__meta">
                {new Date(movie.release_date).getFullYear()} • {movie.runtime} menit
              </p>

              <div className="movie-detail__section">
                <h2 className="movie-detail__section-title">Sinopsis</h2>
                <p className="movie-detail__overview">{movie.overview}</p>
              </div>

              <div className="movie-detail__section">
                <h2 className="movie-detail__section-title">Genre</h2>
                <div className="movie-detail__genres">
                  {movie.genres.map(genre => (
                    <span
                      key={genre.id}
                      className="movie-detail__genre-tag"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {director && (
                <div className="movie-detail__section">
                  <h2 className="movie-detail__section-title">Sutradara</h2>
                  <p className="movie-detail__director">{director.name}</p>
                </div>
              )}

              <div className="movie-detail__section">
                <h2 className="movie-detail__section-title">Pemeran Utama</h2>
                <div className="movie-detail__cast">
                  {mainCast.map(actor => (
                    <div key={actor.id} className="movie-detail__cast-member">
                      <p className="movie-detail__cast-name">{actor.name}</p>
                      <p className="movie-detail__cast-character">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;