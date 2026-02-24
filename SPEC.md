# Agentic Learning - E-Learning Platform Specification

## Project Overview
- **Project Name**: Agentic Learning
- **Brand**: Powered by LX Obsidian Labs
- **Target Audience**: Matric Students (Grade 12)
- **Core Focus**: Focused notes, strategic video selection, AI-powered learning

---

## 1. Core Features

### 1.1 Course System
- **Subject Categories**: Mathematics, Physical Sciences, Life Sciences, Geography, Accounting, Economics, English, Afrikaans
- **Advanced Course Setup**: Teachers/Admins can create custom courses with:
  - Custom modules and lessons
  - Prerequisites for courses
  - Difficulty levels (Beginner, Intermediate, Advanced)
  - Estimated completion time

### 1.2 Notes System
- **Rich Text Notes**: Markdown-supported notes per lesson
- **Quick Summaries**: AI-generated key points per topic
- **Key Concepts**: Highlighted important formulas/definitions
- **Downloadable**: Export notes as PDF

### 1.3 Video System
- **YouTube Embedding**: Custom video player with:
  - Playback speed control (0.5x - 2x)
  - Timestamp markers for key topics
  - Auto-bookmark important sections
  - Quality selection
- **Strategic Video Selection**:
  - AI recommends best videos per topic
  - Videos ranked by: clarity, length, relevance, student ratings
  - "Must-Watch" vs "Supplementary" labels

### 1.4 AI Features (Powered by LX Obsidian Labs)
- **Smart Study Plans**: Personalized schedules based on weak areas
- **Quiz Generation**: Auto-generate practice questions
- **Progress Analytics**: Track understanding per topic
- **Video Recommendations**: AI suggests next best video

---

## 2. User Roles

| Role | Access |
|------|--------|
| Student | View courses, watch videos, read notes, take quizzes |
| Teacher | Create courses, upload notes, curate videos |
| Admin | Full system access, user management |

---

## 3. Technology Stack (Recommended)

- **Frontend**: Next.js (React) + Tailwind CSS
- **Backend**: Node.js + Express or Next.js API routes
- **Database**: PostgreSQL or MongoDB
- **AI Integration**: OpenAI API / Claude API
- **Video**: YouTube IFrame API
- **Auth**: NextAuth.js or Clerk

---

## 4. Data Models

### Course
```
- id, title, description, subject, grade
- modules: [{ title, lessons: [{ title, videoUrl, notes, duration }] }]
- difficulty, prerequisites, createdBy
```

### Student Progress
```
- userId, courseId, completedLessons
- quizScores, timeSpent, lastAccessed
```

### Video Metadata
```
- youtubeId, title, duration, topic
- quality: "must-watch" | "supplementary"
- source, views, rating
```

---

## 5. Phase 1: MVP Scope (Matric Focus)

1. **Landing Page**: Subject selection, featured courses
2. **Course Viewer**: Lessons with YouTube embed + notes side-by-side
3. **Video Player**: Custom controls, progress tracking
4. **Notes Display**: Clean, focused reading experience
5. **Basic Progress Tracking**: What students completed

---

## 6. Design Principles

- **Minimalist**: Focus on learning, no distractions
- **Dark/Light Mode**: Student preference
- **Fast Loading**: Optimized video previews
- **Mobile-Responsive**: Study anywhere
- **Strategic Simplicity**: Only show what's needed

---

## Next Steps

1. Initialize project with Next.js
2. Set up database schema
3. Build landing page + course listing
4. Implement video player component
5. Add notes viewer
6. Integrate AI features

---

*Agentic Learning - Powered by LX Obsidian Labs*
*Learning, Reimagined.*
