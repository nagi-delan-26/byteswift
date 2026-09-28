import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { pingSearchEngines } from '@/lib/seo';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && !process.env.VERCEL_CRON) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Revalidate the Next.js cache for posts
    revalidateTag('posts', 'max');

    // 2. Trigger Vercel Deploy Hook (if configured)
    if (process.env.DEPLOY_HOOK_URL) {
      await fetch(process.env.DEPLOY_HOOK_URL, { method: 'POST' });
    }

    // 3. Ping Search Engines with the updated sitemap
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.byteswifts.com';
    pingSearchEngines(`${siteUrl}/sitemap.xml`);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
