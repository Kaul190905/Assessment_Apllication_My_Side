import React from 'react';

const ProgressBar = ({ answers, total }) => {
  const answeredCount = answers.filter(a => a !== null).length;
  const progressPercent = (answeredCount / total) * 100;

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <span className="progress-text">
        {answeredCount} / {total} Questions Answered
      </span>
    </div>
  );
};

export default ProgressBar;