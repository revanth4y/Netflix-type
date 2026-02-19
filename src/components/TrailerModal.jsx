import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTrailer } from '../hooks/useTrailer';
import { getEmbedUrl } from '../api/youtube';

export function TrailerModal({ isOpen, onClose, movieTitle, movieId, onViewDetails }) {
  const contentRef = useRef(null);
  const { videoId, loading, error } = useTrailer(isOpen ? movieTitle : null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEscape);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-trailer-fade"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trailer-modal-title"
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-4xl rounded-lg overflow-hidden bg-netflix-dark border border-gray-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
          aria-label="Close trailer"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <h2 id="trailer-modal-title" className="sr-only">
          Trailer: {movieTitle}
        </h2>

        {loading && (
          <div className="aspect-video w-full flex items-center justify-center bg-gray-900">
            <div
              className="w-12 h-12 border-2 border-netflix-red border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
          </div>
        )}

        {(error || (!loading && !videoId && movieTitle)) && !loading && (
          <div className="aspect-video w-full flex flex-col items-center justify-center bg-gray-900 text-gray-300 p-6">
            <p className="text-red-400 font-medium">Trailer not available</p>
            {error && <p className="text-sm mt-2 text-center">{error.message}</p>}
            {!error && !videoId && <p className="text-sm mt-2 text-center">No trailer found for this title.</p>}
            {onViewDetails && movieId && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewDetails(movieId);
                }}
                className="mt-4 px-4 py-2 rounded bg-netflix-red text-white hover:bg-red-600 transition"
              >
                View details
              </button>
            )}
          </div>
        )}

        {videoId && !loading && (
          <div className="relative aspect-video w-full bg-black">
            <iframe
              title={`Trailer for ${movieTitle}`}
              src={getEmbedUrl(videoId)}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {onViewDetails && movieId && (
              <div className="absolute bottom-3 left-3 right-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewDetails(movieId);
                  }}
                  className="px-4 py-2 rounded bg-white/20 text-white hover:bg-white/30 transition text-sm"
                >
                  View details
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
