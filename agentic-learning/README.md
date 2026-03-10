# Agentic Learning

AI-powered e-learning platform for South African matric students (Grade 12): focused notes, strategic video selection, quizzes, progress analytics, and an AI study tutor.

## Tech stack
- Next.js 15 (App Router) + React 18
- Tailwind CSS v4
- TypeScript

## Quickstart
Requirements: Node.js 20+

```bash
cd agentic-learning
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Scripts
- `npm run dev` — local dev server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript typecheck
- `npm run build` — production build
- `npm run check` — lint + typecheck + build
- `npm run db:push` — push Prisma schema to DB (dev)
- `npm run db:migrate` — create/apply migrations (dev)
- `npm run db:seed` — seed DB from `src/data/courses.ts`

## Environment variables
Copy `.env.example` to `.env.local` and fill what you need.

- `OPENAI_API_KEY` — enables the AI Tutor API
- `OPENAI_MODEL` — optional (defaults in code)
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — optional rate limiting backend
- `DATABASE_URL`, `DIRECT_URL` — Postgres connection strings for Prisma (Supabase/Neon/etc)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` — Clerk auth (future workstream)

## Specification
See `../SPEC.md` for the product spec and roadmap.

## Deployment
Recommended: Vercel.
- Set environment variables in Vercel project settings
- Deploy the `agentic-learning` directory as the root (or set a root directory in Vercel)
