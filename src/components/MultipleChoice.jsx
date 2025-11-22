import React from 'react';
import './MultipleChoice.css';

const MultipleChoice = ({ options, selectedAnswer, onSelect }) => {
  return (
    <div className="multiple-choice-container">
      {options.map((option, index) => (
        <div
          key={index}
          className={`option ${selectedAnswer === index ? 'selected' : ''}`}
          onClick={() => onSelect(index)}
        >
          <div className="option-radio">
            {selectedAnswer === index && <div className="option-radio-selected"></div>}
          </div>
          <span className="option-text">{option}</span>
        </div>
      ))}
    </div>
  );
};

export default MultipleChoice;
