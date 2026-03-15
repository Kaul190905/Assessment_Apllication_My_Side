import React from 'react';
import ThemeToggle from './ThemeToggle';

import Icons from './Icons';

const Header = ({ 
  timeLeft, 
  formatTimeFn, 
  isDark, 
  onThemeToggle, 
  timerPulse, 
  title, 
  instructor, 
  duration, 
  isExam = false,
  onToggleSidebar,
  isSidebarCollapsed
}) => {
  const [currentDate] = React.useState(new Date());

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };


  return (
    <header className={isExam ? "exam-header" : "app-header"}>
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {!isExam && (
          <button 
            onClick={onToggleSidebar}
            className="sidebar-toggle-btn"
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--text-secondary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
          >
            {isSidebarCollapsed ? <Icons.MenuIcon size={24} /> : <Icons.MenuIcon size={24} />}
          </button>
        )}
        {isExam ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>{title || "GradeFlow Assessment"}</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Assigned by: {instructor || "Staff"} | Duration: {duration || "60 Minutes"}</p>
          </div>
        ) : (
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>{title}</h1>
        )}
      </div>
      <div className="header-right">
        {isExam ? (
          <>
            <div className="student-info" style={{ gap: '12px' }}>
              {(() => {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const identifier = userData.email || userData.id;
                const savedPic = localStorage.getItem(`profilePic_${identifier}`) || userData.profilePic;
                return (
                  <img 
                    src={savedPic || "https://via.placeholder.com/48"} 
                    alt="Avatar" 
                    className="avatar" 
                    style={{ borderRadius: '10px', objectFit: 'cover' }} 
                  />
                );
              })()}
              <span style={{ fontWeight: '500' }}>Welcome, {JSON.parse(localStorage.getItem('userData') || '{}').name || "John Doe"}</span>
            </div>
            <div className={`timer ${timerPulse ? 'pulse' : ''}`} style={{ background: 'var(--danger-light)', padding: '6px 12px', borderRadius: '8px' }}>
              <span className="time-display" style={{ fontSize: '1.1rem' }}>{formatTimeFn(timeLeft)}</span>
            </div>
          </>
        ) : (
          <div className="header-datetime" style={{ alignItems: 'flex-end', gap: '2px', fontFamily: 'Inter' }}>
            <span className="current-date" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{formatDate(currentDate)}</span>
          </div>
        )}
        <div style={{ marginLeft: '8px' }}>
          <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
        </div>
      </div>
    </header>
  );
};

export default Header;
