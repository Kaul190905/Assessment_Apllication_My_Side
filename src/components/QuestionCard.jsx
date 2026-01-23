import React from 'react';

<<<<<<< HEAD
const QuestionCard = ({ question, totalQuestions }) => {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-no">Question {question.id} of {totalQuestions}</span>
        <span className="marks">Marks: {question.marks || 2}</span>
      </div>
      <h2 className="question-text">{question.text || question.question}</h2>
=======
const QuestionCard = ({ question }) => {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-no">Question {question.id} of 20</span>
        <span className="marks">Marks: {question.marks}</span>
      </div>
      <h2 className="question-text">{question.text}</h2>
>>>>>>> 95a58d0ee9809f0861c234b2ff2a0998125a811a
    </div>
  );
};

export default QuestionCard;