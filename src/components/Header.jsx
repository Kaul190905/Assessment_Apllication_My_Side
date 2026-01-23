import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header = ({ timeLeft, formatTimeFn, isDark, onThemeToggle, timerPulse, title, instructor, duration }) => {
  return (
    <header className="exam-header">
      <div className="header-left">
        <h1>{title || "GradeFlow Assessment"}</h1>
        <p>Assigned by: {instructor || "Staff"} | Duration: {duration || "60 Minutes"}</p>
      </div>
      <div className="header-right">
        <div className="student-info">
          <img src="https://via.placeholder.com/48" alt="Avatar" className="avatar" />
          <span>Welcome, John Doe</span>
        </div>
        <div className={`timer ${timerPulse ? 'pulse' : ''}`}>
          <span className="time-display">{formatTimeFn(timeLeft)}</span>
        </div>
        <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
      </div>
    </header>
  );
};

export default Header;
