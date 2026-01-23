import React from 'react';

const SubmitButton = ({ onClick, disabled, small }) => {
  return (
    <button
      className={`btn-submit ${small ? 'btn-submit-small' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? 'Submitted' : 'Submit Test'}
    </button>
  );
};

export default SubmitButton;