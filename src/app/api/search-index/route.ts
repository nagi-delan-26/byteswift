import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/blogger';

export const revalidate = 3600;

export async function GET() {
  const posts = await getPosts();
  
  const index = posts.map(p => ({
    title: p.title,
    excerpt: p.excerpt,
    path: p.path,
    url: p.url,
    labels: p.labels
  }));

  return NextResponse.json(index);
}
