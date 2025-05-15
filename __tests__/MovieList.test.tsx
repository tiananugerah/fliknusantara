import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MovieList from '../src/components/organisms/MovieList';
import { useInfiniteScroll } from '../src/hooks/useInfiniteScroll';

// Mock useInfiniteScroll hook
jest.mock('../src/hooks/useInfiniteScroll', () => ({
  useInfiniteScroll: jest.fn().mockReturnValue({
    loadMoreRef: { current: null }
  })
}));

const mockMovies = [
  {
    id: 1,
    title: 'Film 1',
    overview: 'Deskripsi film 1',
    backdrop_path: '/backdrop1.jpg',
    poster_path: '/poster1.jpg',
    release_date: '2024-01-01',
    vote_average: 8.5
  },
  {
    id: 2,
    title: 'Film 2',
    overview: 'Deskripsi film 2',
    backdrop_path: '/backdrop2.jpg',
    poster_path: '/poster2.jpg',
    release_date: '2024-01-02',
    vote_average: 7.5
  }
];

const renderMovieList = (props = {}) => {
  const defaultProps = {
    movies: mockMovies,
    onLoadMore: jest.fn(),
    loading: false,
    ...props
  };

  return render(
    <BrowserRouter>
      <MovieList {...defaultProps} />
    </BrowserRouter>
  );
};

describe('MovieList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('merender daftar film dengan benar', () => {
    renderMovieList({ title: 'Daftar Film' });
    expect(screen.getByText('Daftar Film')).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(mockMovies.length);
  });

  it('menampilkan loader saat loading', () => {
    renderMovieList({ loading: true });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('merender hero section ketika isHeroSection=true', () => {
    const mockMoviesWithHero = Array(12).fill(null).map((_, index) => ({
      ...mockMovies[0],
      id: index + 1,
      title: `Film ${index + 1}`,
      overview: `Deskripsi film ${index + 1}`
    }));

    renderMovieList({
      movies: mockMoviesWithHero,
      isHeroSection: true
    });

    expect(screen.getByText('Film 12')).toBeInTheDocument();
    expect(screen.getByText('Deskripsi film 12')).toBeInTheDocument();
    expect(screen.getByText('Info Selengkapnya')).toBeInTheDocument();
  });

  it('menggunakan kelas CSS tambahan jika diberikan', () => {
    renderMovieList({ className: 'custom-list' });
    const listContainer = screen.getByTestId('movie-list');
    expect(listContainer).toHaveClass('movie-list-vertical', 'custom-list');
  });

  it('memanggil useInfiniteScroll dengan parameter yang benar', () => {
    const mockOnLoadMore = jest.fn();
    renderMovieList({ onLoadMore: mockOnLoadMore, loading: false });

    expect(useInfiniteScroll).toHaveBeenCalledWith({
      onLoadMore: mockOnLoadMore,
      loading: false,
      rootMargin: '100px'
    });
  });
});