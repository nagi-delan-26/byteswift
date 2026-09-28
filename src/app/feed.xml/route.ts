import { getPosts } from '@/lib/blogger';

export const revalidate = 3600;

export async function GET() {
  const posts = await getPosts();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.byteswifts.com';
  
  let rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Byteswift Digital</title>
      <link>${siteUrl}</link>
      <description>Tech analysis, Windows performance optimization, AI tools, and cybersecurity insights</description>
      <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
  `;

  posts.forEach(post => {
    rss += `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${siteUrl}${post.path}</link>
        <guid isPermaLink="true">${siteUrl}${post.path}</guid>
        <pubDate>${new Date(post.published).toUTCString()}</pubDate>
        <description><![CDATA[${post.excerpt}]]></description>
      </item>
    `;
  });

  rss += `
    </channel>
  </rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
