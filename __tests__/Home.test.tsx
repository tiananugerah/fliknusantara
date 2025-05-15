import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../src/pages/Home';
import { getMovies, searchMovies, getRandomMovies } from '../src/services/api';

jest.mock('../src/services/api', () => ({
  getMovies: jest.fn(),
  searchMovies: jest.fn(),
  getRandomMovies: jest.fn(),
}));

const mockMovies = [
  {
    id: 1,
    title: 'Test Movie 1',
    poster_path: '/test1.jpg',
    overview: 'Test overview 1',
    release_date: '2023-01-01',
    vote_average: 8.5,
  },
  {
    id: 2,
    title: 'Test Movie 2',
    poster_path: '/test2.jpg',
    overview: 'Test overview 2',
    release_date: '2023-01-02',
    vote_average: 7.5,
  },
];

const renderHome = () => {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
};

describe('Home', () => {
  beforeEach(() => {
    (getMovies as jest.Mock).mockResolvedValue({ results: mockMovies });
    (searchMovies as jest.Mock).mockResolvedValue({ results: mockMovies });
    (getRandomMovies as jest.Mock).mockResolvedValue({ results: mockMovies });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('menampilkan loading state saat mengambil data', async () => {
    const { rerender } = renderHome();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    await waitFor(() => {
      expect(getMovies).toHaveBeenCalled();
    });
    rerender(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  });

  it('menampilkan daftar film setelah data dimuat', async () => {
    renderHome();
    await waitFor(() => {
      expect(getMovies).toHaveBeenCalled();
    });

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
    });

    // Test pagination
    const movieList = screen.getByTestId('movie-list-sedang-tayang');
    fireEvent.scroll(movieList, { target: { scrollY: 1000 } });
    
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(getMovies).toHaveBeenCalledWith('/movie/now_playing', 2);
    });
  
  });

  it('melakukan pencarian film', async () => {
    renderHome();
    const searchInput = screen.getByPlaceholderText('Cari film...');
    
    await waitFor(() => {
      expect(getMovies).toHaveBeenCalled();
    });

    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(searchMovies).toHaveBeenCalledWith('test search', 1);
      expect(screen.getByText('Hasil Pencarian: test search')).toBeInTheDocument();
    });
  });

  it('mengganti kategori film', async () => {
    renderHome();
    await waitFor(() => {
      expect(getMovies).toHaveBeenCalled();
    });

    const popularButton = screen.getByText('Populer');
    fireEvent.click(popularButton);

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(getMovies).toHaveBeenCalledWith('/movie/popular', 1);
    });

    // Test top rated category
    const topRatedButton = screen.getByText('Rating Tertinggi');
    fireEvent.click(topRatedButton);

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(getMovies).toHaveBeenCalledWith('/movie/top_rated', 1);
    });
  });

  it('memuat film acak ketika tidak ada hasil pencarian', async () => {
    (searchMovies as jest.Mock).mockResolvedValueOnce({ results: [] });
    renderHome();

    await waitFor(() => {
      expect(getMovies).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText('Cari film...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent movie' } });

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(searchMovies).toHaveBeenCalledWith('nonexistent movie', 1);
    });

    await waitFor(() => {
      expect(getRandomMovies).toHaveBeenCalled();
      expect(screen.getByText('Film Yang Mungkin Anda Suka')).toBeInTheDocument();
    });
  });

  it('memuat lebih banyak film saat scroll', async () => {
    renderHome();
    
    await waitFor(() => {
      expect(getMovies).toHaveBeenCalled();
    });

    const movieList = screen.getByTestId('movie-list-sedang-tayang');
    fireEvent.scroll(movieList, { target: { scrollY: 1000 } });

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(getMovies).toHaveBeenCalledWith('/movie/now_playing', 2);
    });
  });

  it('menangani error saat mengambil data film', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    (getMovies as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));
    
    renderHome();
    
    await waitFor(
      () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error fetching movies:',
          expect.any(Error)
        );
      },
      { timeout: 3000 }
    );
    
    consoleErrorSpy.mockRestore();
  });

  it('menangani error saat mengambil data film top rated', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    (getMovies as jest.Mock)
      .mockResolvedValueOnce({ results: mockMovies })
      .mockRejectedValueOnce(new Error('Failed to fetch top movies'));
    
    renderHome();
    
    await waitFor(
      () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error fetching top movies:',
          expect.any(Error)
        );
      },
      { timeout: 3000 }
    );
    
    consoleErrorSpy.mockRestore();
  });

  it('membersihkan hasil pencarian saat query kosong', async () => {
    renderHome();
    await waitFor(() => {
      expect(getMovies).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText('Cari film...');
    
    fireEvent.change(searchInput, { target: { value: 'test' } });
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(searchMovies).toHaveBeenCalledWith('test', 1);
    });
    
    fireEvent.change(searchInput, { target: { value: '' } });
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByText('Sedang Tayang')).toBeInTheDocument();
      expect(getMovies).toHaveBeenCalledWith('/movie/now_playing', 1);
    });
  });

  it('menangani scroll event dengan benar', async () => {
    renderHome();
    await waitFor(() => {
      expect(getMovies).toHaveBeenCalled();
    });

    // Simulasi scroll event
    window.dispatchEvent(new Event('scroll'));
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(getMovies).toHaveBeenCalledWith('/movie/now_playing', 2);
    });
  });

  it('menangani perubahan kategori dan memuat film baru', async () => {
    renderHome();
    await waitFor(() => {
      expect(getMovies).toHaveBeenCalled();
    });

    // Test upcoming category
    const upcomingButton = screen.getByText('Akan Datang');
    fireEvent.click(upcomingButton);
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(getMovies).toHaveBeenCalledWith('/movie/upcoming', 1);
    });

    // Test now playing category
    const nowPlayingButton = screen.getByText('Sedang Tayang');
    fireEvent.click(nowPlayingButton);
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(getMovies).toHaveBeenCalledWith('/movie/now_playing', 1);
    });
  });
});