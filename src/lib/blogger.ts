import slugify from 'slugify';
import * as cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';

export interface BloggerPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  published: string;
  updated: string;
  url: string;
  path: string; // The relative path /YYYY/MM/slug.html
  labels: string[];
  author: string;
  image?: string;
}



// Helper to generate a slug from a string (useful for category URLs)
export function getSlug(text: string) {
  return slugify(text, { lower: true, strict: true });
}

// Extracts a safe excerpt and the first image from the HTML content
function extractPostMetadata(html: string) {
  const $ = cheerio.load(html);
  
  // Find first image
  let image = $('img').first().attr('src');
  if (image && image.startsWith('//')) {
    image = 'https:' + image;
  }

  // Get text content, strip HTML
  const text = $.text().replace(/\s+/g, ' ').trim();
  
  // Create an excerpt (~155 characters, cut off at word boundary)
  let excerpt = text.substring(0, 155);
  const lastSpace = excerpt.lastIndexOf(' ');
  if (lastSpace > 100) {
    excerpt = excerpt.substring(0, lastSpace);
  }
  excerpt = excerpt + '...';

  // Sanitize HTML body: ensure images have lazy loading and external links are secure
  $('img').attr('loading', 'lazy');
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.startsWith('http') && !href.includes('byteswifts.com')) {
      $(el).attr('target', '_blank');
      $(el).attr('rel', 'noopener noreferrer');
    }
  });

  const sanitizedContent = sanitizeHtml($.html(), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe', 'style']),
    allowVulnerableTags: true,
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height', 'loading'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow'],
      a: ['href', 'target', 'rel']
    },
  });

  return { image, excerpt, sanitizedContent };
}

// Fetch posts from Blogger API
export async function getPosts(updatedMin?: string): Promise<BloggerPost[]> {
  // Read env vars inside the function to ensure they are captured at runtime
  const API_KEY = process.env.BLOGGER_API_KEY;
  const BLOG_ID = process.env.BLOGGER_BLOG_ID || "6735182721591551066";

  let posts: BloggerPost[] = [];

  if (API_KEY) {
    // === USE API V3 ===
    const API_URL = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts`;
    let pageToken: string | undefined = undefined;

    do {
      const url = new URL(API_URL);
      url.searchParams.append('key', API_KEY);
      url.searchParams.append('maxResults', '500'); // Blogger API max is 500
      url.searchParams.append('status', 'LIVE');
      url.searchParams.append('fetchImages', 'true');
      if (pageToken) url.searchParams.append('pageToken', pageToken);
      if (updatedMin) url.searchParams.append('updatedMin', updatedMin);

      console.log(`Fetching Blogger API v3: ${API_URL} (pageToken: ${pageToken || 'none'})`);

      const res = await fetch(url.toString(), {
        next: { tags: ['posts'] }
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch posts via API v3. Status: ${res.status} ${res.statusText}. Response: ${errorText}`);
      }

      const data = await res.json();
      
      if (data.items) {
        const mappedPosts = data.items.map((item: any) => {
          try {
            const { image, excerpt, sanitizedContent } = extractPostMetadata(item.content || '');
            
            const itemUrl = new URL(item.url);
            const path = itemUrl.pathname; 

            return {
              id: item.id,
              title: item.title,
              content: sanitizedContent,
              excerpt,
              published: item.published,
              updated: item.updated,
              url: item.url,
              path,
              labels: item.labels || [],
              author: item.author?.displayName || 'A. Bayern',
              image: item.images?.[0]?.url || image,
            };
          } catch (err) {
            console.error(`Error processing post ${item.id}:`, err);
            return null;
          }
        }).filter(Boolean) as BloggerPost[];
        
        posts = posts.concat(mappedPosts);
      }

      pageToken = data.nextPageToken;
    } while (pageToken);

  } else {
    // === FALLBACK TO PUBLIC JSON FEED ===
    console.log("No API_KEY found. Falling back to public JSON feed.");
    const url = `https://www.blogger.com/feeds/${BLOG_ID}/posts/default?alt=json&max-results=500`;
    
    const res = await fetch(url, {
      next: { tags: ['posts'] }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch posts via Public Feed. Status: ${res.status}`);
    }

    const data = await res.json();

    if (data.feed && data.feed.entry) {
      posts = data.feed.entry.map((entry: any) => {
        try {
          const content = entry.content ? entry.content.$t : '';
          const { image, excerpt, sanitizedContent } = extractPostMetadata(content);
          
          const linkNode = entry.link.find((l: any) => l.rel === 'alternate');
          const itemUrl = linkNode ? linkNode.href : '';
          const path = itemUrl ? new URL(itemUrl).pathname : '';

          const labels = entry.category ? entry.category.map((c: any) => c.term) : [];
          
          let author = 'A. Bayern';
          if (entry.author && entry.author[0] && entry.author[0].name) {
            author = entry.author[0].name.$t;
          }

          return {
            id: entry.id.$t,
            title: entry.title.$t,
            content: sanitizedContent,
            excerpt,
            published: entry.published.$t,
            updated: entry.updated.$t,
            url: itemUrl,
            path,
            labels,
            author,
            image,
          };
        } catch (err) {
          console.error("Error processing entry from feed:", err);
          return null;
        }
      }).filter(Boolean) as BloggerPost[];
    }
  }

  // Sort by published date descending
  posts.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

  return posts;
}

export async function getPostByPath(path: string): Promise<BloggerPost | undefined> {
  const posts = await getPosts();
  return posts.find((p) => p.path === path || p.path === `/${path}`);
}

export async function getPostsByLabel(label: string): Promise<BloggerPost[]> {
  const posts = await getPosts();
  const slugifiedTarget = getSlug(label);
  return posts.filter((p) => p.labels.some((l) => getSlug(l) === slugifiedTarget));
}

export async function getAllLabels(): Promise<string[]> {
  const posts = await getPosts();
  const labels = new Set<string>();
  posts.forEach(p => p.labels.forEach(l => labels.add(l)));
  return Array.from(labels);
}
