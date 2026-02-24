export interface Competition {
  id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  description: string;
  prizes: Prize[];
  status: 'upcoming' | 'active' | 'ended';
}

export interface Prize {
  rank: number;
  title: string;
  description: string;
  value: number;
}

export interface CompetitionEntry {
  id: string;
  studentId: string;
  studentName: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  completedLessons: number;
  badges: number;
  rank: number;
}

export const competitions: Competition[] = [
  {
    id: 'matric-2026',
    name: 'Matric Mastery Championship 2026',
    year: 2026,
    startDate: '2026-01-15',
    endDate: '2026-11-30',
    description: 'The ultimate competition for South African matric students. Top performers win prizes while mastering their subjects!',
    status: 'active',
    prizes: [
      { rank: 1, title: '🏆 Grand Champion', description: 'Full scholarship to university of choice', value: 50000 },
      { rank: 2, title: '🥈 2nd Place', description: 'R10,000 study bursary', value: 10000 },
      { rank: 3, title: '🥉 3rd Place', description: 'R5,000 study voucher', value: 5000 },
      { rank: 4, title: '🥇 4th Place', description: 'R2,500 book voucher', value: 2500 },
      { rank: 5, title: '🥇 5th Place', description: 'R2,500 book voucher', value: 2500 },
      { rank: 6, title: '⭐ 6th Place', description: 'R1,000 stationery pack', value: 1000 },
      { rank: 7, title: '⭐ 7th Place', description: 'R1,000 stationery pack', value: 1000 },
      { rank: 8, title: '⭐ 8th Place', description: 'R1,000 stationery pack', value: 1000 },
      { rank: 9, title: '⭐ 9th Place', description: 'R1,000 stationery pack', value: 1000 },
      { rank: 10, title: '⭐ 10th Place', description: 'R1,000 stationery pack', value: 1000 },
    ]
  },
  {
    id: 'matric-2025',
    name: 'Matric Mastery Championship 2025',
    year: 2025,
    startDate: '2025-01-15',
    endDate: '2025-11-30',
    description: 'Last year\'s competition winners.',
    status: 'ended',
    prizes: [
      { rank: 1, title: '🏆 Grand Champion', description: 'University acceptance + R50,000', value: 50000 },
      { rank: 2, title: '🥈 2nd Place', description: 'R10,000 study bursary', value: 10000 },
      { rank: 3, title: '🥉 3rd Place', description: 'R5,000 study voucher', value: 5000 },
      { rank: 4, title: '🥇 4th Place', description: 'R2,500 book voucher', value: 2500 },
      { rank: 5, title: '🥇 5th Place', description: 'R2,500 book voucher', value: 2500 },
      { rank: 6, title: '⭐ 6th Place', description: 'R1,000 stationery pack', value: 1000 },
      { rank: 7, title: '⭐ 7th Place', description: 'R1,000 stationery pack', value: 1000 },
      { rank: 8, title: '⭐ 8th Place', description: 'R1,000 stationery pack', value: 1000 },
      { rank: 9, title: '⭐ 9th Place', description: 'R1,000 stationery pack', value: 1000 },
      { rank: 10, title: '⭐ 10th Place', description: 'R1,000 stationery pack', value: 1000 },
    ]
  }
];

export const mockCompetitionLeaderboard: CompetitionEntry[] = [
  { id: '1', studentId: 'you', studentName: 'You', avatar: '🎓', xp: 2450, level: 8, streak: 12, completedLessons: 45, badges: 8, rank: 1 },
  { id: '2', studentId: 'sarah', studentName: 'Sarah M.', avatar: '👩‍🎓', xp: 4500, level: 12, streak: 45, completedLessons: 120, badges: 28, rank: 2 },
  { id: '3', studentId: 'james', studentName: 'James K.', avatar: '👨‍💻', xp: 3800, level: 11, streak: 32, completedLessons: 95, badges: 24, rank: 3 },
  { id: '4', studentId: 'emily', studentName: 'Emily R.', avatar: '👩‍🔬', xp: 3200, level: 10, streak: 28, completedLessons: 82, badges: 21, rank: 4 },
  { id: '5', studentId: 'michael', studentName: 'Michael T.', avatar: '👨‍🎨', xp: 2800, level: 9, streak: 21, completedLessons: 68, badges: 18, rank: 5 },
  { id: '6', studentId: 'anna', studentName: 'Anna L.', avatar: '👩‍🏫', xp: 2400, level: 8, streak: 18, completedLessons: 55, badges: 15, rank: 6 },
  { id: '7', studentId: 'david', studentName: 'David W.', avatar: '👨‍🔧', xp: 2000, level: 7, streak: 14, completedLessons: 42, badges: 12, rank: 7 },
  { id: '8', studentId: 'lisa', studentName: 'Lisa P.', avatar: '👩‍⚕️', xp: 1650, level: 6, streak: 10, completedLessons: 35, badges: 10, rank: 8 },
  { id: '9', studentId: 'tom', studentName: 'Tom H.', avatar: '👨‍🌾', xp: 1300, level: 5, streak: 7, completedLessons: 28, badges: 8, rank: 9 },
  { id: '10', studentId: 'emma', studentName: 'Emma J.', avatar: '👩‍🎤', xp: 950, level: 4, streak: 5, completedLessons: 22, badges: 6, rank: 10 },
];

export function getActiveCompetition(): Competition | undefined {
  return competitions.find(c => c.status === 'active');
}

export function getCompetitionById(id: string): Competition | undefined {
  return competitions.find(c => c.id === id);
}
