import React, { useEffect, lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Components
import NavBar from './components/NavBar';

// Lazy load pages for better code splitting
const Home = lazy(() => import('./pages/Home'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Stores
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';

// Loading fallback component
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <Loader className="size-10 animate-spin" />
  </div>
);

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Show loading spinner while checking authentication
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
      </Suspense>
      <Toaster />
    </div>
  );
};

export default App;