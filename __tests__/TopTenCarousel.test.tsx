import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TopTenCarousel from '../src/components/organisms/TopTenCarousel';

const mockMovies = [
  {
    id: 1,
    title: 'Film 1',
    poster_path: '/poster1.jpg',
    vote_average: 8.5,
    release_date: '2024-01-01',
    overview: 'Deskripsi film 1'
  },
  {
    id: 2,
    title: 'Film 2',
    poster_path: '/poster2.jpg',
    vote_average: 7.8,
    release_date: '2024-01-02',
    overview: 'Deskripsi film 2'
  }
];

const renderTopTenCarousel = (props = {}) => {
  return render(
    <BrowserRouter>
      <TopTenCarousel movies={mockMovies} loading={false} {...props} />
    </BrowserRouter>
  );
};

describe('TopTenCarousel Component', () => {
  beforeEach(() => {
    Element.prototype.scrollBy = jest.fn();
  });

  it('menampilkan loading spinner saat loading=true', () => {
    renderTopTenCarousel({ loading: true });
    expect(screen.getByTestId('top-ten-carousel-loader')).toBeInTheDocument();
  });

  it('merender judul dengan benar', () => {
    renderTopTenCarousel();
    expect(screen.getByText('Top 10 Film')).toBeInTheDocument();
  });

  it('merender daftar film dengan nomor urutan', () => {
    renderTopTenCarousel();
    mockMovies.forEach((_, index) => {
      expect(screen.getByText(String(index + 1))).toBeInTheDocument();
    });
  });

  it('membatasi jumlah film yang ditampilkan menjadi 10', () => {
    const manyMovies = Array(15).fill(null).map((_, index) => ({
      id: index + 1,
      title: `Film ${index + 1}`,
      poster_path: `/poster${index + 1}.jpg`,
      vote_average: 8.0,
      release_date: '2024-01-01',
      overview: `Deskripsi film ${index + 1}`
    }));

    renderTopTenCarousel({ movies: manyMovies });
    const movieCards = screen.getAllByRole('img');
    expect(movieCards).toHaveLength(10);
  });

  it('menangani scroll ke kiri dan kanan', () => {
    renderTopTenCarousel();

    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 1000
    });

    const leftButton = screen.getByRole('button', { name: '←' });
    const rightButton = screen.getByRole('button', { name: '→' });

    fireEvent.click(rightButton);
    expect(Element.prototype.scrollBy).toHaveBeenCalledWith({
      left: 800,
      behavior: 'smooth'
    });

    fireEvent.click(leftButton);
    expect(Element.prototype.scrollBy).toHaveBeenCalledWith({
      left: -800,
      behavior: 'smooth'
    });
  });

  it('menerapkan kelas kustom jika diberikan', () => {
    renderTopTenCarousel({ className: 'custom-carousel' });
    expect(screen.getByTestId('top-ten-carousel')).toHaveClass('custom-carousel');
  });

  it('menangani kasus ketika tidak ada film', () => {
    renderTopTenCarousel({ movies: [] });
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});