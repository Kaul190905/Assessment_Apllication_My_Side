import React from 'react';

const SubmissionModal = ({ open, onClose, onSubmit, rollInput, setRollInput, error }) => {
  if (!open) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Confirm Submission</h2>
        <p>Please enter your Roll Number to submit the test:</p>
        <input
          type="text"
          value={rollInput}
          onChange={(e) => {
            setRollInput(e.target.value);
            // Clear error when typing
            if (error) setRollInput(e.target.value); // trigger re-render if needed
          }}
          placeholder="e.g. STU2025001"
          autoFocus
        />
        {error && (
          <p style={{ color: 'red', marginTop: '15px' }}>
            Incorrect Roll Number. Try again.
          </p>
        )}
        <div className="modal-buttons">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onSubmit}>Submit Test</button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;