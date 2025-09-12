export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  timer: number;
}