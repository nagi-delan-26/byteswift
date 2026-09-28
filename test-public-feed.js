async function run() {
  const BLOG_ID = process.env.BLOGGER_BLOG_ID || "6735182721591551066";
  const url = `https://www.blogger.com/feeds/${BLOG_ID}/posts/default?alt=json&max-results=500`;
  const res = await fetch(url);
  const data = await res.json();
  console.log("Total posts:", data.feed.entry.length);
}
run();
