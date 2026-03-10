'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, Award, RotateCcw, Check } from 'lucide-react';

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
  onClose?: () => void;
  existingScore?: { score: number; total: number };
}

export default function Quiz({ lessonId: _lessonId, lessonTitle, questions, onComplete, onClose, existingScore }: QuizProps) {
  const [screen, setScreen] = useState<'quiz' | 'result'>(() => (existingScore ? 'result' : 'quiz'));
  const [resultKind, setResultKind] = useState<'existing' | 'new'>(() => (existingScore ? 'existing' : 'new'));
  const [result, setResult] = useState<{ score: number; total: number } | null>(
    existingScore ? { score: existingScore.score, total: existingScore.total } : null
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array.from({ length: questions.length }, () => null));

  const computedScore = useMemo(() => {
    return answers.reduce<number>((acc, answerIndex, idx) => {
      if (answerIndex === null) return acc;
      return acc + (answerIndex === questions[idx]?.correctAnswer ? 1 : 0);
    }, 0);
  }, [answers, questions]);

  const answeredCount = useMemo(() => answers.filter(a => a !== null).length, [answers]);
  const progressPercent = useMemo(() => Math.round((answeredCount / questions.length) * 100), [answeredCount, questions.length]);

  const selectedAnswer = answers[currentQuestion];
  const showResult = selectedAnswer !== null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen !== 'quiz') return;
      
      if (e.key >= '1' && e.key <= '4') {
        const optionIndex = parseInt(e.key) - 1;
        const question = questions[currentQuestion];
        if (question && optionIndex < question.options.length) {
          handleAnswer(optionIndex);
        }
      }
      
      if (e.key === 'ArrowRight' || e.key === 'n') {
        if (showResult && currentQuestion < questions.length - 1) {
          handleNext();
        }
      }
      
      if (e.key === 'ArrowLeft' || e.key === 'p') {
        if (currentQuestion > 0) {
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, currentQuestion, showResult, questions.length, handleAnswer, handleNext, handlePrev]);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (selectedAnswer !== null) return;
    setAnswers(prev => prev.map((a, idx) => (idx === currentQuestion ? answerIndex : a)));
  }, [selectedAnswer, currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setResult({ score: computedScore, total: questions.length });
      setResultKind('new');
      setScreen('result');
    }
  }, [currentQuestion, questions.length, computedScore]);

  const handlePrev = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  const goToQuestion = useCallback((idx: number) => {
    if (answers[idx] !== null || idx <= currentQuestion) {
      setCurrentQuestion(idx);
    }
  }, [answers, currentQuestion]);

  const handleRetry = () => {
    setAnswers(Array.from({ length: questions.length }, () => null));
    setCurrentQuestion(0);
    setResult(null);
    setResultKind('new');
    setScreen('quiz');
  };

  const handleContinue = () => {
    if (resultKind === 'existing') {
      return;
    }
    if (!result) return;
    onComplete(result.score, result.total);
  };

  if (screen === 'result' && result) {
    const percentage = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;
    const isPassing = percentage >= 80;
    
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isPassing ? 'bg-green-100' : 'bg-yellow-100'
        }`}>
          <Award className={`w-10 h-10 ${isPassing ? 'text-green-600' : 'text-yellow-600'}`} />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Quiz Complete!</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{lessonTitle}</p>
        
        <div className="text-5xl font-bold mb-2" style={{ color: isPassing ? '#22C55E' : '#F59E0B' }}>
          {percentage}%
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {result.score} out of {result.total} correct
        </p>
        
        {isPassing ? (
          <div className="flex items-center justify-center gap-2 text-green-600 mb-6">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Great job! You passed (80%+).</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-yellow-600 mb-6">
            <span className="font-medium">Keep practicing! Aim for 80%+ to unlock the next lesson.</span>
          </div>
        )}
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          {resultKind === 'new' ? (
            <button
              onClick={handleContinue}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onClose?.()}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Back to lesson
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Quick Quiz</h3>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <span>{answeredCount}/{questions.length} answered</span>
          </div>
        </div>
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{question.question}</h4>
        </div>
        
        <div className="space-y-3 mb-6">
          {question.options.map((option, idx) => {
            let buttonClass = 'w-full p-4 text-left rounded-xl border-2 transition-all ';
            
            if (!showResult) {
              buttonClass += selectedAnswer === idx 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600';
            } else {
              if (idx === question.correctAnswer) {
                buttonClass += 'border-green-500 bg-green-50 dark:bg-green-900/30';
              } else if (selectedAnswer === idx) {
                buttonClass += 'border-red-500 bg-red-50 dark:bg-red-900/30';
              } else {
                buttonClass += 'border-gray-200 dark:border-gray-700 opacity-50';
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
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                    showResult && idx === question.correctAnswer
                      ? 'border-green-500 bg-green-500 text-white'
                    : showResult && selectedAnswer === idx && idx !== question.correctAnswer
                      ? 'border-red-500 bg-red-500 text-white'
                    : selectedAnswer === idx
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}>
                    {showResult && idx === question.correctAnswer ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : showResult && selectedAnswer === idx && idx !== question.correctAnswer ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="hidden md:flex gap-1">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToQuestion(idx)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                  idx === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : answers[idx] !== null
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {showResult && (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Tip: Use keyboard shortcuts - 1-4 to select answer, Arrow keys to navigate
        </p>
      </div>
    </div>
  );
}
