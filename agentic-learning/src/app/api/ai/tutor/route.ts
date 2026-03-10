import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { auth, currentUser } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

const API_KEY = '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';
const MODEL = 'stepfun/step-3.5-flash:free';

const TutorRequestSchema = z.object({
  message: z.string().min(1).max(4000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
  context: z.object({
    courseId: z.string().optional(),
    lessonId: z.string().optional(),
    progress: z.object({
      completedLessons: z.array(z.string()).optional(),
      quizScores: z.array(z.any()).optional(),
      weakAreas: z.array(z.string()).optional(),
      strongAreas: z.array(z.string()).optional(),
      streak: z.number().optional(),
      level: z.number().optional(),
    }).optional(),
  }).optional(),
  type: z.enum(['tutor', 'suggestions', 'analytics', 'report', 'adaptive', 'goals', 'quiz', 'spaced-repetition', 'socratic', 'study-plan', 'gap-analysis']).optional(),
  pageContext: z.object({
    page: z.string(),
    subject: z.object({ id: z.string(), name: z.string() }).optional(),
    course: z.object({ id: z.string(), name: z.string() }).optional(),
    lesson: z.object({ id: z.string(), name: z.string() }).optional(),
  }).optional(),
  needsResearch: z.boolean().optional(),
});

async function performWebResearch(query: string): Promise<{ results: Array<{ title: string; url: string; snippet: string }> }> {
  const searchUrl = `https://ddg-api.vercel.app/search?q=${encodeURIComponent(query)}&max_results=5`;
  
  try {
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      return { results: [] };
    }
    
    const data = await response.json();
    return {
      results: data.map((r: { title: string; url: string; body: string }) => ({
        title: r.title,
        url: r.url,
        snippet: r.body?.substring(0, 300) || '',
      }))
    };
  } catch {
    return { results: [] };
  }
}

async function checkRateLimit(userId: string): Promise<boolean> {
  try {
    const { ratelimit } = await import('@/lib/ratelimit');
    const { success } = await ratelimit.limit(userId);
    return success;
  } catch {
    return true;
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Please sign in to use the AI Tutor' }, { status: 401 });
  }

  const rateLimitOk = await checkRateLimit(userId);
  if (!rateLimitOk) {
    return NextResponse.json(
      { error: 'Too many requests! Please wait a moment.' },
      { status: 429 }
    );
  }

  const user = await currentUser();
  const userName = user?.firstName || user?.username || undefined;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
  }

  const parsed = TutorRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  const { message, history, context, type = 'tutor', pageContext, needsResearch } = parsed.data;

  const openai = new OpenAI({
    apiKey: API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
  });

  const shouldResearch = needsResearch || type === 'tutor';

  let researchResults: Array<{ title: string; url: string; snippet: string }> = [];
  
  if (shouldResearch && type === 'tutor') {
    try {
      const researchQuery = `${message} grade 12 south africa matric`;
      const research = await performWebResearch(researchQuery);
      researchResults = research.results;
    } catch {
      researchResults = [];
    }
  }

  try {
    const { getSystemPrompt } = await import('@/lib/tutorPrompts');
    let systemPrompt = getSystemPrompt(type, userName, pageContext, context?.progress);

    if (researchResults.length > 0) {
      const researchContext = `\n\n## 📚 Additional Reference Materials:\n${researchResults.map((r, i) => `${i + 1}. **${r.title}**\n${r.snippet}\nSource: ${r.url}`).join('\n\n')}\n\nUse these to provide accurate, up-to-date information.`;
      systemPrompt += researchContext;
    }

    const userPrompt = [
      context?.courseId ? `Course: ${context.courseId}` : null,
      context?.lessonId ? `Lesson: ${context.lessonId}` : null,
      context?.progress ? `Progress: Level ${context.progress.level || 1}, Streak: ${context.progress.streak || 0} days` : null,
      '',
      `📝 **Your Question:**`,
      message,
      '',
      '---',
      'Provide a helpful, clear response. Be friendly and educational!',
    ].filter(Boolean).join('\n');

    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
    ];

    if (history && history.length > 0) {
      messages.push(...history.map(h => ({
        role: h.role as 'user' | 'assistant',
        content: h.content,
      })));
    }

    messages.push({ role: 'user', content: userPrompt });

    const completion = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.7,
      max_tokens: 1500,
      messages,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || 
      "I'm having trouble thinking of a response right now. Can you try asking in a different way?";

    return NextResponse.json({ 
      reply, 
      safety: { flagged: false },
      sources: researchResults.length > 0 ? researchResults.map(r => ({ title: r.title, url: r.url })) : undefined
    });
  } catch (err) {
    console.error('AI Tutor error:', err);
    
    const errorMessage = err instanceof Error ? err.message : String(err);
    
    if (errorMessage.includes('API key') || errorMessage.includes('api key') || errorMessage.includes('401')) {
      return NextResponse.json(
        { reply: "I'm having trouble connecting to my brain right now. The API key seems invalid. Please check the configuration! 🤖", safety: { flagged: false } },
        { status: 500 }
      );
    }
    
    if (errorMessage.includes('rate limit') || errorMessage.includes('Rate limit')) {
      return NextResponse.json(
        { reply: "Whoa there! I'm getting too many requests. Give me a moment! 😅", safety: { flagged: false } },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { reply: "Oops! Something went wrong. But don't worry - try again and I'll do my best! 🤗", safety: { flagged: false }, error: errorMessage },
      { status: 500 }
    );
  }
}
