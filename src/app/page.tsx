import { getPosts, BloggerPost } from '@/lib/blogger';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 3600; // revalidate every hour, plus on-demand revalidation via ISR tag

function PostCard({ post }: { post: BloggerPost }) {
  return (
    <div className="group relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-white/40 dark:border-white/5 overflow-hidden flex flex-col h-full -translate-y-0 hover:-translate-y-1">
      <a href={post.url} target="_blank" rel="noopener noreferrer" className="block relative h-56 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
        {post.image ? (
          <Image 
            src={post.image} 
            alt={post.title} 
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
        )}
      </a>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.labels.slice(0, 2).map(label => (
            <span key={label} className="text-xs font-bold uppercase tracking-widest text-[#482dff] dark:text-[#6a55ff] bg-[#482dff]/10 dark:bg-[#6a55ff]/10 px-3 py-1 rounded-full">
              {label}
            </span>
          ))}
        </div>
        <a href={post.url} target="_blank" rel="noopener noreferrer" className="block mt-2 flex-grow">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-[#482dff] dark:group-hover:text-[#6a55ff] line-clamp-3 leading-snug transition-colors">
            {post.title}
          </h3>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400 line-clamp-3 font-medium leading-relaxed">
            {post.excerpt}
          </p>
        </a>
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 font-medium">
          <time dateTime={post.published}>
            {new Date(post.published).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </time>
          <div className="flex items-center gap-2">
            <span>By {post.author}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  const posts = await getPosts();
  
  if (!posts.length) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-xl text-gray-500">No posts found.</p>
      </div>
    );
  }

  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="sr-only">Byteswift Digital - Tech Blog</h1>
      
      {/* Featured Hero Post */}
      <div className="mb-16">
        <div className="group relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-white/40 dark:border-white/5 overflow-hidden flex flex-col md:flex-row -translate-y-0 hover:-translate-y-1">
          <a href={featuredPost.url} target="_blank" rel="noopener noreferrer" className="block relative h-72 md:h-auto md:w-3/5 bg-gray-200 dark:bg-gray-800 overflow-hidden">
            {featuredPost.image ? (
              <Image 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                fill
                priority
                className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
            )}
          </a>
          <div className="p-8 md:p-12 flex flex-col justify-center md:w-2/5">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#482dff] dark:text-[#6a55ff] bg-[#482dff]/10 dark:bg-[#6a55ff]/10 px-3 py-1 rounded-full">
                Featured
              </span>
              {featuredPost.labels.slice(0, 1).map(label => (
                <span key={label} className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  {label}
                </span>
              ))}
            </div>
            <a href={featuredPost.url} target="_blank" rel="noopener noreferrer" className="block">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white group-hover:text-[#482dff] dark:group-hover:text-[#6a55ff] line-clamp-3 leading-tight transition-colors">
                {featuredPost.title}
              </h2>
              <p className="mt-5 text-lg text-gray-600 dark:text-gray-400 line-clamp-3 font-medium leading-relaxed">
                {featuredPost.excerpt}
              </p>
            </a>
            <div className="mt-8 flex items-center text-sm text-gray-500 dark:text-gray-400 font-medium">
              <time dateTime={featuredPost.published}>
                {new Date(featuredPost.published).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
              <span className="mx-3">&middot;</span>
              <span>By {featuredPost.author}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Latest Articles</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {gridPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
