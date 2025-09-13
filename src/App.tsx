import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import QuizScreen from './components/QuizScreen';
import AdminPanel from './components/AdminPanel';
import defaultQuestionsData from './data/questions.json';
import { Question } from './interfaces/Question';
import { clearQuizData } from './utils/dataUtils';

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);

  // Load questions from localStorage or use default questions
  useEffect(() => {
    // Check if we want to force reset to defaults (for debugging)
    const forceReset = localStorage.getItem('forceResetToDefaults');
    if (forceReset === 'true') {
      console.log('Force resetting to default questions');
      setQuestions(defaultQuestionsData as Question[]);
      localStorage.setItem('quizQuestions', JSON.stringify(defaultQuestionsData as Question[]));
      localStorage.removeItem('forceResetToDefaults');
      return;
    }

    const savedQuestions = localStorage.getItem('quizQuestions');
    if (savedQuestions) {
      console.log('Loading saved questions from localStorage:', JSON.parse(savedQuestions).length);
      setQuestions(JSON.parse(savedQuestions));
    } else {
      console.log('Loading default questions:', (defaultQuestionsData as Question[]).length);
      setQuestions(defaultQuestionsData as Question[]);
    }
  }, []);

  // Listen for storage changes to keep questions in sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'quizQuestions') {
        if (e.newValue) {
          try {
            const updatedQuestions = JSON.parse(e.newValue);
            console.log('Updating questions from storage event:', updatedQuestions.length);
            setQuestions(updatedQuestions);
          } catch (error) {
            console.error('Error parsing questions from storage event:', error);
          }
        } else {
          // If quizQuestions was removed from localStorage, load defaults
          console.log('Loading default questions after storage clear');
          setQuestions(defaultQuestionsData as Question[]);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateQuestions = (updatedQuestions: Question[]) => {
    console.log('Updating questions, new count:', updatedQuestions.length);
    setQuestions(updatedQuestions);
    localStorage.setItem('quizQuestions', JSON.stringify(updatedQuestions));
  };

  const loadDefaultQuestions = () => {
    const defaultQuestions = defaultQuestionsData as Question[];
    console.log('Loading default questions, count:', defaultQuestions.length);
    setQuestions(defaultQuestions);
    localStorage.setItem('quizQuestions', JSON.stringify(defaultQuestions));
  };

  console.log('App rendering with questions count:', questions.length);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<QuizScreen questions={questions} updateQuestions={updateQuestions} />} />
          <Route path="/admin" element={
            <AdminPanel 
              questions={questions} 
              updateQuestions={updateQuestions} 
              loadDefaultQuestions={loadDefaultQuestions}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;