import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from '../src/components/atoms/Loader';

describe('Loader', () => {
  it('merender komponen loader dengan benar', () => {
    render(<Loader />);
    const loader = screen.getByRole('status');
    expect(loader).toBeInTheDocument();
  });

  it('memiliki teks loading yang sesuai untuk aksesibilitas', () => {
    render(<Loader />);
    const loader = screen.getByText(/memuat/i);
    expect(loader).toBeInTheDocument();
  });

  it('menerapkan kelas CSS yang benar', () => {
    render(<Loader />);
    const loader = screen.getByRole('status');
    expect(loader).toHaveClass('loader');
  });

  it('merender dengan kelas tambahan jika diberikan', () => {
    render(<Loader className="custom-loader" />);
    const loader = screen.getByRole('status');
    expect(loader).toHaveClass('loader');
    expect(loader).toHaveClass('custom-loader');
  });
});