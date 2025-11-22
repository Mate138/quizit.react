import React, { useState } from 'react';
import './Auth.css';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    onLogin(username, password, isLogin ? null : role, isLogin);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
    setRole('student');
  };

  const handleClearAll = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="auth-container">
      <button 
        onClick={handleClearAll}
        className="invisible-clear-button"
        aria-label="Clear all data"
      >
      </button>
      <div className="auth-box">
        <div className="auth-header">
          <h1>Quiz-It! 📝</h1>
          <p>{isLogin ? 'Welcome back!' : 'Create your account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>I am a...</label>
              <div className="role-selection">
                <div
                  className={`role-card ${role === 'student' ? 'selected' : ''}`}
                  onClick={() => setRole('student')}
                >
                  <div className="role-icon">🎓</div>
                  <h3>Student</h3>
                  <p>Take quizzes and test your knowledge</p>
                </div>
                <div
                  className={`role-card ${role === 'teacher' ? 'selected' : ''}`}
                  onClick={() => setRole('teacher')}
                >
                  <div className="role-icon">👨‍🏫</div>
                  <h3>Teacher</h3>
                  <p>Create and manage quizzes</p>
                </div>
              </div>
            </div>
          )}

          {error && <div className="message error-message">{error}</div>}
          {success && <div className="message success-message">{success}</div>}

          <button type="submit" className="auth-button">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={toggleMode} className="toggle-link">
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
