import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../src/components/atoms/Button';

describe('Button', () => {
  it('merender button dengan teks yang benar', () => {
    render(<Button>Klik Saya</Button>);
    expect(screen.getByText('Klik Saya')).toBeInTheDocument();
  });

  it('memanggil onClick handler ketika diklik', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Klik Saya</Button>);
    
    const button = screen.getByText('Klik Saya');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('merender button dengan kelas tambahan', () => {
    render(<Button className="custom-class">Klik Saya</Button>);
    const button = screen.getByText('Klik Saya');
    expect(button).toHaveClass('custom-class');
  });

  it('merender button yang dinonaktifkan', () => {
    render(<Button disabled>Klik Saya</Button>);
    const button = screen.getByText('Klik Saya');
    expect(button).toBeDisabled();
  });

  it('merender button dengan tipe yang ditentukan', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByText('Submit');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('merender button dengan teks yang benar', () => {
    render(<Button>Klik Saya</Button>);
    expect(screen.getByText('Klik Saya')).toBeInTheDocument();
  });

  it('memanggil onClick handler ketika diklik', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Klik Saya</Button>);
    
    fireEvent.click(screen.getByText('Klik Saya'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('menerapkan kelas tambahan yang diberikan melalui props', () => {
    render(<Button className="custom-class">Klik Saya</Button>);
    expect(screen.getByText('Klik Saya')).toHaveClass('custom-class');
  });

  it('menonaktifkan button ketika disabled prop true', () => {
    render(<Button disabled>Klik Saya</Button>);
    expect(screen.getByText('Klik Saya')).toBeDisabled();
  });

  it('menerapkan gaya kustom melalui style prop', () => {
    const customStyle = { backgroundColor: 'red' };
    render(<Button style={customStyle}>Klik Saya</Button>);
    expect(screen.getByText('Klik Saya')).toHaveStyle({ backgroundColor: 'red' });
  });
});