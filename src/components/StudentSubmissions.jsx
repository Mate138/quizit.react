import React, { useState, useEffect } from 'react';
import './StudentSubmissions.css';

const StudentSubmissions = ({ onBack }) => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [openEndedGrades, setOpenEndedGrades] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    const stored = localStorage.getItem('quizit_submissions');
    if (stored) {
      setSubmissions(JSON.parse(stored));
    }
  };

  const handleGradeOpenEnded = (submissionId, questionId, isCorrect) => {
    const key = `${submissionId}_${questionId}`;
    setOpenEndedGrades({
      ...openEndedGrades,
      [key]: isCorrect
    });
  };

  const handleCommentChange = (submissionId, questionId, comment) => {
    const key = `${submissionId}_${questionId}`;
    setComments({
      ...comments,
      [key]: comment
    });
  };

  const saveGrades = () => {
    if (!selectedSubmission) return;

    const updatedSubmissions = submissions.map(sub => {
      if (sub.id === selectedSubmission.id) {
        // Update grading for open-ended questions
        const gradedAnswers = sub.answers.map(answer => {
          if (answer.questionType === 'open-ended') {
            const key = `${sub.id}_${answer.questionId}`;
            const commentKey = `${sub.id}_${answer.questionId}`;
            return {
              ...answer,
              teacherGrade: openEndedGrades[key],
              teacherComment: comments[commentKey] || answer.teacherComment || '',
              gradedBy: 'teacher'
            };
          }
          return answer;
        });

        // Calculate new score including graded open-ended questions
        let newScore = 0;
        gradedAnswers.forEach(answer => {
          if (answer.questionType === 'multiple-choice') {
            if (answer.userAnswer === answer.correctAnswer) {
              newScore++;
            }
          } else if (answer.questionType === 'open-ended') {
            // Only count if teacher has explicitly graded it as correct
            if (answer.teacherGrade === true) {
              newScore++;
            }
          }
        });

        return {
          ...sub,
          answers: gradedAnswers,
          score: newScore,
          graded: true
        };
      }
      return sub;
    });

    localStorage.setItem('quizit_submissions', JSON.stringify(updatedSubmissions));
    setSubmissions(updatedSubmissions);
    alert('Grades and comments saved successfully!');
    setSelectedSubmission(null);
    setOpenEndedGrades({});
    setComments({});
  };

  if (selectedSubmission) {
    return (
      <div className="submissions-container">
        <div className="submissions-header">
          <h2>Review Submission</h2>
          <button onClick={() => setSelectedSubmission(null)} className="back-btn">
            ← Back to Submissions
          </button>
        </div>

        <div className="submission-info">
          <h3>{selectedSubmission.quizTitle}</h3>
          <p><strong>Student:</strong> {selectedSubmission.studentUsername}</p>
          <p><strong>Submitted:</strong> {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
          <p><strong>Status:</strong> {selectedSubmission.graded ? 'Graded ✓' : 'Pending Review'}</p>
        </div>

        <div className="answers-review-section">
          <h3>Answers Review</h3>
          {selectedSubmission.answers.map((answer, index) => (
            <div key={index} className="answer-review-card">
              <div className="answer-review-header">
                <span className="question-num">Question {index + 1}</span>
                <span className={`type-badge ${answer.questionType}`}>
                  {answer.questionType === 'multiple-choice' ? 'Multiple Choice' : 'Open Ended'}
                </span>
              </div>

              <p className="question-text">{answer.question}</p>

              {answer.questionType === 'multiple-choice' ? (
                <div className="mc-review">
                  <div className="answer-row">
                    <span className="label">Student's answer:</span>
                    <span className={answer.userAnswer === answer.correctAnswer ? 'correct-ans' : 'incorrect-ans'}>
                      {answer.options[answer.userAnswer]}
                      {answer.userAnswer === answer.correctAnswer ? ' ✓' : ' ✗'}
                    </span>
                  </div>
                  {answer.userAnswer !== answer.correctAnswer && (
                    <div className="answer-row">
                      <span className="label">Correct answer:</span>
                      <span className="correct-ans">{answer.options[answer.correctAnswer]}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="open-review">
                  <div className="student-answer-box">
                    <strong>Student's Answer:</strong>
                    <p>{answer.userAnswer}</p>
                  </div>
                  
                  <div className="grading-section">
                    <strong>Grade this answer:</strong>
                    <div className="grade-buttons">
                      <button
                        className={`grade-btn correct ${openEndedGrades[`${selectedSubmission.id}_${answer.questionId}`] === true ? 'active' : ''}`}
                        onClick={() => handleGradeOpenEnded(selectedSubmission.id, answer.questionId, true)}
                      >
                        ✓ Correct
                      </button>
                      <button
                        className={`grade-btn incorrect ${openEndedGrades[`${selectedSubmission.id}_${answer.questionId}`] === false ? 'active' : ''}`}
                        onClick={() => handleGradeOpenEnded(selectedSubmission.id, answer.questionId, false)}
                      >
                        ✗ Incorrect
                      </button>
                    </div>
                    {answer.teacherGrade !== undefined && (
                      <p className="previous-grade">
                        Previously graded: <strong>{answer.teacherGrade ? 'Correct ✓' : 'Incorrect ✗'}</strong>
                      </p>
                    )}
                    
                    <div className="comment-section">
                      <strong>Teacher's Comment:</strong>
                      <textarea
                        className="teacher-comment-input"
                        placeholder="Leave a comment for the student..."
                        value={comments[`${selectedSubmission.id}_${answer.questionId}`] || ''}
                        onChange={(e) => handleCommentChange(selectedSubmission.id, answer.questionId, e.target.value)}
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={saveGrades} className="save-grades-btn">
          Save All Grades
        </button>
      </div>
    );
  }

  return (
    <div className="submissions-container">
      <div className="submissions-header">
        <h2>Student Submissions</h2>
        <button onClick={onBack} className="back-btn">← Back to Dashboard</button>
      </div>

      {submissions.length === 0 ? (
        <div className="empty-submissions">
          <p>No student submissions yet.</p>
        </div>
      ) : (
        <div className="submissions-list">
          {submissions.map((submission) => (
            <div key={submission.id} className="submission-card">
              <div className="submission-card-header">
                <h3>{submission.quizTitle}</h3>
                <span className={`status-badge ${submission.graded ? 'graded' : 'pending'}`}>
                  {submission.graded ? 'Graded' : 'Pending'}
                </span>
              </div>
              <div className="submission-details">
                <p><strong>Student:</strong> {submission.studentUsername}</p>
                <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleDateString()}</p>
                <p><strong>Score:</strong> {submission.score} / {submission.answers.length}</p>
              </div>
              <button 
                onClick={() => {
                  setSelectedSubmission(submission);
                  // Pre-fill existing grades
                  const grades = {};
                  const existingComments = {};
                  submission.answers.forEach(answer => {
                    if (answer.questionType === 'open-ended' && answer.teacherGrade !== undefined) {
                      grades[`${submission.id}_${answer.questionId}`] = answer.teacherGrade;
                    }
                    if (answer.teacherComment) {
                      existingComments[`${submission.id}_${answer.questionId}`] = answer.teacherComment;
                    }
                  });
                  setOpenEndedGrades(grades);
                  setComments(existingComments);
                }}
                className="review-btn"
              >
                Review & Grade
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSubmissions;
