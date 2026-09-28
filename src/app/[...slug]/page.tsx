import { getPosts, getPostByPath, getPostsByLabel, getSlug } from '@/lib/blogger';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => {
    // path is /YYYY/MM/slug.html, split by '/'
    const slugParts = post.path.split('/').filter(Boolean);
    return {
      slug: slugParts,
    };
  });
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const path = '/' + resolvedParams.slug.join('/');
  const post = await getPostByPath(path);

  if (!post) {
    return {};
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.byteswifts.com';
  const url = `${siteUrl}${post.path}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: url,
      type: 'article',
      publishedTime: post.published,
      modifiedTime: post.updated,
      authors: [post.author],
      images: post.image ? [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    }
  };
}

export default async function BlogPost({ params }: Props) {
  const resolvedParams = await params;
  const path = '/' + resolvedParams.slug.join('/');
  
  const post = await getPostByPath(path);

  if (!post) {
    notFound();
  }

  // Related posts (same first label)
  const relatedPosts = post.labels.length > 0 
    ? (await getPostsByLabel(post.labels[0])).filter(p => p.id !== post.id).slice(0, 3)
    : [];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.byteswifts.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image ? [post.image] : [],
    datePublished: post.published,
    dateModified: post.updated,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Byteswift Digital',
      logo: {
        '@type': 'ImageObject',
        url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhEDkATO0X6b4qdiHLeZagvH9kRabG_P8-ry2vbA7C4CFqBHH_YAEr3A5duyoKcJR1kC1O44ENsKQ6c76GFtwGO25VXvvu5eEcpnklHNGBZlrjfDIV_pLb0ZIhsE5OPhanOcKDZoX9b0cdqX-QULdI3y6zcg0mJOjuADPDARDIQ7bycAA/s1600/byteswift%20digital%202025%20main%20logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}${post.path}`
    }
  };

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl
      },
      ...(post.labels.length > 0 ? [{
        '@type': 'ListItem',
        position: 2,
        name: post.labels[0],
        item: `${siteUrl}/category/${getSlug(post.labels[0])}`
      }] : []),
      {
        '@type': 'ListItem',
        position: post.labels.length > 0 ? 3 : 2,
        name: post.title,
        item: `${siteUrl}${post.path}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10 text-center">
          <div className="flex justify-center space-x-2 mb-4">
            {post.labels.map(label => (
              <Link key={label} href={`/category/${getSlug(label)}`} className="text-xs font-semibold uppercase tracking-wider text-[#482dff] bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                {label}
              </Link>
            ))}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-6">
            {post.title}
          </h1>
          <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 space-x-4">
            <time dateTime={post.published}>
              {new Date(post.published).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
            <span>&middot;</span>
            <span>By {post.author}</span>
          </div>
        </header>

        {post.image && (
          <div className="relative w-full h-[400px] sm:h-[500px] mb-12 rounded-xl overflow-hidden shadow-lg">
            <Image 
              src={post.image} 
              alt={post.title} 
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        <div 
          className="prose prose-lg dark:prose-invert prose-blue max-w-none 
          prose-img:rounded-xl prose-img:shadow-md prose-a:text-[#482dff] prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <hr className="my-12 border-gray-200 dark:border-gray-800" />

        {/* Author Bio Box */}
        <div className="flex items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-[#482dff] flex items-center justify-center text-white text-2xl font-bold">
              {post.author.charAt(0)}
            </div>
          </div>
          <div className="ml-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{post.author}</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Tech analyst and digital security researcher specializing in Windows performance optimization, AI tools, and cybersecurity.
            </p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <span className="text-gray-500 font-medium">Share this:</span>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(siteUrl + post.path)}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1DA1F2]">X (Twitter)</a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl + post.path)}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#4267B2]">Facebook</a>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map(rp => (
                <Link key={rp.id} href={rp.path} className="group">
                  <div className="relative h-40 w-full rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 mb-3">
                    {rp.image ? (
                      <Image src={rp.image} alt={rp.title} fill className="object-cover group-hover:opacity-75 transition-opacity" />
                    ) : null}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#482dff] line-clamp-2">{rp.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
