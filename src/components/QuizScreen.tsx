import React, { useState, useEffect } from 'react';
import configData from '../data/config.json';
import { Question } from '../interfaces/Question';
import './QuizScreen.css';
import MainContent from './MainContent';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Function to convert English numbers to Bangla numbers
const convertToBanglaNumber = (num: number): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(digit => banglaDigits[parseInt(digit)]).join('');
};

interface QuizScreenProps {
  questions: Question[];
  updateQuestions: (questions: Question[]) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, updateQuestions }) => {
  const [examConfig, setExamConfig] = useState(configData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{[key: number]: number}>({});
  const [timeLeft, setTimeLeft] = useState(configData.totalTime); // Use config time

  console.log('QuizScreen rendering with questions:', questions.length);

  // Load config from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('examConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setExamConfig(config);
      setTimeLeft(config.totalTime);
    }
  }, []);

  // Update examConfig when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedConfig = localStorage.getItem('examConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        setExamConfig(config);
        setTimeLeft(config.totalTime);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Reset current question index if it's out of bounds
  useEffect(() => {
    if (currentQuestionIndex >= questions.length && questions.length > 0) {
      setCurrentQuestionIndex(questions.length - 1);
    } else if (questions.length === 0) {
      setCurrentQuestionIndex(0);
    }
  }, [questions, currentQuestionIndex]);

  // Listen for changes in localStorage to sync questions
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'quizQuestions' && e.newValue) {
        try {
          const updatedQuestions = JSON.parse(e.newValue);
          // We don't directly update state here since App.tsx manages the questions
          // This is just for logging
          console.log('Questions updated in localStorage:', updatedQuestions.length);
        } catch (error) {
          console.error('Error parsing updated questions:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
    if (questions.length === 0) return;
    setSelectedOptions(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: optionIndex
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

  // Format time as HH:MM:SS with Bangla numbers
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const banglaHrs = convertToBanglaNumber(hrs);
    const banglaMins = convertToBanglaNumber(mins);
    const banglaSecs = convertToBanglaNumber(secs);
    return `${banglaHrs.toString().padStart(2, '০')}:${banglaMins.toString().padStart(2, '০')}:${banglaSecs.toString().padStart(2, '০')}`;
  };

  // Get timer color based on remaining time
  const getTimerColorClass = (seconds: number) => {
    if (seconds < 300) return 'critical'; // < 5 minutes
    if (seconds < 600) return 'warning'; // < 10 minutes
    return ''; // Normal
  };

  // Handle case when there are no questions
  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>কোন প্রশ্ন পাওয়া যায়নি</h2>
          <p>এডমিন প্যানেল থেকে প্রশ্ন যোগ করুন।</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container-fluid px-0 quiz-container">
      <div className="row mx-0">
        {/* First Top Bar */}
        <div className="col-12 px-0 first-top-bar">
          <div className="container-fluid px-2 py-1">
            <div className="row align-items-center">
              {/* Info Section */}
              <div className="col-12 col-md-3 mb-1 mb-md-0">
                <div className="question-section-indicator">
                  <span className="question-section">{convertToBanglaNumber(currentQuestion.id)}</span>
                  <span className="section-indicator">১</span>
                </div>
              </div>
              
              {/* Timer Section */}
              <div className="col-12 col-md-3 mb-1 mb-md-0">
                <div className="timer-section d-flex align-items-center justify-content-md-center">
                  <AccessTimeIcon className="clock-icon" />
                  <div className="timer-text-container ms-2">
                    <div className="timer-label">বিভাগের সময় অবশিষ্ট রয়েছে</div>
                    <div className={`timer-value ${getTimerColorClass(timeLeft)}`}>
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Progress Section */}
              <div className="col-12 col-md-3 mb-2 mb-md-0">
                <div className="progress-section d-flex flex-column align-items-center">
                  <div className="progress-container d-flex align-items-center justify-content-center">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="progress-text">অগ্রগতি {convertToBanglaNumber(progress)}%</div>
                </div>
              </div>
              
              {/* Button Section */}
              <div className="col-12 col-md-3 d-flex justify-content-md-end">
                <button 
                  className="finish-button btn"
                  onClick={() => alert("পরীক্ষা সমাপ্ত হয়েছে!")}
                >
                  পরীক্ষা সমাপ্ত করুন
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Top Bar */}
        <div className="col-12 px-0 sub-top-bar">
          <div className="container-fluid px-2 py-1">
            <div className="row align-items-center">
              <div className="col-12 col-md-6 mb-1 mb-md-0">
                <div className="sub-left-section d-flex align-items-baseline">
                  <div className="exam-title">পরীক্ষা:</div>
                  <div className="exam-subtitle ms-2">{examConfig.examTitle}</div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="sub-right-section d-flex justify-content-md-end align-items-baseline">
                  <div className="student-info-label">পরীক্ষার্থী:</div>
                  <div className="student-name ms-2">{examConfig.studentName}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="row mx-0 main-content-wrapper">
        <div className="container-fluid px-0">
          <div className="row mx-0">
            {/* Sidebar */}
            <div className="col-12 col-sm-1 col-md-1 col-lg-1 px-0 sidebar-container">
              <div className="sidebar d-flex flex-column align-items-center py-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    className={`sidebar-button ${currentQuestionIndex === index ? 'active' : ''}`}
                    onClick={() => handleQuestionChange(index)}
                  >
                    {index + 1}
                  </button>
                ))}
                {/* Info button at the bottom */}
                <button
                  className="sidebar-button info-button mt-auto"
                  onClick={() => alert('Info button clicked')}
                >
                  ℹ️
                </button>
              </div>
            </div>

            {/* Main Question Area */}
            <div className="col-12 col-sm-11 col-md-11 col-lg-11 px-0">
              <MainContent 
                question={currentQuestion}
                selectedOption={selectedOptions[questions[currentQuestionIndex].id]}
                onOptionSelect={handleOptionSelect}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar-container">
        <div className="bottom-bar">
          <button 
            className="nav-button prev-button btn"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            &lt; ফেরত যান
          </button>
          <button 
            className="nav-button next-button btn"
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            এগিয়ে যান &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;