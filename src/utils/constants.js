/**
 * Application constants
 */

export const API_BASE_URL = 'https://www.omdbapi.com';

export const STORAGE_KEYS = {
  USER: 'netflix_clone_user',
  USERS_DB: 'netflix_clone_users_db',
};

/** Categories to fetch for browse page horizontal rows */
export const MOVIE_CATEGORIES = [
  { key: 'batman', title: 'Batman' },
  { key: 'avengers', title: 'Avengers' },
  { key: 'action', title: 'Action' },
  { key: 'comedy', title: 'Comedy' },
  { key: 'drama', title: 'Drama' },
];

export const PASSWORD_MIN_LENGTH = 6;

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  BROWSE: '/browse',
  MY_LIST: '/browse', // My List uses browse for now (no backend)
};
