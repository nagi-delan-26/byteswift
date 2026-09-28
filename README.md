# Byteswift Digital Next.js Blog

This is a complete, production-ready website for Byteswift Digital, sourcing content automatically from your Blogger blog and aggressively optimized for search engine ranking.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Deployment:** Vercel
- **Styling:** Tailwind CSS
- **CMS:** Blogger API v3 (Headless)

## Local Setup
1. Clone this repository or open the project folder.
2. Run `npm install` to install all dependencies.
3. Copy `.env.example` to `.env` and fill in your credentials:
   - `BLOGGER_API_KEY`: A Google Cloud API key with access to the Blogger API v3.
   - `BLOGGER_BLOG_ID`: 6735182721591551066 (already set in .env.example)
   - `CRON_SECRET`: A secure random string for manual revalidation (e.g., `my_secret_123`)
4. Run `npm run dev` to start the local development server at `http://localhost:3000`.

## How Auto-Sync Works
This site uses **Incremental Static Regeneration (ISR)** and Next.js's Data Cache to serve static pages instantly while keeping them up to date.

- When you publish a post on Blogger, it goes live on the new site via two possible ways:
  1. **Background Revalidation:** The Next.js fetch cache is set to revalidate every hour by default (`revalidate: 3600`). If traffic hits the site after 1 hour, Next.js fetches the new posts in the background and updates the cache.
  2. **Instant Revalidation (Vercel Cron):** A configured cron job pings `/api/cron` every 15 minutes. This API route explicitly invalidates the `posts` cache tag (`revalidateTag('posts')`), meaning Next.js instantly fetches the freshest data from Blogger on the next request. It also automatically pings Google and Bing with the updated sitemap.

### Setting up the Cron Job on Vercel
1. Add a `vercel.json` file in the root of the project with the following (already provided in the repository):
\`\`\`json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "*/15 * * * *"
    }
  ]
}
\`\`\`

## Domain Cutover (Important)
Because we kept the Blogger URL structure (`/YYYY/MM/post-slug.html`), you **will not lose any SEO rankings** and no 301 redirects are necessary. 

**Steps to cut over:**
1. Deploy this code to Vercel and ensure everything looks good at the temporary `*.vercel.app` domain.
2. Go to your domain registrar's DNS settings.
3. Remove the existing Google/Blogger CNAME and A records.
4. Add the Vercel DNS records (Vercel will provide these in the Project Settings -> Domains tab).
5. Go to your Blogger Settings -> "Custom domain" and remove the custom domain so Blogger stops trying to route `www.byteswifts.com`.
6. Once DNS propagates, `www.byteswifts.com` will point to your new Next.js site, and all existing Google links will resolve perfectly to the same paths.

## Verifying SEO Tags
After deployment, use the **Google Rich Results Test** (https://search.google.com/test/rich-results) on any of your blog post URLs. You should see valid `Article`/`BlogPosting` and `BreadcrumbList` schema detected.
