import { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../utils/constants';
import { Clock } from './Clock';

const NAV_LINKS = [
  { to: ROUTES.BROWSE, label: 'Home' },
  { to: ROUTES.BROWSE, label: 'Browse' },
  { to: ROUTES.MY_LIST, label: 'My List' },
];

export function Navbar({ onSearchSubmit, searchValue, onSearchChange, isBrowse }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = useCallback(() => {
    setMobileMenuOpen(false);
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [logout, navigate]);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClickOutside = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && setMobileMenuOpen(false);
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 bg-gradient-to-b from-black/80 to-transparent transition-all duration-300 dark:from-black/80 light:from-gray-900/95"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-4 md:gap-8">
        {/* Hamburger - visible only on mobile */}
        <button
          ref={hamburgerRef}
          type="button"
          className="md:hidden p-2 text-white rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-netflix-red transition"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {mobileMenuOpen ? (
              <path fillRule="evenodd" d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 011.414 1.414l-4.828 4.829 4.828 4.828z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" clipRule="evenodd" />
            )}
          </svg>
        </button>

        <Link to={ROUTES.BROWSE} className="text-2xl md:text-3xl font-bold text-netflix-red shrink-0">
          Netflix
        </Link>

        {/* Desktop nav links - hidden on small screens */}
        {isBrowse && (
          <div className="hidden md:flex items-center gap-4" role="menubar">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                className={`text-sm transition px-2 py-1 rounded ${
                  isActive(to) ? 'text-white font-semibold bg-white/10' : 'text-gray-300 hover:text-white'
                }`}
                role="menuitem"
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Search - debounced by parent */}
      {isBrowse && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (onSearchSubmit) onSearchSubmit(searchValue);
          }}
          className={`flex items-center transition-all duration-300 ${searchFocused ? 'flex-1 max-w-xl mx-4' : ''}`}
        >
          <div className="relative">
            <input
              type="search"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search movies..."
              className="w-32 md:w-48 lg:w-64 py-1.5 pl-3 pr-8 rounded bg-black/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-netflix-red transition dark:bg-black/50 light:bg-white/20 light:border-gray-500"
              aria-label="Search movies"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white" aria-label="Search">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      )}

      {/* Right: Clock, Profile dropdown (desktop), Avatar + dropdown */}
      <div className="flex items-center gap-2 md:gap-4">
        {isBrowse && (
          <div className="hidden sm:block">
            <Clock />
          </div>
        )}
        {user && (
          <>
            {/* Desktop: Headless UI dropdown */}
            <div className="hidden md:block">
              <Menu as="div" className="relative">
                <MenuButton
                  className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-netflix-red focus:ring-offset-2 focus:ring-offset-transparent"
                  aria-label="Profile menu"
                >
                  <span
                    className="w-8 h-8 rounded-full bg-netflix-red flex items-center justify-center text-white font-semibold text-sm"
                    aria-hidden="true"
                  >
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </MenuButton>
                <MenuItems
                  anchor="bottom end"
                  className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-gray-900 border border-gray-700 shadow-xl focus:outline-none py-1 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white truncate">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        type="button"
                        onClick={toggleTheme}
                        className={`block w-full text-left px-4 py-2 text-sm ${focus ? 'bg-gray-800' : ''} text-gray-200`}
                      >
                        {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 text-sm text-red-400 ${focus ? 'bg-gray-800' : ''}`}
                      >
                        Logout
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
            {/* Mobile: show avatar only (menu in sidebar) */}
            <div className="md:hidden flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-full bg-netflix-red flex items-center justify-center text-white font-semibold text-sm"
                aria-hidden="true"
              >
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Slide-in mobile menu (CSS transitions, no framer-motion) */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-200 opacity-100"
            aria-hidden="true"
            onClick={closeMobileMenu}
          />
          <aside
            ref={sidebarRef}
            id="mobile-menu"
            className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-gray-900 border-r border-gray-800 z-50 shadow-xl md:hidden flex flex-col transition-transform duration-300 ease-out translate-x-0"
            role="dialog"
            aria-label="Mobile menu"
          >
            <div className="p-4 border-b border-gray-800">
              <span className="text-xl font-bold text-netflix-red">Netflix</span>
            </div>
            <nav className="flex-1 p-4" role="navigation" aria-label="Mobile navigation">
              <ul className="space-y-1">
                {NAV_LINKS.map(({ to, label }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      onClick={closeMobileMenu}
                      className={`block px-4 py-3 rounded transition ${
                        isActive(to) ? 'bg-white/10 text-white font-medium' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                      tabIndex={0}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => toggleTheme()}
                  className="block w-full text-left px-4 py-3 rounded text-gray-300 hover:bg-white/5 hover:text-white transition"
                  tabIndex={0}
                >
                  {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 rounded text-red-400 hover:bg-white/5 transition"
                  tabIndex={0}
                >
                  Logout
                </button>
              </div>
            </nav>
          </aside>
        </>
      )}
    </nav>
  );
}
