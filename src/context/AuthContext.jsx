import { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

function getStoredUsers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && parsed.email) setUser(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    setIsInitialized(true);
  }, []);

  const login = useCallback((email, password) => {
    const users = getStoredUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return false;
    const currentUser = {
      email: found.email,
      name: found.name,
      mobile: found.mobile,
    };
    setUser(currentUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    return true;
  }, []);

  const signup = useCallback((name, email, mobile, password) => {
    const users = getStoredUsers();
    if (users.some((u) => u.email === email)) return false;
    users.push({ name, email, mobile: mobile || null, password });
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
    const currentUser = { name, email, mobile: mobile || null };
    setUser(currentUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isInitialized,
      login,
      signup,
      logout,
    }),
    [user, isInitialized, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
