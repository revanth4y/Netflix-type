import { useRef } from 'react';
import { MovieCard } from './MovieCard';

export function MovieRow({ title, movies, onMovieClick, isLoading }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-lg md:text-xl font-semibold mb-4 px-4 md:px-8">{title}</h2>
        <div className="flex gap-3 overflow-hidden px-4 md:px-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-36 sm:w-40 md:w-44 aspect-[2/3] bg-gray-800 rounded animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!movies?.length) return null;

  return (
    <section className="mb-8 group/row">
      <div className="flex items-center justify-between px-4 md:px-8 mb-4">
        <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
        <div className="flex gap-1 opacity-0 group-hover/row:opacity-100 transition">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-8 pb-2"
      >
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} onClick={onMovieClick} />
        ))}
      </div>
    </section>
  );
}
