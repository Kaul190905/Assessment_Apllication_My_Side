import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header = ({ timeLeft, formatTimeFn, isDark, onThemeToggle, timerPulse, title, instructor, duration, isExam = false }) => {
  const [currentDateTime, setCurrentDateTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <header className={isExam ? "exam-header" : "app-header"}>
      <div className="header-left">
        {isExam ? (
          <>
            <h1>{title || "GradeFlow Assessment"}</h1>
            <p>Assigned by: {instructor || "Staff"} | Duration: {duration || "60 Minutes"}</p>
          </>
        ) : (
          <h1>{title}</h1>
        )}
      </div>
      <div className="header-right">
        {isExam ? (
          <>
            <div className="student-info">
              <img src="https://via.placeholder.com/48" alt="Avatar" className="avatar" />
              <span>Welcome, John Doe</span>
            </div>
            <div className={`timer ${timerPulse ? 'pulse' : ''}`}>
              <span className="time-display">{formatTimeFn(timeLeft)}</span>
            </div>
          </>
        ) : (
          <div className="header-datetime">
            <span className="current-date">{formatDate(currentDateTime)}</span>
            <span className="current-time">{formatTime(currentDateTime)}</span>
          </div>
        )}
        <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
      </div>
    </header>
  );
};

export default Header;
