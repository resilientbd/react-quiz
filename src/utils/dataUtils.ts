// Utility function to clear quiz data from localStorage
export const clearQuizData = () => {
  localStorage.removeItem('quizQuestions');
  localStorage.removeItem('examConfig');
  console.log('Quiz data cleared from localStorage');
};

// Utility function to reset to default data
export const resetToDefaults = (defaultQuestions: any[]) => {
  localStorage.setItem('quizQuestions', JSON.stringify(defaultQuestions));
  console.log('Reset to default questions');
};