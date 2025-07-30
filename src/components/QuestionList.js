import React from "react";
import QuestionItem from "./QuestionItem";

function QuestionList({ 
  questions = [], 
  onDeleteQuestion, 
  onUpdateCorrectAnswer, 
  loading = false, 
  error = null, 
  onRetry 
}) {
  const renderContent = () => {
    // Loading state
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner large" aria-hidden="true"></div>
          <p className="loading-text">Loading questions...</p>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="error-container">
          <div className="error-icon" aria-hidden="true">⚠️</div>
          <h3>Unable to load questions</h3>
          <p className="error-text">{error}</p>
          {onRetry && (
            <button onClick={onRetry} className="button-primary retry-button">
              Try Again
            </button>
          )}
        </div>
      );
    }

    // Empty state
    if (questions.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">📝</div>
          <h3>No questions yet</h3>
          <p className="empty-text">
            Get started by creating your first quiz question!
          </p>
        </div>
      );
    }

    // Questions list
    return (
      <div className="questions-grid">
        {questions.map((question, index) => (
          <QuestionItem
            key={question.id}
            question={question}
            questionNumber={index + 1}
            onDelete={onDeleteQuestion}
            onUpdateCorrectAnswer={onUpdateCorrectAnswer}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="question-list-section">
      <div className="list-container">
        <header className="list-header">
          <div className="header-content">
            <h1>Quiz Questions</h1>
            {!loading && !error && questions.length > 0 && (
              <div className="questions-count">
                <span className="count-badge">
                  {questions.length} question{questions.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
          {!loading && !error && questions.length > 0 && (
            <p className="list-description">
              Manage your quiz questions below. You can edit the correct answer or delete questions as needed.
            </p>
          )}
        </header>

        <div className="list-content" role="main">
          {renderContent()}
        </div>
      </div>
    </section>
  );
}

export default QuestionList;