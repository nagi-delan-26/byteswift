require('dotenv').config();
const { getPosts } = require('./src/lib/blogger');
getPosts().then(posts => {
  console.log("Total posts:", posts.length);
  if (posts.length > 0) {
    console.log("First post:", posts[0]);
  }
}).catch(console.error);
