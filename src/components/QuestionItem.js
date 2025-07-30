import React, { useState, useEffect } from "react";

function QuestionItem({ 
  question, 
  questionNumber, 
  onDelete, 
  onUpdateCorrectAnswer,
  showDeleteConfirmation = false
}) {
  const { id, prompt, answers, correctIndex } = question;
  const [localCorrectIndex, setLocalCorrectIndex] = useState(correctIndex);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  // Track component mount state
  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      setLocalCorrectIndex(correctIndex);
    }
  }, [correctIndex, isMounted]);

  const handleDelete = () => {
    if (showDeleteConfirmation) {
      setShowDeleteConfirm(true);
    } else {
      onDelete(id);
    }
  };

  const confirmDelete = () => {
    onDelete(id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleCorrectAnswerChange = async (e) => {
    const newIndex = parseInt(e.target.value, 10);
    if (isMounted) {
      setLocalCorrectIndex(newIndex);
      setIsUpdating(true);
    }
    
    try {
      await onUpdateCorrectAnswer(id, newIndex);
    } catch (error) {
      // Revert on error
      if (isMounted) {
        setLocalCorrectIndex(correctIndex);
      }
      console.error("Failed to update correct answer:", error);
    } finally {
      if (isMounted) {
        setIsUpdating(false);
      }
    }
  };

  const getAnswerStatusIcon = (index) => {
    return index === localCorrectIndex ? "✅" : "⭕";
  };

  return (
    <article className="question-item" aria-labelledby={`question-${id}-title`}>
      <div className="question-header">
        <h3 id={`question-${id}-title`} className="question-title">
          Question {questionNumber}
        </h3>
        <div className="question-actions">
                     <button
             onClick={handleDelete}
             className="button-danger delete-button"
             aria-label={`Delete question ${questionNumber}`}
             type="button"
           >
             <span className="button-icon" aria-hidden="true">🗑️</span>
             Delete Question
           </button>
        </div>
      </div>

      <div className="question-content">
        <div className="question-prompt">
          <h4 className="prompt-label">Prompt:</h4>
          <p className="prompt-text">{prompt}</p>
        </div>

        <div className="answers-section">
          <h4 className="answers-label">Answer Options:</h4>
          <ul className="answers-list" role="list">
            {answers.map((answer, index) => (
              <li 
                key={index} 
                className={`answer-item ${index === localCorrectIndex ? "correct" : ""}`}
                role="listitem"
              >
                <span className="answer-icon" aria-hidden="true">
                  {getAnswerStatusIcon(index)}
                </span>
                <span className="answer-text">{answer}</span>
                {index === localCorrectIndex && (
                  <span className="correct-badge" aria-label="Correct answer">
                    Correct
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="correct-answer-section">
          <label htmlFor={`correct-answer-${id}`} className="correct-answer-label">
            Correct Answer:
            {isUpdating && (
              <span className="updating-indicator" aria-live="polite">
                <span className="loading-spinner small" aria-hidden="true"></span>
                Updating...
              </span>
            )}
          </label>
          <select
            id={`correct-answer-${id}`}
            value={localCorrectIndex}
            onChange={handleCorrectAnswerChange}
            className="correct-answer-select"
            aria-label="Correct Answer"
            disabled={isUpdating}
          >
            {answers.map((answer, index) => (
              <option key={index} value={index}>
                {answer}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && showDeleteConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
          <div className="modal-content">
            <header className="modal-header">
              <h3 id="delete-modal-title">Confirm Delete</h3>
            </header>
            <div className="modal-body">
              <p>Are you sure you want to delete this question?</p>
              <div className="question-preview">
                <strong>"{prompt}"</strong>
              </div>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <footer className="modal-actions">
              <button
                onClick={cancelDelete}
                className="button-secondary"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="button-danger"
                type="button"
                autoFocus
              >
                Delete Question
              </button>
            </footer>
          </div>
        </div>
      )}
    </article>
  );
}

export default QuestionItem;