import React from 'react';

const SummaryLegend = ({ answers, marked, visited, total }) => {
  const answeredCount = answers.filter(a => a !== null).length;
  const markedCount = marked.filter(m => m).length;
  const notAnsweredCount = visited.filter((v, i) => v && answers[i] === null && !marked[i]).length;
  const notVisitedCount = visited.filter(v => !v).length;

  return (
    <>
      <div className="summary">
        <div className="summary-item">
          <span className="dot answered"></span> Answered: {answeredCount}
        </div>
        <div className="summary-item">
          <span className="dot marked"></span> Marked: {markedCount}
        </div>
        <div className="summary-item">
          <span className="dot not-answered"></span> Not Answered: {notAnsweredCount}
        </div>
        <div className="summary-item">
          <span className="dot not-visited"></span> Not Visited: {notVisitedCount}
        </div>
      </div>

      <div className="legend">
        <h4>Legend</h4>
        <div><span className="dot current"></span> Current</div>
        <div><span className="dot answered"></span> Answered</div>
        <div><span className="dot marked"></span> Marked for Review</div>
        <div><span className="dot not-answered"></span> Not Answered</div>
        <div><span className="dot not-visited"></span> Not Visited</div>
      </div>
    </>
  );
};

export default SummaryLegend;