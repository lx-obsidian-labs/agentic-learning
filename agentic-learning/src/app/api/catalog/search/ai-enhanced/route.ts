import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

const API_KEY = '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';
const MODEL = 'stepfun/step-3.5-flash:free';

const SearchRequestSchema = z.object({
  query: z.string().min(1).max(200),
  context: z.object({
    subject: z.string().optional(),
    grade: z.number().optional(),
    recentSearches: z.array(z.string()).optional(),
    completedTopics: z.array(z.string()).optional(),
  }).optional(),
});

interface SearchSuggestion {
  type: 'topic' | 'lesson' | 'concept' | 'practice';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: string;
  relatedConcepts?: string[];
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = SearchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  const { query, context } = parsed.data;

  const openai = new OpenAI({
    apiKey: API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
  });

  try {
    const systemPrompt = `You are an educational search assistant for Grade 12 South African students.

Given a search query, provide intelligent learning recommendations. Consider:
- The student's grade level and curriculum (CAPS/NSC)
- What they likely want to learn next based on the query
- Whether they need foundational knowledge first
- Practical study suggestions

Respond with a JSON array of 5-7 recommendations. Each recommendation should have:
- type: 'topic' | 'lesson' | 'concept' | 'practice'
- title: Clear, specific title
- description: Brief explanation why this is relevant
- priority: 'high' | 'medium' | 'low' based on likelihood of need
- estimatedTime: e.g., '30 min' (optional)
- relatedConcepts: array of related topics (optional)

Example response format:
[
  {
    "type": "topic",
    "title": "Derivatives - Chain Rule",
    "description": "Master the chain rule for composite functions",
    "priority": "high",
    "estimatedTime": "45 min",
    "relatedConcepts": ["functions", "composite functions"]
  }
]

Focus on actionable, specific learning recommendations.`;

    const userPrompt = `Search query: "${query}"
${context?.subject ? `Subject: ${context.subject}` : ''}
${context?.grade ? `Grade: ${context.grade}` : 'Grade: 12'}
${context?.completedTopics?.length ? `Already studied: ${context.completedTopics.join(', ')}` : ''}

Provide learning recommendations for this search.`;

    const completion = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.3,
      max_tokens: 800,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' }
    });

    const content = completion.choices?.[0]?.message?.content?.trim();
    
    let recommendations: SearchSuggestion[] = [];
    
    if (content) {
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          recommendations = parsed;
        } else if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
          recommendations = parsed.recommendations;
        }
      } catch {
        recommendations = [];
      }
    }

    return NextResponse.json({
      query,
      recommendations,
      context: {
        subject: context?.subject || 'General',
        searchedAt: new Date().toISOString(),
      }
    });

  } catch (err) {
    console.error('Search recommendations error:', err);
    return NextResponse.json(
      { error: 'Search failed', recommendations: [] },
      { status: 500 }
    );
  }
}
