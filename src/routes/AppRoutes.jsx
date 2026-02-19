import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ROUTES } from '../utils/constants';

const Login = lazy(() => import('../pages/Login').then((m) => ({ default: m.Login })));
const Signup = lazy(() => import('../pages/Signup').then((m) => ({ default: m.Signup })));
const Browse = lazy(() => import('../pages/Browse').then((m) => ({ default: m.Browse })));
const NotFound = lazy(() => import('../pages/NotFound').then((m) => ({ default: m.NotFound })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-netflix-black">
      <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function HomeRedirect() {
  const { isAuthenticated, isInitialized } = useAuth();
  if (!isInitialized) return <PageLoader />;
  return <Navigate to={isAuthenticated ? ROUTES.BROWSE : ROUTES.LOGIN} replace />;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />
        <Route
          path={ROUTES.BROWSE}
          element={
            <ProtectedRoute>
              <Browse />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<HomeRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
