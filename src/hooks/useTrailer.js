import { useState, useCallback, useEffect } from 'react';
import { searchTrailer } from '../api/youtube';

/**
 * Fetches trailer videoId for a movie title.
 * @param {string|null|undefined} movieTitle - Title to search (e.g. "Inception")
 * @returns {{ videoId: string|null, loading: boolean, error: Error|null, refetch: function }}
 */
export function useTrailer(movieTitle) {
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrailer = useCallback(async (title) => {
    if (!title?.trim()) {
      setVideoId(null);
      setError(null);
      return null;
    }
    setLoading(true);
    setError(null);
    setVideoId(null);
    try {
      const id = await searchTrailer(title);
      setVideoId(id);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setVideoId(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!movieTitle?.trim()) {
      setVideoId(null);
      setLoading(false);
      setError(null);
      return;
    }
    fetchTrailer(movieTitle);
  }, [movieTitle, fetchTrailer]);

  return { videoId, loading, error, refetch: fetchTrailer };
}
