import axiosInstance from './axios';

/**
 * Search movies by keyword (OMDb search)
 * @param {string} query - Search term
 * @returns {Promise<{ Search: Array, totalResults: string }>}
 */
export async function searchMovies(query) {
  if (!query?.trim()) return { Search: [], totalResults: '0' };
  const { data } = await axiosInstance.get('/', {
    params: { s: query.trim(), type: 'movie' },
  });
  if (data.Response === 'False') return { Search: [], totalResults: '0' };
  return { Search: data.Search || [], totalResults: data.totalResults || '0' };
}

/**
 * Get single movie details by IMDb ID
 * @param {string} id - IMDb ID (e.g. tt0372784)
 * @returns {Promise<Object>}
 */
export async function getMovieById(id) {
  if (!id) return null;
  const { data } = await axiosInstance.get('/', {
    params: { i: id, plot: 'short' },
  });
  if (data.Response === 'False') return null;
  return data;
}
