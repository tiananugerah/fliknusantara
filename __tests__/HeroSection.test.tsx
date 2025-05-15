import { render, screen, fireEvent, act } from '@testing-library/react';
import HeroSection from '../src/components/organisms/HeroSection';
import React from 'react';

const mockMovies = [
  {
    id: 1,
    title: 'Film 1',
    backdrop_path: '/path/to/backdrop1.jpg',
    poster_path: '/path/to/poster1.jpg',
    overview: 'Deskripsi film 1',
    vote_average: 8.5,
    release_date: '2024-01-01'
  },
  {
    id: 2,
    title: 'Film 2',
    backdrop_path: '/path/to/backdrop2.jpg',
    poster_path: '/path/to/poster2.jpg',
    overview: 'Deskripsi film 2',
    vote_average: 7.8,
    release_date: '2024-01-02'
  }
];

describe('HeroSection Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('merender film pertama sebagai slide aktif', () => {
    render(<HeroSection movies={mockMovies} />);
    
    expect(screen.getByText('Film 1')).toBeInTheDocument();
    expect(screen.getByText('Deskripsi film 1')).toBeInTheDocument();
    expect(screen.getByAltText('Film 1')).toHaveAttribute(
      'src',
      expect.stringContaining('/path/to/backdrop1.jpg')
    );
  });

  it('mengganti slide secara otomatis setelah interval waktu', () => {
    render(<HeroSection movies={mockMovies} />);
    
    act(() => {
      jest.advanceTimersByTime(5000); // Menunggu 5 detik
    });

    expect(screen.getByText('Film 2')).toBeInTheDocument();
  });

  it('mengganti slide ketika indikator diklik', () => {
    render(<HeroSection movies={mockMovies} />);
    
    const indicators = screen.getAllByRole('button');
    fireEvent.click(indicators[1]); // Klik indikator kedua
    
    expect(screen.getByText('Film 2')).toBeInTheDocument();
  });

  it('menampilkan tombol info selengkapnya', () => {
    render(<HeroSection movies={mockMovies} />);
    
    const buttons = screen.getAllByText('Info Selengkapnya');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('menangani kasus ketika tidak ada film', () => {
    render(<HeroSection movies={[]} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('merender film pertama sebagai slide aktif', () => {
    render(<HeroSection movies={mockMovies} />);
    
    expect(screen.getByText('Film 1')).toBeInTheDocument();
    expect(screen.getByText('Deskripsi film 1')).toBeInTheDocument();
    expect(screen.getByAltText('Film 1')).toHaveAttribute(
      'src',
      expect.stringContaining('/path/to/backdrop1.jpg')
    );
  });

  it('mengganti slide secara otomatis setelah interval waktu', () => {
    render(<HeroSection movies={mockMovies} />);
    
    act(() => {
      jest.advanceTimersByTime(5000); // Menunggu 5 detik
    });

    expect(screen.getByText('Film 2')).toBeInTheDocument();
  });

  it('mengganti slide ketika indikator diklik', () => {
    render(<HeroSection movies={mockMovies} />);
    
    const indicators = screen.getAllByRole('button');
    fireEvent.click(indicators[1]); // Klik indikator kedua
    
    expect(screen.getByText('Film 2')).toBeInTheDocument();
  });

  it('menampilkan tombol info selengkapnya', () => {
    render(<HeroSection movies={mockMovies} />);
    
    const buttons = screen.getAllByText('Info Selengkapnya');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('menangani kasus ketika tidak ada film', () => {
    render(<HeroSection movies={[]} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});