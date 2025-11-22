import React from 'react';
import './OpenQuestion.css';

const OpenQuestion = ({ value, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="open-question-container">
      <textarea
        className="open-question-textarea"
        value={value}
        onChange={handleChange}
        placeholder="Type your answer here..."
        rows="6"
        maxLength="1000"
      />
      <div className="character-count">
        {value.length} / 1000 characters
      </div>
    </div>
  );
};

export default OpenQuestion;
