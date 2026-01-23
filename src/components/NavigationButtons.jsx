import React from 'react';

const NavigationButtons = ({
  current,
  total,
  onPrev,
  onNext,
  onClear,
  onMark,
  marked,
  onSubmit
}) => {
  const isLastQuestion = current === total - 1;

  return (
    <div className="navigation-buttons">
      <button
        className="btn-prev"
        onClick={onPrev}
        disabled={current === 0}
      >
        Previous
      </button>
      <button className="btn-mark" onClick={onMark}>
        {marked ? 'Unmark' : 'Mark for Review'}
      </button>
      <button className="btn-clear" onClick={onClear}>
        Clear
      </button>
      {isLastQuestion ? (
        <button className="btn-submit-final" onClick={onSubmit}>
          Submit Test
        </button>
      ) : (
        <button className="btn-next" onClick={onNext}>
          Save & Next
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;