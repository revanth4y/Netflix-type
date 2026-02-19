import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ROUTES, PASSWORD_MIN_LENGTH } from '../utils/constants';
import { validateRequired, validatePassword, validateMobile } from '../utils/validation';
import { Input } from '../components/ui/Input';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const validateForm = useCallback(() => {
    const next = {};
    const nameResult = validateRequired(name, 'Name');
    if (!nameResult.valid) next.name = nameResult.message;
    const emailResult = validateRequired(email, 'Email');
    if (!emailResult.valid) next.email = emailResult.message;
    const mobileResult = validateMobile(mobile);
    if (!mobileResult.valid) next.mobile = mobileResult.message;
    const passwordResult = validatePassword(password, PASSWORD_MIN_LENGTH);
    if (!passwordResult.valid) next.password = passwordResult.message;
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [name, email, mobile, password]);

  if (isAuthenticated) {
    navigate(ROUTES.BROWSE, { replace: true });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const success = signup(name.trim(), email.trim(), mobile.trim(), password);
    setLoading(false);
    if (success) {
      toast.success('Account created! Welcome to Netflix.');
      navigate(ROUTES.BROWSE, { replace: true });
    } else {
      toast.error('An account with this email already exists');
    }
  };

  const isFormValid =
    name.trim() &&
    email.trim() &&
    validateMobile(mobile).valid &&
    password.length >= PASSWORD_MIN_LENGTH;

  return (
    <div className="min-h-screen flex flex-col bg-netflix-black dark:bg-netflix-black light:bg-gray-100">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-netflix-red mb-8 text-center">Netflix</h1>
          <form
            onSubmit={handleSubmit}
            className="bg-black/70 light:bg-white rounded-lg p-8 shadow-xl border border-gray-800 light:border-gray-200"
          >
            <h2 className="text-2xl font-semibold mb-6 dark:text-white light:text-gray-900">Sign Up</h2>
            <div className="space-y-4">
              <Input
                id="signup-name"
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                error={errors.name}
                disabled={loading}
                autoComplete="name"
              />
              <Input
                id="signup-email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                error={errors.email}
                disabled={loading}
                autoComplete="email"
              />
              <Input
                id="signup-mobile"
                label="Mobile Number"
                type="tel"
                inputMode="numeric"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10 digit mobile number"
                error={errors.mobile}
                disabled={loading}
                autoComplete="tel"
              />
              <Input
                id="signup-password"
                label={`Password (min ${PASSWORD_MIN_LENGTH} characters)`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                error={errors.password}
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full mt-6 py-3 rounded bg-netflix-red text-white font-semibold hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
            <p className="mt-6 text-gray-400 light:text-gray-600 text-center text-sm">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="text-white light:text-netflix-red hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
