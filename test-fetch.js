const BLOG_ID = "6735182721591551066";
const API_KEY = process.env.BLOGGER_API_KEY; // I don't have their API key... wait!

async function test() {
  // Using public feed instead to see post structure
  const res = await fetch(`https://www.byteswifts.com/feeds/posts/default?alt=json&max-results=5`);
  const data = await res.json();
  const entry = data.feed.entry[0];
  console.log("Feed Entry URL:");
  const link = entry.link.find(l => l.rel === 'alternate').href;
  console.log(link);
  console.log("Pathname:", new URL(link).pathname);
  
  // also check labels
  console.log("Labels:", entry.category ? entry.category.map(c => c.term) : []);
}
test();
