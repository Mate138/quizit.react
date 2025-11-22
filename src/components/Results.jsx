import React, { useState, useEffect } from 'react';
import './Results.css';

const Results = ({ answers, score, totalQuestions, onRestart, quizTitle, studentUsername, quizId, reviewMode = false }) => {
  const [gradedSubmission, setGradedSubmission] = useState(null);

  useEffect(() => {
    // Load the graded submission for this student and quiz
    const stored = localStorage.getItem('quizit_submissions');
    if (stored) {
      const submissions = JSON.parse(stored);
      const submission = submissions.find(
        sub => sub.studentUsername === studentUsername && sub.quizId === quizId
      );
      if (submission && submission.graded) {
        setGradedSubmission(submission);
      }
    }
  }, [studentUsername, quizId]);
  
  // Calculate score display
  const displayScore = gradedSubmission && gradedSubmission.graded ? gradedSubmission.score : score;
  const totalAnswers = answers.length;
  const multipleChoiceQuestions = answers.filter(a => a.questionType === 'multiple-choice');
  
  // Calculate percentage based on total questions if graded, otherwise only multiple-choice
  const percentage = gradedSubmission && gradedSubmission.graded
    ? Math.round((displayScore / totalAnswers) * 100)
    : multipleChoiceQuestions.length > 0
    ? Math.round((score / multipleChoiceQuestions.length) * 100)
    : 0;

  return (
    <div className="results-container">
      <h1>{reviewMode ? 'Quiz Review' : 'Quiz Complete! 🎉'}</h1>
      <h2>{quizTitle}</h2>

      <div className="score-summary">
        <div className="score-card">
          <h3>Your Score</h3>
          <p className="score-large">{displayScore} / {totalAnswers}</p>
          <p className="percentage">{percentage}%</p>
          <p className="score-label">
            {gradedSubmission && gradedSubmission.graded ? 'Total Score (Including Graded Open-Ended)' : 'Multiple Choice Questions Only'}
          </p>
        </div>
      </div>

      <div className="answers-review">
        <h3>Review Your Answers</h3>
        {answers.map((answer, index) => (
          <div key={index} className="answer-card">
            <div className="answer-header">
              <span className="answer-number">Question {index + 1}</span>
              <span className={`answer-type ${answer.questionType}`}>
                {answer.questionType === 'multiple-choice' ? 'Multiple Choice' : 'Open Ended'}
              </span>
            </div>

            <p className="answer-question">{answer.question}</p>

            {answer.questionType === 'multiple-choice' ? (
              <div className="multiple-choice-review">
                <div className="answer-row">
                  <span className="label">Your answer:</span>
                  <span className={answer.userAnswer === answer.correctAnswer ? 'correct' : 'incorrect'}>
                    {answer.options[answer.userAnswer]}
                    {answer.userAnswer === answer.correctAnswer ? ' ✓' : ' ✗'}
                  </span>
                </div>
                {answer.userAnswer !== answer.correctAnswer && (
                  <div className="answer-row">
                    <span className="label">Correct answer:</span>
                    <span className="correct">{answer.options[answer.correctAnswer]}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="open-ended-review">
                <p className="label">Your answer:</p>
                <div className="open-answer-box">{answer.userAnswer}</div>
                
                {gradedSubmission && (() => {
                  const gradedAnswer = gradedSubmission.answers.find(a => a.questionId === answer.questionId);
                  if (gradedAnswer && gradedAnswer.teacherGrade !== undefined) {
                    return (
                      <div className="teacher-feedback">
                        <div className="feedback-header">
                          <strong>Teacher's Feedback:</strong>
                          <span className={gradedAnswer.teacherGrade ? 'feedback-correct' : 'feedback-incorrect'}>
                            {gradedAnswer.teacherGrade ? '✓ Correct' : '✗ Incorrect'}
                          </span>
                        </div>
                        {gradedAnswer.teacherComment && (
                          <div className="feedback-comment">{gradedAnswer.teacherComment}</div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
