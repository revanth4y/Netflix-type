import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.BROWSE;

  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!password) {
      toast.error('Please enter your password');
      return;
    }
    setLoading(true);
    const success = login(email.trim(), password);
    setLoading(false);
    if (success) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-netflix-black">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-netflix-red mb-8 text-center">Netflix</h1>
          <form
            onSubmit={handleSubmit}
            className="bg-black/70 rounded-lg p-8 shadow-xl border border-gray-800"
          >
            <h2 className="text-2xl font-semibold mb-6">Sign In</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm text-gray-400 mb-1">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-sm text-gray-400 mb-1">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition"
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 rounded bg-netflix-red text-white font-semibold hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="mt-6 text-gray-400 text-center text-sm">
              New to Netflix?{' '}
              <Link to={ROUTES.SIGNUP} className="text-white hover:underline">
                Sign up now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
