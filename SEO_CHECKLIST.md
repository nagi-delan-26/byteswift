# Post-Deployment SEO Checklist

Run through this checklist after deploying the site and syncing a major batch of content to ensure everything is working correctly.

### 1. Title and Meta Descriptions
- [ ] **Check the Home Page:** Right-click -> "View Page Source". Ensure `<title>Byteswift Digital</title>` and the correct `<meta name="description">` are present.
- [ ] **Check a Blog Post:** Open any blog post. Ensure the `<title>` matches "{Post Title} | Byteswift Digital". Ensure the `<meta name="description">` is populated with a ~150 character excerpt of the post. It MUST NOT be blank or use a generic fallback.

### 2. Canonical Tags
- [ ] Open a blog post and View Source. Verify `<link rel="canonical" href="https://www.byteswifts.com/...">` points exactly to the current post's URL.

### 3. Open Graph and Twitter Cards
- [ ] Open a blog post and View Source. Verify `og:image`, `og:title`, and `og:description` exist and contain correct data. If the post has an image, it should be listed in `og:image` and `twitter:image`.

### 4. Structured Data (JSON-LD)
- [ ] Navigate to the [Google Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Enter a live blog post URL (e.g., `https://www.byteswifts.com/2023/10/example.html`).
- [ ] Verify that **Article** (or BlogPosting) and **Breadcrumbs** schema are detected with zero errors or warnings.
- [ ] Verify the author is listed as "A. Bayern" and the publisher is "Byteswift Digital".

### 5. Sitemap and Robots
- [ ] Go to `/sitemap.xml` on the live site. Verify it loads an XML document containing your posts and category pages.
- [ ] Ensure `<lastmod>` dates for posts match their last updated dates.
- [ ] Ensure the Next.js `robots.txt` allows all bots. (Next.js automatically generates a default permissive one, but you can add an explicit `src/app/robots.ts` if you want to customize it later).

### 6. Search Console & Analytics
- [ ] Verify you have added the site property to Google Search Console (Domain property using DNS is recommended).
- [ ] Submit the new `/sitemap.xml` url in Google Search Console explicitly.
- [ ] Once you set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in your Vercel Environment Variables, visit the site and check Google Analytics Realtime overview to confirm the tag is firing.
