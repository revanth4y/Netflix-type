import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const apiKey = import.meta.env.VITE_OMDB_API_KEY;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  params: {
    apikey: apiKey,
  },
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
