import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../src/pages/Home', () => {
  return function MockHome() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock('../src/pages/MovieDetail', () => {
  return function MockMovieDetail() {
    return <div data-testid="movie-detail-page">Movie Detail Page</div>;
  };
});

describe('App', () => {
  it('merender halaman Home pada path /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>  
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('merender halaman MovieDetail pada path /movie/:id', () => {
    render(
      <MemoryRouter initialEntries={['/movie/123']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('movie-detail-page')).toBeInTheDocument();
  });

  it('merender halaman Home untuk path yang tidak valid', () => {
    render(
      <MemoryRouter initialEntries={['/invalid-path']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
});