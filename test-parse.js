const cheerio = require('cheerio');
const sanitizeHtml = require('sanitize-html');

function extractPostMetadata(html) {
  const $ = cheerio.load(html);
  let image = $('img').first().attr('src');
  if (image && image.startsWith('//')) {
    image = 'https:' + image;
  }
  const text = $.text().replace(/\s+/g, ' ').trim();
  let excerpt = text.substring(0, 155);
  const lastSpace = excerpt.lastIndexOf(' ');
  if (lastSpace > 100) {
    excerpt = excerpt.substring(0, lastSpace);
  }
  excerpt = excerpt + '...';

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
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height', 'loading'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow'],
      a: ['href', 'target', 'rel']
    },
  });
  return { image, excerpt, sanitizedContent };
}

async function run() {
  const res = await fetch("https://www.byteswifts.com/feeds/posts/default?alt=json&max-results=5");
  const data = await res.json();
  const entry = data.feed.entry[0];
  const html = entry.content ? entry.content.$t : '';
  try {
    const parsed = extractPostMetadata(html);
    console.log("Parsed OK!");
    console.log("Excerpt:", parsed.excerpt);
    console.log("Image:", parsed.image);
  } catch (err) {
    console.error("Error parsing:", err);
  }
}
run();
