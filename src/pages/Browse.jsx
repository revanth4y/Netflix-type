import { useState, useCallback, lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '../components/Navbar';
import { MovieRow } from '../components/MovieRow';
import { Modal } from '../components/Modal';
import { searchMovies, getMovieById } from '../api/movies';
import { movieKeys } from '../api/queryKeys';
import { MOVIE_CATEGORIES } from '../utils/constants';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

const TrailerModal = lazy(() =>
  import('../components/TrailerModal').then((m) => ({ default: m.TrailerModal }))
);

function MovieDetailModal({ movieId, onClose }) {
  const { data: movie, isLoading, isError } = useQuery({
    queryKey: movieKeys.detail(movieId),
    queryFn: () => getMovieById(movieId),
    enabled: !!movieId,
  });

  if (!movieId) return null;
  if (isError) {
    return (
      <Modal isOpen onClose={onClose}>
        <div className="p-6 text-center text-red-400">Failed to load movie details.</div>
      </Modal>
    );
  }
  if (isLoading || !movie) {
    return (
      <Modal isOpen onClose={onClose}>
        <div className="p-12 flex justify-center">
          <div className="w-10 h-10 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
        </div>
      </Modal>
    );
  }

  const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : null;
  return (
    <Modal isOpen onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 pr-10">{movie.Title}</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {poster && (
            <img
              src={poster}
              alt={movie.Title}
              className="w-full sm:w-48 flex-shrink-0 rounded object-cover"
            />
          )}
          <div className="flex-1 space-y-2">
            {movie.Year && (
              <p>
                <span className="text-gray-500">Year:</span> {movie.Year}
              </p>
            )}
            {movie.Genre && (
              <p>
                <span className="text-gray-500">Genre:</span> {movie.Genre}
              </p>
            )}
            {movie.Runtime && (
              <p>
                <span className="text-gray-500">Runtime:</span> {movie.Runtime}
              </p>
            )}
            {movie.imdbRating && (
              <p>
                <span className="text-gray-500">IMDb Rating:</span> {movie.imdbRating}/10
              </p>
            )}
            {movie.Plot && (
              <p className="text-gray-300">
                <span className="text-gray-500 block mb-1">Plot:</span>
                {movie.Plot}
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function Browse() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput.trim(), 400);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [trailerMovie, setTrailerMovie] = useState(null);

  const handleMovieClick = useCallback((movie) => {
    setTrailerMovie({ title: movie.Title, imdbID: movie.imdbID });
  }, []);

  const handleSearchSubmit = useCallback((e) => {
    e?.preventDefault?.();
  }, []);

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: movieKeys.search(debouncedSearch),
    queryFn: () => searchMovies(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });

  const searchResults = searchData?.Search ?? [];
  const showSearchResults = searchInput.trim().length > 0;

  return (
    <div className="min-h-screen bg-netflix-black dark:bg-netflix-black light:bg-gray-100">
      <Navbar
        isBrowse
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <main className="pt-16">
        {!showSearchResults ? (
          <>
            <BrowseHero />
            {MOVIE_CATEGORIES.map((cat) => (
              <CategoryRow
                key={cat.key}
                categoryKey={cat.key}
                title={cat.title}
                onMovieClick={handleMovieClick}
              />
            ))}
          </>
        ) : (
          <div className="px-4 md:px-8 py-8">
            <h1 className="text-xl font-semibold mb-4">
              Search results for &quot;{searchInput.trim() || debouncedSearch}&quot;
            </h1>
            {searchLoading ? (
              <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-36 sm:w-40 md:w-44 aspect-[2/3] bg-gray-800 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : searchResults.length === 0 && !searchLoading ? (
              <EmptySearchState onClear={() => setSearchInput('')} />
            ) : (
              <MovieRow
                title="Results"
                movies={searchResults}
                onMovieClick={handleMovieClick}
              />
            )}
          </div>
        )}
      </main>

      {selectedMovieId && (
        <MovieDetailModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}

      {trailerMovie && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80">
              <div className="w-12 h-12 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <TrailerModal
            isOpen
            onClose={() => setTrailerMovie(null)}
            movieTitle={trailerMovie.title}
            movieId={trailerMovie.imdbID}
            onViewDetails={(id) => {
              setTrailerMovie(null);
              setSelectedMovieId(id);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}

function BrowseHero() {
  const { data, isLoading } = useQuery({
    queryKey: movieKeys.category(MOVIE_CATEGORIES[0]?.key ?? 'batman'),
    queryFn: () => searchMovies(MOVIE_CATEGORIES[0]?.key ?? 'batman'),
  });
  const featured = data?.Search?.[0];
  const poster = featured?.Poster && featured.Poster !== 'N/A' ? featured.Poster : null;

  if (isLoading || !featured) {
    return (
      <div className="relative h-[50vw] min-h-[300px] max-h-[600px] w-full bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <section className="relative h-[50vw] min-h-[300px] max-h-[600px] w-full bg-gray-900">
      {poster && (
        <img
          src={poster}
          alt={featured.Title}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg max-w-2xl">
          {featured.Title}
        </h1>
        {featured.Year && (
          <p className="mt-2 text-lg text-gray-300">{featured.Year}</p>
        )}
      </div>
    </section>
  );
}

function CategoryRow({ categoryKey, title, onMovieClick }) {
  const { data, isLoading } = useQuery({
    queryKey: movieKeys.category(categoryKey),
    queryFn: () => searchMovies(categoryKey),
  });
  const movies = data?.Search ?? [];
  return (
    <MovieRow
      title={title}
      movies={movies}
      onMovieClick={onMovieClick}
      isLoading={isLoading}
    />
  );
}

function EmptySearchState({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="w-16 h-16 text-gray-600 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-gray-400 text-lg">No movies found. Try a different search.</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
      >
        Clear search
      </button>
    </div>
  );
}
