import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MovieCard from '../src/components/molecules/MovieCard';

const mockMovie = {
  id: 1,
  title: 'Test Movie',
  vote_average: 8.5,
  poster_path: '/test-poster.jpg',
  release_date: '2024-01-01',
  overview: 'Test movie description'
};

const renderMovieCard = () => {
  return render(
    <BrowserRouter>
      <MovieCard movie={mockMovie} />
    </BrowserRouter>
  );
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};


describe('MovieCard', () => {
  it('menampilkan informasi film dengan benar', () => {
    renderMovieCard();

    // Memverifikasi judul film
    expect(screen.getByText('Test Movie')).toBeInTheDocument();

    // Memverifikasi tahun rilis
    expect(screen.getByText('2024')).toBeInTheDocument();

    // Memverifikasi tombol info
    expect(screen.getByText('Info')).toBeInTheDocument();

    // Memverifikasi gambar poster
    const posterImage = screen.getByAltText('Test Movie');
    expect(posterImage).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w500/test-poster.jpg'
    );
  });

  it('merender informasi film dengan benar', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />);
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByAltText('Test Movie')).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w500/test-poster.jpg'
    );
  });

  it('menampilkan URL gambar yang benar ketika poster_path null', () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null };
    renderWithRouter(<MovieCard movie={movieWithoutPoster} />);
    
    expect(screen.getByAltText('Test Movie')).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w500null'
    );
  });

  it('memformat tanggal rilis dengan benar', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />);
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('membuat link ke halaman detail film', () => {
    renderWithRouter(<MovieCard movie={mockMovie} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', expect.stringContaining('/movie/1'));
  });
});
