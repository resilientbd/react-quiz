import React, { useState, useEffect } from 'react';
import questionsData from '../data/questions.json';
import { Question } from '../interfaces/Question';
import './QuizScreen.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const QuizScreen: React.FC = () => {
  const [questions] = useState<Question[]>(questionsData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{[key: number]: number}>({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  const currentQuestion = questions[currentQuestionIndex];

  // Calculate progress based on answered questions
  const calculateProgress = () => {
    const answeredCount = Object.keys(selectedOptions).length;
    const totalQuestions = questions.length;
    return totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  };

  const progress = calculateProgress();

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const handleQuestionChange = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer color based on remaining time
  const getTimerColorClass = (seconds: number) => {
    if (seconds < 300) return 'critical'; // < 5 minutes
    if (seconds < 600) return 'warning'; // < 10 minutes
    return ''; // Normal
  };

  return (
    <div className="quiz-container">
      {/* First Top Bar */}
      <div className="first-top-bar">
        <div className="first-top-bar-content">
          {/* Info Section */}
          <div className="question-section-indicator">
            <span className="question-section">{currentQuestion.id}</span>
            <span className="section-indicator">১</span>
          </div>
          
          {/* Timer Section */}
          <div className="timer-section">
            <AccessTimeIcon className="clock-icon" />
            <div className="timer-text-container">
              <div className="timer-label">বিভাগের সময় অবশিষ্ট রয়েছে</div>
              <div className={`timer-value ${getTimerColorClass(timeLeft)}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
          
          {/* Progress Section */}
          <div className="progress-section">
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="progress-text">অগ্রগতি {progress}%</div>
          </div>
          
          {/* Button Section */}
          <button 
            className="finish-button"
            onClick={() => alert("পরীক্ষা সমাপ্ত হয়েছে!")}
          >
            পরীক্ষা সমাপ্ত করুন
          </button>
        </div>
      </div>

      {/* Sub-Top Bar */}
      <div className="sub-top-bar">
        <div className="sub-left-section">
          <div className="exam-title">পরীক্ষা:</div>
          <div className="exam-subtitle">লোডার এবং আনলোডার ওয়ার্কার - বাংলা</div>
        </div>
        <div className="sub-right-section">
          <div className="student-info-label">পরীক্ষার্থী:</div>
          <div className="student-name">Hasan Al Mamun</div>
        </div>
      </div>

      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`sidebar-button ${currentQuestionIndex === index ? 'active' : ''}`}
              onClick={() => handleQuestionChange(index)}
            >
              {currentQuestionIndex === index ? '▶ ' : ''}{index + 1}
            </button>
          ))}
        </div>

        {/* Main Question Area */}
        <div className="question-area">
          <div className="question-header">
            <span className="question-number">প্রশ্ন: {currentQuestion.id}</span>
          </div>
          <div className="question-text">{currentQuestion.question}</div>
          
          {/* Options */}
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="option-label">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  checked={selectedOptions[currentQuestion.id] === index}
                  onChange={() => handleOptionSelect(index)}
                />
                <span className="option-box">{option}</span>
              </label>
            ))}
          </div>
          
          {/* Image placeholder */}
          <div className="image-placeholder">
            [ছবি এখানে থাকবে]
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <button 
          className="nav-button prev-button" 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          পূর্ববর্তী প্রশ্ন
        </button>
        <button 
          className="nav-button next-button" 
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          পরবর্তী প্রশ্ন
        </button>
      </div>
    </div>
  );
};

export default QuizScreen;