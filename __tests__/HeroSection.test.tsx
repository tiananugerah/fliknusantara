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

  it('menampilkan slide berikutnya saat tombol next diklik', () => {
    render(<HeroSection movies={mockMovies} />);
    const nextButton = screen.getByLabelText('Slide berikutnya');
    fireEvent.click(nextButton);
    expect(screen.getByText('Film Test 2')).toBeInTheDocument();
    expect(screen.getByText('Deskripsi film test 2')).toBeInTheDocument();
  });

  it('menampilkan slide sebelumnya saat tombol previous diklik', () => {
    render(<HeroSection movies={mockMovies} />);
    const prevButton = screen.getByLabelText('Slide sebelumnya');
    fireEvent.click(prevButton);
    expect(screen.getByText('Film Test 2')).toBeInTheDocument();
    expect(screen.getByText('Deskripsi film test 2')).toBeInTheDocument();
  });

  it('menavigasi slide menggunakan keyboard', () => {
    render(<HeroSection movies={mockMovies} />);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('Film Test 2')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByText('Film Test 1')).toBeInTheDocument();
  });

  it('mengubah slide secara otomatis setelah interval waktu', () => {
    render(<HeroSection movies={mockMovies} />);
    expect(screen.getByText('Film Test 1')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByText('Film Test 2')).toBeInTheDocument();
  });

  it('menampilkan indikator dot untuk setiap slide', () => {
    render(<HeroSection movies={mockMovies} />);
    const indicators = screen.getAllByRole('button', { name: /Pergi ke slide/ });
    expect(indicators).toHaveLength(mockMovies.length);
    fireEvent.click(indicators[1]);
    expect(screen.getByText('Film Test 2')).toBeInTheDocument();
  });

  it('menavigasi ke halaman detail film saat tombol info diklik', () => {
    const mockLocation = { href: '' };
    delete window.location;
    window.location = mockLocation;
    render(<HeroSection movies={mockMovies} />);
    const infoButton = screen.getByText('Info Selengkapnya');
    fireEvent.click(infoButton);
    expect(window.location.href).toBe('/movie/1');
  });

  it('mengembalikan null jika tidak ada film', () => {
    const { container } = render(<HeroSection movies={[]} />);
    expect(container.firstChild).toBeNull();
  });
});