import React, { useState } from 'react';
import MultipleChoice from './MultipleChoice';
import OpenQuestion from './OpenQuestion';
import './Question.css';

const Question = ({ question, questionNumber, onAnswerSubmit, disabled = false, isLastQuestion = false }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [openAnswer, setOpenAnswer] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (disabled) return;
    
    // Validate answer based on question type
    if (question.type === 'multiple-choice') {
      if (selectedAnswer === null) {
        setError('Please select an answer before continuing.');
        return;
      }
      onAnswerSubmit(selectedAnswer);
    } else if (question.type === 'open-ended') {
      if (openAnswer.trim() === '') {
        setError('Please provide an answer before continuing.');
        return;
      }
      onAnswerSubmit(openAnswer);
    }

    // Reset state for next question
    setSelectedAnswer(null);
    setOpenAnswer('');
    setError('');
  };

  const handleOptionSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    setError('');
  };

  const handleOpenAnswerChange = (value) => {
    setOpenAnswer(value);
    setError('');
  };

  return (
    <div className="question-container">
      <div className="question-header">
        <span className="question-number">Question {questionNumber}</span>
        <span className="question-type-badge">
          {question.type === 'multiple-choice' ? 'Multiple Choice' : 'Open Ended'}
        </span>
      </div>

      <h2 className="question-text">{question.question}</h2>

      {question.type === 'multiple-choice' ? (
        <MultipleChoice
          options={question.options}
          selectedAnswer={selectedAnswer}
          onSelect={handleOptionSelect}
        />
      ) : (
        <OpenQuestion
          value={openAnswer}
          onChange={handleOpenAnswerChange}
        />
      )}

      {error && <p className="error-message">{error}</p>}

      <button 
        className="submit-button"
        onClick={handleSubmit}
        disabled={disabled}
      >
        {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
      </button>
    </div>
  );
};

export default Question;
