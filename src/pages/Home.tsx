/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { getMovies, searchMovies, getRandomMovies, type MovieResponse } from '../services/api';
import MovieList from '../components/organisms/MovieList';
import TopTenCarousel from '../components/organisms/TopTenCarousel';
import Header from '../components/organisms/Header';
import BackToTopButton from '../components/atoms/BackToTopButton';
import '@/styles/pages/Home.css';
import HeroSection from '../components/organisms/HeroSection';

type CategoryType = 'now_playing' | 'popular' | 'top_rated' | 'upcoming';

const CATEGORIES: { [key in CategoryType]: string } = {
  now_playing: 'Sedang Tayang',
  popular: 'Populer',
  top_rated: 'Rating Tertinggi',
  upcoming: 'Akan Datang'
};

const Home: React.FC = () => {
  const [movies, setMovies] = useState<MovieResponse['results']>([]);
  const [topMovies, setTopMovies] = useState<MovieResponse['results']>([]);
  const [loading, setLoading] = useState(false);
  const [topMoviesLoading, setTopMoviesLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<CategoryType>('now_playing');
  const [searchQuery, setSearchQuery] = useState('');
  const [randomMovies, setRandomMovies] = useState<MovieResponse['results']>([]);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  const fetchMovies = useCallback(async (resetPage = false) => {
    try {
      setLoading(true);
      const currentPage = resetPage ? 1 : page;
      const endpoint = searchQuery
        ? await searchMovies(searchQuery, currentPage)
        : await getMovies(`/movie/${category}`, currentPage);
  
      const newMovies = endpoint.results;
      
      if (newMovies.length === 0) {
        setHasReachedEnd(true);
        if (!randomMovies.length) {
          const randomResults = await getRandomMovies();
          setRandomMovies(randomResults.results);
        }
      }
  
      setMovies(prevMovies => (
        resetPage ? newMovies : [...prevMovies, ...newMovies]
      ));
      if (!resetPage) setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  }, [page, category, searchQuery, randomMovies]);

  const fetchTopMovies =  useCallback(async () => {
    try {
      setTopMoviesLoading(true);
      const response = await getMovies('/movie/top_rated', 1);
      setTopMovies(response.results);
    } catch (error) {
      console.error('Error fetching top movies:', error);
    } finally {
      setTopMoviesLoading(false);
    }
  },[]);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    fetchMovies(true);
    if (!searchQuery) {
      fetchTopMovies();
    }
  }, [category]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setMovies([]);
    setPage(1);
    setHasReachedEnd(false);
    setRandomMovies([]);
    
    if (query) {
      fetchMovies(true);
    } else {
      setCategory('now_playing');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header
        onSearch={handleSearch}
        onCategoryChange={setCategory}
        currentCategory={category}
        searchQuery={searchQuery}
      />

      <main className="main-content">
        {!searchQuery && (
          <>
            <HeroSection
              movies={movies}
            />
            <div className="container mx-auto space-y-12 pb-8">
              <TopTenCarousel
                movies={topMovies}
                loading={topMoviesLoading}
              />
              <MovieList
                title={CATEGORIES[category]}
                movies={movies.slice(1)}
                onLoadMore={() => fetchMovies()}
                loading={loading}
                className="movie-list-main"
                isHeroSection={true}
              />
              <MovieList
                title={CATEGORIES[category]}
                movies={movies.slice(1)}
                onLoadMore={() => fetchMovies()}
                loading={loading}
                className="movie-list-second"
              />
            </div>
          </>
        )}
        {searchQuery && (
          <div className="container mx-auto px-4 pt-32 pb-8">
            <MovieList
              title={`Hasil Pencarian: ${searchQuery}`}
              movies={movies}
              onLoadMore={() => fetchMovies()}
              loading={loading && !hasReachedEnd}
            />
          </div>
        )}
        {hasReachedEnd && randomMovies.length > 0 && (
          <div className="container mx-auto px-4 pb-8">
            <MovieList
              title="Film Yang Mungkin Anda Suka"
              movies={randomMovies}
              onLoadMore={() => {}}
              loading={true}
            />
          </div>
        )}
      </main>
      <BackToTopButton />
    </div>
  );
};

export default Home;
