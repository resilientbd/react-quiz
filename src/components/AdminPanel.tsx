import React, { useState } from 'react';
import { Question } from '../interfaces/Question';
import './AdminPanel.css';

interface AdminPanelProps {
  questions: Question[];
  updateQuestions: (questions: Question[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ questions, updateQuestions }) => {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Omit<Question, 'id'>>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    timer: 30
  });

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
  };

  const handleDeleteQuestion = (id: number) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    updateQuestions(updatedQuestions);
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion) return;
    
    const updatedQuestions = questions.map(q => 
      q.id === editingQuestion.id ? editingQuestion : q
    );
    
    updateQuestions(updatedQuestions);
    setEditingQuestion(null);
  };

  const handleAddQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    const questionToAdd: Question = {
      ...newQuestion,
      id: newId
    };
    
    updateQuestions([...questions, questionToAdd]);
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      timer: 30
    });
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

  return (
    <div className="admin-panel">
      <h2>এডমিন প্যানেল</h2>
      
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
            <label>অপশনসমূহ:</label>
            {editingQuestion.options.map((option, index) => (
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
            ))}
          </div>
          
          <div className="form-group">
            <label>সময় (সেকেন্ড):</label>
            <input
              type="number"
              value={editingQuestion.timer}
              onChange={(e) => setEditingQuestion({...editingQuestion, timer: parseInt(e.target.value) || 30})}
              min="5"
              max="300"
            />
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
            <label>অপশনসমূহ:</label>
            {newQuestion.options.map((option, index) => (
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
            ))}
          </div>
          
          <div className="form-group">
            <label>সময় (সেকেন্ড):</label>
            <input
              type="number"
              value={newQuestion.timer}
              onChange={(e) => setNewQuestion({...newQuestion, timer: parseInt(e.target.value) || 30})}
              min="5"
              max="300"
            />
          </div>
          
          <button onClick={handleAddQuestion} className="add-button">প্রশ্ন যোগ করুন</button>
        </div>
      )}
      
      {/* Questions List */}
      <div className="questions-list">
        <h3>বিদ্যমান প্রশ্নসমূহ</h3>
        {questions.length === 0 ? (
          <p>কোন প্রশ্ন পাওয়া যায়নি</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>প্রশ্ন</th>
                <th>সময়</th>
                <th>ক্রিয়া</th>
              </tr>
            </thead>
            <tbody>
              {questions.map(question => (
                <tr key={question.id}>
                  <td>{question.question.substring(0, 50)}...</td>
                  <td>{question.timer} সেকেন্ড</td>
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