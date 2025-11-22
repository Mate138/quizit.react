import React, { useState, useEffect } from 'react';
import Quiz from './components/Quiz';
import Auth from './components/Auth';
import TeacherDashboard from './components/TeacherDashboard';
import { useAuth } from './contexts/AuthContext';
import './App.css';

function App() {
  const { currentUser, login, signup, logout } = useAuth();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [testCode, setTestCode] = useState('');
  const [reviewMode, setReviewMode] = useState(false);

  // Load quizzes from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('quizit_quizzes');
    if (stored) {
      setQuizzes(JSON.parse(stored));
    }

    const storedSubmissions = localStorage.getItem('quizit_submissions');
    if (storedSubmissions) {
      setSubmissions(JSON.parse(storedSubmissions));
    }
  }, [currentUser]); // Reload when user changes

  const handleLogin = (username, password, role, isLogin) => {
    setError('');
    
    if (isLogin) {
      const result = login(username, password);
      if (!result.success) {
        setError(result.message);
      }
    } else {
      const result = signup(username, password, role);
      if (result.success) {
        // Auto-login after signup
        login(username, password);
      } else {
        setError(result.message);
      }
    }
  };

  const handleQuizSelect = (quizId, isReview = false) => {
    // Check if student has already taken this quiz
    const alreadyTaken = submissions.some(
      sub => sub.quizId === quizId && sub.studentUsername === currentUser.username
    );

    if (isReview) {
      // Review mode - just show the results
      const quiz = quizzes.find(q => q.id === quizId);
      setSelectedQuiz(quiz);
      setReviewMode(true);
      return;
    }

    if (alreadyTaken) {
      const code = prompt('You have already taken this quiz. Enter test code to retake:');
      if (code !== '123') {
        alert('Invalid test code or quiz already completed.');
        return;
      }
    }

    const quiz = quizzes.find(q => q.id === quizId);
    setSelectedQuiz(quiz);
    setReviewMode(false);
  };

  const handleBackToMenu = () => {
    setSelectedQuiz(null);
    setReviewMode(false);
  };

  const handleLogout = () => {
    logout();
    setSelectedQuiz(null);
  };

  // Not logged in - show auth page
  if (!currentUser) {
    return (
      <div className="App">
        <Auth onLogin={handleLogin} />
        {error && (
          <div style={{ 
            position: 'fixed', 
            top: '20px', 
            right: '20px', 
            background: '#fee', 
            color: '#e74c3c',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {error}
          </div>
        )}
      </div>
    );
  }

  // Teacher view
  if (currentUser.role === 'teacher') {
    return (
      <div className="App">
        <TeacherDashboard 
          onLogout={handleLogout} 
          username={currentUser.username}
        />
      </div>
    );
  }

  // Student view - taking quiz or reviewing
  if (selectedQuiz) {
    // Review mode - show results directly
    if (reviewMode) {
      const submission = submissions.find(
        sub => sub.quizId === selectedQuiz.id && sub.studentUsername === currentUser.username
      );
      
      if (submission) {
        return (
          <div className="App">
            <div className="student-header">
              <button className="back-button" onClick={handleBackToMenu}>
                ← Back to Quiz Selection
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
            <Quiz 
              quizData={selectedQuiz} 
              studentUsername={currentUser.username}
              reviewMode={true}
              existingSubmission={submission}
            />
          </div>
        );
      }
    }
    
    // Normal quiz taking mode
    return (
      <div className="App">
        <div className="student-header">
          <button className="back-button" onClick={handleBackToMenu}>
            ← Back to Quiz Selection
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <Quiz quizData={selectedQuiz} studentUsername={currentUser.username} />
      </div>
    );
  }

  // Student view - quiz selection
  return (
    <div className="App">
      <div className="quiz-selection">
        <div className="selection-header">
          <div>
            <h1>Quiz-It! 📝</h1>
            <p className="subtitle">Welcome, {currentUser.username}! Select a quiz to begin.</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        
        {quizzes.length === 0 ? (
          <div className="empty-quiz-state">
            <p>No quizzes available yet. Check back later!</p>
          </div>
        ) : (
          <div className="quiz-list">
            {quizzes.map((quiz) => {
              const submission = submissions.find(
                sub => sub.quizId === quiz.id && sub.studentUsername === currentUser.username
              );
              const hasCompleted = !!submission;
              
              return (
                <div 
                  key={quiz.id} 
                  className={`quiz-card ${hasCompleted ? 'completed' : ''}`}
                >
                  {hasCompleted && <div className="completed-badge">✓ Completed</div>}
                  <h2>{quiz.title}</h2>
                  <p>{quiz.description}</p>
                  <div className="quiz-meta">
                    <span>{quiz.questions.length} questions</span>
                    {quiz.timeLimit && (
                      <span className="time-limit-display">⏱️ {quiz.timeLimit} min</span>
                    )}
                    {hasCompleted && (
                      <span className="quiz-score">Score: {submission.score}/{quiz.questions.length}</span>
                    )}
                  </div>
                  
                  {hasCompleted ? (
                    <div className="quiz-actions">
                      <button 
                        className="review-button"
                        onClick={() => handleQuizSelect(quiz.id, true)}
                      >
                        📋 Review Answers
                      </button>
                      <button 
                        className="retake-button"
                        onClick={() => handleQuizSelect(quiz.id, false)}
                      >
                        🔄 Retake Quiz
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="start-button"
                      onClick={() => handleQuizSelect(quiz.id, false)}
                    >
                      Start Quiz →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
