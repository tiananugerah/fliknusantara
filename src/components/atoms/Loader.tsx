import React from 'react';
import '@/styles/components/Loader.css';

interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className = '' }) => {
  return (
    <div className={`loader ${className}`} role="status" aria-label="Memuat">
      <div className="loader__spinner" />
      <span className="sr-only">Memuat</span>
    </div>
  );
};

export default Loader;