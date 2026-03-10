import React from 'react';
import { SunIcon, MoonIcon } from './Icons';

const ThemeToggle = ({ isDark, onToggle }) => {
    return (
        <button
            className="theme-toggle"
            onClick={onToggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <SunIcon size={20} />
            ) : (
                <MoonIcon size={20} />
            )}
        </button>
    );
};

export default ThemeToggle;

