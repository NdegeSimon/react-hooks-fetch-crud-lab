import React from "react";

function QuestionItem({ question, onDelete, onUpdateCorrectAnswer }) {
  const { id, prompt, answers, correctIndex } = question;

  const handleDelete = () => {
    onDelete(id);
  };

  const handleCorrectAnswerChange = (e) => {
    onUpdateCorrectAnswer(id, e.target.value);
  };

  return (
    <li>
      <h4>Question {id}</h4>
      <h5>Prompt: {prompt}</h5>
      <label>
        Correct Answer:
        <select
          value={correctIndex}
          onChange={handleCorrectAnswerChange}
          aria-label="Correct Answer"
        >
          {answers.map((answer, index) => (
            <option key={index} value={index}>
              {answer}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleDelete}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;