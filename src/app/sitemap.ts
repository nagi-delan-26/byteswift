import { MetadataRoute } from 'next';
import { getPosts, getAllLabels, getSlug } from '@/lib/blogger';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const labels = await getAllLabels();
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.byteswifts.com';

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  labels.forEach(label => {
    sitemap.push({
      url: `${siteUrl}/category/${getSlug(label)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  });

  posts.forEach(post => {
    sitemap.push({
      url: `${siteUrl}${post.path}`,
      lastModified: new Date(post.updated),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  return sitemap;
}
