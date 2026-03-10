'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { 
  ChevronLeft, 
  Plus, 
  FlipHorizontal, 
  Check, 
  X, 
  Brain,
  Zap,
  Trash2,
  Edit3,
  Save,
  BookOpen,
  Lightbulb,
  Target,
  RotateCcw
} from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
  topic: string;
  nextReview: number;
  interval: number;
  easeFactor: number;
  reviews: number;
  lastReview: number | null;
}

const STORAGE_KEY = 'agentic-learning-flashcards';

const defaultFlashcards: Flashcard[] = [
  {
    id: 'demo-1',
    front: 'What is a derivative?',
    back: 'A derivative measures the rate of change of a function. It represents the slope of the tangent line at any point on a curve. For f(x), the derivative is f\'(x) or dy/dx.',
    subject: 'Mathematics',
    topic: 'Calculus',
    nextReview: 0,
    interval: 1,
    easeFactor: 2.5,
    reviews: 0,
    lastReview: null
  },
  {
    id: 'demo-2',
    front: 'What is Newton\'s Second Law?',
    back: 'F = ma. Force equals mass times acceleration. The net force acting on an object is equal to the mass of the object multiplied by its acceleration.',
    subject: 'Physics',
    topic: 'Mechanics',
    nextReview: 0,
    interval: 1,
    easeFactor: 2.5,
    reviews: 0,
    lastReview: null
  },
  {
    id: 'demo-3',
    front: 'What is photosynthesis?',
    back: 'The process by which plants convert light energy into chemical energy. 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Occurs in chloroplasts containing chlorophyll.',
    subject: 'Life Sciences',
    topic: 'Plants',
    nextReview: 0,
    interval: 1,
    easeFactor: 2.5,
    reviews: 0,
    lastReview: null
  },
  {
    id: 'demo-4',
    front: 'What is supply and demand?',
    back: 'Supply: quantity sellers want to sell at various prices. Demand: quantity buyers want to buy at various prices. Equilibrium is where supply meets demand.',
    subject: 'Economics',
    topic: 'Basic Concepts',
    nextReview: 0,
    interval: 1,
    easeFactor: 2.5,
    reviews: 0,
    lastReview: null
  },
  {
    id: 'demo-5',
    front: 'What is DNA replication?',
    back: 'The process of copying DNA. Helicase unwinds the DNA, primase adds RNA primers, DNA polymerase synthesizes new strands, and ligase joins Okazaki fragments.',
    subject: 'Life Sciences',
    topic: 'Genetics',
    nextReview: 0,
    interval: 1,
    easeFactor: 2.5,
    reviews: 0,
    lastReview: null
  }
];

export default function FlashcardsPage() {
  const { progress } = useProgress();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '', subject: '', topic: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'due' | 'learned'>('all');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFlashcards(parsed);
      } catch {
        setFlashcards(defaultFlashcards);
      }
    } else {
      setFlashcards(defaultFlashcards);
    }
  }, []);

  useEffect(() => {
    if (flashcards.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flashcards));
    }
  }, [flashcards]);

  const dueCards = flashcards.filter(f => f.nextReview <= Date.now());
  const learnedCards = flashcards.filter(f => f.reviews > 0);
  
  const filteredCards = flashcards.filter(card => {
    if (filter === 'due') return card.nextReview <= Date.now();
    if (filter === 'learned') return card.reviews > 0;
    return true;
  });

  const currentCard = filteredCards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRating = (quality: number) => {
    if (!currentCard) return;

    const card = flashcards.find(f => f.id === currentCard.id);
    if (!card) return;

    let newInterval: number;
    let newEaseFactor = card.easeFactor;

    if (quality >= 3) {
      if (card.reviews === 0) {
        newInterval = 1;
      } else if (card.reviews === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(card.interval * newEaseFactor);
      }
      newEaseFactor = Math.max(1.3, newEaseFactor + 0.1);
    } else {
      newInterval = 1;
      newEaseFactor = Math.max(1.3, newEaseFactor - 0.2);
    }

    const nextReview = Date.now() + newInterval * 24 * 60 * 60 * 1000;

    const updatedCards = flashcards.map(f => {
      if (f.id === card.id) {
        return {
          ...f,
          interval: newInterval,
          easeFactor: newEaseFactor,
          reviews: f.reviews + 1,
          nextReview,
          lastReview: Date.now()
        };
      }
      return f;
    });

    setFlashcards(updatedCards);

    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    setIsFlipped(false);
  };

  const handleAddCard = () => {
    if (!newCard.front.trim() || !newCard.back.trim()) return;

    const card: Flashcard = {
      id: `card-${Date.now()}`,
      front: newCard.front,
      back: newCard.back,
      subject: newCard.subject || 'General',
      topic: newCard.topic || 'General',
      nextReview: Date.now(),
      interval: 1,
      easeFactor: 2.5,
      reviews: 0,
      lastReview: null
    };

    setFlashcards([...flashcards, card]);
    setNewCard({ front: '', back: '', subject: '', topic: '' });
    setIsAdding(false);
  };

  const handleDeleteCard = (id: string) => {
    setFlashcards(flashcards.filter(f => f.id !== id));
    if (currentIndex >= filteredCards.length - 1) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const handleEditCard = (id: string) => {
    const card = flashcards.find(f => f.id === id);
    if (!card) return;

    setNewCard({ front: card.front, back: card.back, subject: card.subject, topic: card.topic });
    setEditingId(id);
    setIsAdding(true);
  };

  const handleSaveEdit = () => {
    if (!editingId || !newCard.front.trim() || !newCard.back.trim()) return;

    const updatedCards = flashcards.map(f => {
      if (f.id === editingId) {
        return {
          ...f,
          front: newCard.front,
          back: newCard.back,
          subject: newCard.subject || 'General',
          topic: newCard.topic || 'General'
        };
      }
      return f;
    });

    setFlashcards(updatedCards);
    setNewCard({ front: '', back: '', subject: '', topic: '' });
    setEditingId(null);
    setIsAdding(false);
  };

  const getQualityLabel = (quality: number) => {
    switch(quality) {
      case 1: return 'Again';
      case 2: return 'Hard';
      case 3: return 'Good';
      case 4: return 'Easy';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Flashcards</h1>
                <p className="text-xs text-white/60">{dueCards.length} due for review</p>
              </div>
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Card
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{flashcards.length}</p>
                <p className="text-white/60 text-sm">Total Cards</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{dueCards.length}</p>
                <p className="text-white/60 text-sm">Due Today</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{learnedCards.length}</p>
                <p className="text-white/60 text-sm">Learned</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {(['all', 'due', 'learned'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentIndex(0); setIsFlipped(false); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f 
                  ? 'bg-white text-purple-900' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'due' && dueCards.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                  {dueCards.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {isAdding && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingId ? 'Edit Flashcard' : 'Add New Flashcard'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">Front (Question)</label>
                <textarea
                  value={newCard.front}
                  onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                  placeholder="Enter the question or term..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Back (Answer)</label>
                <textarea
                  value={newCard.back}
                  onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                  placeholder="Enter the answer or definition..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1">Subject</label>
                  <input
                    type="text"
                    value={newCard.subject}
                    onChange={(e) => setNewCard({ ...newCard, subject: e.target.value })}
                    placeholder="e.g., Mathematics"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Topic</label>
                  <input
                    type="text"
                    value={newCard.topic}
                    onChange={(e) => setNewCard({ ...newCard, topic: e.target.value })}
                    placeholder="e.g., Calculus"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={editingId ? handleSaveEdit : handleAddCard}
                  disabled={!newCard.front.trim() || !newCard.back.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Save Changes' : 'Add Card'}
                </button>
                <button
                  onClick={() => { setIsAdding(false); setEditingId(null); setNewCard({ front: '', back: '', subject: '', topic: '' }); }}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredCards.length > 0 && currentCard && !isAdding ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-white/60 text-sm">
              <span>Card {currentIndex + 1} of {filteredCards.length}</span>
              <span>{currentCard.subject} • {currentCard.topic}</span>
            </div>

            <div 
              onClick={handleFlip}
              className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-8 min-h-[300px] flex items-center justify-center cursor-pointer transition-all hover:bg-white/15"
            >
              <div className="text-center">
                {!isFlipped ? (
                  <>
                    <p className="text-white/60 text-sm mb-2">Question</p>
                    <p className="text-2xl font-bold text-white">{currentCard.front}</p>
                    <p className="text-white/40 text-sm mt-4">Click to reveal answer</p>
                  </>
                ) : (
                  <>
                    <p className="text-green-400 text-sm mb-2">Answer</p>
                    <p className="text-xl text-white leading-relaxed">{currentCard.back}</p>
                  </>
                )}
              </div>
            </div>

            {isFlipped && (
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleRating(1)}
                  className="px-6 py-3 bg-red-600/80 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                >
                  <X className="w-5 h-5 inline mr-1" />
                  Again
                </button>
                <button
                  onClick={() => handleRating(2)}
                  className="px-6 py-3 bg-yellow-600/80 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors"
                >
                  Hard
                </button>
                <button
                  onClick={() => handleRating(3)}
                  className="px-6 py-3 bg-green-600/80 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
                >
                  <Check className="w-5 h-5 inline mr-1" />
                  Good
                </button>
                <button
                  onClick={() => handleRating(4)}
                  className="px-6 py-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                >
                  Easy
                </button>
              </div>
            )}

            {!isFlipped && (
              <div className="flex justify-center">
                <button
                  onClick={handleFlip}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-colors"
                >
                  <FlipHorizontal className="w-5 h-5" />
                  Show Answer
                </button>
              </div>
            )}

            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setIsFlipped(false); }}
                disabled={currentIndex === 0}
                className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white rounded-lg transition-colors"
              >
                ← Previous
              </button>
              <button
                onClick={() => { setIsFlipped(false); setIsAdding(true); handleEditCard(currentCard.id); }}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteCard(currentCard.id)}
                className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setCurrentIndex(Math.min(filteredCards.length - 1, currentIndex + 1)); setIsFlipped(false); }}
                disabled={currentIndex === filteredCards.length - 1}
                className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white rounded-lg transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        ) : filteredCards.length === 0 && !isAdding ? (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No flashcards yet</h3>
            <p className="text-white/60 mb-4">Create flashcards to start spaced repetition learning</p>
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Card
            </button>
          </div>
        ) : null}

        {filteredCards.length > 0 && !isAdding && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-white mb-4">All Flashcards</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {flashcards.slice(0, 10).map((card) => (
                <div 
                  key={card.id}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-white text-sm">{card.front}</p>
                      <p className="text-white/50 text-xs mt-1">{card.subject} • {card.topic}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditCard(card.id)}
                        className="p-1 hover:bg-white/10 rounded"
                      >
                        <Edit3 className="w-3 h-3 text-white/50" />
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-1 hover:bg-white/10 rounded"
                      >
                        <Trash2 className="w-3 h-3 text-red-400/50" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-white/40">{card.reviews} reviews</span>
                    {card.nextReview <= Date.now() && (
                      <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded">Due</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
