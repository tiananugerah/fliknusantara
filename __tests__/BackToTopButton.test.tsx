import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BackToTopButton from '../src/components/atoms/BackToTopButton';

describe('BackToTopButton', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
  });

  it('tidak menampilkan tombol ketika scroll di posisi atas', () => {
    render(<BackToTopButton />);
    const button = screen.queryByRole('button', { name: /kembali ke atas/i });
    expect(button).not.toBeInTheDocument();
  });

  it('menampilkan tombol ketika halaman di-scroll ke bawah', () => {
    render(<BackToTopButton />);
    
    // Simulasi scroll
    Object.defineProperty(window, 'scrollY', { value: 1000 });
    fireEvent.scroll(window);

    const button = screen.getByRole('button', { name: 'Kembali ke atas' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle({ display: 'block' });
  });

  it('memanggil window.scrollTo ketika tombol diklik', () => {
    render(<BackToTopButton />);
    
    // Simulasi scroll untuk menampilkan tombol
    Object.defineProperty(window, 'scrollY', { value: 1000 });
    fireEvent.scroll(window);

    const button = screen.getByRole('button', { name: 'Kembali ke atas' });
    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    });
  });
});