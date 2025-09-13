import React from 'react';
import './MainContent.css';
import { Question } from '../interfaces/Question';

interface MainContentProps {
  question: Question;
  selectedOption: number | undefined;
  onOptionSelect: (optionIndex: number) => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
  question, 
  selectedOption, 
  onOptionSelect 
}) => {
  return (
    <div className="main-content">
      <div className="question-container">
        <p className="question-text">{question.question}</p>
        <div className="options-container">
          {question.options.map((option, index) => (
            <div key={index} className="option-item">
              <label className={`option-label ${selectedOption === index ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={selectedOption === index}
                  onChange={() => onOptionSelect(index)}
                />
                <span>{option}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainContent;