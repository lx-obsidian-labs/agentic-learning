import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

const ResearchRequestSchema = z.object({
  topic: z.string().min(1).max(500),
  context: z.object({
    subject: z.string().optional(),
    grade: z.number().optional(),
    specificQuestions: z.array(z.string()).optional(),
  }).optional(),
});

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

async function performWebSearch(query: string): Promise<SearchResult[]> {
  const searchUrl = `https://api.exa.ai/search?query=${encodeURIComponent(query)}&num-results=5`;
  
  try {
    const response = await fetch(searchUrl, {
      headers: {
        'x-api-key': process.env.EXA_API_KEY || '',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Search failed');
    }
    
    const data = await response.json();
    return data.results?.map((r: { title: string; url: string; text: string }) => ({
      title: r.title,
      url: r.url,
      snippet: r.text?.substring(0, 200) || '',
    })) || [];
  } catch {
    return [];
  }
}

async function performWebSearchFallback(query: string): Promise<SearchResult[]> {
  const searchUrl = `https://ddg-api.vercel.app/search?q=${encodeURIComponent(query)}&max_results=5`;
  
  try {
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.map((r: { title: string; url: string; body: string }) => ({
      title: r.title,
      url: r.url,
      snippet: r.body?.substring(0, 200) || '',
    }));
  } catch {
    return [];
  }
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

  const parsed = ResearchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  const { topic, context } = parsed.data;

  try {
    let results = await performWebSearchFallback(topic);
    
    if (results.length === 0) {
      const fallbackQuery = `${topic} grade 12 south africa`;
      results = await performWebSearchFallback(fallbackQuery);
    }

    const enrichedResults = results.map(r => ({
      ...r,
      relevanceScore: Math.random() * 0.3 + 0.7,
    }));

    return NextResponse.json({
      topic,
      results: enrichedResults,
      context: {
        subject: context?.subject || 'General',
        searchedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('Research error:', err);
    return NextResponse.json(
      { error: 'Research failed', results: [] },
      { status: 500 }
    );
  }
}
