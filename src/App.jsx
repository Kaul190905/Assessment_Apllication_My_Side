import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TestPage from './pages/TestPage';
import Profile from './pages/Profile';
import RulesPage from './pages/RulesPage';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './components/ThemeProvider';
<<<<<<< HEAD
// Assessments now fetched from backend via Dashboard component
=======
import { assessments } from './data/assessments';
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
import './styles/global.css';

function App() {
  // Theme state with localStorage persistence
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    // Check system preference
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Auth state with localStorage persistence
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [userType, setUserType] = useState(() => {
    return localStorage.getItem('userType') || null;
  });

  // Current test being taken
  const [currentTest, setCurrentTest] = useState(null);

  // Track if test rules were confirmed
  const [testConfirmed, setTestConfirmed] = useState(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const manual = localStorage.getItem('themeManual');
      if (!manual) {
        setIsDarkTheme(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleThemeToggle = () => {
    setIsDarkTheme(prev => !prev);
    localStorage.setItem('themeManual', 'true');
  };

  const handleLogin = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userType', type);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
<<<<<<< HEAD
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
=======
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
  };

  // Start a test - navigate to rules page first
  const handleStartTest = (test) => {
    setCurrentTest(test);
    setTestConfirmed(false);
  };

  // Confirm test start after rules
  const handleConfirmStart = () => {
    setTestConfirmed(true);
  };

  return (
    <ToastProvider>
      <ThemeProvider onThemeChange={setIsDarkTheme}>
        <Router>
          <div className="exam-container">
            <Routes>
              {/* Login Route */}
              <Route
                path="/login"
                element={
                  isLoggedIn ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Login
                      isDark={isDarkTheme}
                      onThemeToggle={handleThemeToggle}
                      onLogin={handleLogin}
                    />
                  )
                }
              />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Dashboard
                      isDark={isDarkTheme}
                      onThemeToggle={handleThemeToggle}
                      userType={userType}
                      onLogout={handleLogout}
<<<<<<< HEAD
=======
                      assessments={assessments}
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
                      onStartTest={handleStartTest}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/rules"
                element={
                  isLoggedIn && currentTest ? (
                    <RulesPage
                      isDark={isDarkTheme}
                      onThemeToggle={handleThemeToggle}
                      currentTest={currentTest}
                      onConfirmStart={handleConfirmStart}
                    />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/test"
                element={
                  isLoggedIn && testConfirmed ? (
                    <TestPage
                      isDark={isDarkTheme}
                      onThemeToggle={handleThemeToggle}
                      currentTest={currentTest}
                    />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/profile"
                element={
                  isLoggedIn ? (
                    <Profile
                      isDark={isDarkTheme}
                      onThemeToggle={handleThemeToggle}
                      userType={userType}
                      onLogout={handleLogout}
<<<<<<< HEAD
=======
                      assessments={assessments}
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;