'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { 
  ChevronLeft, 
  Brain, 
  Download, 
  Share2, 
  Target,
  TrendingUp,
  BookOpen,
  Calculator,
  Music,
  Palette,
  Users,
  Activity,
  Lightbulb,
  Award,
  FileText,
  Printer,
  Mail,
  CheckCircle,
  Clock,
  Zap,
  Star,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface IntelligenceScores {
  overall: number;
  logicalMathematical: number;
  linguistic: number;
  spatial: number;
  interpersonal: number;
  intrapersonal: number;
  naturalist: number;
  creativity: number;
  memory: number;
  processingSpeed: number;
}

interface CareerPath {
  title: string;
  description: string;
  matchPercentage: number;
  subjects: string[];
  icon: string;
}

export default function IntelligenceReportPage() {
  const { progress, getLearningInsights } = useProgress();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const intelligenceScores = useMemo((): IntelligenceScores => {
    const analytics = progress.analytics;
    const quizScores = progress.quizScores;
    const completedLessons = progress.completedLessons;
    
    if (quizScores.length === 0) {
      return {
        overall: 85,
        logicalMathematical: 80,
        linguistic: 85,
        spatial: 75,
        interpersonal: 70,
        intrapersonal: 75,
        naturalist: 70,
        creativity: 72,
        memory: 78,
        processingSpeed: 80
      };
    }

    const avgScore = analytics.averageQuizScore || 0;
    const totalQuizzes = quizScores.length;
    const masteredTopics = analytics.masteredTopics?.length || 0;
    const studyTime = analytics.totalStudyTime || 0;
    const streak = progress.streak || 0;
    
    const baseScore = Math.min(130, 70 + avgScore * 0.6);
    const bonus = Math.min(20, totalQuizzes * 2);
    const consistencyBonus = streak ? Math.min(10, streak) : 0;
    
    const logicalMathematical = Math.min(145, baseScore + bonus + (masteredTopics > 3 ? 10 : 0));
    const linguistic = Math.min(145, baseScore + (completedLessons.length * 1.5));
    const spatial = Math.min(145, baseScore - 5 + (studyTime > 60 ? 10 : 0));
    const interpersonal = Math.min(145, baseScore - 10 + (progress.badges.length * 2));
    const intrapersonal = Math.min(145, baseScore - 5 + (consistencyBonus * 2));
    const naturalist = Math.min(145, baseScore - 8 + (masteredTopics * 3));
    const creativity = Math.min(145, baseScore - 3 + (analytics.activeRecallScore ? 5 : 0));
    const memory = Math.min(145, baseScore + (studyTime * 0.1));
    const processingSpeed = Math.min(145, baseScore + (totalQuizzes > 5 ? 10 : 0));
    
    const overall = Math.round(
      (logicalMathematical * 0.25) +
      (linguistic * 0.20) +
      (spatial * 0.10) +
      (interpersonal * 0.10) +
      (intrapersonal * 0.10) +
      (naturalist * 0.05) +
      (creativity * 0.05) +
      (memory * 0.08) +
      (processingSpeed * 0.07)
    );

    return {
      overall,
      logicalMathematical: Math.round(logicalMathematical),
      linguistic: Math.round(linguistic),
      spatial: Math.round(spatial),
      interpersonal: Math.round(interpersonal),
      intrapersonal: Math.round(intrapersonal),
      naturalist: Math.round(naturalist),
      creativity: Math.round(creativity),
      memory: Math.round(memory),
      processingSpeed: Math.round(processingSpeed)
    };
  }, [progress]);

  const careerPaths: CareerPath[] = useMemo(() => {
    const topics = Object.keys(progress.analytics.topicScores || {});
    const scores = intelligenceScores;
    
    const paths: CareerPath[] = [
      {
        title: 'STEM Research Scientist',
        description: 'Ideal for strong logical-mathematical and analytical thinking',
        matchPercentage: Math.round((scores.logicalMathematical / 145) * 100),
        subjects: ['Mathematics', 'Physical Sciences'],
        icon: '🔬'
      },
      {
        title: 'Software Engineer',
        description: 'Best for problem-solving and computational thinking',
        matchPercentage: Math.round((scores.logicalMathematical / 145) * 100 - 5),
        subjects: ['Mathematics', 'Computer Science'],
        icon: '💻'
      },
      {
        title: 'Medical Professional',
        description: 'Combines scientific knowledge with interpersonal skills',
        matchPercentage: Math.round(((scores.logicalMathematical + scores.interpersonal) / 290) * 100),
        subjects: ['Biology', 'Chemistry'],
        icon: '🏥'
      },
      {
        title: 'Law & Legal Studies',
        description: 'Strong linguistic and interpersonal abilities',
        matchPercentage: Math.round(((scores.linguistic + scores.interpersonal) / 290) * 100),
        subjects: ['Languages', 'History'],
        icon: '⚖️'
      },
      {
        title: 'Creative Director',
        description: 'Spatial intelligence combined with creativity',
        matchPercentage: Math.round(((scores.spatial + scores.creativity) / 290) * 100),
        subjects: ['Art', 'Design'],
        icon: '🎨'
      },
      {
        title: 'Financial Analyst',
        description: 'Strong numerical and analytical capabilities',
        matchPercentage: Math.round((scores.logicalMathematical / 145) * 100 - 10),
        subjects: ['Mathematics', 'Accounting'],
        icon: '📊'
      },
      {
        title: 'Education Professional',
        description: 'Combines linguistic with interpersonal intelligence',
        matchPercentage: Math.round(((scores.linguistic + scores.interpersonal) / 290) * 100 - 8),
        subjects: ['Languages', 'Pedagogy'],
        icon: '📚'
      },
      {
        title: 'Environmental Scientist',
        description: 'Naturalist intelligence with analytical thinking',
        matchPercentage: Math.round(((scores.naturalist + scores.logicalMathematical) / 290) * 100),
        subjects: ['Biology', 'Geography'],
        icon: '🌍'
      }
    ];

    return paths.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 5);
  }, [progress, intelligenceScores]);

  const getIQCategory = (score: number): { label: string; color: string; description: string } => {
    if (score >= 130) return { label: 'Gifted', color: 'text-purple-600', description: 'Exceptionally high cognitive ability' };
    if (score >= 120) return { label: 'Superior', color: 'text-blue-600', description: 'Above average cognitive ability' };
    if (score >= 110) return { label: 'High Average', color: 'text-green-600', description: 'Above average cognitive ability' };
    if (score >= 90) return { label: 'Average', color: 'text-yellow-600', description: 'Typical cognitive ability' };
    if (score >= 80) return { label: 'Low Average', color: 'text-orange-600', description: 'Below average cognitive ability' };
    return { label: 'Below Average', color: 'text-red-600', description: 'Requires additional support' };
  };

  const getIntelligenceType = (score: number): string => {
    if (score >= 130) return 'Exceptional Strength';
    if (score >= 115) return 'Strong';
    if (score >= 100) return 'Average';
    if (score >= 85) return 'Developing';
    return 'Needs Support';
  };

  const handleDownloadReport = () => {
    setIsGenerating(true);
    
    const reportContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Student Intelligence Report - Agentic Learning</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #1a1a1a; }
    .header { text-align: center; padding: 30px 0; border-bottom: 3px solid #3b82f6; margin-bottom: 30px; }
    .header h1 { font-size: 28px; color: #111; margin-bottom: 10px; }
    .header p { color: #666; }
    .score-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px; }
    .score-card h2 { font-size: 48px; margin-bottom: 10px; }
    .score-card p { opacity: 0.9; }
    .category { background: #f0f9ff; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #3b82f6; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .grid-item { background: #f9fafb; padding: 15px; border-radius: 8px; }
    .grid-item h4 { font-size: 12px; color: #666; text-transform: uppercase; }
    .grid-item p { font-size: 24px; font-weight: bold; }
    .strengths, .weaknesses { padding: 20px; border-radius: 12px; margin-bottom: 20px; }
    .strengths { background: #dcfce7; border-left: 4px solid #22c55e; }
    .weaknesses { background: #fef3c7; border-left: 4px solid #f59e0b; }
    .careers { background: #f3e8ff; padding: 20px; border-radius: 12px; border-left: 4px solid #a855f7; }
    .career-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧠 Cognitive Intelligence Report</h1>
    <p>Generated by Agentic Learning • ${new Date().toLocaleDateString()}</p>
  </div>
  
  <div class="score-card">
    <h2>${intelligenceScores.overall}</h2>
    <p>Overall Cognitive Score</p>
    <p style="margin-top: 10px; font-size: 18px;">${getIQCategory(intelligenceScores.overall).label}</p>
  </div>
  
  <div class="category">
    <h3 style="margin-bottom: 10px;">📊 Score Breakdown</h3>
    <div class="grid">
      <div class="grid-item"><h4>Logical-Mathematical</h4><p>${intelligenceScores.logicalMathematical}</p></div>
      <div class="grid-item"><h4>Linguistic</h4><p>${intelligenceScores.linguistic}</p></div>
      <div class="grid-item"><h4>Spatial</h4><p>${intelligenceScores.spatial}</p></div>
      <div class="grid-item"><h4>Interpersonal</h4><p>${intelligenceScores.interpersonal}</p></div>
      <div class="grid-item"><h4>Memory</h4><p>${intelligenceScores.memory}</p></div>
      <div class="grid-item"><h4>Processing Speed</h4><p>${intelligenceScores.processingSpeed}</p></div>
    </div>
  </div>
  
  <div class="strengths">
    <h3 style="margin-bottom: 10px;">💪 Strengths</h3>
    <p>${progress.analytics.strongestTopic || 'Mathematics & Logic'} - ${getIntelligenceType(intelligenceScores.logicalMathematical)}</p>
  </div>
  
  <div class="weaknesses">
    <h3 style="margin-bottom: 10px;">🎯 Areas for Development</h3>
    <p>${progress.analytics.weakestTopic || 'Continue learning to identify'}</p>
  </div>
  
  <div class="careers">
    <h3 style="margin-bottom: 15px;">🚀 Recommended Career Paths</h3>
    ${careerPaths.slice(0, 3).map(c => `
      <div class="career-item">
        <span>${c.icon} ${c.title}</span>
        <strong>${c.matchPercentage}% Match</strong>
      </div>
    `).join('')}
  </div>
  
  <div class="footer">
    <p>This report is generated based on learning analytics and quiz performance.</p>
    <p>For educational purposes only. Not a clinical assessment.</p>
    <p>Agentic Learning - Empowering Students Worldwide</p>
  </div>
</body>
</html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        setIsGenerating(false);
      }, 500);
    } else {
      setIsGenerating(false);
    }
  };

  const intelligenceTypes = [
    { key: 'logicalMathematical', label: 'Logical-Mathematical', icon: Calculator, desc: 'Problem-solving & numerical reasoning', color: 'bg-blue-100' },
    { key: 'linguistic', label: 'Linguistic', icon: BookOpen, desc: 'Language & verbal abilities', color: 'bg-green-100' },
    { key: 'spatial', label: 'Spatial', icon: Palette, desc: 'Visual & creative thinking', color: 'bg-purple-100' },
    { key: 'interpersonal', label: 'Interpersonal', icon: Users, desc: 'Social & communication skills', color: 'bg-pink-100' },
    { key: 'intrapersonal', label: 'Intrapersonal', icon: Brain, desc: 'Self-reflection & awareness', color: 'bg-indigo-100' },
    { key: 'naturalist', label: 'Naturalist', icon: Activity, desc: 'Nature & environmental awareness', color: 'bg-emerald-100' },
    { key: 'creativity', label: 'Creativity', icon: Lightbulb, desc: 'Divergent thinking & innovation', color: 'bg-yellow-100' },
    { key: 'memory', label: 'Memory', icon: Zap, desc: 'Information retention & recall', color: 'bg-cyan-100' },
    { key: 'processingSpeed', label: 'Processing Speed', icon: TrendingUp, desc: 'Cognitive processing efficiency', color: 'bg-orange-100' },
  ];

  const overallCategory = getIQCategory(intelligenceScores.overall);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Intelligence Report</h1>
                <p className="text-xs text-gray-500">Cognitive ability analysis & career guidance</p>
              </div>
            </div>
            <button
              onClick={handleDownloadReport}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Report
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-blue-100 mb-1">Overall Cognitive Score</p>
                <h2 className="text-6xl font-bold">{intelligenceScores.overall}</h2>
                <p className="text-2xl font-semibold mt-2">{overallCategory.label}</p>
              </div>
              <div className="w-32 h-32 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.2)" strokeWidth="12" fill="none" />
                  <circle 
                    cx="64" cy="64" r="56" 
                    stroke="white" 
                    strokeWidth="12" 
                    fill="none"
                    strokeDasharray={`${(intelligenceScores.overall / 145) * 352} 352`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-10 h-10" />
                </div>
              </div>
            </div>
            <p className="text-blue-100">{overallCategory.description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Multi-Intelligence Analysis
            </h3>
            <div className="space-y-4">
              {intelligenceTypes.map((type) => {
                const score = intelligenceScores[type.key as keyof IntelligenceScores];
                const percentage = (score / 145) * 100;
                
                return (
                  <div key={type.key} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${type.color}`}>
                          <type.icon className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{type.label}</p>
                          <p className="text-xs text-gray-500">{type.desc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{score}</p>
                        <p className="text-xs text-gray-500">{getIntelligenceType(score)}</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Learning Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-600">Quizzes Completed</span>
                  <span className="font-bold text-green-700">{progress.quizScores.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-bold text-blue-700">{progress.analytics.averageQuizScore}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-600">Topics Mastered</span>
                  <span className="font-bold text-purple-700">{(progress.analytics.masteredTopics || []).length}</span>
                </div>
<div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-600">Study Streak</span>
                  <span className="font-bold text-orange-700">{progress.streak} days</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Achievements
              </h3>
              <div className="flex flex-wrap gap-2">
                {progress.badges.map((badge) => (
                  <span key={badge} className="text-2xl" title={badge}>
                    {badge === 'first_lesson' && '🎯'}
                    {badge === 'quick_learner' && '⚡'}
                    {badge === 'week_streak' && '🔥'}
                    {badge === 'dedicated' && '🏆'}
                    {badge === 'month_master' && '👑'}
                    {badge === 'high_achiever' && '⭐'}
                  </span>
                ))}
                {progress.badges.length === 0 && (
                  <p className="text-gray-500 text-sm">Complete lessons to earn badges!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-500" />
            Recommended Career Paths
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {careerPaths.slice(0, 6).map((career, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{career.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900">{career.title}</p>
                    <p className="text-xs text-gray-500">{career.matchPercentage}% Match</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{career.description}</p>
                <div className="flex flex-wrap gap-1">
                  {career.subjects.map((subj, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {subj}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            Parent/Guardian Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About This Report</h4>
              <p className="text-sm text-gray-600 mb-4">
                This cognitive assessment is based on learning analytics, quiz performance, 
                and engagement patterns. It provides insight into various cognitive abilities 
                based on Howard Gardner's Multiple Intelligences theory.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Logical-Mathematical: Problem-solving abilities</li>
                <li>• Linguistic: Language and communication</li>
                <li>• Spatial: Visual and creative thinking</li>
                <li>• Interpersonal: Social and communication skills</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">How to Use This Report</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Download the full report using the button above</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Review career recommendations with your child</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Focus on strengthening weaker areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Track progress over time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
