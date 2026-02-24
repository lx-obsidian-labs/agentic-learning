'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { courses } from '@/data/courses';
import { useProgress } from '@/hooks/useProgress';
import VideoPlayer from '@/components/VideoPlayer';
import NotesPanel from '@/components/NotesPanel';
import Quiz from '@/components/Quiz';
import ProgressDashboard from '@/components/ProgressDashboard';
import { ChevronLeft, Play, CheckCircle2, Clock, BookOpen, LayoutDashboard, ListOrdered, Bookmark, User, GraduationCap } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const generateQuizQuestions = (lessonTitle: string): Question[] => {
  const questionBank: Record<string, Question[]> = {
    'derivatives': [
      { id: '1', question: 'What is the derivative of x³?', options: ['x²', '3x²', '3x', 'x³'], correctAnswer: 1 },
      { id: '2', question: 'What does f\'(x) represent?', options: ['Area under curve', 'Rate of change', 'Sum', 'Product'], correctAnswer: 1 },
      { id: '3', question: 'The derivative of sin(x) is:', options: ['sin(x)', '-sin(x)', 'cos(x)', '-cos(x)'], correctAnswer: 2 },
      { id: '4', question: 'Using the power rule, what is d/dx(x⁵)?', options: ['5x⁴', '5x⁵', 'x⁶', 'x⁴'], correctAnswer: 0 },
      { id: '5', question: 'The derivative of eˣ is:', options: ['eˣ', 'xeˣ⁻¹', 'eˣ⁺¹', '1/eˣ'], correctAnswer: 0 },
    ],
    'integration': [
      { id: '1', question: '∫x² dx = ?', options: ['x³ + C', '2x + C', 'x³/3 + C', '3x² + C'], correctAnswer: 2 },
      { id: '2', question: 'Integration is the reverse of:', options: ['Addition', 'Multiplication', 'Differentiation', 'Division'], correctAnswer: 2 },
      { id: '3', question: '∫eˣ dx = ?', options: ['eˣ + C', 'xeˣ + C', 'eˣ⁻¹ + C', 'eˣ/eˣ + C'], correctAnswer: 0 },
      { id: '4', question: 'What is the constant of integration called?', options: ['k', 'C', 'π', 'x'], correctAnswer: 1 },
      { id: '5', question: '∫1/x dx = ?', options: ['ln|x| + C', '1/x² + C', 'x + C', 'log|x| + C'], correctAnswer: 0 },
    ],
    'newtons-laws': [
      { id: '1', question: 'F = ma is Newton\'s:', options: ['First Law', 'Second Law', 'Third Law', 'Law of Gravitation'], correctAnswer: 1 },
      { id: '2', question: 'What does inertia mean?', options: ['Force', 'Resistance to change in motion', 'Acceleration', 'Mass'], correctAnswer: 1 },
      { id: '3', question: 'Newton\'s Third Law states:', options: ['F = ma', 'Every action has equal and opposite reaction', 'Objects stay at rest', 'Energy is conserved'], correctAnswer: 1 },
      { id: '4', question: 'An object at rest will stay at rest unless acted upon by:', options: ['Energy', 'A net external force', 'Gravity', 'Friction only'], correctAnswer: 1 },
      { id: '5', question: 'What is the unit of force?', options: ['Joule', 'Watt', 'Newton', 'Pascal'], correctAnswer: 2 },
    ],
    'dna': [
      { id: '1', question: 'DNA stands for:', options: ['Deoxyribonucleic acid', 'Dinitrogen acid', 'Dynamic nucleic acid', 'Direct nucleic acid'], correctAnswer: 0 },
      { id: '2', question: 'Base pairs in DNA are:', options: ['A-G, T-C', 'A-T, G-C', 'A-C, G-T', 'A-A, G-G'], correctAnswer: 1 },
      { id: '3', question: 'DNA has a double helix structure discovered by:', options: ['Darwin', 'Watson & Crick', 'Mendel', 'Fleming'], correctAnswer: 1 },
      { id: '4', question: 'Which base pairs with Adenine?', options: ['Guanine', 'Cytosine', 'Thymine', 'Uracil'], correctAnswer: 2 },
      { id: '5', question: 'DNA replication is:', options: ['Conservative', 'Dispersive', 'Semi-conservative', 'Full copy'], correctAnswer: 2 },
    ],
    'momentum': [
      { id: '1', question: 'Momentum is calculated as:', options: ['m/v', 'mv', 'm + v', 'm - v'], correctAnswer: 1 },
      { id: '2', question: 'What is the SI unit of momentum?', options: ['kg·m/s', 'kg·m²/s', 'kg/s', 'kg·m/s²'], correctAnswer: 0 },
      { id: '3', question: 'In a closed system, total momentum is:', options: ['Always zero', 'Conserved', 'Increasing', 'Decreasing'], correctAnswer: 1 },
      { id: '4', question: 'Impulse equals change in:', options: ['Velocity', 'Acceleration', 'Momentum', 'Energy'], correctAnswer: 2 },
      { id: '5', question: 'An elastic collision conserves:', options: ['Momentum only', 'Energy only', 'Both momentum and kinetic energy', 'Mass only'], correctAnswer: 2 },
    ],
    'work-energy': [
      { id: '1', question: 'Work is calculated as:', options: ['W = mv', 'W = Fd cosθ', 'W = Fd', 'W = mgh'], correctAnswer: 1 },
      { id: '2', question: 'The SI unit of work is:', options: ['Watt', 'Joule', 'Newton', 'Pascal'], correctAnswer: 1 },
      { id: '3', question: 'Kinetic energy formula is:', options: ['½mv', '½mv²', 'mgh', 'mv²'], correctAnswer: 1 },
      { id: '4', question: 'Potential energy due to height is:', options: ['½mv²', 'mgh', 'Fd', 'mv'], correctAnswer: 1 },
      { id: '5', question: 'Power is:', options: ['Work/Time', 'Force/Velocity', 'Energy/Distance', 'Mass/Acceleration'], correctAnswer: 0 },
    ],
    'wave': [
      { id: '1', question: 'The speed of a wave is given by:', options: ['v = f/λ', 'v = fλ', 'v = λ/f', 'v = f + λ'], correctAnswer: 1 },
      { id: '2', question: 'Wavelength is measured in:', options: ['Seconds', 'Hertz', 'Meters', 'Joules'], correctAnswer: 2 },
      { id: '3', question: 'Frequency is measured in:', options: ['Meters', 'Hertz', 'Seconds', 'Joules'], correctAnswer: 1 },
      { id: '4', question: 'Sound is a:', options: ['Transverse wave', 'Longitudinal wave', 'Electromagnetic wave', 'Standing wave'], correctAnswer: 1 },
      { id: '5', question: 'The Doppler effect describes:', options: ['Wave reflection', 'Change in frequency due to motion', 'Wave interference', 'Wave diffraction'], correctAnswer: 1 },
    ],
    'equilibrium': [
      { id: '1', question: 'In chemical equilibrium, the forward rate equals:', options: ['Reverse rate', 'Activation energy', 'Catalyst effect', 'Temperature'], correctAnswer: 0 },
      { id: '2', question: 'Le Chatelier\'s principle states that:', options: ['Systems stay at rest', 'Systems shift to counteract changes', 'Equilibrium never changes', 'Temperature is constant'], correctAnswer: 1 },
      { id: '3', question: 'Increasing temperature in an exothermic reaction:', options: ['Shifts left', 'Shifts right', 'No effect', 'Stops reaction'], correctAnswer: 0 },
      { id: '4', question: 'Kc represents:', options: ['Kinetic constant', 'Equilibrium constant', 'Rate constant', 'Catalyst constant'], correctAnswer: 1 },
      { id: '5', question: 'Adding more reactant shifts equilibrium:', options: ['Left', 'Right', 'No change', 'Randomly'], correctAnswer: 1 },
    ],
    'acid-base': [
      { id: '1', question: 'A Brønsted-Lowry acid:', options: ['Accepts H⁺', 'Donates H⁺', 'Donates electrons', 'Accepts electrons'], correctAnswer: 1 },
      { id: '2', question: 'pH measures:', options: ['Acidity/basicity', 'Salinity', 'Temperature', 'Pressure'], correctAnswer: 0 },
      { id: '3', question: 'A pH of 7 indicates:', options: ['Acid', 'Base', 'Neutral', 'Buffer'], correctAnswer: 2 },
      { id: '4', question: 'A strong acid:', options: ['Partially dissociates', 'Completely dissociates', 'Has no effect', 'Is always dilute'], correctAnswer: 1 },
      { id: '5', question: 'The conjugate base of HCl is:', options: ['H⁺', 'Cl⁻', 'OH⁻', 'HCl'], correctAnswer: 1 },
    ],
    'electric': [
      { id: '1', question: 'Ohm\'s Law states:', options: ['V = IR', 'P = IV', 'R = V/I', 'I = V/R'], correctAnswer: 0 },
      { id: '2', question: 'Current is measured in:', options: ['Volts', 'Amperes', 'Ohms', 'Watts'], correctAnswer: 1 },
      { id: '3', question: 'Resistance is measured in:', options: ['Volts', 'Amperes', 'Ohms', 'Watts'], correctAnswer: 2 },
      { id: '4', question: 'In series circuits, total resistance:', options: ['Adds up', 'Decreases', 'Stays same', 'Multiplies'], correctAnswer: 0 },
      { id: '5', question: 'Power is calculated as:', options: ['P = IV', 'P = V/I', 'P = IR', 'P = V/R'], correctAnswer: 0 },
    ],
    'genetics': [
      { id: '1', question: 'Mendel\'s Law of Segregation states that:', options: ['Genes are linked', 'Alleles separate during gamete formation', 'Traits blend', 'Dominance doesn\'t exist'], correctAnswer: 1 },
      { id: '2', question: 'A dominant allele is expressed when:', options: ['It\'s recessive', 'It\'s present', 'Homozygous recessive', 'Never'], correctAnswer: 1 },
      { id: '3', question: 'A Punnett square shows:', options: ['DNA structure', 'Possible offspring genotypes', 'Chromosome numbers', 'Mutation rates'], correctAnswer: 1 },
      { id: '4', question: 'Homozygous dominant genotype is represented as:', options: ['aa', 'AA', 'Aa', 'A'], correctAnswer: 1 },
      { id: '5', question: 'Independent assortment occurs during:', options: ['Mitosis', 'Meiosis', 'Fertilization', 'Translation'], correctAnswer: 1 },
    ],
    'probability': [
      { id: '1', question: 'Probability ranges from:', options: ['0 to 1', '-1 to 1', '0 to 100', '1 to 10'], correctAnswer: 0 },
      { id: '2', question: 'P(A) + P(A\') = ?', options: ['0', '1', '2', '0.5'], correctAnswer: 1 },
      { id: '3', question: 'Independent events are multiplied:', options: ['Always', 'Only for disjoint events', 'Never', 'At random'], correctAnswer: 0 },
      { id: '4', question: 'A permutation considers:', options: ['Order only', 'Selection only', 'Both order and selection', 'Neither'], correctAnswer: 0 },
      { id: '5', question: 'Combination differs from permutation because:', options: ['Uses formula', 'Order doesn\'t matter', 'Has more variables', 'Is smaller'], correctAnswer: 1 },
    ],
    'sequence': [
      { id: '1', question: 'Arithmetic sequence has a constant:', options: ['Ratio', 'Difference', 'Product', 'Sum'], correctAnswer: 1 },
      { id: '2', question: 'Geometric sequence has a constant:', options: ['Difference', 'Ratio', 'Sum', 'Product'], correctAnswer: 1 },
      { id: '3', question: 'The nth term of arithmetic sequence is:', options: ['a₁ + (n-1)d', 'a₁ × rⁿ⁻¹', 'a₁ + nd', 'a₁ × dⁿ'], correctAnswer: 0 },
      { id: '4', question: 'Sum of arithmetic series formula includes:', options: ['First term only', 'Last term and first term', 'Middle terms', 'Ratio'], correctAnswer: 1 },
      { id: '5', question: 'Infinite geometric series converges when |r|:', options: ['> 1', '< 1', '= 1', '= 0'], correctAnswer: 1 },
    ],
    'binomial': [
      { id: '1', question: 'Binomial expansion uses:', options: ['Pascal\'s Triangle', 'Pythagorean theorem', 'Quadratic formula', 'Derivative rules'], correctAnswer: 0 },
      { id: '2', question: 'C(n,r) is called:', options: ['Combination', 'Permutation', 'Binomial coefficient', 'Factorial'], correctAnswer: 2 },
      { id: '3', question: '(a + b)⁰ = ?', options: ['a + b', 'ab', '1', '0'], correctAnswer: 2 },
      { id: '4', question: 'C(5,2) equals:', options: ['10', '5', '7', '12'], correctAnswer: 0 },
      { id: '5', question: 'The sum of coefficients in (a+b)ⁿ equals:', options: ['n', '2ⁿ', 'n²', '1'], correctAnswer: 1 },
    ],
    'nervous': [
      { id: '1', question: 'The CNS consists of:', options: ['Brain and spinal cord', 'Only brain', 'Only spinal cord', 'Nerves outside spine'], correctAnswer: 0 },
      { id: '2', question: 'Neurons transmit:', options: ['Blood', 'Impulses', 'Oxygen', 'Hormones'], correctAnswer: 1 },
      { id: '3', question: 'The resting membrane potential is approximately:', options: ['+70mV', '-70mV', '0mV', '-30mV'], correctAnswer: 1 },
      { id: '4', question: 'Synapses use:', options: ['Hormones only', 'Neurotransmitters', 'Electrical signals only', 'Blood'], correctAnswer: 1 },
      { id: '5', question: 'The fight-or-flight response is controlled by:', options: ['Parasympathetic', 'Sympathetic', 'Central', 'Somatic'], correctAnswer: 1 },
    ],
    'excretory': [
      { id: '1', question: 'The main excretory organ is the:', options: ['Liver', 'Skin', 'Kidney', 'Lungs'], correctAnswer: 2 },
      { id: '2', question: 'The functional unit of the kidney is the:', options: ['Alveoli', 'Nephron', 'Neuron', 'Hepatocyte'], correctAnswer: 1 },
      { id: '3', question: 'Urea is produced in the:', options: ['Kidneys', 'Liver', 'Lungs', 'Heart'], correctAnswer: 1 },
      { id: '4', question: 'Urine composition is mostly:', options: ['Urea', 'Water', 'Salts', 'Creatinine'], correctAnswer: 1 },
      { id: '5', question: 'The first step in urine formation is:', options: ['Reabsorption', 'Filtration', 'Secretion', 'Excretion'], correctAnswer: 1 },
    ],
    'immune': [
      { id: '1', question: 'Innate immunity is:', options: ['Specific', 'Non-specific', 'Acquired', 'Genetic'], correctAnswer: 1 },
      { id: '2', question: 'B-cells produce:', options: ['Antibodies', 'T-cells only', 'Hormones', 'Enzymes'], correctAnswer: 0 },
      { id: '3', question: 'Vaccination provides:', options: ['Cure', 'Active immunity', 'Passive immunity only', 'Antibiotics'], correctAnswer: 1 },
      { id: '4', question: 'The skin is part of:', options: ['First line of defense', 'Second line', 'Third line', 'Not a defense'], correctAnswer: 0 },
      { id: '5', question: 'Antigens are:', options: ['Body\'s own cells', 'Foreign substances', 'Antibodies', 'Vitamins'], correctAnswer: 1 },
    ],
    'weathering': [
      { id: '1', question: 'Physical weathering is also called:', options: ['Chemical weathering', 'Mechanical weathering', 'Biological weathering', 'Thermal weathering'], correctAnswer: 1 },
      { id: '2', question: 'Frost wedging is an example of:', options: ['Chemical weathering', 'Mechanical weathering', 'Biological weathering', 'Oxidation'], correctAnswer: 1 },
      { id: '3', question: 'Oxidation is a type of:', options: ['Physical weathering', 'Chemical weathering', 'Biological weathering', 'Erosion'], correctAnswer: 1 },
      { id: '4', question: 'Main agents of erosion include:', options: ['Only water', 'Wind, water, ice, gravity', 'Fire only', 'Earthquakes only'], correctAnswer: 1 },
      { id: '5', question: 'A drainage basin is also called:', options: ['Watershed', 'Delta', 'Valley', 'Plateau'], correctAnswer: 0 },
    ],
    'climate': [
      { id: '1', question: 'Temperature decreases with increasing:', options: ['Altitude', 'Longitude', 'Time', 'Population'], correctAnswer: 0 },
      { id: '2', question: 'Ocean currents affect:', options: ['Only land', 'Climate of coastal areas', 'Nothing', 'Only temperature'], correctAnswer: 1 },
      { id: '3', question: 'Onshore winds bring:', options: ['Dry air', 'Moist air', 'Cold air only', 'No effect'], correctAnswer: 1 },
      { id: '4', question: 'Continental climate has:', options: ['Moderate temperatures', 'Extreme temperature range', 'Always warm', 'Always cold'], correctAnswer: 1 },
      { id: '5', question: 'Latitude affects:', options: ['Only rainfall', 'Only temperature', 'Temperature and climate', 'Nothing'], correctAnswer: 2 },
    ],
    'interest': [
      { id: '1', question: 'Simple interest formula is:', options: ['I = Prt', 'I = Pr/t', 'I = P/r', 'I = P + rt'], correctAnswer: 0 },
      { id: '2', question: 'Compound interest is calculated on:', options: ['Principal only', 'Principal + accumulated interest', 'Interest only', 'Time only'], correctAnswer: 1 },
      { id: '3', question: 'The formula A = P(1 + r/n)^(nt) is for:', options: ['Simple interest', 'Compound interest', 'Discount', 'Tax'], correctAnswer: 1 },
      { id: '4', question: 'More frequent compounding results in:', options: ['Less interest', 'More interest', 'No change', 'Loss'], correctAnswer: 1 },
      { id: '5', question: 'Principal is:', options: ['Interest earned', 'Initial amount', 'Total amount', 'Rate'], correctAnswer: 1 },
    ],
  };

  for (const [key, questions] of Object.entries(questionBank)) {
    if (lessonTitle.toLowerCase().includes(key)) {
      return questions;
    }
  }

  return [
    { id: '1', question: 'Did you understand this lesson?', options: ['Yes, completely', 'Mostly', 'Partially', 'Need to review'], correctAnswer: 0 },
    { id: '2', question: 'How confident do you feel about this topic?', options: ['Very confident', 'Confident', 'Somewhat confident', 'Not confident'], correctAnswer: 0 },
  ];
};

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  
  const course = courses.find(c => c.id === courseId);
  const { progress, completeLesson, addQuizScore, isLessonCompleted, getQuizScore, toggleBookmark, isBookmarked, isLessonUnlocked, getQuizForDifficulty, resetProgress } = useProgress();
  
  const [currentLesson, setCurrentLesson] = useState(course?.modules[0]?.lessons[0]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Course not found</p>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedCount = course.modules.reduce((acc, mod) => 
    acc + mod.lessons.filter(l => progress.completedLessons.includes(l.id)).length, 0
  );
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleCompleteLesson = () => {
    if (currentLesson && !progress.completedLessons.includes(currentLesson.id)) {
      completeLesson(currentLesson.id, course.id);
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    if (currentLesson) {
      addQuizScore(currentLesson.id, score, total);
    }
    setShowQuiz(false);
  };

  const getNextLesson = () => {
    const allLessons = course.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
    if (currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1];
    }
    return null;
  };

  const handleNextLesson = () => {
    const next = getNextLesson();
    if (next) {
      setCurrentLesson(next);
      setShowQuiz(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{course.title}</h1>
                <p className="text-xs text-gray-500">{completedCount}/{totalLessons} completed • {progressPercent}%</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">{course.instructor}</span>
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-700">{progress.streak} day streak</span>
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-full">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-700">{progress.points} pts</span>
              </div>
              <button
                onClick={() => setShowDashboard(!showDashboard)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  showDashboard ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:inline">Progress</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showDashboard ? (
          <ProgressDashboard 
            progress={progress} 
            totalLessons={totalLessons}
            onReset={resetProgress}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {currentLesson ? (
                <>
                  <VideoPlayer
                    videoId={currentLesson.videoId}
                    title={currentLesson.title}
                    timestamps={currentLesson.timestamps}
                    videoQuality={currentLesson.videoQuality}
                  />
                  
                  {showQuiz ? (
                    <Quiz
                      lessonId={currentLesson.id}
                      lessonTitle={currentLesson.title}
                      questions={generateQuizQuestions(currentLesson.title)}
                      onComplete={handleQuizComplete}
                      existingScore={getQuizScore(currentLesson.id)}
                    />
                  ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{currentLesson.title}</h2>
                          <div className="flex items-center gap-4 mt-2 text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {currentLesson.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              Notes available
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {currentLesson && (
                            <button
                              onClick={() => toggleBookmark(currentLesson.id)}
                              className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${
                                isBookmarked(currentLesson.id)
                                  ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <Bookmark className={`w-4 h-4 ${isBookmarked(currentLesson.id) ? 'fill-yellow-500' : ''}`} />
                              {isBookmarked(currentLesson.id) ? 'Saved' : 'Save'}
                            </button>
                          )}
                          {progress.completedLessons.includes(currentLesson.id) ? (
                            <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                              <CheckCircle2 className="w-4 h-4" />
                              Completed
                            </span>
                          ) : (
                            <button
                              onClick={handleCompleteLesson}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                            >
                              <Play className="w-4 h-4" />
                              Mark Complete
                            </button>
                          )}
                          {getNextLesson() && (
                            <button
                              onClick={handleNextLesson}
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                              Next Lesson →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!showQuiz && (
                    <NotesPanel
                      notes={currentLesson.notes}
                      keyPoints={currentLesson.keyPoints}
                      lessonTitle={currentLesson.title}
                    />
                  )}
                </>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <p className="text-gray-500">Select a lesson to start learning</p>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Course Content</h3>
                    <p className="text-sm text-gray-500">{course.modules.length} modules • {totalLessons} lessons</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{progressPercent}%</p>
                    <p className="text-xs text-gray-500">complete</p>
                  </div>
                </div>
                
                <div className="max-h-[500px] overflow-y-auto">
                  {course.modules.map((module, moduleIdx) => (
                    <div key={module.id} className="border-b border-gray-100 last:border-0">
                      <div className="p-4 bg-gray-50">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-200 text-xs flex items-center justify-center">{moduleIdx + 1}</span>
                          {module.title}
                        </h4>
                      </div>
                      
                      <div>
                        {module.lessons.map((lesson, lessonIdx) => {
                          const allLessons = course.modules.flatMap(m => m.lessons);
                          const lessonIndex = allLessons.findIndex(l => l.id === lesson.id);
                          const isUnlocked = isLessonUnlocked(lesson.id, allLessons.map(l => l.id), lessonIndex);
                          const isCompleted = progress.completedLessons.includes(lesson.id);
                          const isCurrent = currentLesson?.id === lesson.id;
                          
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => {
                                if (isUnlocked || isCompleted) {
                                  setCurrentLesson(lesson);
                                  setShowQuiz(false);
                                }
                              }}
                              disabled={!isUnlocked && !isCompleted}
                              className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                                isCurrent ? 'bg-blue-50' : isUnlocked || isCompleted ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed bg-gray-50'
                              }`}
                            >
                              <div className={`mt-0.5 ${
                                isCompleted ? 'text-green-500' : isCurrent ? 'text-blue-500' : isUnlocked ? 'text-gray-400' : 'text-gray-300'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : isCurrent ? (
                                  <Play className="w-5 h-5" />
                                ) : isUnlocked ? (
                                  <div className="w-5 h-5 rounded-full border-2 border-current" />
                                ) : (
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium text-sm ${
                                  isCurrent ? 'text-blue-900' : 'text-gray-900'
                                }`}>
                                  {lesson.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-500">{lesson.duration}</span>
                                  {!isUnlocked && !isCompleted && (
                                    <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded">🔒 80% required</span>
                                  )}
                                  {lesson.videoQuality === 'must-watch' && (
                                    <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">⭐</span>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
                <h3 className="font-semibold mb-2">Keep Your Streak!</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Study every day to build your streak and earn badges.
                </p>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="font-bold">{progress.streak} days</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Flame({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function Zap({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
