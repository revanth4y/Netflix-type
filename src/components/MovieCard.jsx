import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMovieById } from '../api/movies';
import { movieKeys } from '../api/queryKeys';

const PLOT_MAX_LENGTH = 100;

function truncatePlot(text) {
  if (!text || typeof text !== 'string') return '';
  const t = text.trim();
  if (t.length <= PLOT_MAX_LENGTH) return t;
  return t.slice(0, PLOT_MAX_LENGTH).trim() + '…';
}

export function MovieCard({ movie, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const ignoreNextClickRef = useRef(false);

  const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : null;
  const title = movie.Title || 'Unknown';
  const year = movie.Year || '';

  const { data: details } = useQuery({
    queryKey: movieKeys.detail(movie.imdbID),
    queryFn: () => getMovieById(movie.imdbID),
    enabled: isHovered || isTapped,
    staleTime: 1000 * 60 * 5,
  });

  const showOverlay = isHovered || isTapped;
  const plot = details?.Plot ? truncatePlot(details.Plot) : '';
  const rating = details?.imdbRating ?? '';

  const handleClick = () => {
    if (ignoreNextClickRef.current) {
      ignoreNextClickRef.current = false;
      return;
    }
    onClick(movie);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setIsTapped(false);
  };

  const handleMobileTap = (e) => {
    if (!window.matchMedia('(hover: none)').matches) return;
    if (!isTapped) {
      e.preventDefault();
      ignoreNextClickRef.current = true;
      setIsTapped(true);
    }
  };

  return (
    <div
      className="flex-shrink-0 w-36 sm:w-40 md:w-44 group focus-within:z-10"
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
    >
      <button
        type="button"
        onClick={handleClick}
        onTouchEnd={handleMobileTap}
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-netflix-red focus:ring-offset-2 focus:ring-offset-netflix-black rounded overflow-hidden transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-black/50 active:scale-[1.02]"
        style={{ transformOrigin: 'center center' }}
      >
        <div className="aspect-[2/3] bg-gray-800 rounded overflow-hidden relative">
          {poster ? (
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover transition duration-300 ease-in-out group-hover:brightness-75"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm text-center p-2">
              No poster
            </div>
          )}

          {/* Netflix-style hover overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-300 ease-in-out ${
              showOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden="true"
          >
            <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-semibold text-sm leading-tight line-clamp-2">
                  {title}
                </span>
                {year && (
                  <span className="text-gray-400 text-xs shrink-0">{year}</span>
                )}
              </div>
              {rating && (
                <p className="text-xs text-yellow-400">IMDb {rating}</p>
              )}
              {plot && (
                <p className="text-xs text-gray-300 line-clamp-3">{plot}</p>
              )}
              <div className="flex items-center justify-center mt-1">
                <span className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-black flex-shrink-0">
                  <svg
                    className="w-5 h-5 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-300 truncate group-hover:text-white transition duration-300">
          {title}
        </p>
      </button>
    </div>
  );
}
