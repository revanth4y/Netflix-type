/**
 * YouTube Data API v3 - trailer search.
 * No inline API calls in components; key from env.
 */

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

/**
 * Search for a movie's official trailer; returns first video ID or null.
 * @param {string} movieTitle - Movie title for search query
 * @returns {Promise<string|null>} - videoId or null if not found / error
 */
export async function searchTrailer(movieTitle) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YouTube API key is not configured');
  }
  if (!movieTitle?.trim()) {
    return null;
  }

  const query = `${movieTitle.trim()} official trailer`;
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    key: apiKey,
    maxResults: '1',
    type: 'video',
  });

  const res = await fetch(`${YOUTUBE_SEARCH_URL}?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`YouTube API error: ${res.status}`);
  }

  const data = await res.json();
  const first = data?.items?.[0];
  const videoId = first?.id?.videoId ?? null;
  return videoId;
}

/**
 * Build embed URL for iframe (autoplay, mute, controls).
 * @param {string} videoId
 * @returns {string}
 */
export function getEmbedUrl(videoId) {
  if (!videoId) return '';
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1`;
}
