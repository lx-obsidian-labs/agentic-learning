export interface VideoSource {
  id: string;
  name: string;
  type: 'youtube' | 'invidious' | 'oembed' | 'curated';
  baseUrl: string;
  requiresAuth: boolean;
  rateLimit: number;
  description: string;
}

export const VIDEO_SOURCES: VideoSource[] = [
  {
    id: 'invidious',
    name: 'Invidious',
    type: 'invidious',
    baseUrl: 'https://invidious.jingl.xyz',
    requiresAuth: false,
    rateLimit: 100,
    description: 'Privacy-friendly YouTube frontend with API - no API key needed'
  },
  {
    id: 'invidious-alt',
    name: 'Invidious (Alternate)',
    type: 'invidious',
    baseUrl: 'https://invidious.snopyta.org',
    requiresAuth: false,
    rateLimit: 100,
    description: 'Alternate Invidious instance'
  },
  {
    id: 'invidious-ycombinator',
    name: 'Invidious (Y Combinator)',
    type: 'invidious',
    baseUrl: 'https://yewtu.be',
    requiresAuth: false,
    rateLimit: 100,
    description: 'Another Invidious instance'
  },
  {
    id: 'oembed',
    name: 'oEmbed',
    type: 'oembed',
    baseUrl: 'https://noembed.com/embed',
    requiresAuth: false,
    rateLimit: 1000,
    description: 'Universal oEmbed API - works with YouTube, Vimeo, and more'
  },
  {
    id: 'youtube-oembed',
    name: 'YouTube oEmbed',
    type: 'oembed',
    baseUrl: 'https://www.youtube.com/oembed',
    requiresAuth: false,
    rateLimit: 1000,
    description: 'Official YouTube oEmbed endpoint'
  },
  {
    id: 'curated',
    name: 'Curated SA Content',
    type: 'curated',
    baseUrl: 'local',
    requiresAuth: false,
    rateLimit: Infinity,
    description: 'Hand-picked educational videos from SA channels'
  }
];

export const SA_EDUCATIONAL_CHANNELS = [
  {
    id: 'mindset-learn',
    name: 'Mindset Learn',
    youtubeChannelId: 'UCkyfhR3EkW4WukL5LrvmjNQ',
    description: 'Official Mindset Learn - CAPS aligned for Grades 10-12',
    subjects: ['mathematics', 'physical-sciences', 'life-sciences', 'geography', 'accounting', 'economics'],
    website: 'https://www.mindset.co.za/'
  },
  {
    id: 'thuma-mina-teaching',
    name: 'Thuma Mina Teaching',
    youtubeChannelId: 'UCw3C46lS5L2hT5Z8g5MqP9w',
    description: 'Free CAPS video lessons for Grade 7-9',
    subjects: ['geography', 'history', 'life-sciences'],
    website: 'https://tmteaching.co.za/'
  },
  {
    id: 'khan-academy',
    name: 'Khan Academy',
    youtubeChannelId: 'UC8ytrG1kE5i5Kf1GYYk6q3A',
    description: 'World-class education for anyone, anywhere',
    subjects: ['mathematics', 'physical-sciences', 'computer-science', 'economics'],
    website: 'https://www.khanacademy.org/'
  },
  {
    id: 'exam-solutions',
    name: 'ExamSolutions',
    youtubeChannelId: 'UC4sm6vNjMitM44eMlG8K8fQ',
    description: 'Maths exam preparation and tutorials',
    subjects: ['mathematics'],
    website: 'https://www.examsolutions.net/'
  },
  {
    id: 'physics-girl',
    name: 'Physics Girl',
    youtubeChannelId: 'UC7DdEm33Syaa93OR撤銷q1V2Gw',
    description: 'Physics experiments and explanations',
    subjects: ['physical-sciences'],
    website: 'https://www.physicsgirl.org/'
  },
  {
    id: 'organic-chemistry-tutor',
    name: 'The Organic Chemistry Tutor',
    youtubeChannelId: 'UC8L8k-p5J16_2V1V9t2g8aA',
    description: 'Math, Chemistry, and Physics tutorials',
    subjects: ['mathematics', 'physical-sciences'],
    website: 'https://www.youtube.com/c/TheOrganicChemistryTutor'
  },
  {
    id: 'prof-leonard',
    name: 'Professor Leonard',
    youtubeChannelId: 'UC5f8hN8t3n0lX5L8V9t2g8aA',
    description: 'University-level mathematics and calculus',
    subjects: ['mathematics'],
    website: 'https://www.youtube.com/c/ProfessorLeonard'
  },
  {
    id: 'crash-course',
    name: 'CrashCourse',
    youtubeChannelId: 'UCXgGY0wkgOzynnHvSEVmE3A',
    description: 'Fast-paced educational videos on many subjects',
    subjects: ['history', 'geography', 'economics', 'life-sciences'],
    website: 'https://crashcourse.com/'
  },
  {
    id: '3blue1brown',
    name: '3Blue1Brown',
    youtubeChannelId: 'UCYO_jab_esuFRV4b17AJtAw',
    description: 'Beautiful math visualizations',
    subjects: ['mathematics'],
    website: 'https://www.3blue1brown.com/'
  },
  {
    id: 'veritasium',
    name: 'Veritasium',
    youtubeChannelId: 'UCHnyfMqiRRG1u-2MsSQLbXA',
    description: 'Science and physics videos',
    subjects: ['physical-sciences', 'life-sciences'],
    website: 'https://www.veritasium.com/'
  }
];

export const INVIDIOUS_INSTANCES = [
  'https://invidious.jingl.xyz',
  'https://invidious.snopyta.org',
  'https://yewtu.be',
  'https://invidious.kavin.rocks',
  'https://invidious.projectsegfau.lt'
];

export function getRandomInvidiousInstance(): string {
  return INVIDIOUS_INSTANCES[Math.floor(Math.random() * INVIDIOUS_INSTANCES.length)];
}
