import React from 'react';

const QuestionPalette = ({ total, current, answers, marked, visited, onJump }) => {
  const getStatusClass = (idx) => {
    if (idx === current) return 'current';
    if (marked[idx]) return 'marked';
    if (answers[idx] !== null) return 'answered';
    if (visited[idx]) return 'not-answered';
    return 'not-visited';
  };

  return (
    <div className="palette-grid">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`palette-btn ${getStatusClass(i)}`}
          onClick={() => onJump(i)}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

export default QuestionPalette;