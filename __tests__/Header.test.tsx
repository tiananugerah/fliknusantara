import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header, { HeaderProps } from '../src/components/organisms/Header';
import React from 'react';

const mockOnSearch = jest.fn();
const mockOnCategoryChange = jest.fn();

const renderHeader = (props: Partial<HeaderProps> = {}) => {
  const defaultProps = {
    onSearch: mockOnSearch,
    onCategoryChange: mockOnCategoryChange,
    currentCategory: 'now_playing' as const,
    searchQuery: '',
    ...props
  };

  return render(
    <BrowserRouter>
      <Header {...defaultProps} />
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('merender logo dengan benar', () => {
    renderHeader();
    expect(screen.getByText('FlikNusantara')).toBeInTheDocument();
  });

  it('merender kategori film dengan benar', () => {
    renderHeader();
    expect(screen.getByText('Sedang Tayang')).toBeInTheDocument();
    expect(screen.getByText('Populer')).toBeInTheDocument();
    expect(screen.getByText('Rating Tertinggi')).toBeInTheDocument();
    expect(screen.getByText('Akan Datang')).toBeInTheDocument();
  });

  it('mengganti kategori ketika tombol kategori diklik', () => {
    renderHeader();
    fireEvent.click(screen.getByText('Populer'));
    expect(mockOnCategoryChange).toHaveBeenCalledWith('popular');
  });

  it('memanggil onSearch ketika input pencarian berubah', async () => {
    renderHeader();
    const searchInput = screen.getByPlaceholderText('Cari film...');
    
    fireEvent.change(searchInput, { target: { value: 'Batman' } });
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('Batman');
    }, { timeout: 1000 });
  });

  it('menerapkan kelas scrolled pada header saat di-scroll', () => {
    renderHeader();
    const header = screen.getByRole('banner');
    
    // Simulasi scroll
    window.scrollY = 100;
    fireEvent.scroll(window);
    
    expect(header).toHaveClass('header--scrolled');
  });

  it('menyembunyikan kategori saat ada query pencarian', () => {
    renderHeader({ searchQuery: 'Batman' });
    expect(screen.queryByText('Sedang Tayang')).not.toBeInTheDocument();
  });
});