import React, { useState, useEffect } from 'react';
import Question from './Question';
import Results from './Results';
import ProgressBar from './ProgressBar';
import './Quiz.css';

const Quiz = ({ quizData, studentUsername, reviewMode = false, existingSubmission = null }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(quizData.timeLimit ? quizData.timeLimit * 60 : null);
  const [timerExpired, setTimerExpired] = useState(false);

  // Save submission to localStorage
  const saveSubmission = (finalAnswers) => {
    const submission = {
      id: Date.now(), // Simple timestamp ID
      quizId: quizData.id,
      quizTitle: quizData.title,
      studentUsername: studentUsername,
      answers: finalAnswers,
      score: score,
      submittedAt: new Date().toISOString(),
      graded: false // Tracks if open-ended questions are graded
    };

    // Get existing submissions
    const stored = localStorage.getItem('quizit_submissions');
    const submissions = stored ? JSON.parse(stored) : [];
    
    // Add new submission
    submissions.push(submission);
    localStorage.setItem('quizit_submissions', JSON.stringify(submissions));
  };

  // Handle time expiration
  const handleTimeExpired = () => {
    // Auto-submit with current answers
    saveSubmission(answers);
    setQuizCompleted(true);
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Countdown timer effect - MUST be at top level
  useEffect(() => {
    if (!quizData.timeLimit || quizCompleted || reviewMode) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerExpired(true);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizCompleted, reviewMode]);

  // If in review mode, show results immediately
  if (reviewMode && existingSubmission) {
    return (
      <Results
        answers={existingSubmission.answers}
        score={existingSubmission.score}
        totalQuestions={quizData.questions.length}
        onRestart={() => {}}
        quizTitle={quizData.title}
        studentUsername={studentUsername}
        quizId={quizData.id}
        reviewMode={true}
      />
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Handle answer submission
  const handleAnswerSubmit = (answer) => {
    const newAnswers = [...answers, {
      questionId: currentQuestion.id,
      questionType: currentQuestion.type,
      question: currentQuestion.question,
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      options: currentQuestion.options
    }];
    
    setAnswers(newAnswers);

    // Calculate score for multiple-choice questions
    if (currentQuestion.type === 'multiple-choice' && answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    // Move to next question or finish quiz
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Save submission to localStorage
      saveSubmission(newAnswers);
      setQuizCompleted(true);
    }
  };

  // Restart quiz
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizCompleted(false);
    setScore(0);
  };

  if (quizCompleted) {
    return (
      <Results
        answers={answers}
        score={score}
        totalQuestions={totalQuestions}
        onRestart={handleRestart}
        quizTitle={quizData.title}
        studentUsername={studentUsername}
        quizId={quizData.id}
      />
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>{quizData.title}</h1>
        <p className="quiz-description">{quizData.description}</p>
        {quizData.timeLimit && timeRemaining !== null && (
          <div className={`timer-display ${timeRemaining <= 60 ? 'timer-warning' : ''}`}>
            <span className="timer-icon">⏱️</span>
            <span className="timer-text">Time Remaining: {formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>

      <ProgressBar 
        current={currentQuestionIndex + 1} 
        total={totalQuestions}
        progress={progress}
      />

      <Question
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        onAnswerSubmit={handleAnswerSubmit}
        disabled={timerExpired}
        isLastQuestion={currentQuestionIndex === totalQuestions - 1}
      />
      
      {timerExpired && (
        <div className="time-expired-notice">
          ⚠️ Time has expired! The quiz will be submitted automatically.
        </div>
      )}
    </div>
  );
};

export default Quiz;
