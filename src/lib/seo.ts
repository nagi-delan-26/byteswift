export function pingSearchEngines(sitemapUrl: string) {
  // Ping Google
  fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`)
    .catch(err => console.error('Failed to ping Google:', err));
  
  // Ping Bing
  fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`)
    .catch(err => console.error('Failed to ping Bing:', err));
}

export async function pingIndexNow(host: string, urlList: string[], key: string) {
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `https://${host}/${key}.txt`,
        urlList
      })
    });
    if (!res.ok) {
      console.error('IndexNow ping failed', await res.text());
    }
  } catch (error) {
    console.error('Failed to ping IndexNow:', error);
  }
}
