'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Award, RotateCcw } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  lessonId: string;
  lessonTitle: string;
  questions: Question[];
  onComplete: (score: number, total: number) => void;
  existingScore?: { score: number; total: number };
}

export default function Quiz({ lessonId, lessonTitle, questions, onComplete, existingScore }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(existingScore?.score || 0);
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const finalScore = score + (selectedAnswer === questions[currentQuestion].correctAnswer && !showResult ? 1 : 0);
      const totalCorrect = selectedAnswer === questions[currentQuestion].correctAnswer ? score + 1 : score;
      setIsComplete(true);
      onComplete(totalCorrect, questions.length);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsComplete(false);
  };

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPassing = percentage >= 70;
    
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isPassing ? 'bg-green-100' : 'bg-yellow-100'
        }`}>
          <Award className={`w-10 h-10 ${isPassing ? 'text-green-600' : 'text-yellow-600'}`} />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
        <p className="text-gray-600 mb-4">{lessonTitle}</p>
        
        <div className="text-5xl font-bold mb-2" style={{ color: isPassing ? '#22C55E' : '#F59E0B' }}>
          {percentage}%
        </div>
        <p className="text-gray-500 mb-6">
          {score} out of {questions.length} correct
        </p>
        
        {isPassing ? (
          <div className="flex items-center justify-center gap-2 text-green-600 mb-6">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Great job! You've mastered this topic!</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-yellow-600 mb-6">
            <span className="font-medium">Keep practicing! Review the notes and try again.</span>
          </div>
        )}
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={() => onComplete(score, questions.length)}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
        <h3 className="text-white font-semibold">Quick Quiz</h3>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <div className="flex gap-1 mb-4">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full ${
                  idx < currentQuestion ? 'bg-green-500' : idx === currentQuestion ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          <h4 className="text-lg font-medium text-gray-900">{question.question}</h4>
        </div>
        
        <div className="space-y-3 mb-6">
          {question.options.map((option, idx) => {
            let buttonClass = 'w-full p-4 text-left rounded-xl border-2 transition-all ';
            
            if (!showResult) {
              buttonClass += selectedAnswer === idx 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300';
            } else {
              if (idx === question.correctAnswer) {
                buttonClass += 'border-green-500 bg-green-50';
              } else if (selectedAnswer === idx) {
                buttonClass += 'border-red-500 bg-red-50';
              } else {
                buttonClass += 'border-gray-200 opacity-50';
              }
            }
            
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={buttonClass}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    showResult && idx === question.correctAnswer
                      ? 'border-green-500 bg-green-500'
                      : showResult && selectedAnswer === idx && idx !== question.correctAnswer
                      ? 'border-red-500 bg-red-500'
                      : selectedAnswer === idx
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {showResult && idx === question.correctAnswer && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                    {showResult && selectedAnswer === idx && idx !== question.correctAnswer && (
                      <XCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-700">{option}</span>
                </div>
              </button>
            );
          })}
        </div>
        
        {showResult && (
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
