import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((r) => r.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleAddQuestion = (newQuestion) => {
    const formattedQuestion = {
      prompt: newQuestion.prompt,
      answers: [
        newQuestion.answer1,
        newQuestion.answer2,
        newQuestion.answer3 || "Default Answer 3",
        newQuestion.answer4 || "Default Answer 4",
      ],
      correctIndex: parseInt(newQuestion.correctIndex),
    };

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedQuestion),
    })
      .then((r) => r.json())
      .then((newQuestion) => {
        setQuestions([...questions, newQuestion]);
        setPage("List");
      });
  };

  const handleDeleteQuestion = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    }).then(() => {
      setQuestions(questions.filter((q) => q.id !== id));
    });
  };

  const handleUpdateCorrectAnswer = (id, correctIndex) => {
    const newCorrectIndex = parseInt(correctIndex);
    
    // Update state optimistically
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, correctIndex: newCorrectIndex } : q
      )
    );
    
    // Then update the server
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex: newCorrectIndex }),
    }).catch((error) => {
      // If the request fails, revert the optimistic update
      console.error("Failed to update question:", error);
      // You could revert the state here if needed
    });
  };

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onAddQuestion={handleAddQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateCorrectAnswer={handleUpdateCorrectAnswer}
        />
      )}
    </main>
  );
}

export default App;