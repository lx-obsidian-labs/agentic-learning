'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { 
  ChevronLeft, 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  SkipForward, 
  SkipBack,
  MessageSquare,
  Target,
  Check,
  X,
  AlertCircle,
  Clock,
  Bookmark,
  Lightbulb,
  Zap,
  ArrowRight,
  Brain
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  timestamp: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const MOCK_QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  'default': [
    {
      id: 'q1',
      timestamp: 30,
      question: 'What is the main concept being discussed in this section?',
      options: [
        'Derivatives',
        'Integrals', 
        'Limits',
        'Functions'
      ],
      correct: 0,
      explanation: 'The video introduces derivatives as the rate of change.'
    },
    {
      id: 'q2',
      timestamp: 120,
      question: 'What is the formula for the derivative of f(x) = x^n?',
      options: [
        'f\'(x) = n*x^(n-1)',
        'f\'(x) = n*x^n',
        'f\'(x) = x^(n-1)',
        'f\'(x) = n/x'
      ],
      correct: 0,
      explanation: 'The power rule states: d/dx(x^n) = n*x^(n-1)'
    }
  ]
};

export default function VideoPlayerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addWatchTime, addQuizScore } = useProgress();

  const [videoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizShownAt, setQuizShownAt] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const quizQuestions = MOCK_QUIZ_QUESTIONS['default'];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const time = videoRef.current.currentTime;
    setCurrentTime(time);
    
    addWatchTime(1, 'video-player');

    const seconds = Math.floor(time);
    const pendingQuiz = quizQuestions.find(q => 
      q.timestamp === seconds && 
      (!quizShownAt || quizShownAt !== seconds)
    );

    if (pendingQuiz) {
      setCurrentQuiz(pendingQuiz);
      setShowQuiz(true);
      setQuizSubmitted(false);
      setQuizAnswer(null);
      setQuizShownAt(seconds);
      
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === null || !currentQuiz) return;
    
    const isCorrect = quizAnswer === currentQuiz.correct;
    setQuizSubmitted(true);
    
    addQuizScore(`video-${Date.now()}`, isCorrect ? 1 : 0, 1);
  };

  const skipToTimestamp = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      setCurrentTime(timestamp);
    }
  };

  const jump = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div ref={containerRef} className="relative" onMouseMove={() => setShowControls(true)}>
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full max-h-[70vh] bg-black"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />

        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-6xl mx-auto">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="text-white p-2 hover:bg-white/20 rounded-full">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button onClick={() => jump(-10)} className="text-white p-2 hover:bg-white/20 rounded-full">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button onClick={() => jump(10)} className="text-white p-2 hover:bg-white/20 rounded-full">
                  <SkipForward className="w-5 h-5" />
                </button>
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowQuiz(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Quizzes
                  {quizQuestions.length > 0 && (
                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {quizQuestions.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className={`p-2 ${showNotes ? 'bg-blue-600' : 'hover:bg-white/20'} text-white rounded-full`}
                >
                  <Bookmark className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 bg-black/30 rounded-full p-1">
                  <button onClick={() => { setVolume(v => Math.max(0, v - 0.1)); }} className="text-white p-1">
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20 h-2 bg-white/30 rounded-full appearance-none cursor-pointer"
                  />
                </div>

                <button className="text-white p-2 hover:bg-white/20 rounded-full">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <Link href="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Big Buck Bunny</h1>
              <p className="text-white/60">
                A large and lovable rabbit deals with three tiny bullies in this animated short film.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Interactive Quiz Points
              </h2>
              <div className="space-y-3">
                {quizQuestions.map((quiz, idx) => (
                  <div
                    key={quiz.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      quizShownAt && quizShownAt >= quiz.timestamp
                        ? 'bg-green-500/20 border-green-500/50'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                    onClick={() => skipToTimestamp(quiz.timestamp)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{quiz.question}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-white/50" />
                            <span className="text-xs text-white/50">{formatTime(quiz.timestamp)}</span>
                            {quizShownAt && quizShownAt >= quiz.timestamp && (
                              <span className="text-xs text-green-400 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/40" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/50 mt-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Click on any quiz to jump to that timestamp and answer
              </p>
            </div>

            {showQuiz && currentQuiz && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 p-6 fixed inset-0 z-50 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Quick Check</h2>
                    <button
                      onClick={() => setShowQuiz(false)}
                      className="text-white/60 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                      <Clock className="w-4 h-4" />
                      Timestamp: {formatTime(currentQuiz.timestamp)}
                    </div>
                    <p className="text-white text-lg">{currentQuiz.question}</p>
                  </div>

                  <div className="space-y-2 mb-6">
                    {currentQuiz.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => !quizSubmitted && setQuizAnswer(idx)}
                        disabled={quizSubmitted}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          quizSubmitted
                            ? idx === currentQuiz.correct
                              ? 'bg-green-500/20 border-green-500 text-green-100'
                              : quizAnswer === idx
                              ? 'bg-red-500/20 border-red-500 text-red-100'
                              : 'bg-white/5 border-white/10 text-white/60'
                            : quizAnswer === idx
                            ? 'bg-blue-500/20 border-blue-500 text-blue-100'
                            : 'bg-white/5 border-white/20 hover:bg-white/10 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {quizSubmitted && idx === currentQuiz.correct && (
                            <Check className="w-5 h-5" />
                          )}
                          {quizSubmitted && quizAnswer === idx && idx !== currentQuiz.correct && (
                            <X className="w-5 h-5" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={quizAnswer === null}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl ${quizAnswer === currentQuiz.correct ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                        <p className="text-white font-medium">
                          {quizAnswer === currentQuiz.correct ? '✓ Correct!' : '✗ Incorrect'}
                        </p>
                        <p className="text-white/80 mt-2">{currentQuiz.explanation}</p>
                      </div>
                      <button
                        onClick={() => setShowQuiz(false)}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
                      >
                        Continue Watching
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {showNotes && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Bookmark className="w-4 h-4" /> Video Notes
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Take notes while watching..."
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={6}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setNotes('')}
                    className="text-xs text-white/60 hover:text-white"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem(`video-notes-${Date.now()}`, notes);
                      alert('Note saved!');
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 p-4">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                Study Tips
              </h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <span>Answer quiz questions to reinforce learning</span>
                </li>
                <li className="flex items-start gap-2">
                  <Bookmark className="w-4 h-4 text-blue-400 mt-0.5" />
                  <span>Take timestamped notes while watching</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Review quizzes marked incorrect</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-500/30 p-4">
              <h3 className="font-bold text-white mb-2">📊 Learning Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Videos Watched</span>
                  <span className="text-white font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Quiz Average</span>
                  <span className="text-green-400 font-bold">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Time Spent</span>
                  <span className="text-white font-bold">3.5 hrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
