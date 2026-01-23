import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Theme Context
const ThemeContext = createContext(null);

// Accent color presets
const ACCENT_COLORS = {
    lavender: {
        name: 'Lavender',
        primary: '#9b7fd1',
        primaryLight: '#c4b5e0',
        primaryDark: '#7c5fb8'
    },
    blue: {
        name: 'Ocean Blue',
        primary: '#3b82f6',
        primaryLight: '#93c5fd',
        primaryDark: '#1d4ed8'
    }
};

// Theme Provider Component
export const ThemeProvider = ({ children, onThemeChange }) => {
    // Initialize theme from localStorage or system preference
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';

        // Check system preference
        if (window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    // Initialize accent color
    const [accentColor, setAccentColor] = useState(() => {
        return localStorage.getItem('accentColor') || 'lavender';
    });

    // Initialize glassmorphism setting
    const [glassmorphism, setGlassmorphism] = useState(() => {
        return localStorage.getItem('glassmorphism') === 'true';
    });

    // Initialize sound setting
    const [soundEnabled, setSoundEnabled] = useState(() => {
        return localStorage.getItem('soundEnabled') !== 'false';
    });

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        if (onThemeChange) {
            onThemeChange(isDark);
        }
    }, [isDark, onThemeChange]);

    // Apply accent color
    useEffect(() => {
        const colors = ACCENT_COLORS[accentColor];
        if (colors) {
            document.documentElement.style.setProperty('--primary', colors.primary);
            document.documentElement.style.setProperty('--primary-light', colors.primaryLight);
            document.documentElement.style.setProperty('--primary-dark', colors.primaryDark);
            document.documentElement.style.setProperty('--btn-primary', colors.primary);
            localStorage.setItem('accentColor', accentColor);
        }
    }, [accentColor]);

    // Apply glassmorphism
    useEffect(() => {
        document.documentElement.setAttribute('data-glass', glassmorphism ? 'true' : 'false');
        localStorage.setItem('glassmorphism', glassmorphism.toString());
    }, [glassmorphism]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            // Only auto-switch if user hasn't manually set a preference
            const saved = localStorage.getItem('themeManual');
            if (!saved) {
                setIsDark(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Toggle theme
    const toggleTheme = useCallback(() => {
        setIsDark(prev => !prev);
        localStorage.setItem('themeManual', 'true');
    }, []);

    // Toggle sound
    const toggleSound = useCallback(() => {
        setSoundEnabled(prev => {
            const newValue = !prev;
            localStorage.setItem('soundEnabled', newValue.toString());
            return newValue;
        });
    }, []);

    // Toggle glassmorphism
    const toggleGlass = useCallback(() => {
        setGlassmorphism(prev => !prev);
    }, []);

    const value = {
        isDark,
        toggleTheme,
        accentColor,
        setAccentColor,
        accentColors: ACCENT_COLORS,
        glassmorphism,
        toggleGlass,
        soundEnabled,
        toggleSound
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use theme
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeProvider;
