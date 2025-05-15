import { render, screen, fireEvent, act } from '@testing-library/react';
import HeroSection from '../src/components/organisms/HeroSection';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

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

const renderHeroSection = (movies) => {
  return render(
    <BrowserRouter>
      <HeroSection movies={movies} />
    </BrowserRouter>
  );
};

describe('HeroSection Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('merender film pertama sebagai slide aktif', () => {
    renderHeroSection(mockMovies);
    expect(screen.getByText('Film 1')).toBeInTheDocument();
    expect(screen.getByText('Deskripsi film 1')).toBeInTheDocument();
    expect(screen.getByAltText('Film 1')).toHaveAttribute(
      'src',
      expect.stringContaining('/path/to/backdrop1.jpg')
    );
  });

  it('mengganti slide secara otomatis setelah interval waktu', () => {
    renderHeroSection(mockMovies);
    act(() => {
      jest.advanceTimersByTime(5000); // Menunggu 5 detik
    });
    expect(screen.getByText('Film 2')).toBeInTheDocument();
  });

  it('mengganti slide ketika indikator diklik', () => {
    renderHeroSection(mockMovies);
    const indicators = screen.getAllByRole('button');
    fireEvent.click(indicators[1]); // Klik indikator kedua
    expect(screen.getByText('Film 2')).toBeInTheDocument();
  });

  it('menampilkan tombol info selengkapnya', () => {
    renderHeroSection(mockMovies);
    const buttons = screen.getAllByText('Info Selengkapnya');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('menangani kasus ketika tidak ada film', () => {
    renderHeroSection([]);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('menampilkan slide berikutnya saat tombol next diklik', () => {
    renderHeroSection(mockMovies);
    const nextButton = screen.getByLabelText('Slide berikutnya');
    fireEvent.click(nextButton);
    expect(screen.getByText('Film 2')).toBeInTheDocument();
    expect(screen.getByText('Deskripsi film 2')).toBeInTheDocument();
  });

  it('menampilkan slide sebelumnya saat tombol previous diklik', () => {
    renderHeroSection(mockMovies);
    const prevButton = screen.getByLabelText('Slide sebelumnya');
    fireEvent.click(prevButton);
    expect(screen.getByText('Film 2')).toBeInTheDocument();
    expect(screen.getByText('Deskripsi film 2')).toBeInTheDocument();
  });

  it('menavigasi slide menggunakan keyboard', () => {
    renderHeroSection(mockMovies);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('Film 2')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByText('Film 1')).toBeInTheDocument();
  });

  it('mengubah slide secara otomatis setelah interval waktu', () => {
    renderHeroSection(mockMovies);
    expect(screen.getByText('Film 1')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByText('Film 2')).toBeInTheDocument();
  });

  it('menampilkan indikator dot untuk setiap slide', () => {
    renderHeroSection(mockMovies);
    const indicators = screen.getAllByRole('button', { name: /Pergi ke slide/ });
    expect(indicators).toHaveLength(mockMovies.length);
    fireEvent.click(indicators[1]);
    expect(screen.getByText('Film 2')).toBeInTheDocument();
  });

  it('menavigasi ke halaman detail film saat tombol info diklik', () => {
    renderHeroSection(mockMovies);
    const infoButtons = screen.getAllByText('Info Selengkapnya');
    fireEvent.click(infoButtons[0]);
    window.location.href = '/movie/1';
  });

  it('mengembalikan null jika tidak ada film', () => {
    const { container } = renderHeroSection([]);
    expect(container.firstChild).toBeNull();
  });
});