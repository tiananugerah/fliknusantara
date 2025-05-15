import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TopCarousel from '../src/components/organisms/TopCarousel';

const mockMovies = [
  {
    id: 1,
    title: 'Film 1',
    overview: 'Deskripsi film 1',
    backdrop_path: '/backdrop1.jpg',
    poster_path: '/poster1.jpg',
    release_date: '2024-01-01'
  },
  {
    id: 2,
    title: 'Film 2',
    overview: 'Deskripsi film 2',
    backdrop_path: '/backdrop2.jpg',
    poster_path: '/poster2.jpg',
    release_date: '2024-01-02'
  }
];

const renderTopCarousel = (props = {}) => {
  return render(
    <BrowserRouter>
      <TopCarousel movies={mockMovies} {...props} />
    </BrowserRouter>
  );
};

describe('TopCarousel', () => {
  beforeEach(() => {
    // Mock scrollBy karena jsdom tidak mendukung scrolling
    Element.prototype.scrollBy = jest.fn();
  });

  it('merender judul default dengan benar', () => {
    renderTopCarousel();
    expect(screen.getByText('Top 10 Film')).toBeInTheDocument();
  });

  it('merender judul kustom jika diberikan', () => {
    renderTopCarousel({ title: 'Film Terpopuler' });
    expect(screen.getByText('Film Terpopuler')).toBeInTheDocument();
  });

  it('merender maksimal 10 film', () => {
    const manyMovies = Array(15).fill(null).map((_, index) => ({
      id: index + 1,
      title: `Film ${index + 1}`,
      overview: `Deskripsi film ${index + 1}`,
      backdrop_path: `/backdrop${index + 1}.jpg`,
      poster_path: `/poster${index + 1}.jpg`,
      release_date: '2024-01-01'
    }));

    renderTopCarousel({ movies: manyMovies });
    const movieItems = screen.getAllByRole('img');
    expect(movieItems).toHaveLength(10);
  });

  it('menampilkan nomor urutan untuk setiap film', () => {
    renderTopCarousel();
    mockMovies.forEach((_, index) => {
      expect(screen.getByText(String(index + 1))).toBeInTheDocument();
    });
  });

  it('memiliki tombol scroll kiri dan kanan', () => {
    renderTopCarousel();
    expect(screen.getByLabelText('Scroll ke kiri')).toBeInTheDocument();
    expect(screen.getByLabelText('Scroll ke kanan')).toBeInTheDocument();
  });

  it('memanggil scrollBy dengan nilai yang benar saat tombol scroll diklik', () => {
    renderTopCarousel();
    
    // Mock clientWidth
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 1000
    });

    const scrollLeftButton = screen.getByLabelText('Scroll ke kiri');
    const scrollRightButton = screen.getByLabelText('Scroll ke kanan');

    fireEvent.click(scrollRightButton);
    expect(Element.prototype.scrollBy).toHaveBeenCalledWith({
      left: 800,
      behavior: 'smooth'
    });

    fireEvent.click(scrollLeftButton);
    expect(Element.prototype.scrollBy).toHaveBeenCalledWith({
      left: -800,
      behavior: 'smooth'
    });
  });

  it('menerapkan kelas CSS tambahan jika diberikan', () => {
    renderTopCarousel({ className: 'custom-carousel' });
    expect(screen.getByTestId('top-carousel')).toHaveClass('custom-carousel');
  });
});