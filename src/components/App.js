import React, { useState, useEffect, useCallback } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

const API_BASE_URL = "http://localhost:4000";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch questions from API
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/questions`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status}`);
      }
      
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Add a new question
  const handleAddQuestion = async (newQuestion) => {
    try {
      setError(null);
      
      // Validate required fields
      if (!newQuestion.prompt || !newQuestion.answer1 || !newQuestion.answer2) {
        throw new Error("Prompt and at least two answers are required");
      }

      const formattedQuestion = {
        prompt: newQuestion.prompt.trim(),
        answers: [
          newQuestion.answer1.trim(),
          newQuestion.answer2.trim(),
          newQuestion.answer3?.trim() || "Default Answer 3",
          newQuestion.answer4?.trim() || "Default Answer 4",
        ],
        correctIndex: parseInt(newQuestion.correctIndex, 10),
      };

      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedQuestion),
      });

      if (!response.ok) {
        throw new Error(`Failed to create question: ${response.status}`);
      }

      const createdQuestion = await response.json();
      setQuestions(prevQuestions => [...prevQuestions, createdQuestion]);
      setPage("List");
    } catch (err) {
      console.error("Error adding question:", err);
      setError(err.message);
    }
  };

  // Delete a question
  const handleDeleteQuestion = async (id) => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete question: ${response.status}`);
      }

      setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== id));
    } catch (err) {
      console.error("Error deleting question:", err);
      setError(err.message);
    }
  };

  // Update correct answer for a question
  const handleUpdateCorrectAnswer = async (id, correctIndex) => {
    try {
      setError(null);
      const newCorrectIndex = parseInt(correctIndex, 10);

      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correctIndex: newCorrectIndex }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update question: ${response.status}`);
      }

      setQuestions(prevQuestions =>
        prevQuestions.map(q =>
          q.id === id ? { ...q, correctIndex: newCorrectIndex } : q
        )
      );
    } catch (err) {
      console.error("Error updating question:", err);
      setError(err.message);
    }
  };

  // Handle page changes
  const handlePageChange = (newPage) => {
    setError(null); // Clear errors when changing pages
    setPage(newPage);
  };

  // Retry function for error states
  const handleRetry = () => {
    setError(null);
    fetchQuestions();
  };

  return (
    <main className="app">
      <AdminNavBar onChangePage={handlePageChange} currentPage={page} />
      
      {error && (
        <div className="error-banner">
          <p>Error: {error}</p>
          <button onClick={handleRetry} className="retry-button">
            Retry
          </button>
        </div>
      )}

      {page === "Form" ? (
        <QuestionForm 
          onAddQuestion={handleAddQuestion} 
          loading={loading}
          error={error}
        />
      ) : (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateCorrectAnswer={handleUpdateCorrectAnswer}
          loading={loading}
          error={error}
          onRetry={handleRetry}
        />
      )}
    </main>
  );
}

export default App;