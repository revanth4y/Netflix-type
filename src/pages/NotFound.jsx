import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-netflix-black px-4">
      <h1 className="text-8xl md:text-9xl font-bold text-netflix-red">404</h1>
      <p className="text-xl text-gray-400 mt-4 text-center">Page not found.</p>
      <Link
        to={ROUTES.BROWSE}
        className="mt-8 px-6 py-3 rounded bg-netflix-red text-white font-semibold hover:bg-red-600 transition"
      >
        Go to Home
      </Link>
    </div>
  );
}
