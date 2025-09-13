import React, { useState, useEffect } from 'react';
import { Question } from '../interfaces/Question';
import '../components/AdminPanel.css';

interface AdminPanelProps {
  questions: Question[];
  updateQuestions: (questions: Question[]) => void;
  loadDefaultQuestions: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ questions, updateQuestions, loadDefaultQuestions }) => {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Omit<Question, 'id'>>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    type: 'multiple-choice'
  });
  const [examTitle, setExamTitle] = useState('লোডার এবং আনলোডার ওয়ার্কার - বাংলা');
  const [studentName, setStudentName] = useState('Hasan Al Mamun');
  const [totalTime, setTotalTime] = useState(900);

  console.log('AdminPanel rendering with questions:', questions.length);

  // Load config from localStorage or use defaults
  useEffect(() => {
    const savedConfig = localStorage.getItem('examConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setExamTitle(config.examTitle || 'লোডার এবং আনলোডার ওয়ার্কার - বাংলা');
      setStudentName(config.studentName || 'Hasan Al Mamun');
      setTotalTime(config.totalTime || 900);
    }
  }, []);

  // Save config to localStorage
  const saveConfig = () => {
    const config = {
      examTitle,
      studentName,
      totalTime
    };
    localStorage.setItem('examConfig', JSON.stringify(config));
    alert('কনফিগারেশন সংরক্ষিত হয়েছে!');
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
  };

  const handleDeleteQuestion = (id: number) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই প্রশ্নটি মুছে ফেলতে চান?')) {
      const updatedQuestions = questions.filter(q => q.id !== id);
      console.log('Deleting question, new count:', updatedQuestions.length);
      updateQuestions(updatedQuestions);
    }
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion) return;
    
    const updatedQuestions = questions.map(q => 
      q.id === editingQuestion.id ? editingQuestion : q
    );
    
    console.log('Saving question, count:', updatedQuestions.length);
    updateQuestions(updatedQuestions);
    setEditingQuestion(null);
    alert('প্রশ্ন সংরক্ষিত হয়েছে!');
  };

  const handleAddQuestion = () => {
    if (!newQuestion.question.trim()) {
      alert('প্রশ্ন লিখুন');
      return;
    }
    
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    const questionToAdd: Question = {
      ...newQuestion,
      id: newId
    };
    
    const updatedQuestions = [...questions, questionToAdd];
    console.log('Adding question, new count:', updatedQuestions.length);
    updateQuestions(updatedQuestions);
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      type: 'multiple-choice'
    });
    alert('নতুন প্রশ্ন যোগ হয়েছে!');
  };

  const handleNewOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleEditOptionChange = (index: number, value: string) => {
    if (!editingQuestion) return;
    const updatedOptions = [...editingQuestion.options];
    updatedOptions[index] = value;
    setEditingQuestion({ ...editingQuestion, options: updatedOptions });
  };

  const handleQuestionTypeChange = (type: 'multiple-choice' | 'true-false') => {
    if (type === 'true-false') {
      setNewQuestion({
        ...newQuestion,
        type,
        options: ['সত্য', 'মিথ্যা']
      });
    } else {
      setNewQuestion({
        ...newQuestion,
        type,
        options: ['', '', '', '']
      });
    }
  };

  const handleEditQuestionTypeChange = (type: 'multiple-choice' | 'true-false') => {
    if (!editingQuestion) return;
    
    if (type === 'true-false') {
      setEditingQuestion({
        ...editingQuestion,
        type,
        options: ['সত্য', 'মিথ্যা']
      });
    } else {
      setEditingQuestion({
        ...editingQuestion,
        type,
        options: ['', '', '', '']
      });
    }
  };

  const handleLoadDefaults = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে ডিফল্ট প্রশ্নগুলি লোড করতে চান? এটি বর্তমান সব প্রশ্ন মুছে ফেলবে।')) {
      loadDefaultQuestions();
      alert('ডিফল্ট প্রশ্নগুলি লোড করা হয়েছে!');
    }
  };

  return (
    <div className="admin-panel">
      <h2>এডমিন প্যানেল</h2>
      
      {/* Configuration Section */}
      <div className="config-section">
        <h3>পরীক্ষার কনফিগারেশন</h3>
        <div className="form-group">
          <label>পরীক্ষার শিরোনাম:</label>
          <input
            type="text"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            className="full-width"
          />
        </div>
        
        <div className="form-group">
          <label>পরীক্ষার্থীর নাম:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="full-width"
          />
        </div>
        
        <div className="form-group">
          <label>মোট সময় (সেকেন্ড):</label>
          <input
            type="number"
            value={totalTime}
            onChange={(e) => setTotalTime(parseInt(e.target.value) || 900)}
            min="60"
            max="3600"
            className="short-input"
          />
        </div>
        
        <button onClick={saveConfig} className="save-button">কনফিগারেশন সংরক্ষণ</button>
      </div>
      
      {/* Default Questions Button */}
      <div className="default-questions-section">
        <button onClick={handleLoadDefaults} className="load-defaults-button">
          ডিফল্ট প্রশ্নগুলি লোড করুন
        </button>
        <button onClick={() => {
          if (window.confirm('আপনি কি নিশ্চিত যে সমস্ত ডেটা মুছে ফেলতে চান? এটি বর্তমান সব প্রশ্ন এবং কনফিগারেশন মুছে ফেলবে।')) {
            localStorage.removeItem('quizQuestions');
            localStorage.removeItem('examConfig');
            loadDefaultQuestions();
            alert('সমস্ত ডেটা মুছে ফেলা হয়েছে এবং ডিফল্ট প্রশ্নগুলি লোড করা হয়েছে!');
          }
        }} className="clear-data-button">
          সমস্ত ডেটা মুছুন
        </button>
      </div>
      
      {/* Edit Question Form */}
      {editingQuestion && (
        <div className="edit-form">
          <h3>প্রশ্ন সম্পাদনা</h3>
          <div className="form-group">
            <label>প্রশ্ন:</label>
            <textarea
              value={editingQuestion.question}
              onChange={(e) => setEditingQuestion({...editingQuestion, question: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label>প্রশ্নের ধরন:</label>
            <select 
              value={editingQuestion.type}
              onChange={(e) => handleEditQuestionTypeChange(e.target.value as 'multiple-choice' | 'true-false')}
            >
              <option value="multiple-choice">মাল্টিপল চয়েস</option>
              <option value="true-false">সত্য/মিথ্যা</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>অপশনসমূহ:</label>
            {editingQuestion.type === 'true-false' ? (
              <div className="option-input">
                <input
                  type="text"
                  value={editingQuestion.options[0] || 'সত্য'}
                  onChange={(e) => handleEditOptionChange(0, e.target.value)}
                  placeholder="সত্য"
                  disabled
                />
                <input
                  type="text"
                  value={editingQuestion.options[1] || 'মিথ্যা'}
                  onChange={(e) => handleEditOptionChange(1, e.target.value)}
                  placeholder="মিথ্যা"
                  disabled
                />
              </div>
            ) : (
              editingQuestion.options.map((option, index) => (
                <div key={index} className="option-input">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleEditOptionChange(index, e.target.value)}
                    placeholder={`অপশন ${String.fromCharCode(97 + index)}`}
                  />
                  <label>
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={editingQuestion.correctAnswer === index}
                      onChange={() => setEditingQuestion({...editingQuestion, correctAnswer: index})}
                    />
                    সঠিক উত্তর
                  </label>
                </div>
              ))
            )}
          </div>
          
          <div className="form-actions">
            <button onClick={handleSaveQuestion} className="save-button">সংরক্ষণ</button>
            <button onClick={() => setEditingQuestion(null)} className="cancel-button">বাতিল</button>
          </div>
        </div>
      )}
      
      {/* Add New Question Form */}
      {!editingQuestion && (
        <div className="add-form">
          <h3>নতুন প্রশ্ন যোগ করুন</h3>
          <div className="form-group">
            <label>প্রশ্ন:</label>
            <textarea
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label>প্রশ্নের ধরন:</label>
            <select 
              value={newQuestion.type}
              onChange={(e) => handleQuestionTypeChange(e.target.value as 'multiple-choice' | 'true-false')}
            >
              <option value="multiple-choice">মাল্টিপল চয়েস</option>
              <option value="true-false">সত্য/মিথ্যা</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>অপশনসমূহ:</label>
            {newQuestion.type === 'true-false' ? (
              <div className="option-input">
                <input
                  type="text"
                  value="সত্য"
                  placeholder="সত্য"
                  disabled
                />
                <input
                  type="text"
                  value="মিথ্যা"
                  placeholder="মিথ্যা"
                  disabled
                />
              </div>
            ) : (
              newQuestion.options.map((option, index) => (
                <div key={index} className="option-input">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleNewOptionChange(index, e.target.value)}
                    placeholder={`অপশন ${String.fromCharCode(97 + index)}`}
                  />
                  <label>
                    <input
                      type="radio"
                      name="newCorrectAnswer"
                      checked={newQuestion.correctAnswer === index}
                      onChange={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                    />
                    সঠিক উত্তর
                  </label>
                </div>
              ))
            )}
          </div>
          
          <button onClick={handleAddQuestion} className="add-button">প্রশ্ন যোগ করুন</button>
        </div>
      )}
      
      {/* Questions List */}
      <div className="questions-list">
        <h3>বিদ্যমান প্রশ্নসমূহ ({questions.length} টি প্রশ্ন)</h3>
        {questions.length === 0 ? (
          <p>কোন প্রশ্ন পাওয়া যায়নি</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>আইডি</th>
                <th>প্রশ্ন</th>
                <th>ধরন</th>
                <th>ক্রিয়া</th>
              </tr>
            </thead>
            <tbody>
              {questions.map(question => (
                <tr key={question.id}>
                  <td>{question.id}</td>
                  <td>{question.question.substring(0, 50)}...</td>
                  <td>{question.type === 'true-false' ? 'সত্য/মিথ্যা' : 'মাল্টিপল চয়েস'}</td>
                  <td>
                    <button 
                      onClick={() => handleEditQuestion(question)}
                      className="edit-button"
                    >
                      সম্পাদনা
                    </button>
                    <button 
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="delete-button"
                    >
                      মুছুন
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;