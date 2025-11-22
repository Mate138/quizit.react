import React, { useState, useEffect } from 'react';
import StudentSubmissions from './StudentSubmissions';
import './TeacherDashboard.css';

const TeacherDashboard = ({ onLogout, username }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    questions: [],
    timeLimit: 30
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    sampleAnswer: ''
  });

  // Load quizzes from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('quizit_quizzes');
    if (stored) {
      setQuizzes(JSON.parse(stored));
    }
  }, []);

  // Save quizzes to localStorage
  const saveQuizzes = (updatedQuizzes) => {
    localStorage.setItem('quizit_quizzes', JSON.stringify(updatedQuizzes));
    setQuizzes(updatedQuizzes);
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert('Please enter a question');
      return;
    }

    if (currentQuestion.type === 'multiple-choice') {
      const validOptions = currentQuestion.options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        alert('Please provide at least 2 options');
        return;
      }
    }

    const questionToAdd = {
      id: newQuiz.questions.length,
      ...currentQuestion
    };

    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, questionToAdd]
    });

    // Reset current question
    setCurrentQuestion({
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      sampleAnswer: ''
    });
  };

  const removeQuestion = (index) => {
    const updated = newQuiz.questions.filter((_, i) => i !== index);
    setNewQuiz({ ...newQuiz, questions: updated });
  };

  const saveQuiz = () => {
    if (!newQuiz.title.trim()) {
      alert('Please enter a quiz title');
      return;
    }

    if (newQuiz.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    const quizToSave = {
      id: quizzes.length,
      ...newQuiz,
      createdBy: username,
      createdAt: new Date().toISOString()
    };

    saveQuizzes([...quizzes, quizToSave]);
    
    // Reset form
    setNewQuiz({ title: '', description: '', questions: [], timeLimit: 30 });
    setShowCreateForm(false);
    alert('Quiz created successfully!');
  };

  const deleteQuiz = (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      const updated = quizzes.filter(q => q.id !== quizId);
      saveQuizzes(updated);
    }
  };

  // Show submissions view
  if (showSubmissions) {
    return <StudentSubmissions onBack={() => setShowSubmissions(false)} />;
  }

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Teacher Dashboard</h1>
          <p>Welcome, {username}! 👨‍🏫</p>
        </div>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>

      <div className="dashboard-actions">
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)} 
          className="create-quiz-button"
        >
          {showCreateForm ? '← Back to Quizzes' : '+ Create New Quiz'}
        </button>
        <button 
          onClick={() => setShowSubmissions(true)} 
          className="submissions-button"
        >
          📋 View Student Submissions
        </button>
      </div>

      {showCreateForm ? (
        <div className="quiz-creator">
          <div className="creator-section">
            <h2>Quiz Information</h2>
            <input
              type="text"
              placeholder="Quiz Title"
              value={newQuiz.title}
              onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
              className="quiz-input"
            />
            <textarea
              placeholder="Quiz Description"
              value={newQuiz.description}
              onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
              className="quiz-textarea"
              rows="3"
            />
            <div className="time-limit-section">
              <label htmlFor="timeLimit"><strong>Time Limit (minutes):</strong></label>
              <input
                id="timeLimit"
                type="number"
                min="1"
                max="180"
                placeholder="Time in minutes"
                value={newQuiz.timeLimit}
                onChange={(e) => setNewQuiz({ ...newQuiz, timeLimit: parseInt(e.target.value) || 30 })}
                className="time-limit-input"
              />
            </div>
          </div>

          <div className="creator-section">
            <h2>Add Question</h2>
            <div className="question-type-selector">
              <label>
                <input
                  type="radio"
                  value="multiple-choice"
                  checked={currentQuestion.type === 'multiple-choice'}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value })}
                />
                Multiple Choice
              </label>
              <label>
                <input
                  type="radio"
                  value="open-ended"
                  checked={currentQuestion.type === 'open-ended'}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value })}
                />
                Open Ended
              </label>
            </div>

            <textarea
              placeholder="Enter your question"
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
              className="quiz-textarea"
              rows="2"
            />

            {currentQuestion.type === 'multiple-choice' ? (
              <div className="options-container">
                <p className="label">Options:</p>
                {currentQuestion.options.map((option, idx) => (
                  <div key={idx} className="option-input-group">
                    <input
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...currentQuestion.options];
                        newOptions[idx] = e.target.value;
                        setCurrentQuestion({ ...currentQuestion, options: newOptions });
                      }}
                      className="option-input"
                    />
                    <label className="correct-label">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === idx}
                        onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: idx })}
                      />
                      Correct
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <textarea
                placeholder="Sample answer (optional - for reference)"
                value={currentQuestion.sampleAnswer}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, sampleAnswer: e.target.value })}
                className="quiz-textarea"
                rows="2"
              />
            )}

            <button onClick={addQuestion} className="add-question-button">
              Add Question to Quiz
            </button>
          </div>

          {newQuiz.questions.length > 0 && (
            <div className="creator-section">
              <h2>Questions in Quiz ({newQuiz.questions.length})</h2>
              <div className="questions-list">
                {newQuiz.questions.map((q, idx) => (
                  <div key={idx} className="question-preview">
                    <div className="question-preview-header">
                      <span className="question-number">Q{idx + 1}</span>
                      <span className="question-type-badge">{q.type}</span>
                      <button onClick={() => removeQuestion(idx)} className="remove-button">×</button>
                    </div>
                    <p className="question-text">{q.question}</p>
                    {q.type === 'multiple-choice' && (
                      <ul className="options-preview">
                        {q.options.map((opt, i) => (
                          opt && <li key={i} className={i === q.correctAnswer ? 'correct-option' : ''}>{opt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={saveQuiz} className="save-quiz-button">
                Save Quiz
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="quizzes-list">
          <h2>Your Quizzes ({quizzes.length})</h2>
          {quizzes.length === 0 ? (
            <div className="empty-state">
              <p>No quizzes yet. Create your first quiz!</p>
            </div>
          ) : (
            <div className="quiz-grid">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="quiz-item">
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  <div className="quiz-item-meta">
                    <span>{quiz.questions.length} questions</span>
                    <button onClick={() => deleteQuiz(quiz.id)} className="delete-button">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
