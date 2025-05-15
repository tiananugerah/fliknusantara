import React, { useState, useEffect } from 'react';
import Button from '../atoms/Button';
import '@/styles/components/Header.css';

type CategoryType = 'now_playing' | 'popular' | 'top_rated' | 'upcoming';

export interface HeaderProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: CategoryType) => void;
  currentCategory: CategoryType;
  searchQuery: string;
}

const CATEGORIES: { [key in CategoryType]: string } = {
  now_playing: 'Sedang Tayang',
  popular: 'Populer',
  top_rated: 'Rating Tertinggi',
  upcoming: 'Akan Datang'
};

const Header: React.FC<HeaderProps> = ({
  onSearch,
  onCategoryChange,
  currentCategory,
  searchQuery
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      onSearch(query);
    }, 100); // Mengurangi waktu delay menjadi 300ms

    setSearchTimeout(timeout);
  };

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        <div className="header__content">
          <h1 className="header__logo">FlikNusantara</h1>
          
          <div className="header__search">
            <input
              type="text"
              placeholder="Cari film..."
              className="header__search-input"
              value={searchQuery}
              onChange={handleSearch}
            />
            <div className="header__search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {!searchQuery && (
            <div className="header__categories">
              {(Object.keys(CATEGORIES) as CategoryType[]).map(key => (
                <Button
                  key={key}
                  variant={'secondary'}
                  onClick={() => onCategoryChange(key as CategoryType)}
                  className={`header__category-button ${currentCategory === key ? 'header__category-button--active' : 'header__category-button--inactive'}`}
                >
                  {CATEGORIES[key]}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;