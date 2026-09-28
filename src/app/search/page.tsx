'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SearchIndexItem {
  title: string;
  excerpt: string;
  path: string;
  labels: string[];
  url: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchIndexItem[]>([]);
  const [results, setResults] = useState<SearchIndexItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/search-index')
      .then(res => res.json())
      .then(data => {
        setIndex(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = index.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.excerpt.toLowerCase().includes(lowerQuery) ||
      item.labels.some(l => l.toLowerCase().includes(lowerQuery))
    );

    setResults(filtered.slice(0, 20)); // Limit to 20 results
  }, [query, index]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">Search Byteswift Digital</h1>
      
      <div className="relative mb-12">
        <input 
          type="text" 
          placeholder="Search articles, topics..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-6 py-4 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm text-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#482dff] focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
        />
        {loading && <span className="absolute right-4 top-3 text-gray-400">Loading index...</span>}
      </div>

      <div>
        {query && results.length === 0 && !loading && (
          <p className="text-gray-500 dark:text-gray-400">No results found for &quot;{query}&quot;</p>
        )}
        
        <div className="space-y-6">
          {results.map((item, i) => (
            <div key={i} className="group relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-white/40 dark:border-white/5 p-6 -translate-y-0 hover:-translate-y-1">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {item.labels.slice(0, 2).map(label => (
                    <span key={label} className="text-xs font-bold uppercase tracking-widest text-[#482dff] dark:text-[#6a55ff] bg-[#482dff]/10 dark:bg-[#6a55ff]/10 px-3 py-1 rounded-full">
                      {label}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-[#482dff] dark:group-hover:text-[#6a55ff] mb-2 transition-colors">{item.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed line-clamp-2">{item.excerpt}</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
