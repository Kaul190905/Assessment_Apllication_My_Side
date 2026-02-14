import React from 'react';

const OptionItem = ({ index, text, selected, onSelect }) => {
  return (
    <label className={`option-card ${selected ? 'selected' : ''}`}>
      <input
        type="radio"
        name="question-option"
        checked={selected}
        onChange={() => onSelect(index)}
      />
      <span>{String.fromCharCode(65 + index)}. {(text || "").replace(/^\s*[A-Z][.)]\s*/, '')}</span>
    </label>
  );
};

export default OptionItem;