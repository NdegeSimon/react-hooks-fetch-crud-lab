import React, { useState, useEffect } from "react";

const initialFormData = {
  prompt: "",
  answer1: "",
  answer2: "",
  answer3: "",
  answer4: "",
  correctIndex: 0,
};

function QuestionForm({ onAddQuestion, loading = false, error = null }) {
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  // Track component mount state
  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Reset form when there's an error
  useEffect(() => {
    if (error && isMounted) {
      setIsSubmitting(false);
    }
  }, [error, isMounted]);

  const validateForm = () => {
    const errors = {};

    // Validate prompt
    if (!formData.prompt.trim()) {
      errors.prompt = "Question prompt is required";
    } else if (formData.prompt.trim().length < 10) {
      errors.prompt = "Question prompt must be at least 10 characters long";
    }

    // Validate answers
    if (!formData.answer1.trim()) {
      errors.answer1 = "Answer 1 is required";
    }
    if (!formData.answer2.trim()) {
      errors.answer2 = "Answer 2 is required";
    }

    // Check for duplicate answers
    const answers = [
      formData.answer1.trim(),
      formData.answer2.trim(),
      formData.answer3.trim(),
      formData.answer4.trim(),
    ].filter(Boolean);

    const uniqueAnswers = new Set(answers.map(a => a.toLowerCase()));
    if (uniqueAnswers.size !== answers.length) {
      errors.duplicate = "All answers must be unique";
    }

    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onAddQuestion(formData);
      // Reset form on successful submission
      if (isMounted) {
        setFormData(initialFormData);
        setValidationErrors({});
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      if (isMounted) {
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setValidationErrors({});
  };

  const isFormDisabled = loading || isSubmitting;

  return (
    <section className="question-form-section">
      <div className="form-container">
        <header className="form-header">
          <h1>Create New Question</h1>
          <p className="form-description">
            Add a new quiz question with multiple choice answers
          </p>
        </header>

        <form onSubmit={handleSubmit} className="question-form" noValidate>
          <div className="form-group">
            <label htmlFor="prompt" className="form-label">
              Question Prompt *
            </label>
            <textarea
              id="prompt"
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              className={`form-input ${validationErrors.prompt ? "error" : ""}`}
              placeholder="Enter your question here..."
              rows={3}
              disabled={isFormDisabled}
              aria-describedby={validationErrors.prompt ? "prompt-error" : undefined}
            />
            {validationErrors.prompt && (
              <span id="prompt-error" className="error-message" role="alert">
                {validationErrors.prompt}
              </span>
            )}
          </div>

          <div className="answers-grid">
            {[1, 2, 3, 4].map((num) => {
              const fieldName = `answer${num}`;
              const isRequired = num <= 2;
              return (
                <div key={fieldName} className="form-group">
                  <label htmlFor={fieldName} className="form-label">
                    Answer {num} {isRequired && "*"}
                  </label>
                  <input
                    id={fieldName}
                    type="text"
                    name={fieldName}
                    value={formData[fieldName]}
                    onChange={handleChange}
                    className={`form-input ${validationErrors[fieldName] ? "error" : ""}`}
                    placeholder={`Enter answer ${num}${!isRequired ? " (optional)" : ""}`}
                    disabled={isFormDisabled}
                    aria-describedby={validationErrors[fieldName] ? `${fieldName}-error` : undefined}
                  />
                  {validationErrors[fieldName] && (
                    <span id={`${fieldName}-error`} className="error-message" role="alert">
                      {validationErrors[fieldName]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="form-group">
            <label htmlFor="correctIndex" className="form-label">
              Correct Answer *
            </label>
            <select
              id="correctIndex"
              name="correctIndex"
              value={formData.correctIndex}
              onChange={handleChange}
              className="form-select"
              disabled={isFormDisabled}
            >
              <option value="0">Answer 1</option>
              <option value="1">Answer 2</option>
              <option value="2">Answer 3</option>
              <option value="3">Answer 4</option>
            </select>
          </div>

          {validationErrors.duplicate && (
            <div className="error-message global-error" role="alert">
              {validationErrors.duplicate}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={handleReset}
              className="button-secondary"
              disabled={isFormDisabled}
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="button-primary"
              disabled={isFormDisabled}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner" aria-hidden="true"></span>
                  Adding Question...
                </>
              ) : (
                "Add Question"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default QuestionForm;