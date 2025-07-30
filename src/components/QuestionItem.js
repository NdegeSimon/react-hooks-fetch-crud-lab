import React, { useState, useEffect } from "react";

function QuestionItem({ question, onDelete, onUpdateCorrectAnswer }) {
  const { id, prompt, answers, correctIndex } = question;
  const [localCorrectIndex, setLocalCorrectIndex] = useState(correctIndex);

  useEffect(() => {
    setLocalCorrectIndex(correctIndex);
  }, [correctIndex]);

  const handleDelete = () => {
    onDelete(id);
  };

  const handleCorrectAnswerChange = (e) => {
    const newIndex = e.target.value;
    setLocalCorrectIndex(newIndex);
    onUpdateCorrectAnswer(id, newIndex);
  };

  return (
    <li>
      <h4>Question {id}</h4>
      <h5>Prompt: {prompt}</h5>
      <label>
        Correct Answer:
        <select
          value={localCorrectIndex}
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