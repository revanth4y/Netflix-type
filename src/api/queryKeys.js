/**
 * React Query key factory for movies
 */
export const movieKeys = {
  all: ['movies'],
  search: (query) => [...movieKeys.all, 'search', query],
  category: (categoryKey) => [...movieKeys.all, 'category', categoryKey],
  detail: (id) => [...movieKeys.all, 'detail', id],
};
