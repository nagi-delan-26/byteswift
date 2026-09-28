import { getPostsByLabel, getAllLabels, BloggerPost, getSlug } from '@/lib/blogger';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const revalidate = 3600;

interface Props {
  params: Promise<{ label: string }>;
}

export async function generateStaticParams() {
  const labels = await getAllLabels();
  return labels.map(label => ({
    label: getSlug(label)
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const rawLabel = resolvedParams.label.replace(/-/g, ' ');
  return {
    title: `${rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1)} Archives`,
    description: `Browse all articles related to ${rawLabel} on Byteswift Digital.`,
  };
}

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
        <a href={post.url} target="_blank" rel="noopener noreferrer" className="block mt-2 flex-grow">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-[#482dff] dark:group-hover:text-[#6a55ff] line-clamp-3 leading-snug transition-colors">
            {post.title}
          </h3>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400 line-clamp-3 font-medium leading-relaxed">
            {post.excerpt}
          </p>
        </a>
      </div>
    </div>
  );
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const posts = await getPostsByLabel(resolvedParams.label);

  if (!posts.length) {
    notFound();
  }

  const rawLabel = resolvedParams.label.replace(/-/g, ' ');
  const displayLabel = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white capitalize">
          {displayLabel}
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 font-medium">
          Explore {posts.length} {posts.length === 1 ? 'article' : 'articles'} in this category.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
