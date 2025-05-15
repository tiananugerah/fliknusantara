import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useParams, useNavigate } from 'react-router-dom';
import MovieDetail from '../src/pages/MovieDetail';
import { getMovieDetails } from '../src/services/api';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../src/services/api', () => ({
  getMovieDetails: jest.fn(),
}));

const mockMovieDetails = {
  id: 123,
  title: 'Test Movie',
  overview: 'Test Overview',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2023-01-01',
  vote_average: 8.5,
  runtime: 120,
  genres: [{ id: 1, name: 'Action' }],
  credits: {
    cast: [
      { id: 1, name: 'Actor 1', character: 'Character 1', profile_path: '/actor1.jpg' },
      { id: 2, name: 'Actor 2', character: 'Character 2', profile_path: '/actor2.jpg' },
    ],
    crew: [
      { id: 3, name: 'Director', job: 'Director' },
    ],
  },
};

describe('MovieDetail', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ id: '123' });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (getMovieDetails as jest.Mock).mockResolvedValue(mockMovieDetails);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('menampilkan loading spinner saat mengambil data', () => {
    render(
      <MemoryRouter>
        <MovieDetail />
      </MemoryRouter>
    );

    expect(screen.getByTestId('movie-detail-loading')).toBeInTheDocument();
  });

  it('menampilkan detail film setelah data dimuat', async () => {
    render(
      <MemoryRouter>
        <MovieDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockMovieDetails.title)).toBeInTheDocument();
    });

    expect(screen.getByText(mockMovieDetails.overview)).toBeInTheDocument();
    expect(screen.getByText('Director')).toBeInTheDocument();
    expect(screen.getByText('Actor 1')).toBeInTheDocument();
  });

  it('menampilkan pesan error ketika film tidak ditemukan', async () => {
    (getMovieDetails as jest.Mock).mockResolvedValue(null);

    render(
      <MemoryRouter>
        <MovieDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Film tidak ditemukan')).toBeInTheDocument();
    });
  });

  it('menangani error saat mengambil data film', async () => {
    (getMovieDetails as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <MemoryRouter>
        <MovieDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching movie details:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it('menavigasi kembali ke halaman utama ketika tombol kembali diklik', async () => {
    render(
      <MemoryRouter>
        <MovieDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      const backButton = screen.getByRole('button', { name: /← kembali/i });
      backButton.click();
    });

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});