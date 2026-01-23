import React from 'react';

const QuestionCard = ({ question, totalQuestions }) => {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-no">Question {question.id} of {totalQuestions}</span>
        <span className="marks">Marks: {question.marks || 2}</span>
      </div>
      <h2 className="question-text">{question.text || question.question}</h2>
    </div>
  );
};

export default QuestionCard;